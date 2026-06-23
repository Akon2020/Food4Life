import { getTranslations } from "next-intl/server"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ProductsList } from "@/components/admin/products-list"

export default async function AdminProductsPage() {
  const t = await getTranslations("admin")
  const tui = await getTranslations("adminUI")

  return (
    <div className="grid gap-6">
      <AdminPageHeader title={t("products")} />
      <p className="-mt-4 text-sm text-ink-muted">{tui("productsSubtitle")}</p>
      <ProductsList />
    </div>
  )
}
