const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";

function normalizeError(detail) {
  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail.map((item) => item?.msg || "Validation error").join(" | ");
  }

  return "Employer agent request failed.";
}

export async function sendEmployerAgentMessage(payload) {
  const response = await fetch(`${apiBaseUrl}/employer/agent/chat`, {
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
