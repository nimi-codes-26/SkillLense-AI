# Current State

This document reflects the state of the repository as directly observed in code at the time
this documentation set was written. Update it whenever a change materially affects what is
listed here.

## Completed

- **ML pipeline**: dataset generation, EDA, preprocessing, K-Means pseudo-labeling, DBSCAN
  exploratory analysis, PCA exploratory analysis, and Random Forest classifier training are
  all implemented and their artifacts exist under `ml/models/`. See
  [ML_METHODOLOGY.md](ML_METHODOLOGY.md).
- **Backend**: FastAPI service fully implemented with all 6 endpoints documented in
  [API_REFERENCE.md](API_REFERENCE.md), the ML prediction path, and the independent rule-based
  career alignment engine. A manual verification script (`backend/test_alignment.py`) confirms
  the alignment formula against hand-calculated values.
- **Frontend**: all 6 routes implemented (Home, Profile, Analysis, Career Alignment, Skill
  Gap, About) with a shared shell (Sidebar, TopBar, Footer), shared design system, context-based
  state management with `localStorage` persistence, and an ambient decorative background
  layer. See [ARCHITECTURE.md](ARCHITECTURE.md) and [PRODUCT_REQUIREMENTS.md](PRODUCT_REQUIREMENTS.md).
- **Design system**: locked colors, typography, spacing/radius/shadow tokens, and semantic
  color usage are defined and consistently applied across components (see
  [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)).
- **Accessibility basics**: label association on form controls, focus-visible states,
  `prefers-reduced-motion` support across all decorative animation.
- **Manual QA**: the application has been manually verified end-to-end (profile submission →
  analysis → career alignment → skill gap → reload persistence) and across multiple viewport
  widths — see [QA_GUIDE.md](QA_GUIDE.md).

## Partial / In Progress

- **Career path taxonomy**: 4 of 9 browsable career paths in
  `frontend/src/constants/careerPaths.js` are backed by a live backend role; the remaining 5
  (Cloud & DevOps, Business Analytics, UI/UX, Product Management) are placeholder entries with
  `roleKey: null` and render as non-functional "coming next" items. See
  [DATA_MODEL.md](DATA_MODEL.md#career-path-taxonomy).
- No environment-variable-based configuration exists; the root `README.md` and
  [ARCHITECTURE.md](ARCHITECTURE.md) both note the backend URL and CORS origin are hardcoded
  for local development.

## Not Implemented

- No authentication, accounts, or multi-user support.
- No server-side persistence of student data — the only persistence is client-side
  `localStorage`, scoped to a single browser.
- No deployment configuration (hosting, containers, CI/CD pipeline) exists in the repository.
- No automated test suite (unit or integration) beyond the manual `test_alignment.py` script
  and the lint/build/py_compile checks in [QA_GUIDE.md](QA_GUIDE.md) — there is no
  Jest/Vitest/pytest suite.
- No real (non-synthetic) student dataset.
- No rate limiting, request logging, or monitoring on the backend.

## Known Gaps / Risks

- The synthetic dataset means model behavior on real students is unverified.
- Career role requirement profiles are illustrative, author-chosen numbers, not sourced from
  any real hiring dataset — this must remain visible in any user-facing framing (see
  [ML_METHODOLOGY.md](ML_METHODOLOGY.md)).
- Hardcoded local URLs (`http://127.0.0.1:8000` in the frontend, `http://localhost:5173` in
  backend CORS) mean the app only works as-is in local development; deploying either service
  elsewhere requires code changes, not just configuration.

## Not Documented / Requires Confirmation

- No issue tracker, roadmap, or backlog exists in the repository to confirm planned next
  steps beyond what's implied by the "coming next" career paths above.
- No historical dates for when specific features were completed are recorded in the
  repository (a single initial commit exists; most of the current tree is untracked at the
  time of writing) — see [CHANGELOG.md](CHANGELOG.md).
