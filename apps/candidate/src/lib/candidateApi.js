const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";

const fieldLabels = {
  auth_user_id: "Account",
  email: "Email",
  full_name: "Full name",
  phone: "Phone number",
  primary_role: "Primary role",
  location: "Location",
  expected_pay: "Expected pay",
  availability: "Availability",
  profile_summary: "Profile summary",
};

function prettifyMessage(message) {
  if (!message) {
    return "Request failed.";
  }

  return message
    .replace("String should have at least", "Must have at least")
    .replace("String should have at most", "Must have at most")
    .replace("Field required", "This field is required")
    .replace("Input should be a valid string", "Enter valid text")
    .replace("Input should be a valid boolean", "Choose a valid option");
}

function normalizeErrorDetail(detail) {
  if (!detail) {
    return "Request failed.";
  }

  if (typeof detail === "string") {
    return prettifyMessage(detail);
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item?.msg) {
          const fieldKey = Array.isArray(item.loc) ? item.loc.slice(1).join(".") : "";
          const field = fieldLabels[fieldKey] ?? fieldKey;
          const message = prettifyMessage(item.msg);
          return field ? `${field}: ${message}` : message;
        }

        return "Validation error.";
      })
      .join(" | ");
  }

  return "Request failed.";
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const text = await response.text();
    if (text.startsWith("<!doctype") || text.startsWith("<html")) {
      throw new Error("API returned HTML instead of JSON. Start the backend and check VITE_API_BASE_URL.");
    }
    throw new Error("API returned a non-JSON response.");
  }

  if (response.ok) {
    return response.json();
  }

  const payload = await response.json().catch(() => null);
  const message = normalizeErrorDetail(payload?.detail);
  throw new Error(message);
}

export async function getCandidateProfileByAuthUserId(authUserId) {
  const response = await fetch(`${apiBaseUrl}/candidate/profiles/by-auth/${authUserId}`);
  if (response.status === 404) {
    return null;
  }
  return parseResponse(response);
}

export async function createCandidateProfile(payload) {
  const response = await fetch(`${apiBaseUrl}/candidate/profiles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
}

export async function updateCandidateProfile(candidateId, payload) {
  const response = await fetch(`${apiBaseUrl}/candidate/profiles/${candidateId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
}

export async function updateCandidateAvailability(candidateId, payload) {
  const response = await fetch(`${apiBaseUrl}/candidate/profiles/${candidateId}/availability`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
}
