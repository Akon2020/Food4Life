import { cn } from "@/lib/utils"
import { Reveal } from "@/components/motion/reveal"

type Props = {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
  tone?: "default" | "inverted"
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  tone = "default",
}: Props) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
            tone === "inverted"
              ? "bg-primary-foreground/10 text-primary-foreground"
              : "bg-secondary text-primary"
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          "font-heading text-3xl font-bold text-balance md:text-4xl",
          tone === "inverted" ? "text-primary-foreground" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-pretty leading-relaxed",
            tone === "inverted" ? "text-primary-foreground/80" : "text-muted-foreground",
            align === "center" ? "mx-auto" : ""
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  )
}
