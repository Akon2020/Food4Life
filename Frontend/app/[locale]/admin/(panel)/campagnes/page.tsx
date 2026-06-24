import { getTranslations } from "next-intl/server"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { CampaignsList } from "@/components/admin/campaigns-list"

export default async function AdminCampaignsPage() {
  const t = await getTranslations("admin")
  const tui = await getTranslations("adminUI")
  return (
    <div className="grid gap-6">
      <AdminPageHeader title={t("campaigns")} />
      <p className="-mt-4 text-sm text-ink-muted">{tui("campaignsSubtitle")}</p>
      <CampaignsList />
    </div>
  )
}
