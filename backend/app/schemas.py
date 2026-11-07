"""
Pydantic request/response models for the SkillLens AI API.

Only the student's actual profile is accepted as input - no student_id,
skill_category, cluster_id, or generated archetype fields exist here. Those are
internal artifacts of the ML pipeline (Stages 1-6) and are never something a
real API caller would provide.
"""

from typing import List

from pydantic import BaseModel, Field


class StudentProfile(BaseModel):
    """A student's 9 skill features, on the same scales used throughout the project."""

    cgpa: float = Field(..., ge=0, le=10)
    coding_skill: float = Field(..., ge=0, le=10)
    dsa_skill: float = Field(..., ge=0, le=10)
    math_aptitude: float = Field(..., ge=0, le=10)
    communication_skill: float = Field(..., ge=0, le=10)
    security_knowledge: float = Field(..., ge=0, le=10)
    projects_count: float = Field(..., ge=0, le=10)
    internships_count: float = Field(..., ge=0, le=5)
    certifications_count: float = Field(..., ge=0, le=5)

    class Config:
        json_schema_extra = {
            "example": {
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
        }


class SkillCategoryResponse(BaseModel):
    """Response for POST /predict-skill-category."""

    predicted_category: str
    model_name: str


class SkillGap(BaseModel):
    feature: str
    actual: float
    required: float
    gap: float


class RoleAlignmentResult(BaseModel):
    role: str
    alignment_score: float
    total_gap: float
    skill_gaps: List[SkillGap]


class CareerAlignmentResponse(BaseModel):
    """Response for POST /career-alignment."""

    best_match: str
    best_match_score: float
    all_role_results: List[RoleAlignmentResult]
