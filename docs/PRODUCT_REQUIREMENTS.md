# Product Requirements

This document describes what the SkillLens AI product does today, as evidenced by the
frontend routes and their behavior. It is a description of implemented behavior, not a
forward-looking specification — see [CURRENT_STATE.md](CURRENT_STATE.md) for what remains
undone and [DECISIONS.md](DECISIONS.md) for why certain scope was excluded.

## Pages / Routes

The application has 6 routes, all rendered inside a persistent shell (sidebar + top bar +
footer, see [ARCHITECTURE.md](ARCHITECTURE.md)):

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | Landing page: value proposition, illustrative preview of a report, career-path teaser, pipeline overview, call to action |
| `/profile` | Profile | Form for entering the 9 skill/academic features |
| `/analysis` | Analysis | "Skill Intelligence Report" — predicted category, role fit, strengths, gaps, full breakdown |
| `/career-alignment` | Career Alignment | Alignment scores against all 5 career roles, plus a career-path explorer |
| `/skill-gap` | Skill Gap | Focused view of the best-match role's alignment score and priority skill gaps |
| `/about` | About | Explains what the product is, how the pipeline works, and the two-systems (ML vs rule-based) distinction |

## Home (`/`)

- Hero section with heading, supporting copy, and two calls to action (build profile / learn
  more), plus a decorative illustrative snapshot card showing example metrics.
- "Discover, Align, Grow" motif section (see `DiscoverAlignGrow` component) explaining the
  three-step value proposition.
- "What your report could look like" section: 4 example metric cards, explicitly labeled as
  illustrative, not real results (no backend call is made on this page).
- Career paths teaser using the career-path explorer component.
- "How It Works" 5-step pipeline overview (Your Profile → Skill Analysis → Pattern
  Identification → Career Fit → Skill Gaps).
- Closing call-to-action panel linking to the Profile page.

## Profile (`/profile`)

- A form grouped into 3 sections: Academic (CGPA), Technical (coding, DSA, math aptitude,
  security knowledge), and Professional (communication, projects, internships,
  certifications) — see [DATA_MODEL.md](DATA_MODEL.md) for exact fields and ranges.
- Each field is a labeled range slider with accessible `label`/`htmlFor` association and
  `aria-valuetext`.
- A progress indicator tracks how many of the fields the user has interacted with.
- Submitting ("Analyze My Profile") triggers both backend calls
  (`/predict-skill-category` and `/career-alignment`) in parallel and navigates to Analysis
  on success.
- Values persist to `localStorage` as they change (see [ARCHITECTURE.md](ARCHITECTURE.md)),
  so a returning user's last profile and results survive a page reload.

## Analysis (`/analysis`)

Requires a submitted profile (backed by `skillCategoryResult` and `careerAlignmentResult` in
context); shows an empty/prompt state otherwise. When results exist, shows 6 numbered
sections:

1. **Profile Snapshot** — predicted skill category plus two illustrative-style metric
   readouts (a readiness figure and a profile figure derived client-side from the submitted
   values).
2. **Role Fit** — the best-matching career role and its alignment score, with a link to the
   full Career Alignment page.
3. **Your Strengths** — the top 3 submitted fields ranked by value-to-max ratio (computed
   client-side from the profile; not a separate backend prediction).
4. **Skill Gaps** — the top 3 gaps versus the best-match role.
5. **What to Build Next** — the same gaps presented as action items.
6. **Profile Breakdown** — every field grouped and shown as a skill bar.

Ends with a methodology note clarifying the skill category is a machine-learning
classification and the role fit/gaps are a separate, rule-based calculation.

## Career Alignment (`/career-alignment`)

- "Your Role Fit": one card per career role (5 total) showing the role name, alignment score,
  and a "Best Match" indicator on the top-scoring role. Shown only when a profile has been
  submitted; otherwise a call-to-action card invites the user to build a profile.
- "Explore Career Paths": a browsable taxonomy of career paths grouped by category
  (Technology; Data & Analytics; Product & Design — see
  [DATA_MODEL.md](DATA_MODEL.md#career-path-taxonomy)). Selecting a path that maps to a live
  backend role scrolls to that role's card in "Your Role Fit" (or, with no profile submitted,
  navigates to Profile first). Selecting a path with no backend role yet is a non-functional
  "coming next" entry.

## Skill Gap (`/skill-gap`)

- Shows the best-match role's name and alignment percentage.
- Lists "Priority Areas": each field where the student's actual value is below that role's
  required value, with actual, required, and gap amount.
- If there are no gaps (student meets or exceeds every requirement for the best-match role),
  shows a positive/empty state instead of an empty list.

## About (`/about`)

- Explains the product in plain terms, includes the "Discover, Align, Grow" motif again.
- A 6-step "How It Works" ordered list: Student Profile, Data Preprocessing, K-Means
  Clustering, Skill Category Classification, Career Alignment, Skill Gap Analysis.
- A card explicitly explaining that skill categorization (ML) and career alignment
  (rule-based) are two separate systems, and why.
- A card on extensibility (the career-path taxonomy is designed to grow).
- A closing methodology-note disclaimer paragraph, consistent with the one on Analysis.

## Cross-Cutting Requirements (as implemented)

- **No fabricated results**: every number shown after a profile is submitted comes from a
  backend response; the only static example numbers in the app are the explicitly-labeled
  illustrative preview cards on Home (per `frontend/README.md`).
- **Persistence**: profile and results persist across a reload via `localStorage`, scoped to
  a single browser (no account system, no server-side storage of student data — see
  [CURRENT_STATE.md](CURRENT_STATE.md)).
- **Responsive layout**: pages are built to adapt at multiple breakpoints (see
  [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)).
- **Accessibility**: form controls have proper label association, focus-visible states, and
  `prefers-reduced-motion` is respected for decorative animation (see
  [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)).

## Not Documented / Requires Confirmation

- Formal, business-authored product requirements, user research, or success metrics do not
  exist in the repository — this document reflects only what the implemented pages do.
- No authentication, multi-user, or admin-facing requirements are implemented or specified.
- No deployment/hosting requirements are documented (see [CURRENT_STATE.md](CURRENT_STATE.md)).
