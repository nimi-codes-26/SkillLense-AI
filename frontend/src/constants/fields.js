// Single source of truth for the 9 student features on the frontend.
// Ranges match backend/app/schemas.py exactly.

export const FIELD_GROUPS = [
  {
    title: "Academic",
    fields: [
      { key: "cgpa", label: "CGPA", min: 0, max: 10, step: 0.1 },
    ],
  },
  {
    title: "Technical",
    fields: [
      { key: "coding_skill", label: "Coding Skill", min: 0, max: 10, step: 0.1 },
      { key: "dsa_skill", label: "DSA Skill", min: 0, max: 10, step: 0.1 },
      { key: "math_aptitude", label: "Math Aptitude", min: 0, max: 10, step: 0.1 },
      { key: "security_knowledge", label: "Security Knowledge", min: 0, max: 10, step: 0.1 },
    ],
  },
  {
    title: "Professional",
    fields: [
      { key: "communication_skill", label: "Communication Skill", min: 0, max: 10, step: 0.1 },
      { key: "projects_count", label: "Projects", min: 0, max: 10, step: 1 },
      { key: "internships_count", label: "Internships", min: 0, max: 5, step: 1 },
      { key: "certifications_count", label: "Certifications", min: 0, max: 5, step: 1 },
    ],
  },
];

export const ALL_FIELDS = FIELD_GROUPS.flatMap((group) => group.fields);

export const DEFAULT_PROFILE = Object.fromEntries(
  ALL_FIELDS.map((field) => [field.key, Math.round((field.min + field.max) / 2)])
);

export const FEATURE_LABELS = Object.fromEntries(
  ALL_FIELDS.map((field) => [field.key, field.label])
);
