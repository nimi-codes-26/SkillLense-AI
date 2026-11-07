# SkillLens AI

Skill intelligence platform that turns a student's self-reported profile into a skill category, career alignment score, and a prioritized list of skill gaps.

## Overview

Students often have limited visibility into how their current academic, technical, and professional skills line up with different career paths, or where the biggest gaps are. SkillLens AI takes a 9-field skill profile and returns:

- A predicted **skill category**, based on a classifier trained on patterns discovered in the data.
- A **career alignment score** against a fixed set of career roles, including a best-match role and a per-role skill-gap breakdown.

The career-role set currently covers five roles (Software Developer, Data Analyst, ML Engineer, Web Developer, Cybersecurity Analyst) built on a synthetic training dataset. It is not a universal career predictor — see [Limitations](#limitations).

## Features

- Skill profile assessment across academic, technical, and professional dimensions
- ML-based skill categorization (K-Means-derived categories, Random Forest classifier)
- Rule-based career alignment scoring against multiple roles
- Skill gap analysis with prioritized, ranked gaps
- Interactive skill intelligence report
- Responsive web interface with a persistent, accessible design system
- Profile and results persist across reloads via browser storage

## How It Works

```
Student Profile → Preprocessing → Skill Categorization → Career Alignment → Skill Gap Report
```

1. A student enters values for 9 skill/academic features.
2. Features are scaled and classified into one of four skill categories.
3. The profile is compared against each supported career role's requirements using a transparent scoring formula.
4. The best-matching role and its largest skill gaps are surfaced as the final report.

## Machine Learning

- **Skill categorization**: features are standardized, then grouped with K-Means to discover four natural skill categories from the training data. A Random Forest classifier is trained to reproduce those categories for new students and is the model used in production; four other classifiers (Logistic Regression, KNN, Decision Tree, SVM) were evaluated for comparison.
- **Exploratory analysis**: DBSCAN (density-based outlier detection) and PCA (dimensionality reduction) were used to validate and visualize the clustering, but are not part of the live prediction path.
- **Career alignment**: a separate, non-ML, rule-based calculation — it compares a student's values against each role's fixed requirement profile and computes a gap-based score. It is not a machine-learning prediction.

Full methodology, exact evaluation metrics, and the reasoning behind each modeling choice are documented in [`docs/ML_METHODOLOGY.md`](docs/ML_METHODOLOGY.md).

## Tech Stack

**Frontend**
- React, Vite
- Plain CSS (custom design system, no framework)
- react-router-dom

**Backend**
- FastAPI, Pydantic
- Python

**Machine Learning**
- NumPy, Pandas, scikit-learn, joblib
- Jupyter notebooks for the analysis/training pipeline

## Project Structure

```
SkillLense-AI/
├── frontend/         # React + Vite single-page application
├── backend/          # FastAPI service (prediction + career alignment API)
├── ml/               # Dataset generation, notebooks, trained model artifacts
├── docs/             # Architecture, methodology, and product documentation
├── AGENTS.md         # Repository development rules
└── README.md
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/nimi-codes-26/SkillLense-AI.git
cd SkillLense-AI
```

**Backend**

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

The API starts at `http://127.0.0.1:8000` and loads trained model artifacts from `ml/models/`.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

The app starts at `http://localhost:5173` and expects the backend to be running at `http://127.0.0.1:8000`.

## Environment Variables

No environment variables are currently required — the backend URL and CORS origin are fixed for local development (`http://127.0.0.1:8000` and `http://localhost:5173` respectively). See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for details.

## Development

```bash
# Frontend
cd frontend
npm run lint     # oxlint
npm run build    # production build

# Backend
cd backend
python -m py_compile app/*.py
python test_alignment.py   # verifies the career alignment formula
```

See [`docs/QA_GUIDE.md`](docs/QA_GUIDE.md) for the full manual QA checklist (functional, responsive, and accessibility) and [`docs/DEVELOPMENT_GUIDE.md`](docs/DEVELOPMENT_GUIDE.md) for extending the project.

## Limitations

- The training dataset is synthetically generated, not collected from real students (see [`ml/data/raw/DATASET_NOTES.md`](ml/data/raw/DATASET_NOTES.md)). Model behavior on real-world data is unverified.
- The skill categories are pseudo-labels discovered by unsupervised clustering, not validated against real employment or academic outcomes — they should not be read as employability predictions.
- The five supported career roles use illustrative, project-defined requirement profiles, not sourced from an industry hiring dataset.
- There is no authentication, no server-side storage, and no deployment configuration; the application is built for local development.

## Future Scope

- Expanding the supported career-role taxonomy (several categories are already scaffolded in the frontend but not yet backed by a role)
- Training on a larger, real-world dataset
- Additional skill domains beyond the current 9 features
- Longitudinal skill tracking across multiple submissions

## License

No license is currently specified for this repository.
