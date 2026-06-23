"use client"

import { useTranslations } from "next-intl"
import { RotateCcw } from "lucide-react"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations("system")

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-heading text-3xl font-bold text-ink">
        {t("errorTitle")}
      </h1>
      <p className="mt-3 max-w-md text-ink-muted">{t("errorText")}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
      >
        <RotateCcw className="size-4" />
        {t("retry")}
      </button>
    </div>
  )
}
