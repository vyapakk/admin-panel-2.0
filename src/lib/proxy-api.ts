import type { ProxyEntry } from "@/types/proxy";

// BACKEND INTEGRATION POINT: Set VITE_PROXY_API_URL to your proxy backend base URL
const API_BASE = import.meta.env.VITE_PROXY_API_URL || "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function getEntries(): Promise<ProxyEntry[]> {
  return request("/entries");
}

export async function createEntry(data: {
  name: string;
  csvUrl: string;
  allowedDomains: string[];
  useApiKey: boolean;
}): Promise<ProxyEntry> {
  return request("/entries", { method: "POST", body: JSON.stringify(data) });
}

export async function deleteEntry(id: string): Promise<void> {
  return request(`/entries/${id}`, { method: "DELETE" });
}

export async function updateEntry(
  id: string,
  data: Partial<{ name: string; csvUrl: string; allowedDomains: string[] }>
): Promise<ProxyEntry> {
  return request(`/entries/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}
