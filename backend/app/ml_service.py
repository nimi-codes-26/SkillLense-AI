"""
ML service for SkillLens AI - loads the already-trained Stage 3-6 artifacts and
uses them to predict a skill category for a new student profile.

IMPORTANT METHODOLOGY:
The Random Forest classifier predicts the K-Means-derived pseudo-category from
Stage 4, not a real-world outcome. Its output must only be described as a
"predicted skill profile category" - never as employability prediction, job
prediction, guaranteed career prediction, or actual career-readiness ground
truth.

This module only LOADS existing artifacts and calls .transform()/.predict() on
them. It never retrains, never refits the scaler, never refits K-Means, and
never touches generation_reference.csv.
"""

import json
from pathlib import Path

import joblib
import numpy as np

# backend/app/ml_service.py -> backend/app -> backend -> project root
BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODELS_DIR = BASE_DIR / "ml" / "models"

# Feature order must exactly match what the scaler and classifier were trained on.
FEATURES = [
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

# All artifacts are loaded once, when this module is first imported - not on
# every request. Nothing here is fit or trained; everything is loaded read-only.
scaler = joblib.load(MODELS_DIR / "scaler.pkl")
kmeans_model = joblib.load(MODELS_DIR / "kmeans_model.pkl")
skill_category_classifier = joblib.load(MODELS_DIR / "skill_category_classifier.pkl")

with open(MODELS_DIR / "cluster_category_mapping.json") as f:
    cluster_category_mapping = json.load(f)

with open(MODELS_DIR / "classifier_info.json") as f:
    classifier_info = json.load(f)

# kmeans_model is loaded because it is one of the existing Stage 3-6 artifacts,
# but it is NOT used for live prediction here - only the already-trained Random
# Forest classifier is used at request time. This avoids ever calling K-Means
# (or re-fitting anything) during a live API request.
_ = kmeans_model

# Known category names, used only as a sanity check on the classifier's output
# below - not as a numeric-ID-to-name conversion. The Random Forest classifier
# was trained directly on these human-readable category names (see Stage 5), so
# its .predict() output is already a human-readable string.
KNOWN_CATEGORIES = set(cluster_category_mapping.values())


def predict_skill_category(student_profile: dict) -> str:
    """
    Predict a student's skill profile category using the already-trained
    Random Forest classifier.

    `student_profile` must be a dict containing all 9 features in FEATURES.
    Returns the predicted category name (e.g. "Strong Technical") - a
    K-Means-derived pseudo-category, not a real-world outcome.
    """
    # 1. Convert the profile into the exact feature order the models expect.
    feature_values = [student_profile[feature] for feature in FEATURES]

    # 2. Convert to a 2D array (the models expect a batch of rows, even for one student).
    feature_array = np.array([feature_values])

    # 3. Apply the already-fitted scaler (transform only - never fit here).
    scaled_features = scaler.transform(feature_array)

    # 4. Predict with the already-trained Random Forest classifier.
    predicted_category = skill_category_classifier.predict(scaled_features)[0]

    # Sanity check: the classifier should only ever output one of the known
    # category names. This is defensive, not a functional conversion step.
    if predicted_category not in KNOWN_CATEGORIES:
        raise ValueError(f"Unexpected predicted category: {predicted_category!r}")

    # 5 & 6. The classifier already outputs the human-readable category directly.
    return predicted_category


def get_model_name() -> str:
    return classifier_info["selected_model"]
