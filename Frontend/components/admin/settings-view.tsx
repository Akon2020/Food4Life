"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { getSettings } from "@/lib/api/content"
import { updateSettings } from "@/lib/api/admin"
import type { SiteSetting } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { TableSkeleton } from "@/components/admin/table-skeleton"

const inputCls =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"

export function SettingsView() {
  const t = useTranslations("adminUI")
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  })

  const [draft, setDraft] = useState<SiteSetting | null>(null)
  useEffect(() => {
    if (data) setDraft(data)
  }, [data])

  const mutation = useMutation({
    mutationFn: (payload: SiteSetting) => updateSettings(payload),
    onSuccess: () => {
      toast.success(t("saved"))
      queryClient.invalidateQueries({ queryKey: ["settings"] })
    },
    onError: () => toast.error(t("saveError")),
  })

  if (isLoading || !draft) {
    return <TableSkeleton columns={2} rows={4} />
  }

  const setImpact = (k: keyof SiteSetting["impact"], v: number) =>
    setDraft({ ...draft, impact: { ...draft.impact, [k]: v } })
  const setContact = (k: keyof SiteSetting["contact"], v: string) =>
    setDraft({ ...draft, contact: { ...draft.contact, [k]: v } })
  const setSocial = (k: keyof SiteSetting["socials"], v: string) =>
    setDraft({ ...draft, socials: { ...draft.socials, [k]: v } })

  const impactFields: { key: keyof SiteSetting["impact"]; label: string }[] = [
    { key: "tonnesProduced", label: t("tonnes") },
    { key: "householdsServed", label: t("households") },
    { key: "farmersSupported", label: t("farmers") },
    { key: "jobsCreated", label: t("jobs") },
  ]
  const contactFields: { key: keyof SiteSetting["contact"]; label: string }[] = [
    { key: "address", label: t("address") },
    { key: "phone", label: t("phone") },
    { key: "email", label: t("email") },
    { key: "mapUrl", label: t("mapUrl") },
  ]
  const socialKeys = Object.keys(draft.socials) as (keyof SiteSetting["socials"])[]

  return (
    <form
      className="grid gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        mutation.mutate(draft)
      }}
    >
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold text-ink">
          {t("impactSection")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {impactFields.map((f) => (
            <label key={f.key} className="grid gap-1.5">
              <span className="text-xs text-ink-muted">{f.label}</span>
              <input
                type="number"
                className={inputCls}
                value={draft.impact[f.key]}
                onChange={(e) => setImpact(f.key, Number(e.target.value))}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold text-ink">
          {t("contactSection")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {contactFields.map((f) => (
            <label key={f.key} className="grid gap-1.5">
              <span className="text-xs text-ink-muted">{f.label}</span>
              <input
                type="text"
                className={inputCls}
                value={draft.contact[f.key]}
                onChange={(e) => setContact(f.key, e.target.value)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold text-ink">
          {t("socialsSection")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {socialKeys.map((k) => (
            <label key={k} className="grid gap-1.5">
              <span className="text-xs capitalize text-ink-muted">{k}</span>
              <input
                type="text"
                className={inputCls}
                value={draft.socials[k]}
                onChange={(e) => setSocial(k, e.target.value)}
              />
            </label>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {t("save")}
        </Button>
      </div>
    </form>
  )
}
