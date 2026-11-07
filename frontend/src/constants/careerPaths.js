// Career path taxonomy for the "Explore Career Paths" experience.
//
// `roleKey` must match a `role` value returned by GET /career-roles - that is
// what makes a path card "live" (clickable into a real, model-backed result).
// Paths with no `roleKey` are presented as "Coming next": visible, so the
// platform reads as extensible, but never wired to a fake prediction.
//
// Adding a new supported role later means: train it into the backend, add it
// to career_roles.py, then just set `roleKey` here - no UI restructuring.
export const CAREER_PATH_CATEGORIES = [
  {
    category: "Technology",
    paths: [
      { label: "Software Engineering", roleKey: "Software Developer" },
      { label: "Web Development", roleKey: "Web Developer" },
      { label: "Data & AI", roleKey: "ML Engineer" },
      { label: "Cybersecurity", roleKey: "Cybersecurity Analyst" },
      { label: "Cloud & DevOps", roleKey: null },
    ],
  },
  {
    category: "Data & Analytics",
    paths: [
      { label: "Data Analyst", roleKey: "Data Analyst" },
      { label: "Business Analytics", roleKey: null },
    ],
  },
  {
    category: "Product & Design",
    paths: [
      { label: "UI/UX", roleKey: null },
      { label: "Product Management", roleKey: null },
    ],
  },
];
