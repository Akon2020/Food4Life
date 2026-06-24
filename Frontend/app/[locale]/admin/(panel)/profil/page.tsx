import { getTranslations } from "next-intl/server"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ProfileView } from "@/components/admin/profile-view"

export default async function AdminProfilePage() {
  const t = await getTranslations("admin")
  const tui = await getTranslations("adminUI")
  return (
    <div className="grid gap-6">
      <AdminPageHeader title={t("profile")} />
      <p className="-mt-4 text-sm text-ink-muted">{tui("profileSubtitle")}</p>
      <ProfileView />
    </div>
  )
}
