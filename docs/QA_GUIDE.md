# QA Guide

There is no automated test suite (no Jest/Vitest/pytest) in this repository. Quality is
verified through the checks below — run all of them before considering a change complete.

## Backend Checks

```bash
cd backend
python -m py_compile app/main.py app/schemas.py app/ml_service.py app/alignment_service.py app/career_roles.py
python test_alignment.py
```

`test_alignment.py` is a plain-Python manual verification script (not pytest). It checks, for
3 hand-written sample profiles, that:
- All 5 roles are evaluated for every profile.
- Every alignment score is between 0 and 100.
- Skill gaps are sorted largest-first.
- No `skill_gaps` entry is included where `actual >= required`.
- `best_match_score` equals the true maximum score.
- One profile's score is verified against an independent hand calculation (see the script's
  `manual_verification()` function).

It should print "All Stage 7 checks completed successfully." with no assertion errors.

Manually start the server and confirm the API responds:
```bash
python -m uvicorn app.main:app --reload
# in another terminal:
curl http://127.0.0.1:8000/health
```

## Frontend Checks

```bash
cd frontend
npm run lint     # oxlint — react/rules-of-hooks and react/only-export-components are errors/warnings
npm run build    # vite build — must complete without errors
```

## Manual Functional Verification

With both servers running (backend at `http://127.0.0.1:8000`, frontend at
`http://localhost:5173`), verify the full user flow in a browser:

1. **Home** (`/`) renders: heading, CTA buttons, "How It Works" strip.
2. Click through to **Profile** (`/profile`), adjust several sliders, submit ("Analyze My
   Profile").
3. Confirm navigation to **Analysis** (`/analysis`) and that it shows a predicted skill
   category and rendered skill bars — not raw JSON.
4. Go to **Career Alignment** (`/career-alignment`) and confirm all 5 roles show with scores
   and exactly one is marked "Best Match".
5. Go to **Skill Gap** (`/skill-gap`) and confirm it shows the best-match role, alignment
   percentage, and gap rows (or the positive/empty state if there are no gaps).
6. **Reload the page** and confirm the profile and results are still shown (verifies
   `localStorage` persistence — see [ARCHITECTURE.md](ARCHITECTURE.md)).
7. Check the browser console for errors during the whole flow.

## Responsive Verification

Check layout at minimum: 375px, 390px, 430px (mobile), 768px, 900px (tablet), 1024px, 1280px,
1440px (desktop) — these correspond to the breakpoints defined in `index.css` (see
[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)). Pay particular attention to the Sidebar/TopBar
collapsing behavior and the Profile page's mobile-only second submit button.

**Testing artifact to be aware of**: full-page browser screenshots (e.g. via Playwright's
`fullPage: true`) can misrepresent `position: fixed` and `position: sticky` elements (such as
the `AmbientBackground` layer or a sticky sidebar/intro panel), making them appear
duplicated, mispositioned, or stretched across the full captured height even though they
render correctly in an actual viewport. When verifying fixed/sticky elements, use
viewport-only screenshots (`fullPage: false`) or check `getBoundingClientRect()` directly
instead of trusting a full-page capture.

## Accessibility Spot-Checks

- Tab through the Profile form; every slider should be reachable and show a visible focus
  ring, and its label should be announced.
- Enable "reduce motion" at the OS level and confirm decorative animation (ambient
  background drift, sparkle drift, scroll-reveal, page fade-in) is stopped or reduced.

## ML / Data Checks

If notebooks are re-run, confirm before treating new artifacts as ready:
- `ml/models/classifier_info.json`'s `evaluation_metrics` are still reasonable (no unexplained
  large drop from the recorded ≈0.97 weighted metrics).
- The `note` field in `classifier_info.json` still contains the pseudo-label disclaimer (see
  [ML_METHODOLOGY.md](ML_METHODOLOGY.md)) — do not let it be dropped by a notebook edit.
- `cluster_category_mapping.json` still has exactly 4 entries matching the category names in
  [ML_METHODOLOGY.md](ML_METHODOLOGY.md).

## Not Documented / Requires Confirmation

- No CI pipeline exists to run any of the above automatically — all checks in this guide are
  currently manual.
