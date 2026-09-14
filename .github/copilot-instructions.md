# Repository Instructions

These are the standing rules for making changes to this repository.

## Read First

Before changing code, read:

- [docs/PROJECT_CONTEXT.md](../docs/PROJECT_CONTEXT.md) — what the project is
- [docs/CURRENT_STATE.md](../docs/CURRENT_STATE.md) — what's built, what isn't
- [docs/DESIGN_SYSTEM.md](../docs/DESIGN_SYSTEM.md) — colors, typography, component conventions
- [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) — how frontend/backend/ML fit together
- [docs/ML_METHODOLOGY.md](../docs/ML_METHODOLOGY.md) — how the ML pipeline works and its limits
- [docs/DECISIONS.md](../docs/DECISIONS.md) — why key choices were made, so they aren't
  reverted by accident

## Preservation Rules

- **Do not change the locked brand colors** — main background (`#FDFCE8`) and sidebar
  background (`#341539`) — without a deliberate, discussed decision. See
  [docs/DESIGN_SYSTEM.md](../docs/DESIGN_SYSTEM.md).
- **Do not modify the validated ML methodology casually.** The K-Means cluster count (k=4),
  the leakage-safe train/test-before-fitting order, and the Random Forest model selection were
  each made for specific, documented reasons — see
  [docs/ML_METHODOLOGY.md](../docs/ML_METHODOLOGY.md) and
  [docs/DECISIONS.md](../docs/DECISIONS.md). If a change is warranted, update the relevant
  docs to explain why, not just the code.
- **Never present K-Means-derived skill categories as real-world employability, career
  success, or career-readiness outcomes** — in code comments, UI copy, or documentation. See
  [docs/ML_METHODOLOGY.md](../docs/ML_METHODOLOGY.md).
- **Do not invent capabilities the system doesn't have.** Career role requirements are
  illustrative, author-defined numbers, not industry standards — keep that framing intact
  anywhere they're surfaced.
- **Keep supported-role/career-path claims honest.** Several career paths in
  `frontend/src/constants/careerPaths.js` are placeholders (`roleKey: null`) not backed by a
  real backend role — do not present them as functional without also adding the backend role
  and requirements that back them. See [docs/DATA_MODEL.md](../docs/DATA_MODEL.md).
- **Maintain responsiveness and accessibility.** Preserve existing breakpoint behavior, label
  association on form controls, focus-visible states, and `prefers-reduced-motion` support for
  any decorative animation. See [docs/DESIGN_SYSTEM.md](../docs/DESIGN_SYSTEM.md).
- **Prefer existing reusable components** (`MetricCard`, `StatCard`, `SkillBar`, `CareerCard`,
  `ReportSection`, etc.) over building new one-off UI for the same purpose. See
  [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md).
- **Avoid adding dependencies that aren't necessary.** Both `frontend/package.json` and the
  Python `requirements.txt` files are intentionally small.
- **Run the checks in [docs/QA_GUIDE.md](../docs/QA_GUIDE.md)** after any change, before
  considering it done.
- **Keep documentation current.** After a change that affects behavior, update
  [docs/CURRENT_STATE.md](../docs/CURRENT_STATE.md), [docs/CHANGELOG.md](../docs/CHANGELOG.md),
  and [docs/DECISIONS.md](../docs/DECISIONS.md) as appropriate, in the same change.
