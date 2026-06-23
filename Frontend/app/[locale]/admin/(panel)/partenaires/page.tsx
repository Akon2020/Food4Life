import { getTranslations } from "next-intl/server"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { PartnersList } from "@/components/admin/partners-list"

export default async function AdminPartnersPage() {
  const t = await getTranslations("admin")
  const tui = await getTranslations("adminUI")

  return (
    <div className="grid gap-6">
      <AdminPageHeader title={t("partners")} />
      <p className="-mt-4 text-sm text-ink-muted">{tui("partnersSubtitle")}</p>
      <PartnersList />
    </div>
  )
}
