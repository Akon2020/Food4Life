import { getTranslations } from "next-intl/server"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { TeamList } from "@/components/admin/team-list"

export default async function AdminTeamPage() {
  const t = await getTranslations("admin")
  const tui = await getTranslations("adminUI")

  return (
    <div className="grid gap-6">
      <AdminPageHeader title={t("team")} />
      <p className="-mt-4 text-sm text-ink-muted">{tui("teamSubtitle")}</p>
      <TeamList />
    </div>
  )
}
