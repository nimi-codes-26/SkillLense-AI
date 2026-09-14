# SkillLens AI — Frontend

The React web application for SkillLens AI. It collects a student's 9 skill features, sends
them to the FastAPI backend, and displays the predicted skill category, career alignment
scores, and skill gap breakdown returned by the API.

## Stack

- React + Vite
- Plain CSS (custom properties for the design system in `src/index.css`) - no CSS framework
- `react-router-dom` for the 6 pages (Home, Profile, Analysis, Career Alignment, Skill Gap, About)

## Running locally

```bash
npm install
npm run dev
```

The app expects the FastAPI backend to be running at `http://127.0.0.1:8000` (see
`../backend/README` or the root project README for how to start it).

## Structure

```
src/
├── api/api.js              # all backend calls live here, nothing fetches directly
├── components/              # Sidebar, TopBar, cards, empty/loading/error states
├── constants/fields.js      # single source of truth for the 9 skill features
├── context/                 # shared profile + result state, persisted to localStorage
├── pages/                   # one file per route
├── App.jsx, main.jsx, index.css
```

## Notes

- No hardcoded prediction results: every number shown after a profile is submitted comes
  from the backend's `/predict-skill-category` and `/career-alignment` responses.
- The only static example numbers in the app are the "illustrative preview" cards on the
  Home page, which are explicitly labeled as examples, not real results.
