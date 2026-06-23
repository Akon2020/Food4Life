import type { ReactNode } from "react"
import "./globals.css"

// The real <html>/<body> live in app/[locale]/layout.tsx so the lang attribute
// can follow the active locale (next-intl pattern). This root layout is a
// required passthrough.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
