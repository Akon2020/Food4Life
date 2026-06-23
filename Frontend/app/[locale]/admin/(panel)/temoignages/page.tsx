import { getTranslations } from "next-intl/server"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { TestimonialsList } from "@/components/admin/testimonials-list"

export default async function AdminTestimonialsPage() {
  const t = await getTranslations("admin")
  const tui = await getTranslations("adminUI")

  return (
    <div className="grid gap-6">
      <AdminPageHeader title={t("testimonials")} />
      <p className="-mt-4 text-sm text-ink-muted">{tui("testimonialsSubtitle")}</p>
      <TestimonialsList />
    </div>
  )
}
