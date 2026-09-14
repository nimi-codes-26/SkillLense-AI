# Changelog

Dates are not reliably recorded in the repository's history (a single initial commit exists;
most of the current tree is untracked at the time this file was written — see `git status`).
Entries are ordered logically (build sequence), each marked **Date not documented**.

## Repository Finalization

**Date not documented**
- Rewrote the root `README.md` into a concise, product-facing overview; the previous version
  described the project as an in-progress staged build and was out of date with the completed
  backend and frontend.
- Tightened `.gitignore` (environment files, editor/OS artifacts, local scratch/screenshot
  output) and committed the trained model artifacts under `ml/models/` so the application runs
  end-to-end from a fresh checkout without a separate training step.
- Removed redundant `.gitkeep` placeholders from `ml/models/` and `ml/notebooks/` now that both
  directories contain real content.

## Documentation

**Date not documented**
- Added the full `docs/` documentation set (`PROJECT_CONTEXT.md`, `PRODUCT_REQUIREMENTS.md`,
  `DESIGN_SYSTEM.md`, `ARCHITECTURE.md`, `ML_METHODOLOGY.md`, `DATA_MODEL.md`,
  `API_REFERENCE.md`, `CURRENT_STATE.md`, `DEVELOPMENT_GUIDE.md`, `QA_GUIDE.md`,
  `CHANGELOG.md`, `DECISIONS.md`), plus `AGENTS.md` and `.github/copilot-instructions.md`.

## Frontend Visual Redesign Passes

**Date not documented**
- Added an ambient, whole-app decorative background (`AmbientBackground` component): 4 slowly
  drifting blurred glow layers plus a grain overlay, fixed behind all routed content,
  respecting `prefers-reduced-motion`.
- Product-level redesign of report/analysis presentation: introduced `ReportSection`,
  `MetricCard`, `StatCard`, `SkillBar`, `CareerCard`, `CareerPathExplorer`,
  `DiscoverAlignGrow`, `Reveal` (scroll-triggered reveal), and the `useAnimatedPercent` hook
  for consistent animated metric readouts.
- Initial visual polish pass establishing the locked color palette (`#FDFCE8` background,
  `#341539` sidebar) and Playfair Display + Inter typography.

## Frontend Application

**Date not documented**
- Built all 6 routes (Home, Profile, Analysis, Career Alignment, Skill Gap, About), the
  persistent Sidebar/TopBar/Footer shell, `ProfileContext` with `localStorage` persistence,
  and the `api/api.js` backend client.

## Backend

**Date not documented**
- Built the FastAPI application: `StudentProfile` schema, `/predict-skill-category` and
  `/career-alignment` endpoints backed by `ml_service.py` and `alignment_service.py`
  respectively, plus `/career-roles`, `/model-info`, `/`, and `/health`.
- Added the rule-based career alignment engine (`alignment_service.py`,
  `career_roles.py`) and its manual verification script (`test_alignment.py`).

## ML Pipeline

**Date not documented**
- Generated the synthetic dataset (`generate_synthetic_data.py`, 300 students, 5 archetypes).
- Completed the notebook sequence: EDA (01), preprocessing with a leakage-safe train/test
  split (02), K-Means pseudo-label clustering with k=4 selected (03), exploratory DBSCAN
  outlier analysis (04), exploratory PCA visualization (05), and 5-way classifier comparison
  resulting in the selected Random Forest classifier (06).

## Initial Commit

**Date not documented** (recorded in git history as the repository's first commit)
- Project setup and synthetic dataset scaffolding.

## Not Documented / Requires Confirmation

- Exact chronological dates for any entry above.
- Whether any entries above correspond to more than one discrete commit/session — the
  repository's git history does not currently reflect this level of granularity.
