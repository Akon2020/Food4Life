import type { ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

const linkButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-green-700",
        accent: "bg-accent text-accent-foreground hover:bg-gold-600",
        outline:
          "border border-border bg-background text-foreground hover:bg-muted",
        ghostInverted:
          "border border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10",
        outlineInverted:
          "border border-primary-foreground/40 bg-primary-foreground text-primary hover:bg-primary-foreground/90",
      },
      size: {
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
)

type LinkButtonProps = ComponentProps<typeof Link> &
  VariantProps<typeof linkButtonVariants>

export function LinkButton({
  className,
  variant,
  size,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(linkButtonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { linkButtonVariants }
