"""
Career role requirement profiles for SkillLens AI.

IMPORTANT: These requirement levels are illustrative, project-defined assumptions
created for this academic project. They are NOT official industry standards, and
they were not learned from data or derived from any hiring dataset - they are
fixed numbers chosen by the project author to represent a reasonable-looking
profile for each role, purely so the alignment engine (alignment_service.py) has
something concrete to compare a student against.

Every role uses the same 9 student features, each with a "required level" on the
same scale the student data uses:
    cgpa, coding_skill, dsa_skill, math_aptitude: 0-10
    communication_skill, security_knowledge, projects_count: 0-10
    internships_count, certifications_count: 0-5
"""

CAREER_ROLES = [
    {
        "role": "Software Developer",
        "description": (
            "A generalist programming-heavy profile: strong coding and DSA "
            "ability, solid project experience, and moderate math/communication."
        ),
        "requirements": {
            "cgpa": 6.5,
            "coding_skill": 8,
            "dsa_skill": 8,
            "math_aptitude": 6,
            "communication_skill": 6,
            "security_knowledge": 3,
            "projects_count": 5,
            "internships_count": 2,
            "certifications_count": 1,
        },
    },
    {
        "role": "Data Analyst",
        "description": (
            "A math- and communication-leaning profile: strong quantitative "
            "aptitude and the ability to explain findings, with moderate coding."
        ),
        "requirements": {
            "cgpa": 6.5,
            "coding_skill": 6,
            "dsa_skill": 5,
            "math_aptitude": 8,
            "communication_skill": 7,
            "security_knowledge": 2,
            "projects_count": 4,
            "internships_count": 1,
            "certifications_count": 2,
        },
    },
    {
        "role": "ML Engineer",
        "description": (
            "A technical, math-heavy profile: strong coding and the highest "
            "math aptitude requirement of all five roles, plus solid DSA."
        ),
        "requirements": {
            "cgpa": 7,
            "coding_skill": 8,
            "dsa_skill": 7,
            "math_aptitude": 9,
            "communication_skill": 6,
            "security_knowledge": 2,
            "projects_count": 5,
            "internships_count": 2,
            "certifications_count": 2,
        },
    },
    {
        "role": "Web Developer",
        "description": (
            "A project-heavy, practical building profile: solid coding, the "
            "highest project-count requirement, lighter DSA and math needs."
        ),
        "requirements": {
            "cgpa": 6,
            "coding_skill": 7,
            "dsa_skill": 5,
            "math_aptitude": 5,
            "communication_skill": 6,
            "security_knowledge": 4,
            "projects_count": 6,
            "internships_count": 1,
            "certifications_count": 1,
        },
    },
    {
        "role": "Cybersecurity Analyst",
        "description": (
            "A security-specialized profile: by far the highest security-"
            "knowledge requirement, with moderate coding and the highest "
            "certifications requirement of all five roles."
        ),
        "requirements": {
            "cgpa": 6.5,
            "coding_skill": 6,
            "dsa_skill": 4,
            "math_aptitude": 5,
            "communication_skill": 6,
            "security_knowledge": 9,
            "projects_count": 4,
            "internships_count": 1,
            "certifications_count": 3,
        },
    },
]
