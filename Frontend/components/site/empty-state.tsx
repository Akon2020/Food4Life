import type { LucideIcon } from "lucide-react"
import { Inbox } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * État vide informatif et stylé, affiché quand une liste/section est vide.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  message,
  className,
}: {
  icon?: LucideIcon
  title?: string
  message: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center",
        className
      )}
    >
      <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">
        <Icon className="size-7" />
      </span>
      {title ? (
        <p className="font-heading text-lg font-semibold text-ink">{title}</p>
      ) : null}
      <p className="max-w-md text-sm leading-relaxed text-ink-muted">{message}</p>
    </div>
  )
}
