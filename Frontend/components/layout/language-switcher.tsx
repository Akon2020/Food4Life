"use client"

import { useLocale } from "next-intl"
import { useParams } from "next/navigation"
import { useTransition } from "react"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const [isPending, startTransition] = useTransition()

  function switchTo(next: string) {
    if (next === locale) return
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- pathname + params typing from next-intl
        { pathname, params },
        { locale: next }
      )
    })
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-cream-200 bg-paper p-0.5 text-sm font-semibold",
        className
      )}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          disabled={isPending}
          aria-current={l === locale}
          className={cn(
            "rounded-full px-2.5 py-1 uppercase transition-colors",
            l === locale
              ? "bg-green-500 text-white"
              : "text-ink-muted hover:text-ink"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
