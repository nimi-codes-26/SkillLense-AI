// Centralized API communication with the SkillLens AI FastAPI backend.
// No component should call fetch() directly - everything goes through here.

const BASE_URL = "http://127.0.0.1:8000";

async function request(path, options) {
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    // fetch() throws when the server can't be reached at all (offline, wrong port, CORS, etc.)
    throw new Error(
      "Unable to connect to the SkillLens AI backend. Make sure the API server is running."
    );
  }

  if (!response.ok) {
    let message = "Something went wrong while talking to the SkillLens AI backend.";
    try {
      const body = await response.json();
      if (typeof body.detail === "string") {
        message = body.detail;
      } else if (Array.isArray(body.detail) && body.detail[0]?.msg) {
        message = body.detail[0].msg;
      }
    } catch {
      // response wasn't JSON - fall back to the generic message above
    }
    throw new Error(message);
  }

  return response.json();
}

export function predictSkillCategory(profile) {
  return request("/predict-skill-category", {
    method: "POST",
    body: JSON.stringify(profile),
  });
}

export function getCareerAlignment(profile) {
  return request("/career-alignment", {
    method: "POST",
    body: JSON.stringify(profile),
  });
}

export function getCareerRoles() {
  return request("/career-roles");
}

export function getModelInfo() {
  return request("/model-info");
}
