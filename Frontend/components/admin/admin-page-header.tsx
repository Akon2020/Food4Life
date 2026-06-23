import type { ReactNode } from "react"

type Crumb = { label: string }

export function AdminPageHeader({
  title,
  breadcrumbs,
  actions,
}: {
  title: string
  breadcrumbs?: Crumb[]
  actions?: ReactNode
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-1.5 flex items-center gap-1.5 text-xs text-ink-muted">
            {breadcrumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1.5">
                {i > 0 ? <span aria-hidden>/</span> : null}
                <span>{c.label}</span>
              </span>
            ))}
          </nav>
        ) : null}
        <h1 className="font-heading text-2xl font-bold text-ink">{title}</h1>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  )
}
