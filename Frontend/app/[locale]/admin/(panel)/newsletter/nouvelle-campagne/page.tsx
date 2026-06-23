import { getTranslations } from "next-intl/server"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { CampaignComposer } from "@/components/admin/campaign-composer"

export default async function NewCampaignPage() {
  const t = await getTranslations("adminUI")
  return (
    <div className="grid gap-6">
      <AdminPageHeader title={t("newCampaign")} />
      <CampaignComposer />
    </div>
  )
}
