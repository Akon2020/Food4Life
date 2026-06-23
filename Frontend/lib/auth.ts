"use client"

/**
 * Mock authentication for the admin area.
 *
 * In mock mode we simply set a session cookie that the proxy/middleware checks
 * to gate `/admin/*`. When the real Express backend is wired in, replace
 * `login`/`logout` with calls to the auth endpoints (the cookie name and the
 * proxy guard stay the same).
 */

export const AUTH_COOKIE = "ffl_admin_session"
const ADMIN_USER_KEY = "ffl_admin_user"

export type AdminUser = {
  name: string
  email: string
}

function setCookie(name: string, value: string, days = 7) {
  const maxAge = days * 24 * 60 * 60
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
}

export async function login(email: string, _password: string): Promise<AdminUser> {
  // Mock: accept any credentials, derive a friendly name from the email.
  await new Promise((r) => setTimeout(r, 600))
  const name = email.split("@")[0].replace(/[._-]/g, " ") || "Admin"
  const user: AdminUser = { name, email }
  setCookie(AUTH_COOKIE, "mock-session-token")
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user))
  }
  return user
}

export function logout() {
  deleteCookie(AUTH_COOKIE)
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ADMIN_USER_KEY)
  }
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
