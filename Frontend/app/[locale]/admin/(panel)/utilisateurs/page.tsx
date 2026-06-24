import { getTranslations } from "next-intl/server"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { UsersList } from "@/components/admin/users-list"

export default async function AdminUsersPage() {
  const t = await getTranslations("admin")
  const tui = await getTranslations("adminUI")
  return (
    <div className="grid gap-6">
      <AdminPageHeader title={t("users")} />
      <p className="-mt-4 text-sm text-ink-muted">{tui("usersSubtitle")}</p>
      <UsersList />
    </div>
  )
}
