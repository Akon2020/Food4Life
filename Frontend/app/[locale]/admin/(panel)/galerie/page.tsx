import { getTranslations } from "next-intl/server"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { GalleryList } from "@/components/admin/gallery-list"

export default async function AdminGalleryPage() {
  const t = await getTranslations("admin")
  const tui = await getTranslations("adminUI")

  return (
    <div className="grid gap-6">
      <AdminPageHeader title={t("gallery")} />
      <p className="-mt-4 text-sm text-ink-muted">{tui("gallerySubtitle")}</p>
      <GalleryList />
    </div>
  )
}
