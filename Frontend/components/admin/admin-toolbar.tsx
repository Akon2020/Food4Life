"use client"

import { Search, Plus } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

export function AdminToolbar({
  search,
  onSearch,
  filters,
  showAdd = true,
  onAdd,
}: {
  search: string
  onSearch: (value: string) => void
  filters?: React.ReactNode
  showAdd?: boolean
  onAdd?: () => void
}) {
  const t = useTranslations("adminUI")

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t("search")}
          className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-ink outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
        />
      </div>

      <div className="flex items-center gap-2">
        {filters}
        {showAdd ? (
          <button
            type="button"
            onClick={onAdd}
            disabled={!onAdd}
            title={onAdd ? t("add") : t("comingSoonAction")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors",
              onAdd
                ? "bg-green-700 hover:bg-green-800"
                : "cursor-not-allowed bg-green-700/40 opacity-70"
            )}
          >
            <Plus className="size-4" />
            {t("add")}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export function FilterPills({
  options,
  active,
  onChange,
}: {
  options: { value: string; label: string }[]
  active: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            active === o.value
              ? "bg-green-700 text-white"
              : "bg-stone-100 text-ink-muted hover:bg-stone-200"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
