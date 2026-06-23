"use client"

import { useState, type ReactNode } from "react"
import Image from "next/image"
import { Menu } from "lucide-react"

import { AdminSidebar } from "@/components/admin/admin-sidebar"

export function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Overlay mobile */}
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm md:hidden"
        />
      ) : null}

      <main className="flex-1 overflow-x-hidden">
        {/* Barre supérieure mobile (hamburger) */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card px-4 py-3 md:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="inline-flex size-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-stone-100"
          >
            <Menu className="size-5" />
          </button>
          <Image
            src="/logo-green.jpeg"
            alt="Food For Life"
            width={120}
            height={40}
            className="h-7 w-auto"
          />
        </header>

        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-5 md:px-8 md:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
