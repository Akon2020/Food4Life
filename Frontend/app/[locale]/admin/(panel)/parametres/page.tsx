import { getTranslations } from "next-intl/server"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { SettingsView } from "@/components/admin/settings-view"

export default async function AdminSettingsPage() {
  const t = await getTranslations("admin")
  const tui = await getTranslations("adminUI")

  return (
    <div className="grid gap-6">
      <AdminPageHeader title={t("settings")} />
      <p className="-mt-4 text-sm text-ink-muted">{tui("settingsSubtitle")}</p>
      <SettingsView />
    </div>
  )
}
