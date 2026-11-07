"""
Career alignment engine for SkillLens AI.

METHODOLOGY (for the project report / viva)
--------------------------------------------
1. Why this is rule-based, not an ML prediction:
   The ML pipeline (K-Means, Random Forest, DBSCAN, PCA) only ever describes a
   student's overall SKILL PROFILE - it never decides which career fits them.
   Deciding "how well does this student match role X" is instead done here, with
   plain arithmetic against a fixed requirement profile per role. This keeps the
   comparison fully transparent: every number in the result can be traced back to
   a simple subtraction, with no hidden model behavior.

2. How the gap is calculated:
   For each of the 9 features, gap = max(0, required - actual).
   If the student already meets or exceeds the requirement, the gap is 0 - a
   student is never penalized for being "overqualified" on a feature.

3. How the 0-100 alignment score is calculated:
       total_gap        = sum of all 9 feature gaps
       max_possible_gap = sum of all 9 requirement values for that role
       alignment_score  = 100 * (1 - total_gap / max_possible_gap)
   A student who meets every requirement scores exactly 100. A student who meets
   none of them (gap equals the full requirement on every feature) scores 0.

4. How the best match is selected:
   The role with the highest alignment_score across all 5 roles is the best
   match. Ties are broken deterministically by CAREER_ROLES list order (the role
   defined earlier in career_roles.py wins) - this is arbitrary but fixed and
   documented, not random.

5. Why the role requirements are illustrative assumptions:
   The numbers in career_roles.py were chosen by the project author to represent
   a reasonable-looking profile for each role. They were not learned from data,
   not derived from a hiring dataset, and are not official industry standards.

6. Why this must not be read as real employability:
   The output is a similarity score against a project-defined requirement
   profile, nothing more. It must never be described as "job eligibility",
   "guaranteed career", "employability prediction", or "job readiness
   prediction" - only as "career alignment with the selected project
   requirement profile".

This module uses no machine learning, no K-Means labels, no Random Forest
predictions, no PCA, and no DBSCAN - only the student's raw feature values and
the fixed requirement profiles from career_roles.py.
"""

from app.career_roles import CAREER_ROLES

# Valid ranges for each of the 9 student features. Used only for a simple,
# non-exhaustive sanity check - not a full validation framework.
FEATURE_RANGES = {
    "cgpa": (0, 10),
    "coding_skill": (0, 10),
    "dsa_skill": (0, 10),
    "math_aptitude": (0, 10),
    "communication_skill": (0, 10),
    "security_knowledge": (0, 10),
    "projects_count": (0, 10),
    "internships_count": (0, 5),
    "certifications_count": (0, 5),
}


def validate_student_profile(student_profile):
    """Raise ValueError if a feature is missing or outside its expected range."""
    for feature, (min_value, max_value) in FEATURE_RANGES.items():
        if feature not in student_profile:
            raise ValueError(f"Missing required feature: '{feature}'")

        value = student_profile[feature]
        if not isinstance(value, (int, float)):
            raise ValueError(f"Feature '{feature}' must be a number, got {type(value).__name__}")

        if not (min_value <= value <= max_value):
            raise ValueError(
                f"Feature '{feature}' = {value} is outside the expected range "
                f"[{min_value}, {max_value}]"
            )


def calculate_role_alignment(student_profile, role):
    """
    Compare a student profile against a single role's requirements.

    Returns a dict with the role name, alignment score, total gap, and a list
    of skill gaps (only features where the student falls short of the
    requirement), sorted from largest gap to smallest.
    """
    requirements = role["requirements"]

    skill_gaps = []
    total_gap = 0
    max_possible_gap = 0

    for feature, required_value in requirements.items():
        actual_value = student_profile[feature]
        gap = max(0, required_value - actual_value)

        total_gap += gap
        max_possible_gap += required_value

        if actual_value < required_value:
            skill_gaps.append({
                "feature": feature,
                "actual": actual_value,
                "required": required_value,
                "gap": round(gap, 2),
            })

    skill_gaps.sort(key=lambda item: item["gap"], reverse=True)

    alignment_score = 100 * (1 - total_gap / max_possible_gap)
    alignment_score = round(alignment_score, 2)

    return {
        "role": role["role"],
        "alignment_score": alignment_score,
        "total_gap": round(total_gap, 2),
        "skill_gaps": skill_gaps,
    }


def calculate_career_alignment(student_profile):
    """
    Compare a student profile against all 5 career roles and find the best match.

    `student_profile` must be a dict containing all 9 features listed in
    FEATURE_RANGES, each within its expected range - see validate_student_profile.

    Returns a dict with:
        - best_match: the role name with the highest alignment_score
        - best_match_score: that role's alignment_score
        - all_role_results: a list of per-role results (see calculate_role_alignment)

    Ties are broken by CAREER_ROLES list order (earlier role wins) - a simple,
    fixed, documented rule rather than a random or arbitrary choice.
    """
    validate_student_profile(student_profile)

    all_role_results = [
        calculate_role_alignment(student_profile, role) for role in CAREER_ROLES
    ]

    best_result = max(
        all_role_results,
        key=lambda result: result["alignment_score"],
    )

    return {
        "best_match": best_result["role"],
        "best_match_score": best_result["alignment_score"],
        "all_role_results": all_role_results,
    }
