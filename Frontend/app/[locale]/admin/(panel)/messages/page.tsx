import { getTranslations } from "next-intl/server"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { MessagesList } from "@/components/admin/messages-list"

export default async function AdminMessagesPage() {
  const t = await getTranslations("admin")
  const tui = await getTranslations("adminUI")

  return (
    <div className="grid gap-6">
      <AdminPageHeader title={t("messages")} />
      <p className="-mt-4 text-sm text-ink-muted">{tui("messagesSubtitle")}</p>
      <MessagesList />
    </div>
  )
}
