# Design System

Source of truth: `frontend/src/index.css`, `:root` block (lines 1–34 at time of writing).
All values below are copied verbatim from that file. **Do not treat any value in this
document as authoritative if it disagrees with `index.css`** — resolve any conflict in favor
of the CSS file and update this document.

## Locked Values

Two values are explicitly locked and must not be changed without a deliberate, discussed
decision (see [DECISIONS.md](DECISIONS.md)):

| Token | Value | Role |
|---|---|---|
| `--bg-main` | `#FDFCE8` | Main application background (set on `<body>`) |
| `--sidebar-bg` | `#341539` | Sidebar background |

## Full Color Token Table

```css
--bg-main: #FDFCE8;
--sidebar-bg: #341539;
--purple-primary: #CBB3F7;
--text-primary: #1F1F1F;
--text-secondary: #5B4B63;
--card-white: #FFFFFF;
--card-soft-purple: #F7F2FF;
--section-bg: #EFE9F7;
--career-readiness: #FDE8E6;
--best-match: #FEF3C7;
--profile-accent: #EDE9FE;
--improvement: #DCF4E6;
--success: #10B981;
--accent-rose: #F7C7C3;
--accent-gold: #FDE199;
--accent-violet: #DDD6FE;
--accent-mint: #BFEAD1;
--accent-terracotta: #D86A5A;
--purple-100: #E8DDFB;
--purple-200: #DCC8FA;
--purple-400: #B792F2;
--purple-500: #A179EB;
```

## Semantic Color Meaning

Color use in this application follows a consistent meaning, not just a visual palette.
When adding new UI, reuse the existing token for the matching meaning rather than
introducing a new color:

| Meaning | Color family | Tokens |
|---|---|---|
| Identity / profile / primary interaction | Purple | `--purple-primary`, `--accent-violet`, `--profile-accent`, `--purple-100`, `--purple-200`, `--purple-400`, `--purple-500` |
| Highlight / priority / best match | Yellow | `--accent-gold`, `--best-match` |
| Strength / success / growth | Green | `--accent-mint`, `--improvement`, `--success` |
| Attention / readiness / areas needing improvement | Pink | `--accent-rose`, `--career-readiness` |
| Warning / error / important gap | Red | `--accent-terracotta` |

Examples of this in the implemented UI: the Analysis page's readiness metric uses the
"rose" variant (pink = readiness/attention), its profile metric uses "violet" (purple =
identity), and the Career Alignment page marks the top-scoring role with the best-match
(yellow) treatment.

## Typography

```css
--font-heading: 'Playfair Display', Georgia, serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

- **Playfair Display** (serif) is used for headings throughout the application.
- **Inter** (sans-serif) is used for body text and UI controls.
- Not documented / requires confirmation: exact type scale (font-size steps) per heading
  level was not exhaustively enumerated in this pass — consult `index.css` directly for any
  specific selector's font-size before changing it.

## Layout Tokens

```css
--sidebar-width: 240px;
--radius: 14px;
--radius-sm: 10px;
--radius-btn: 11px;
--shadow-card: 0 1px 2px rgba(52, 21, 57, 0.06), 0 4px 16px rgba(52, 21, 57, 0.05);
--card-border: 1px solid rgba(52, 21, 57, 0.07);
```

The application shell is a fixed sidebar (`--sidebar-width`) plus a main content column
(`Sidebar` + `TopBar` + routed page content + `Footer` — see
[ARCHITECTURE.md](ARCHITECTURE.md)).

## CSS Organization

All styling lives in a single file, `frontend/src/index.css` (no CSS framework, no
CSS-in-JS, no per-component stylesheets). It is organized into clearly marked sections, in
this order: Ambient background system, Layout, Scroll reveal, Sidebar, Top bar, Buttons,
Cards & shared UI, Status states, Skill bar, Career card, Metric cards, Stat card, Profile
page, Forms, Home/hero, Skill gap page, Career path explorer, Analysis pipeline strip, Final
CTA panel, Discover/Align/Grow motif, Skill Intelligence Report (Analysis page), About page,
Footer.

When adding styles for a new component or page, add a new clearly labeled section rather
than scattering rules, and reuse existing tokens/utility classes before introducing new
ones.

## Animation

Named keyframes defined in `index.css`: `drift-lavender`, `drift-yellow`, `drift-mint`,
`drift-pink` (ambient background glow layers — see `AmbientBackground` in
[ARCHITECTURE.md](ARCHITECTURE.md)), `page-fade-in` (route transition), `spin` (loading
spinner), `sparkle-drift`, `float-y` (hero decorative elements).

**Every decorative animation must respect `prefers-reduced-motion`.** This is already
implemented for the ambient background glows, sparkle drift, hero float, scroll-reveal
(`Reveal` component), and page fade-in — preserve this when touching any of them.

## Responsive Breakpoints

Media query breakpoints present in `index.css`: `480px`, `720px`, `900px`, `960px`,
`1100px`. The application has been verified to render correctly at 375, 390, 430, 768, 900,
1024, 1280, and 1440px widths (see [QA_GUIDE.md](QA_GUIDE.md)).

## Accessibility Rules Already In Place

- Form controls (range sliders) use `label`/`htmlFor` association, `aria-describedby`, and
  `aria-valuetext`.
- Focus-visible rings use the purple accent color.
- `prefers-reduced-motion` disables/reduces all decorative motion (see Animation above).

## Component Visual Rules

- `MetricCard`, `StatCard`, `SkillBar`, and `CareerCard` all use the `useAnimatedPercent`
  hook (`frontend/src/hooks/useAnimatedPercent.js`) to animate their bar/percentage fill on
  mount rather than rendering it instantly — keep this consistent for any new metric-style
  component.
- `MetricCard` and similar cards accept a color "variant" (e.g. `rose`, `violet`) that maps
  to the semantic color table above — do not hardcode a hex value in a component when an
  existing variant/token expresses the same meaning.

## Not Documented / Requires Confirmation

- No standalone design tool source (Figma or similar) is present in the repository; the CSS
  file itself is the only design specification.
- Exact spacing scale (margin/padding steps) beyond the radius/shadow tokens above was not
  exhaustively cataloged — read the relevant `index.css` section directly when styling a new
  component.
