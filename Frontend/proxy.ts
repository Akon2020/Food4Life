import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

const AUTH_COOKIE = "ffl_admin_session"

/**
 * Returns the locale-stripped pathname, e.g. /fr/admin/messages -> /admin/messages
 */
function stripLocale(pathname: string): string {
  const segments = pathname.split("/")
  if (routing.locales.includes(segments[1] as (typeof routing.locales)[number])) {
    return "/" + segments.slice(2).join("/")
  }
  return pathname
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const cleanPath = stripLocale(pathname)

  // Protect /admin/* (except the login page) — relies on a session cookie.
  // In mock mode the cookie is set by the fake auth provider on login.
  const isAdminArea = cleanPath.startsWith("/admin")
  const isLoginPage = cleanPath === "/admin/login"

  if (isAdminArea && !isLoginPage) {
    const hasSession = request.cookies.has(AUTH_COOKIE)
    if (!hasSession) {
      const segments = pathname.split("/")
      const locale = routing.locales.includes(
        segments[1] as (typeof routing.locales)[number]
      )
        ? segments[1]
        : routing.defaultLocale
      const loginUrl = new URL(`/${locale}/admin/login`, request.url)
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  // Match everything except API routes, Next internals and static files.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
