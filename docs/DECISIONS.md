# Decisions

Key technical and product decisions, and the reasoning behind them, as evidenced by code
comments, docstrings, and notebook conclusions. This document exists so a future contributor
does not accidentally "fix" something that was chosen deliberately.

## Use synthetic data instead of real student data

**Decision**: Generate a synthetic dataset (`ml/generate_synthetic_data.py`) rather than use
real student survey data.
**Why**: Real, anonymous student survey data was not available at the time this project was
built. Column names, ranges, and downstream code were deliberately kept generic so real data
could later replace the synthetic dataset without other changes (see
`ml/data/raw/DATASET_NOTES.md`).
**Implication**: All model behavior and evaluation metrics are only known to be valid for this
synthetic dataset — see [ML_METHODOLOGY.md](ML_METHODOLOGY.md) and
[CURRENT_STATE.md](CURRENT_STATE.md).

## Split train/test before any fitting (leakage-safe workflow)

**Decision**: The train/test split happens first, before `StandardScaler`, K-Means, or any
other fitting step; the scaler and K-Means are fit only on the training split and only ever
`.transform()`/`.predict()` on the test split.
**Why**: To mirror how a genuinely new student's data would be handled in production —
transformed using statistics learned in advance, never contributing to learning them — and to
produce an honest, leakage-free evaluation of the classifier.
**Implication**: Any future change to the pipeline (e.g. adding a feature, adding a
preprocessing step) must preserve this ordering. Fitting anything on the full dataset before
splitting would invalidate the reported evaluation metrics.

## Choose k=4 for K-Means despite k=2 scoring higher on silhouette

**Decision**: Use k=4 clusters for skill-category pseudo-labeling, even though k=2 had a
higher silhouette score (≈0.31 vs. ≈0.24).
**Why**: k=4 is a genuine local peak (better than both k=3 and k=5), is supported by the
elbow plot as a reasonable stopping point, and — the deciding factor — produces four clusters
that are actually distinguishable from each other and useful to the product, whereas k=2
would only separate "stronger" from "weaker" students with nothing actionable to offer.
**Implication**: If cluster count is ever revisited, this trade-off (statistical score vs.
product usefulness) should be re-evaluated explicitly, not silently reverted to the highest
silhouette score. See [ML_METHODOLOGY.md](ML_METHODOLOGY.md).

## Rename Cluster 3 from "Balanced" to "Strong Overall"

**Decision**: Cluster 3, originally expected to be labeled "Balanced" (per an earlier 4-category
proposal), was instead named "Strong Overall".
**Why**: Its actual profile, inspected after clustering (highest on 7 of 9 features), did not
match what "balanced" means. Category names were assigned only after inspecting real cluster
means, not decided in advance.
**Implication**: Do not rename this category back to "Balanced" — "Balanced" is correctly used
instead for Cluster 2 (moderate on most features, standout security knowledge). See
[ML_METHODOLOGY.md](ML_METHODOLOGY.md).

## Select Random Forest over a perfect-scoring SVM

**Decision**: Random Forest was selected as the production classifier even though SVM scored
a perfect 1.00 on all weighted evaluation metrics.
**Why**: The perfect SVM score was expected (not suspicious) given that the labels are
cluster-boundary-derived, so a flexible model can separate them cleanly — this alone was not
treated as a reason to select it. Random Forest was chosen instead for even class-wise
performance (no class below 0.90 recall), only 2/60 test misclassifications, and
interpretable feature importances.
**Implication**: Do not swap in a higher-raw-score model without also weighing interpretability
and class-wise balance, per this project's established evaluation criteria.

## Keep DBSCAN and PCA exploratory-only, not part of the live path

**Decision**: Neither DBSCAN (Stage 4) nor PCA (Stage 5) is used by the backend at request
time; DBSCAN saves no artifacts at all.
**Why**: DBSCAN has no `.predict()` for new data, so persisting it would provide no reusable
capability. PCA is for visualization/dimensionality-reduction insight only and does not feed
the classifier or the alignment engine.
**Implication**: Do not wire either into `ml_service.py`'s live prediction path without a
deliberate, separately-justified decision — doing so would blur the boundary this project
has kept explicit between "used to build the model" and "used to understand the data."

## Career alignment is rule-based, not machine learning

**Decision**: `alignment_service.py` is pure Python with no ML model, entirely independent of
the classifier, K-Means, DBSCAN, and PCA.
**Why**: Career-role fit is expressed as a transparent, auditable gap calculation against
fixed, illustrative requirement profiles — not as something to be "learned," since no labeled
ground truth for career fit exists.
**Implication**: Do not replace this with a trained model without an explicit, separate
decision — the current design's value is its transparency and auditability (every score can
be hand-verified, as `test_alignment.py` does).

## Career role requirements are illustrative, not industry-sourced

**Decision**: The 5 roles' requirement profiles in `career_roles.py` are fixed numbers chosen
by the project author, not derived from any hiring dataset or industry standard.
**Why**: No real hiring/requirements dataset was available; the profiles exist to give the
alignment engine something concrete to compare against.
**Implication**: Any user-facing copy must continue to frame these as illustrative, not as
authoritative industry benchmarks (see [ML_METHODOLOGY.md](ML_METHODOLOGY.md) and
[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)).

## Lock the background and sidebar colors

**Decision**: `#FDFCE8` (main background) and `#341539` (sidebar background) are treated as
locked design tokens.
**Why**: Not documented in code comments beyond their consistent, exclusive use throughout
`index.css` as the foundation of the visual identity — recorded here as a locked decision per
explicit project instruction; requires confirmation if a future rebrand is intended.
**Implication**: Do not change these two values as a side effect of an unrelated styling
change. See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) and [AGENTS.md](../AGENTS.md).

## Split ProfileContext into provider, context object, and hook files

**Decision**: `ProfileContext.jsx`, `profileContextObject.js`, and `useProfile.js` are kept as
3 separate files rather than one.
**Why**: So Vite's Fast Refresh can treat the provider component and the
hook/context-object exports separately, avoiding full-reload-on-edit during development.
**Implication**: Do not merge these back into a single file — it would not break runtime
behavior but would degrade the development experience.

## Not Documented / Requires Confirmation

- No formal architecture decision record (ADR) process exists; this document was reconstructed
  from code comments, docstrings, and notebook conclusions rather than from dated decision
  logs.
