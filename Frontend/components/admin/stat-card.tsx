import type { LucideIcon } from "lucide-react"

import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  href?: string
  accent?: "green" | "gold" | "blue" | "stone"
}

const accents: Record<NonNullable<StatCardProps["accent"]>, string> = {
  green: "bg-green-50 text-green-700",
  gold: "bg-amber-50 text-amber-700",
  blue: "bg-sky-50 text-sky-700",
  stone: "bg-stone-100 text-stone-700",
}

export function StatCard({
  label,
  value,
  icon: Icon,
  href,
  accent = "green",
}: StatCardProps) {
  const inner = (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-shadow",
        href && "hover:shadow-md"
      )}
    >
      <span
        className={cn(
          "inline-flex size-12 shrink-0 items-center justify-center rounded-xl",
          accents[accent]
        )}
      >
        <Icon className="size-6" />
      </span>
      <div className="min-w-0">
        <p className="font-heading text-2xl font-bold text-ink">{value}</p>
        <p className="truncate text-sm text-ink-muted">{label}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    )
  }
  return inner
}
