// Single source of truth for mock-vs-real data switching.
// Flip NEXT_PUBLIC_USE_MOCKS=false + set NEXT_PUBLIC_API_BASE_URL to hit the
// real Express backend. Component code NEVER imports lib/mock-data directly —
// it always goes through lib/api/* (which calls these helpers).

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

// Simulate network latency so loading states / skeletons are exercised.
const MOCK_LATENCY = 400

function delay<T>(value: T, ms = MOCK_LATENCY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export async function apiGet<T>(
  path: string,
  mock: () => T | Promise<T>
): Promise<T> {
  if (USE_MOCKS) return delay(await mock())
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
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
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: body instanceof FormData ? body : JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API ${res.status} on ${method} ${path}`)
  return res.json()
}

export { USE_MOCKS }
