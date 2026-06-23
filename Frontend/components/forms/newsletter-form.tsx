"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { ArrowRight } from "lucide-react"

import { subscribeNewsletter } from "@/lib/api/forms"
import type { Locale } from "@/lib/types"
import { cn } from "@/lib/utils"

export function NewsletterForm({
  variant = "footer",
}: {
  variant?: "footer" | "light"
}) {
  const t = useTranslations("footer")
  const locale = useLocale() as Locale
  const [email, setEmail] = useState("")

  const mutation = useMutation({
    mutationFn: () => subscribeNewsletter({ email, locale }),
    onSuccess: () => {
      toast.success(
        locale === "en"
          ? "Almost there! Check your inbox to confirm."
          : "Presque ! Vérifiez votre boîte mail pour confirmer."
      )
      setEmail("")
    },
    onError: () => {
      toast.error(
        locale === "en" ? "Something went wrong." : "Une erreur est survenue."
      )
    },
  })

  const onLight = variant === "light"

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!email) return
        mutation.mutate()
      }}
      className="flex w-full max-w-md items-center gap-2"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("emailPlaceholder")}
        aria-label={t("emailPlaceholder")}
        className={cn(
          "h-12 flex-1 rounded-xl px-4 text-sm outline-none transition-colors",
          onLight
            ? "border border-cream-200 bg-paper text-ink placeholder:text-ink-muted focus:border-green-500 focus:ring-2 focus:ring-green-100"
            : "border border-white/15 bg-white/10 text-white placeholder:text-white/60 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30"
        )}
      />
      <button
        type="submit"
        disabled={mutation.isPending}
        className="inline-flex h-12 items-center gap-1.5 rounded-xl bg-gold-500 px-5 text-sm font-semibold text-ink transition-colors hover:bg-gold-600 disabled:opacity-60"
      >
        {t("subscribe")}
        <ArrowRight className="size-4" />
      </button>
    </form>
  )
}
