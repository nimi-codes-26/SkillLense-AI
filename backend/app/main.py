"""
SkillLens AI FastAPI backend.

This file is an integration layer only: it validates requests, calls the
existing ml_service.py and alignment_service.py, and returns their results as
JSON. No model training, no career-requirement definitions, and no alignment
formula live in this file - they stay in their own modules (Stages 3-7).
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import StudentProfile, SkillCategoryResponse, CareerAlignmentResponse
from app.alignment_service import calculate_career_alignment
from app.career_roles import CAREER_ROLES
from app.ml_service import predict_skill_category, get_model_name, classifier_info

app = FastAPI(title="SkillLens AI API")

# Allow the local Vite React dev server to call this API during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "SkillLens AI API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/predict-skill-category", response_model=SkillCategoryResponse)
def predict_skill_category_endpoint(student: StudentProfile):
    """
    Predicts the student's skill profile category using the trained Random
    Forest classifier. This is a K-Means-derived pseudo-category (see Stage 4
    and Stage 5), not an employability or career-readiness prediction.
    """
    try:
        predicted_category = predict_skill_category(student.model_dump())
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to predict skill category.")

    return SkillCategoryResponse(
        predicted_category=predicted_category,
        model_name=get_model_name(),
    )


@app.post("/career-alignment", response_model=CareerAlignmentResponse)
def career_alignment_endpoint(student: StudentProfile):
    """
    Compares the student's profile against all 5 predefined career role
    requirement profiles using the Stage 7 rule-based alignment engine (no ML
    involved). The result represents career alignment with the selected
    project requirement profile, not guaranteed employability.
    """
    try:
        result = calculate_career_alignment(student.model_dump())
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error))
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to calculate career alignment.")

    return result


@app.get("/career-roles")
def get_career_roles():
    """Returns the 5 predefined, illustrative career role requirement profiles."""
    return CAREER_ROLES


@app.get("/model-info")
def get_model_info():
    """Returns high-level information about the trained skill category classifier."""
    return {
        "model_name": classifier_info["selected_model"],
        "features": classifier_info["feature_list"],
        "target": classifier_info["target_name"],
        "categories": classifier_info["target_categories"],
        "evaluation_metrics": classifier_info["evaluation_metrics"],
        "note": classifier_info["note"],
    }
