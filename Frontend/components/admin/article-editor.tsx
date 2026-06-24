"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Loader2, Upload, ArrowLeft } from "lucide-react"

import {
  createArticle,
  updateArticle,
  getAdminArticle,
} from "@/lib/api/admin"
import { uploadImage } from "@/lib/api/upload"
import type { Article } from "@/lib/types"
import { useRouter as useIntlRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { RichTextEditor } from "@/components/admin/rich-text-editor"

const inputCls =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"

type FormState = {
  titleFr: string
  titleEn: string
  slug: string
  category: string
  status: string
  excerptFr: string
  excerptEn: string
  bodyFr: string
  bodyEn: string
  coverImageUrl: string
}

const empty: FormState = {
  titleFr: "",
  titleEn: "",
  slug: "",
  category: "impact",
  status: "draft",
  excerptFr: "",
  excerptEn: "",
  bodyFr: "",
  bodyEn: "",
  coverImageUrl: "",
}

export function ArticleEditor({ articleId }: { articleId?: string }) {
  const t = useTranslations("adminUI")
  const tc = useTranslations("blog")
  const router = useRouter()
  const intlRouter = useIntlRouter()
  const queryClient = useQueryClient()

  const [form, setForm] = useState<FormState>(empty)
  const [uploading, setUploading] = useState(false)

  const { data: article } = useQuery({
    queryKey: ["admin", "article", articleId],
    queryFn: () => getAdminArticle(articleId as string),
    enabled: !!articleId,
  })

  useEffect(() => {
    if (article) {
      setForm({
        titleFr: article.titleFr ?? "",
        titleEn: article.titleEn ?? "",
        slug: article.slug ?? "",
        category: article.category ?? "impact",
        status: article.status ?? "draft",
        excerptFr: article.excerptFr ?? "",
        excerptEn: article.excerptEn ?? "",
        bodyFr: article.bodyFr ?? "",
        bodyEn: article.bodyEn ?? "",
        coverImageUrl: article.coverImageUrl ?? "",
      })
    }
  }, [article])

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((cur) => ({ ...cur, [k]: v }))

  const mutation = useMutation({
    mutationFn: () =>
      articleId
        ? updateArticle(articleId, form as Partial<Article>)
        : createArticle(form as Partial<Article>),
    onSuccess: () => {
      toast.success(t("saved"))
      queryClient.invalidateQueries({ queryKey: ["admin", "articles"] })
      queryClient.invalidateQueries({ queryKey: ["articles"] })
      intlRouter.push("/admin/actualites")
    },
    onError: () => toast.error(t("saveError")),
  })

  async function onCover(file?: File | null) {
    if (!file) return
    setUploading(true)
    try {
      const { url } = await uploadImage(file)
      set("coverImageUrl", url)
    } finally {
      setUploading(false)
    }
  }

  const canSave = form.titleFr.trim() || form.titleEn.trim()

  return (
    <form
      className="grid gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        mutation.mutate()
      }}
    >
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex w-fit items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        {t("cancel")}
      </button>

      {/* Méta */}
      <section className="grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-xs text-ink-muted">{t("title")} (FR)</span>
          <input className={inputCls} value={form.titleFr} onChange={(e) => set("titleFr", e.target.value)} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs text-ink-muted">{t("title")} (EN)</span>
          <input className={inputCls} value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs text-ink-muted">{t("slug")}</span>
          <input className={inputCls} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto" />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1.5">
            <span className="text-xs text-ink-muted">{t("category")}</span>
            <select className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
              <option value="impact">{tc("impact")}</option>
              <option value="evenement">{tc("evenement")}</option>
              <option value="presse">{tc("presse")}</option>
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs text-ink-muted">{t("status")}</span>
            <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option value="draft">{t("draft")}</option>
              <option value="published">{t("published")}</option>
            </select>
          </label>
        </div>
        <label className="grid gap-1.5 sm:col-span-2">
          <span className="text-xs text-ink-muted">{t("excerpt")} (FR)</span>
          <textarea className={inputCls} rows={2} value={form.excerptFr} onChange={(e) => set("excerptFr", e.target.value)} />
        </label>
        <label className="grid gap-1.5 sm:col-span-2">
          <span className="text-xs text-ink-muted">{t("excerpt")} (EN)</span>
          <textarea className={inputCls} rows={2} value={form.excerptEn} onChange={(e) => set("excerptEn", e.target.value)} />
        </label>
        <div className="grid gap-1.5 sm:col-span-2">
          <span className="text-xs text-ink-muted">{t("cover")}</span>
          <div className="flex items-center gap-3">
            {form.coverImageUrl ? (
              <span className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                <Image src={form.coverImageUrl} alt="" fill sizes="112px" className="object-cover" />
              </span>
            ) : null}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-ink hover:bg-stone-50">
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              {t("chooseFile")}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onCover(e.target.files?.[0])} />
            </label>
          </div>
        </div>
      </section>

      {/* Contenu riche */}
      <section className="grid gap-2">
        <span className="text-sm font-semibold text-ink">{t("body")} (FR)</span>
        <RichTextEditor value={form.bodyFr} onChange={(html) => set("bodyFr", html)} placeholder={t("body")} />
      </section>
      <section className="grid gap-2">
        <span className="text-sm font-semibold text-ink">{t("body")} (EN)</span>
        <RichTextEditor value={form.bodyEn} onChange={(html) => set("bodyEn", html)} placeholder={t("body")} />
      </section>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={mutation.isPending || !canSave}>
          {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {t("save")}
        </Button>
      </div>
    </form>
  )
}
