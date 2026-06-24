import type { LucideIcon } from "lucide-react"

import { StatCard } from "@/components/admin/stat-card"

export interface ListStatItem {
  label: string
  value: number | string
  icon: LucideIcon
  accent?: "green" | "gold" | "blue" | "stone"
}

/** Rangée de cartes de stats affichée en tête d'une liste admin. */
export function ListStats({ items }: { items: ListStatItem[] }) {
  if (items.length === 0) return null
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((it) => (
        <StatCard
          key={it.label}
          label={it.label}
          value={it.value}
          icon={it.icon}
          accent={it.accent}
        />
      ))}
    </div>
  )
}
