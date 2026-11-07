# Architecture

## Overview

```
┌─────────────────────┐        HTTP (JSON)        ┌──────────────────────┐
│   frontend/          │  ───────────────────────▶ │   backend/            │
│   React 19 + Vite    │  ◀─────────────────────── │   FastAPI             │
│   http://localhost:  │                            │   http://127.0.0.1:  │
│   5173 (dev)          │                            │   8000                │
└─────────────────────┘                            └──────────┬───────────┘
                                                                │ loads at import time
                                                                ▼
                                                     ┌──────────────────────┐
                                                     │  ml/models/*.pkl,    │
                                                     │  *.json (artifacts   │
                                                     │  produced by ml/     │
                                                     │  notebooks)          │
                                                     └──────────────────────┘
```

The three top-level directories (`ml/`, `backend/`, `frontend/`) are developed and run
independently but connected by:

1. `ml/` producing serialized model artifacts under `ml/models/`.
2. `backend/app/ml_service.py` loading those artifacts by relative path
   (`BASE_DIR / "ml" / "models"`, where `BASE_DIR` is computed from the backend package's own
   location) — the backend depends on `ml/models/` existing on disk, but has no other coupling
   to the `ml/` codebase.
3. `frontend/src/api/api.js` calling the backend over HTTP at a hardcoded
   `http://127.0.0.1:8000` base URL.

## Backend (`backend/`)

FastAPI application, single package `app/`:

- **`main.py`** — the `FastAPI` app instance and all route definitions. CORS is restricted to
  `http://localhost:5173` (the Vite dev server origin). See
  [API_REFERENCE.md](API_REFERENCE.md) for every endpoint.
- **`schemas.py`** — Pydantic request/response models. `StudentProfile` is the single input
  shape used by both prediction endpoints; its 9 fields are the canonical definition of the
  student feature set (see [DATA_MODEL.md](DATA_MODEL.md)).
- **`ml_service.py`** — loads `scaler.pkl`, `kmeans_model.pkl`,
  `skill_category_classifier.pkl`, `cluster_category_mapping.json`, and `classifier_info.json`
  once at import time. Exposes `predict_skill_category(profile: dict) -> str`. Note:
  `kmeans_model.pkl` is loaded but explicitly **not** used for live prediction (only the
  already-trained classifier is used at request time) — see
  [ML_METHODOLOGY.md](ML_METHODOLOGY.md) for why.
- **`alignment_service.py`** — the rule-based career alignment engine. Pure Python, no ML
  model, no dependency on `ml_service.py` or scikit-learn. Validates the profile, computes a
  gap and alignment score per role, and picks the best match.
- **`career_roles.py`** — the fixed list of 5 career roles and their illustrative requirement
  profiles (see [DATA_MODEL.md](DATA_MODEL.md)).
- **`test_alignment.py`** — a manual, plain-Python verification script (not a pytest suite;
  run directly with `python test_alignment.py`) that hand-checks the alignment formula
  against known values.

The backend has no database and no persistent server-side state — every request is
stateless; the only "storage" in the whole system is the frontend's `localStorage`.

## ML Pipeline (`ml/`)

Sequential Jupyter notebooks under `ml/notebooks/`, each building on artifacts from the
previous one, executed in order:

1. `01_eda.ipynb` — exploratory data analysis on the synthetic dataset.
2. `02_preprocessing_feature_engineering.ipynb` — train/test split, then `StandardScaler`
   fit only on the training split.
3. `03_clustering_target_creation.ipynb` — K-Means (k=4) fit on scaled training data,
   producing pseudo-label skill categories.
4. `04_dbscan_outlier_analysis.ipynb` — exploratory-only outlier analysis; no artifacts saved.
5. `05_pca_visualization.ipynb` — exploratory/visualization-only dimensionality reduction;
   saves `pca_model.pkl` / `pca_info.json` because PCA's `.transform()` is reusable.
6. `06_classification_models.ipynb` — trains and compares 5 classifiers on the K-Means
   pseudo-labels; selects and saves the Random Forest classifier.

Full methodology, exact numbers, and the reasoning behind each choice are in
[ML_METHODOLOGY.md](ML_METHODOLOGY.md) — do not duplicate or restate those numbers from
memory elsewhere; link to that document instead.

`ml/generate_synthetic_data.py` produces `ml/data/raw/student_data.csv` (the actual dataset
used) and `ml/data/raw/generation_reference.csv` (which archetype each row came from — used
only for the author's own sanity-checking, and explicitly never to be used as a feature or
target). `ml/data/processed/` exists as a directory (with a `.gitkeep`) but no processed
files are persisted there — the train/test split and scaling happen in-memory inside the
notebooks.

## Frontend (`frontend/`)

React 19 + Vite single-page application, plain CSS (no framework — see
[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)), routed with `react-router-dom` v7.

### Composition root

