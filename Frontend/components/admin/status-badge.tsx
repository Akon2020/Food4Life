import { cn } from "@/lib/utils"

type Tone = "green" | "amber" | "stone" | "blue" | "red"

// Maps any domain status string to a visual tone.
export function statusTone(status: string): Tone {
  switch (status) {
    case "published":
    case "confirmed":
    case "available":
      return "green"
    case "new":
      return "blue"
    case "draft":
    case "pending":
    case "coming_soon":
      return "amber"
    case "read":
    case "archived":
    default:
      return "stone"
  }
}

const tones: Record<Tone, string> = {
  green: "bg-green-100 text-green-800",
  amber: "bg-amber-100 text-amber-800",
  stone: "bg-stone-200 text-stone-700",
  blue: "bg-sky-100 text-sky-800",
  red: "bg-red-100 text-red-800",
}

export function StatusBadge({
  label,
  tone = "stone",
}: {
  label: string
  tone?: Tone
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone]
      )}
    >
      {label}
    </span>
  )
}
