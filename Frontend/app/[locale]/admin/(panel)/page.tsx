import { getTranslations } from "next-intl/server"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { DashboardOverview } from "@/components/admin/dashboard-overview"

export default async function AdminDashboardPage() {
  const t = await getTranslations("admin")
  const tui = await getTranslations("adminUI")

  return (
    <div className="grid gap-8">
      <AdminPageHeader title={t("dashboard")} />
      <p className="-mt-4 text-sm text-ink-muted">{tui("dashboardSubtitle")}</p>
      <DashboardOverview />
    </div>
  )
}