`main.jsx` renders, in order: `BrowserRouter` → `ProfileProvider` (context) →
`AmbientBackground` (fixed decorative layer, rendered once, outside the routed page content)
→ `App`.

`App.jsx` renders the persistent shell: `.app-shell` containing `Sidebar`, and `.app-main`
containing `TopBar`, a `<Routes>` block for the 6 pages (see
[PRODUCT_REQUIREMENTS.md](PRODUCT_REQUIREMENTS.md)), and `Footer`.

### State management

`frontend/src/context/`:

- **`ProfileContext.jsx`** — defines `ProfileProvider`, which owns `profile`,
  `skillCategoryResult`, `careerAlignmentResult`, `loading`, and `error` state; persists all
  of it to `localStorage` under the key `skilllens_profile_state` on every change; exposes
  `analyzeProfile(profile)` (clears previous results, calls both backend endpoints via
  `Promise.all`, updates state) and `clearProfile()`.
- **`profileContextObject.js`** / **`useProfile.js`** — the context object and consumer hook
  are split into their own files (rather than living in `ProfileContext.jsx`) specifically so
  that Vite's Fast Refresh can treat the provider component and the hook/context as separate
  exports. Keep this split when modifying context — merging them back into one file will
  degrade the dev experience, not break functionality.

### API layer

`frontend/src/api/api.js` is the **only** place that calls the backend. A shared `request()`
helper standardizes error handling (network failure vs. non-OK HTTP response, surfacing the
backend's `detail` field). Exports: `predictSkillCategory`, `getCareerAlignment`,
`getCareerRoles`, `getModelInfo`. No component should call `fetch` directly — route new
backend calls through this file.

### Constants

- **`constants/fields.js`** — the single source of truth for the 9 student features on the
  frontend: `FIELD_GROUPS` (Academic / Technical / Professional), `ALL_FIELDS`,
  `DEFAULT_PROFILE`, `FEATURE_LABELS`. Must stay in sync with `backend/app/schemas.py`'s
  `StudentProfile` — see [DATA_MODEL.md](DATA_MODEL.md).
- **`constants/careerPaths.js`** — `CAREER_PATH_CATEGORIES`, the browsable career-path
  taxonomy shown on the Career Alignment and Home pages, including paths not yet backed by a
  live backend role (see [DATA_MODEL.md](DATA_MODEL.md#career-path-taxonomy) and
  [CURRENT_STATE.md](CURRENT_STATE.md)).

### Components (`frontend/src/components/`)

| Component | Role |
|---|---|
| `Sidebar` | Persistent left navigation, logo/brand mark |
| `TopBar` | Per-route title/subtitle strip |
| `Footer` | Persistent footer |
| `EmptyState` | Generic "nothing here yet" placeholder |
| `StatusMessage` | Loading/error state display |
| `MetricCard` | Animated metric readout with a color variant (see [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)) |
| `StatCard` | Compact stat display |
| `SkillBar` | Animated single-field bar (used in profile breakdown) |
| `CareerCard` | Single career-role result card (score, best-match indicator) |
| `CareerPathExplorer` | Browsable career-path taxonomy grouped by category |
| `DiscoverAlignGrow` | The recurring 3-step value-proposition motif (Home + About) |
| `ReportSection` | Numbered section wrapper used throughout the Analysis report |
| `Reveal` | Scroll-triggered reveal animation via `IntersectionObserver` |
| `Sparkle` | Brand motif SVG |
| `AmbientBackground` | Fixed, `aria-hidden`, `pointer-events: none` decorative layer: 4 drifting blurred glow shapes plus a grain overlay, sitting behind all routed content |

### Hooks (`frontend/src/hooks/`)

- **`useAnimatedPercent.js`** — animates a percentage/bar value from 0 to its target on
  mount; used by `MetricCard`, `SkillBar`, and `CareerCard` for consistent motion.

## Data Flow: Submitting a Profile

1. User adjusts sliders on `/profile`; each change updates `profile` in context (persisted to
   `localStorage` immediately).
2. On submit, `analyzeProfile(profile)` calls `predictSkillCategory(profile)` and
   `getCareerAlignment(profile)` in parallel via `Promise.all`.
3. Both results are stored in context (and thus `localStorage`).
4. The user is navigated to `/analysis`, which reads `skillCategoryResult` and
   `careerAlignmentResult` from context — no additional network call is made when navigating
   between Analysis, Career Alignment, and Skill Gap; all three read the same context state.
5. On a full page reload, `ProfileContext`'s `loadStoredState()` rehydrates `profile` and both
   results from `localStorage`, so the report survives a reload without resubmitting.

## Not Documented / Requires Confirmation

- No deployment topology (hosting, containerization, CI/CD) exists in the repository; both
  the backend base URL (`http://127.0.0.1:8000`) and CORS origin
  (`http://localhost:5173`) are hardcoded for local development only.
- No environment-variable-based configuration exists for either service.
