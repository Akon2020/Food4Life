import { getTranslations } from "next-intl/server"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ArticleEditor } from "@/components/admin/article-editor"

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id } = await params
  const t = await getTranslations("adminUI")
  return (
    <div className="grid gap-6">
      <AdminPageHeader title={t("editTitle")} />
      <ArticleEditor articleId={id} />
    </div>
  )
}
