const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export function getCurrentUser() {
  return sessionStorage.getItem("currentUser") || "";
}

async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    "X-Current-User": getCurrentUser(),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const fetchArticles = (page, pageSize = 6, search = "") =>
  apiFetch(
    `/articles?page=${page}&page_size=${pageSize}&search=${encodeURIComponent(
      search
    )}`
  );

export const fetchArticleById = (id) => apiFetch(`/articles/${id}`);

export const createArticle = (data) =>
  apiFetch(`/articles`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateArticle = (id, data) =>
  apiFetch(`/articles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteArticle = (id) =>
  apiFetch(`/articles/${id}`, {
    method: "DELETE",
  });

export const fetchTrending = (period = 7) =>
  apiFetch(`/trending/nyt?period=${period}&page=1&page_size=5`);

export const fetchHealth = () => apiFetch(`/health`);
