"""
Beginner-friendly manual test/demo for the career alignment engine.

This is a plain script, not a pytest suite - run it directly with:
    python test_alignment.py
(from inside the backend/ folder, so the `app` package is importable)

It checks, in plain English:
    - all five roles are evaluated for every profile
    - every alignment score is between 0 and 100
    - skill gaps are sorted largest-first
    - the best match is picked correctly
    - no ML model or generation_reference.csv is touched anywhere in this file
"""

from app.alignment_service import calculate_career_alignment
from app.career_roles import CAREER_ROLES

# Three manually created sample profiles representing different kinds of students.
# No file is loaded here - these are hand-typed dicts, not read from any dataset.
PROFILE_A_STRONG_OVERALL = {
    "cgpa": 8.8,
    "coding_skill": 9,
    "dsa_skill": 8.5,
    "math_aptitude": 8.5,
    "communication_skill": 8,
    "security_knowledge": 6,
    "projects_count": 7,
    "internships_count": 3,
    "certifications_count": 4,
}

PROFILE_B_SECURITY_FOCUSED = {
    "cgpa": 7.2,
    "coding_skill": 6.5,
    "dsa_skill": 5.5,
    "math_aptitude": 6,
    "communication_skill": 6.5,
    "security_knowledge": 9,
    "projects_count": 5,
    "internships_count": 2,
    "certifications_count": 4,
}

PROFILE_C_DEVELOPING = {
    "cgpa": 5.5,
    "coding_skill": 4,
    "dsa_skill": 3.5,
    "math_aptitude": 4.5,
    "communication_skill": 4.5,
    "security_knowledge": 3,
    "projects_count": 2,
    "internships_count": 0,
    "certifications_count": 1,
}


def print_result(profile_name, result):
    print(f"\n===== {profile_name} =====")
    print(f"Best match: {result['best_match']} (score={result['best_match_score']})")
    for role_result in result["all_role_results"]:
        print(f"  {role_result['role']:<22} score={role_result['alignment_score']:>6} "
              f"total_gap={role_result['total_gap']:>6} "
              f"top_gaps={role_result['skill_gaps'][:2]}")


def run_checks(profile_name, result):
    role_names_returned = {r["role"] for r in result["all_role_results"]}
    role_names_expected = {r["role"] for r in CAREER_ROLES}
    assert role_names_returned == role_names_expected, "Not all 5 roles were evaluated!"

    for role_result in result["all_role_results"]:
        score = role_result["alignment_score"]
        assert 0 <= score <= 100, f"Score out of range: {score}"

        gaps = [g["gap"] for g in role_result["skill_gaps"]]
        assert gaps == sorted(gaps, reverse=True), "Skill gaps are not sorted largest-first!"

        for gap_entry in role_result["skill_gaps"]:
            assert gap_entry["actual"] < gap_entry["required"], (
                "A skill_gap entry was included even though actual >= required!"
            )

    best_score = max(r["alignment_score"] for r in result["all_role_results"])
    assert result["best_match_score"] == best_score, "best_match_score doesn't match the max score!"

    print(f"All checks passed for {profile_name}.")


def manual_verification():
    """
    Manually verify the formula for Profile B against Software Developer,
    computed by hand (not by running the function), to confirm the
    implementation matches the documented formula.

    Software Developer requirements:
        cgpa=6.5, coding_skill=8, dsa_skill=8, math_aptitude=6,
        communication_skill=6, security_knowledge=3, projects_count=5,
        internships_count=2, certifications_count=1
    max_possible_gap = 6.5+8+8+6+6+3+5+2+1 = 45.5

    Profile B: cgpa=7.2, coding_skill=6.5, dsa_skill=5.5, math_aptitude=6,
               communication_skill=6.5, security_knowledge=9, projects_count=5,
               internships_count=2, certifications_count=4

    Gaps (max(0, required - actual)):
        cgpa: 6.5-7.2 -> 0 (already meets it)
        coding_skill: 8-6.5 = 1.5
        dsa_skill: 8-5.5 = 2.5
        math_aptitude: 6-6 = 0 (exactly meets it)
        communication_skill: 6-6.5 -> 0
        security_knowledge: 3-9 -> 0
        projects_count: 5-5 = 0 (exactly meets it)
        internships_count: 2-2 = 0 (exactly meets it)
        certifications_count: 1-4 -> 0

    total_gap = 1.5 + 2.5 = 4.0
    alignment_score = 100 * (1 - 4.0/45.5) = 91.2087... -> rounds to 91.21
    """
    software_developer_role = next(r for r in CAREER_ROLES if r["role"] == "Software Developer")

    result = calculate_career_alignment(PROFILE_B_SECURITY_FOCUSED)
    sw_dev_result = next(r for r in result["all_role_results"] if r["role"] == "Software Developer")

    expected_score = 91.21
    actual_score = sw_dev_result["alignment_score"]

    print(f"\nManual verification (Profile B vs Software Developer):")
    print(f"  Hand-calculated expected score: {expected_score}")
    print(f"  Function-calculated score:      {actual_score}")
    assert abs(actual_score - expected_score) < 0.01, "Manual verification FAILED - formula mismatch!"
    print("  Manual verification PASSED - implementation matches the documented formula.")

    expected_gaps = [
        {"feature": "dsa_skill", "actual": 5.5, "required": 8, "gap": 2.5},
        {"feature": "coding_skill", "actual": 6.5, "required": 8, "gap": 1.5},
    ]
    assert sw_dev_result["skill_gaps"] == expected_gaps, "Skill gap details don't match hand calculation!"
    print("  Skill gap details also match the hand calculation.")


if __name__ == "__main__":
    profiles = {
        "Profile A - Strong Overall": PROFILE_A_STRONG_OVERALL,
        "Profile B - Security-Focused": PROFILE_B_SECURITY_FOCUSED,
        "Profile C - Developing": PROFILE_C_DEVELOPING,
    }

    for name, profile in profiles.items():
        result = calculate_career_alignment(profile)
        print_result(name, result)
        run_checks(name, result)

    manual_verification()

    print("\nNote: this script never imports sklearn/joblib and never reads "
          "generation_reference.csv - the alignment engine is pure Python, "
          "independent of every ML model built in Stages 1-6.")

    print("\nAll Stage 7 checks completed successfully.")
