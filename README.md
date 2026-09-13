# SkillLens AI

**SkillLens AI: An ML-Based Student Skill Profiling and Career Gap Analysis System**

A college machine learning project that analyzes a student's skill profile, classifies
their overall skill category using machine learning, and compares their skills against
career role requirements using a transparent, rule-based alignment calculation.

## What this project does (and does not do)

- It does **not** use ML to directly predict "which career you should pick." That
  decision is made by a transparent, explainable formula (see `alignment_service.py`,
  added in a later stage) that compares a student's skills against fixed requirements
  for each career role.
- Machine learning (Logistic Regression, KNN, SVM, Decision Tree, Random Forest) is
  used only to classify a student's overall **skill category** (e.g., Strong Technical,
  Balanced, Developing, Needs Improvement). These categories are not decided by hand —
  they are discovered from the data using K-Means clustering, and the supervised models
  are trained to reproduce that discovered grouping for new students.
- K-Means, DBSCAN, and PCA are used for unsupervised analysis. DBSCAN and PCA are
  exploratory only and are not part of the live prediction flow.
- No deep learning, no LLM APIs, no database, and no authentication are used. The
  project is intentionally kept simple and explainable for a college viva.

## Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Python, FastAPI, Pydantic
- **Machine Learning:** NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn

## Project Structure

```
SkillLens-AI/
├── ml/
│   ├── data/
│   │   ├── raw/            # original generated/collected dataset
│   │   └── processed/      # cleaned/feature-engineered dataset
│   ├── notebooks/          # EDA, clustering, classification notebooks
│   ├── models/             # saved trained models (.pkl, not committed to git)
│   ├── generate_synthetic_data.py
│   └── requirements.txt
├── backend/                # added in a later stage
├── frontend/                # added in a later stage
└── README.md
```

## Dataset

The dataset used in this project's current stage is **synthetically generated**,
not collected from real students. This is clearly documented in
[`ml/data/raw/DATASET_NOTES.md`](ml/data/raw/DATASET_NOTES.md), including how it was
generated and what its limitations are. If real, anonymized survey data is collected
later, it can replace the synthetic file without changing any downstream code, since
both share the same 9-feature schema.

## Development Stages

1. Project folder setup and dataset preparation *(current stage)*
2. Exploratory Data Analysis (EDA)
3. Preprocessing and feature engineering
4. K-Means clustering on training data to discover and label skill categories
5. Train and compare 5 classifiers (Logistic Regression, KNN, SVM, Decision Tree, Random Forest)
6. DBSCAN and PCA exploratory analysis
7. Rule-based career alignment engine
8. FastAPI backend
9. React frontend
10. Styling and visual polish
11. End-to-end integration and testing
