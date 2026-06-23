import { getTranslations } from "next-intl/server"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ArticlesList } from "@/components/admin/articles-list"

export default async function AdminArticlesPage() {
  const t = await getTranslations("admin")
  const tui = await getTranslations("adminUI")

  return (
    <div className="grid gap-6">
      <AdminPageHeader title={t("news")} />
      <p className="-mt-4 text-sm text-ink-muted">{tui("newsSubtitle")}</p>
      <ArticlesList />
    </div>
  )
}
