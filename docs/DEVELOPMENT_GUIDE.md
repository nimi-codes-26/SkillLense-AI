# Development Guide

## Prerequisites

- Python 3 (backend and ML pipeline)
- Node.js (frontend; `package.json` targets modern tooling — Vite 8, React 19)

Exact minimum versions are not documented / require confirmation — no `.python-version`,
`engines` field, or similar constraint file exists in the repository.

## Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Dependencies (`backend/requirements.txt`): `fastapi`, `uvicorn`, `pydantic`, `numpy`,
`scikit-learn`, `joblib`.

The backend loads model artifacts from `ml/models/` relative to its own location at import
time — it must be run from a checkout where `ml/models/` exists and is populated (see
[ARCHITECTURE.md](ARCHITECTURE.md)). It listens on `http://127.0.0.1:8000` by default (via
uvicorn) and only accepts cross-origin requests from `http://localhost:5173`.

To manually verify the career alignment engine independent of the server:
```bash
cd backend
python test_alignment.py
```

## Frontend

```bash
cd frontend
npm install
npm run dev       # start Vite dev server (http://localhost:5173)
npm run build      # production build
npm run lint       # oxlint
npm run preview    # preview a production build
```

The frontend expects the backend to already be running at `http://127.0.0.1:8000`.

## ML Pipeline

```bash
cd ml
pip install -r requirements.txt
python generate_synthetic_data.py   # regenerates ml/data/raw/student_data.csv and generation_reference.csv
jupyter notebook                     # then run notebooks/01 through 06 in order
```

Dependencies (`ml/requirements.txt`): `numpy`, `pandas`, `matplotlib`, `seaborn`,
`scikit-learn`, `jupyter`, `ipykernel`.

Notebooks must be run in numeric order (01 → 06); each depends on artifacts or reasoning
established by the previous one (see [ML_METHODOLOGY.md](ML_METHODOLOGY.md)). Re-running them
overwrites `ml/models/*.pkl` and the accompanying `*.json` metadata files in place — there is
no artifact versioning.

## Running the Full Stack Locally

1. Start the backend (`http://127.0.0.1:8000`).
2. Start the frontend dev server (`http://localhost:5173`).
3. Open `http://localhost:5173` in a browser.

Both hardcoded URLs above must match for the app to function — see
[ARCHITECTURE.md](ARCHITECTURE.md) for where each is defined.

## Extending the Project

- **Adding a new career role**: add an entry to `CAREER_ROLES` in
  `backend/app/career_roles.py` with a `role`, `description`, and full `requirements` dict for
  all 9 features. Optionally add a matching entry in
  `frontend/src/constants/careerPaths.js` with a `roleKey` matching the new role's `role`
  string exactly.
- **Adding a new career path placeholder** (not yet backed by a role): add an entry to
  `CAREER_PATH_CATEGORIES` in `frontend/src/constants/careerPaths.js` with `roleKey: null`.
- **Adding a new student feature**: requires changes in at least 4 places kept in sync —
  `backend/app/schemas.py` (`StudentProfile`), `backend/app/ml_service.py` (`FEATURES` order),
  `backend/app/career_roles.py` (every role's `requirements`), and
  `frontend/src/constants/fields.js` (`FIELD_GROUPS`/`ALL_FIELDS`/`DEFAULT_PROFILE`) — and
  retraining the classifier on the new feature set, since `FEATURES` order must match what the
  model was trained on.
- **Adding a new frontend page/component**: follow the existing pattern — route in
  `App.jsx`, entry in `Sidebar`'s `NAV_ITEMS` and `TopBar`'s `PAGE_INFO`, styles added as a new
  clearly labeled section in `index.css` (see [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)), reusing
  existing components (`MetricCard`, `StatCard`, `SkillBar`, `CareerCard`, `ReportSection`,
  etc.) before introducing new ones.
- Before merging any change, run the checks in [QA_GUIDE.md](QA_GUIDE.md).

## Not Documented / Requires Confirmation

- No documented process for regenerating the dataset with a different `RANDOM_SEED` or
  archetype set beyond directly editing `ml/generate_synthetic_data.py`.
- No contribution guidelines, branching strategy, or code review process is documented beyond
  what's in [AGENTS.md](../AGENTS.md).
