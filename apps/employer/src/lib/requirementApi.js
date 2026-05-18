const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";

function normalizeError(detail) {
  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (item?.msg) {
          const field = Array.isArray(item.loc) ? item.loc.slice(1).join(".") : "";
          return field ? `${field}: ${item.msg}` : item.msg;
        }
        return "Validation error";
      })
      .join(" | ");
  }

  return "Request failed";
}

export async function createRequirement(payload) {
  const response = await fetch(`${apiBaseUrl}/employer/requirements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(normalizeError(data?.detail));
  }

  return data;
}

export async function listRequirements(employerAuthUserId) {
  const response = await fetch(
    `${apiBaseUrl}/employer/requirements?employer_auth_user_id=${encodeURIComponent(employerAuthUserId)}`,
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(normalizeError(data?.detail));
  }

  return data;
}
