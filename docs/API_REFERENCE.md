# API Reference

Source of truth: `backend/app/main.py`, `backend/app/schemas.py`. Base URL for local
development: `http://127.0.0.1:8000` (hardcoded in `frontend/src/api/api.js`). CORS is
restricted to `http://localhost:5173`.

## `GET /`

Health/liveness check for the API root.

**Response 200**
```json
{ "message": "SkillLens AI API is running" }
```

## `GET /health`

**Response 200**
```json
{ "status": "healthy" }
```

## `POST /predict-skill-category`

Predicts the student's skill category using the trained Random Forest classifier (see
[ML_METHODOLOGY.md](ML_METHODOLOGY.md)).

**Request body** — `StudentProfile`:
```json
{
  "cgpa": 7.5,
  "coding_skill": 8,
  "dsa_skill": 7,
  "math_aptitude": 6.5,
  "communication_skill": 7,
  "security_knowledge": 5,
  "projects_count": 4,
  "internships_count": 1,
  "certifications_count": 2
}
```
All 9 fields required; see [DATA_MODEL.md](DATA_MODEL.md) for exact ranges. Out-of-range or
missing fields produce a `422 Unprocessable Entity` (standard Pydantic validation error body).

**Response 200** — `SkillCategoryResponse`:
```json
{
  "predicted_category": "Strong Technical",
  "model_name": "Random Forest"
}
```

**Response 500** — if `predict_skill_category()` raises internally, the exception is caught
and re-raised as an `HTTPException(status_code=500)`.

## `POST /career-alignment`

Computes the rule-based alignment score against all 5 career roles (see
[DATA_MODEL.md](DATA_MODEL.md) for the formula — this is **not** an ML prediction).

**Request body** — `StudentProfile` (same shape as above).

**Response 200** — `CareerAlignmentResponse`:
```json
{
  "best_match": "Software Developer",
  "best_match_score": 91.21,
  "all_role_results": [
    {
      "role": "Software Developer",
      "alignment_score": 91.21,
      "total_gap": 4.0,
      "skill_gaps": [
        { "feature": "dsa_skill", "actual": 5.5, "required": 8, "gap": 2.5 },
        { "feature": "coding_skill", "actual": 6.5, "required": 8, "gap": 1.5 }
      ]
    }
  ]
}
```
`all_role_results` contains one entry per role (5 total), each with `skill_gaps` sorted
largest-gap-first; entries are included in `skill_gaps` only for features where
`actual < required`.

**Response 422** — if `calculate_career_alignment()` raises `ValueError` (e.g. profile
validation failure), caught and returned as `HTTPException(status_code=422)`.

**Response 500** — any other exception during calculation.

## `GET /career-roles`

Returns the fixed list of career roles and their requirement profiles (see
[DATA_MODEL.md](DATA_MODEL.md#career-roles-rule-based-alignment-input)).

**Response 200**
```json
[
  {
    "role": "Software Developer",
    "description": "A generalist programming-heavy profile: ...",
    "requirements": { "cgpa": 6.5, "coding_skill": 8, "...": "..." }
  }
]
```
(5 entries total.)

## `GET /model-info`

Returns metadata about the deployed skill-category classifier, built from
`ml/models/classifier_info.json`.

**Response 200**
```json
{
  "model_name": "Random Forest",
  "features": ["cgpa", "coding_skill", "dsa_skill", "math_aptitude", "communication_skill", "security_knowledge", "projects_count", "internships_count", "certifications_count"],
  "target": "skill_category",
  "categories": ["Needs Improvement", "Strong Technical", "Balanced", "Strong Overall"],
  "evaluation_metrics": {
    "accuracy": 0.9667,
    "precision_weighted": 0.9686,
    "recall_weighted": 0.9667,
    "f1_weighted": 0.9665
  },
  "note": "target_categories are K-Means-derived pseudo-labels from Stage 4, not real-world ground truth..."
}
```

## Frontend Client

`frontend/src/api/api.js` is the sole caller of this API from the frontend. It exposes
`predictSkillCategory(profile)`, `getCareerAlignment(profile)`, `getCareerRoles()`, and
`getModelInfo()`, all going through a shared `request()` helper that:

- Throws a user-facing "Unable to connect to the SkillLens AI backend..." message on network
  failure.
- Parses and surfaces the backend's `detail` field on non-OK HTTP responses.

## Not Documented / Requires Confirmation

- No authentication or rate-limiting is implemented on any endpoint.
- No API versioning scheme exists (all routes are unprefixed, e.g. no `/v1/`).
- No OpenAPI/Swagger customization beyond FastAPI's default auto-generated docs (available at
  `/docs` when the server is running) is documented — treat that auto-generated page as
  supplementary, not a replacement for this file.
