"""
Generates a synthetic student skill dataset for SkillLens AI.

WHY SYNTHETIC DATA:
This project ideally uses real, anonymous student survey data. Since that was not
available at this stage, this script generates a realistic synthetic dataset instead.
This is clearly documented (see ml/data/raw/DATASET_NOTES.md) and is meant to be
replaced by real survey data later if possible, without changing any other code,
since the column names and ranges stay the same.

HOW IT WORKS (kept deliberately simple, no hidden complexity):
1. We define a few "student archetypes" - rough personas like "high all-round
   performer" or "developing student" - each with typical (mean) skill levels.
2. For each synthetic student, we randomly pick one archetype, then sample their
   9 skill features from a normal distribution centered on that archetype's mean,
   with some random spread (noise) added.
3. Values are clipped to valid ranges and rounded so they look like realistic
   scores/counts.

IMPORTANT: The archetype used to generate each student is NOT saved in the main
dataset (student_data.csv). It is only saved separately, in
generation_reference.csv, purely so we can later sanity-check whether the skill
categories discovered by K-Means (in a later stage) roughly resemble these
archetypes. It must never be used as a training feature or target - that would
defeat the purpose of discovering categories from the data.
"""

import numpy as np
import pandas as pd

RANDOM_SEED = 42
NUM_STUDENTS = 300

FEATURE_COLUMNS = [
    "cgpa",
    "coding_skill",
    "dsa_skill",
    "math_aptitude",
    "communication_skill",
    "security_knowledge",
    "projects_count",
    "internships_count",
    "certifications_count",
]

# Each archetype gives a rough mean value per feature (0-10 scale for skills,
# small counts for the rest). These are intentionally approximate, real-world-ish
# guesses - not derived from any formula.
ARCHETYPES = {
    "high_allround": {
        "cgpa": 8.5, "coding_skill": 8.5, "dsa_skill": 8.0, "math_aptitude": 8.0,
        "communication_skill": 7.5, "security_knowledge": 6.5,
        "projects_count": 6, "internships_count": 2, "certifications_count": 3,
    },
    "technical_strong_soft_weak": {
        "cgpa": 7.5, "coding_skill": 8.5, "dsa_skill": 8.5, "math_aptitude": 7.5,
        "communication_skill": 4.0, "security_knowledge": 5.5,
        "projects_count": 5, "internships_count": 1, "certifications_count": 2,
    },
    "average_balanced": {
        "cgpa": 6.5, "coding_skill": 5.5, "dsa_skill": 5.0, "math_aptitude": 5.5,
        "communication_skill": 5.5, "security_knowledge": 4.5,
        "projects_count": 3, "internships_count": 1, "certifications_count": 1,
    },
    "developing": {
        "cgpa": 5.5, "coding_skill": 3.5, "dsa_skill": 3.0, "math_aptitude": 4.0,
        "communication_skill": 4.5, "security_knowledge": 3.0,
        "projects_count": 1, "internships_count": 0, "certifications_count": 0,
    },
    "security_focused": {
        "cgpa": 7.0, "coding_skill": 6.5, "dsa_skill": 5.5, "math_aptitude": 6.0,
        "communication_skill": 5.0, "security_knowledge": 8.5,
        "projects_count": 4, "internships_count": 1, "certifications_count": 3,
    },
}

# How spread out (noisy) each student is around their archetype's mean.
# Applied the same way to every feature for simplicity.
NOISE_STD = 1.2

# Valid ranges for each feature, used to clip generated values.
SKILL_FEATURES = [
    "cgpa", "coding_skill", "dsa_skill", "math_aptitude",
    "communication_skill", "security_knowledge",
]
COUNT_FEATURES = ["projects_count", "internships_count", "certifications_count"]
COUNT_MAX = {"projects_count": 10, "internships_count": 5, "certifications_count": 5}


def generate_student_row(rng, archetype_name):
    archetype = ARCHETYPES[archetype_name]
    row = {}

    for feature in SKILL_FEATURES:
        raw_value = rng.normal(loc=archetype[feature], scale=NOISE_STD)
        row[feature] = round(float(np.clip(raw_value, 0, 10)), 1)

    for feature in COUNT_FEATURES:
        raw_value = rng.normal(loc=archetype[feature], scale=NOISE_STD)
        clipped_value = np.clip(raw_value, 0, COUNT_MAX[feature])
        row[feature] = int(round(clipped_value))

    return row


def generate_dataset(num_students=NUM_STUDENTS, seed=RANDOM_SEED):
    rng = np.random.default_rng(seed)
    archetype_names = list(ARCHETYPES.keys())

    student_rows = []
    archetype_used = []

    for _ in range(num_students):
        chosen_archetype = rng.choice(archetype_names)
        student_rows.append(generate_student_row(rng, chosen_archetype))
        archetype_used.append(chosen_archetype)

    dataset = pd.DataFrame(student_rows, columns=FEATURE_COLUMNS)
    dataset.insert(0, "student_id", range(1, num_students + 1))

    reference = pd.DataFrame({
        "student_id": dataset["student_id"],
        "archetype_used_for_generation": archetype_used,
    })

    return dataset, reference


if __name__ == "__main__":
    dataset, reference = generate_dataset()

    dataset.to_csv("ml/data/raw/student_data.csv", index=False)
    reference.to_csv("ml/data/raw/generation_reference.csv", index=False)

    print(f"Generated {len(dataset)} synthetic student records.")
    print("Saved: ml/data/raw/student_data.csv")
    print("Saved: ml/data/raw/generation_reference.csv (reference only, not for training)")
