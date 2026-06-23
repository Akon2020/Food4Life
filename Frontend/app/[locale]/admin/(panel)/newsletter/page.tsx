import { getTranslations } from "next-intl/server"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { SubscribersList } from "@/components/admin/subscribers-list"

export default async function AdminNewsletterPage() {
  const t = await getTranslations("admin")
  const tui = await getTranslations("adminUI")

  return (
    <div className="grid gap-6">
      <AdminPageHeader title={t("newsletter")} />
      <p className="-mt-4 text-sm text-ink-muted">{tui("newsletterSubtitle")}</p>
      <SubscribersList />
    </div>
  )
}
