"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Loader2, ArrowLeft, Send } from "lucide-react"

import { createCampaign } from "@/lib/api/admin"
import { useRouter as useIntlRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { RichTextEditor } from "@/components/admin/rich-text-editor"

const inputCls =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"

export function CampaignComposer() {
  const t = useTranslations("adminUI")
  const router = useRouter()
  const intlRouter = useIntlRouter()
  const queryClient = useQueryClient()

  const [subject, setSubject] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const mutation = useMutation({
    mutationFn: () => createCampaign({ title, subject, content }),
    onSuccess: () => {
      toast.success(t("campaignSent"))
      queryClient.invalidateQueries({ queryKey: ["admin", "campaigns"] })
      intlRouter.push("/admin/campagnes")
    },
    onError: () => toast.error(t("saveError")),
  })

  const canSend = subject.trim() && content.trim()

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

      <section className="grid gap-4 rounded-xl border border-border bg-card p-5">
        <label className="grid gap-1.5">
          <span className="text-xs text-ink-muted">{t("subject")}</span>
          <input
            className={inputCls}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t("subject")}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs text-ink-muted">{t("internalTitle")}</span>
          <input
            className={inputCls}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("internalTitle")}
          />
        </label>
      </section>

      <section className="grid gap-2">
        <span className="text-sm font-semibold text-ink">{t("content")}</span>
        <RichTextEditor value={content} onChange={setContent} placeholder={t("content")} />
      </section>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={mutation.isPending || !canSend}>
          {mutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          {t("send")}
        </Button>
      </div>
    </form>
  )
}
