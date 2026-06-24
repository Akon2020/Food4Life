"use client"

/**
 * Authentication for the admin area.
 *
 * Two modes, switched by NEXT_PUBLIC_USE_MOCKS:
 *  - mock  (default): accept any credentials, set a non-httpOnly session cookie
 *    that the proxy/middleware checks to gate `/admin/*`.
 *  - real  (USE_MOCKS=false): call the Express backend. The backend sets an
 *    httpOnly `ffl_admin_session` cookie (read server-side by the Next proxy).
 *    A lightweight copy of the user is cached in localStorage for display.
 */

export const AUTH_COOKIE = "ffl_admin_session"
const ADMIN_USER_KEY = "ffl_admin_user"

const USE_MOCKS =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_USE_MOCKS === "true"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

export type AdminUser = {
  name: string
  email: string
  role?: string
}

function setCookie(name: string, value: string, days = 7) {
  const maxAge = days * 24 * 60 * 60
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
}

function cacheUser(user: AdminUser) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user))
  }
}

export async function login(email: string, password: string): Promise<AdminUser> {
  if (USE_MOCKS) {
    // Mock: accept any credentials, derive a friendly name from the email.
    await new Promise((r) => setTimeout(r, 600))
    const name = email.split("@")[0].replace(/[._-]/g, " ") || "Admin"
    const user: AdminUser = { name, email }
    setCookie(AUTH_COOKIE, "mock-session-token")
    cacheUser(user)
    return user
  }

  // Real backend: sets the httpOnly session cookie via Set-Cookie.
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    let message = "Email ou mot de passe incorrect"
    try {
      const data = await res.json()
      if (data?.message) message = data.message
    } catch {
      /* ignore */
    }
    throw new Error(message)
  }

  const data = await res.json()
  const info = data.user ?? data.data?.userInfo ?? {}
  const user: AdminUser = {
    name: info.nomComplet ?? email.split("@")[0],
    email: info.email ?? email,
    role: info.role,
  }
  cacheUser(user)
  // Cookie-marqueur sur le domaine du FRONTEND : c'est lui que le proxy Next lit
  // pour ouvrir /admin/*. Le vrai JWT reste httpOnly sur le domaine de l'API
  // (envoyé sur les requêtes via credentials:"include"). Indispensable quand le
  // front et l'API sont sur des domaines différents (le cookie httpOnly de l'API
  // n'est jamais visible côté front).
  setCookie(AUTH_COOKIE, "1")
  return user
}

export async function logout() {
  if (!USE_MOCKS) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
    } catch {
      /* ignore network errors on logout */
    }
  }
  // Toujours retirer le cookie-marqueur côté frontend (mock comme réel).
  deleteCookie(AUTH_COOKIE)
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ADMIN_USER_KEY)
  }
}

export function setStoredUser(user: AdminUser) {
  cacheUser(user)
}

export function getCurrentUser(): AdminUser | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(ADMIN_USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AdminUser
  } catch {
    return null
  }
}
