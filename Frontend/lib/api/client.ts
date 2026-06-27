// Single source of truth for mock-vs-real data switching.
// Les mocks sont OPT-IN et **jamais utilisés en production** : il faut à la fois
// NODE_ENV !== "production" ET NEXT_PUBLIC_USE_MOCKS === "true". En prod (build Next),
// USE_MOCKS vaut toujours false → seul le vrai backend est utilisé.
const USE_MOCKS =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_USE_MOCKS === "true"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

// Simulate network latency so loading states / skeletons are exercised.
const MOCK_LATENCY = 400

function delay<T>(value: T, ms = MOCK_LATENCY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

// En-tête Authorization: Bearer <jwt> si un jeton est stocké (auth admin fiable
// en cross-domaine, indépendamment du cookie). Lecture directe du localStorage
// pour éviter un cycle d'import avec lib/auth.
function authHeaders(base: Record<string, string>): Record<string, string> {
  if (typeof window === "undefined") return base
  const token = window.localStorage.getItem("ffl_admin_token")
  return token ? { ...base, Authorization: `Bearer ${token}` } : base
}

export async function apiGet<T>(
  path: string,
  mock: () => T | Promise<T>
): Promise<T> {
  if (USE_MOCKS) return delay(await mock())
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: authHeaders({ Accept: "application/json" }),
  })
  if (!res.ok) throw new Error(`API ${res.status} on GET ${path}`)
  return res.json()
}

export async function apiSend<T, B = unknown>(
  path: string,
  body: B,
  mock: (body: B) => T | Promise<T>,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST"
): Promise<T> {
  if (USE_MOCKS) return delay(await mock(body))
  const isForm = body instanceof FormData
  const headers = authHeaders(
    isForm ? { Accept: "application/json" } : { "Content-Type": "application/json", Accept: "application/json" }
  )
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers,
    body: isForm ? body : JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API ${res.status} on ${method} ${path}`)
  return res.json()
}

export { USE_MOCKS }
