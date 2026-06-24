import { getTranslations } from "next-intl/server"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ArticleEditor } from "@/components/admin/article-editor"

export default async function NewArticlePage() {
  const t = await getTranslations("adminUI")
  return (
    <div className="grid gap-6">
      <AdminPageHeader title={t("createTitle")} />
      <ArticleEditor />
    </div>
  )
}
