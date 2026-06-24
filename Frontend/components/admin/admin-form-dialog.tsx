"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Upload } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { uploadImage } from "@/lib/api/upload"

export type FieldType =
  | "text"
  | "password"
  | "textarea"
  | "number"
  | "select"
  | "image"
  | "stringList"
  | "url"

export interface FieldDef {
  name: string
  label: string
  type: FieldType
  options?: { value: string; label: string }[]
  required?: boolean
  placeholder?: string
  full?: boolean // occupe toute la largeur (2 colonnes)
}

export type FormValues = Record<string, unknown>

function toInitial(fields: FieldDef[], initial?: FormValues | null): FormValues {
  const v: FormValues = {}
  for (const f of fields) {
    const raw = initial?.[f.name]
    if (f.type === "stringList") {
      v[f.name] = Array.isArray(raw) ? raw.join("\n") : (raw ?? "")
    } else {
      v[f.name] = raw ?? (f.type === "number" ? 0 : "")
    }
  }
  return v
}

function toPayload(fields: FieldDef[], values: FormValues): FormValues {
  const out: FormValues = {}
  for (const f of fields) {
    const val = values[f.name]
    if (f.type === "stringList") {
      out[f.name] = String(val ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    } else if (f.type === "number") {
      out[f.name] = Number(val) || 0
    } else {
      out[f.name] = val
    }
  }
  return out
}

const inputCls =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"

export function AdminFormDialog({
  open,
  onOpenChange,
  title,
  fields,
  initial,
  onSubmit,
  submitting = false,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  fields: FieldDef[]
  initial?: FormValues | null
  onSubmit: (values: FormValues) => void
  submitting?: boolean
}) {
  const t = useTranslations("adminUI")
  const [values, setValues] = useState<FormValues>(() => toInitial(fields, initial))
  const [uploadingField, setUploadingField] = useState<string | null>(null)

  // Réinitialise le formulaire à chaque ouverture / changement d'élément édité.
  useEffect(() => {
    if (open) setValues(toInitial(fields, initial))
  }, [open, initial, fields])

  const set = (name: string, value: unknown) =>
    setValues((cur) => ({ ...cur, [name]: value }))

  async function handleFile(name: string, file?: File | null) {
    if (!file) return
    setUploadingField(name)
    try {
      const { url } = await uploadImage(file)
      set(name, url)
    } finally {
      setUploadingField(null)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(toPayload(fields, values))
  }

  const canSubmit = useMemo(
    () =>
      fields
        .filter((f) => f.required)
        .every((f) => String(values[f.name] ?? "").trim().length > 0),
    [fields, values]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => {
              const value = values[f.name]
              const span = f.full || f.type === "textarea" || f.type === "stringList"
              return (
                <div
                  key={f.name}
                  className={span ? "sm:col-span-2" : undefined}
                >
                  <label className="mb-1.5 block text-xs font-medium text-ink-muted">
                    {f.label}
                    {f.required ? <span className="text-red-500"> *</span> : null}
                  </label>

                  {f.type === "textarea" || f.type === "stringList" ? (
                    <textarea
                      className={inputCls}
                      rows={f.type === "stringList" ? 4 : 5}
                      placeholder={
                        f.type === "stringList"
                          ? t("onePerLine")
                          : f.placeholder
                      }
                      value={String(value ?? "")}
                      onChange={(e) => set(f.name, e.target.value)}
                    />
                  ) : f.type === "select" ? (
                    <select
                      className={inputCls}
                      value={String(value ?? "")}
                      onChange={(e) => set(f.name, e.target.value)}
                    >
                      <option value="" disabled>
                        —
                      </option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "image" ? (
                    <div className="flex items-center gap-3">
                      {value ? (
                        <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                          <Image
                            src={String(value)}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </span>
                      ) : null}
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-ink transition-colors hover:bg-stone-50">
                        {uploadingField === f.name ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Upload className="size-4" />
                        )}
                        {t("chooseFile")}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFile(f.name, e.target.files?.[0])
                          }
                        />
                      </label>
                    </div>
                  ) : (
                    <input
                      type={
                        f.type === "number"
                          ? "number"
                          : f.type === "password"
                            ? "password"
                            : "text"
                      }
                      autoComplete={f.type === "password" ? "new-password" : undefined}
                      className={inputCls}
                      placeholder={f.placeholder}
                      value={
                        f.type === "number"
                          ? Number(value ?? 0)
                          : String(value ?? "")
                      }
                      onChange={(e) =>
                        set(
                          f.name,
                          f.type === "number"
                            ? Number(e.target.value)
                            : e.target.value
                        )
                      }
                    />
                  )}
                </div>
              )
            })}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={!canSubmit || submitting}>
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
