import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const t = useTranslations("system")
  const tc = useTranslations("common")
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-sans text-7xl font-bold text-primary">404</p>
      <h1 className="font-sans text-2xl font-semibold text-foreground text-balance">{t("notFoundTitle")}</h1>
      <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">{t("notFoundText")}</p>
      <Button asChild>
        <Link href="/">{tc("backHome")}</Link>
      </Button>
    </main>
  )
}
