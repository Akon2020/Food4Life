"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Send, Loader2, CheckCircle2, Upload, FileText, X } from "lucide-react"

import { submitApplication } from "@/lib/api/forms"
import { FieldShell, TextField, TextAreaField } from "@/components/forms/fields"

export function ApplicationForm() {
  const t = useTranslations("contact")
  const [fileName, setFileName] = useState<string | null>(null)

  const schema = z.object({
    name: z.string().min(2, t("required")),
    email: z.string().email(t("emailInvalid")),
    phone: z.string().min(6, t("required")),
    position: z.string().min(2, t("required")),
    message: z.string().min(10, t("required")),
  })

  type Values = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      message: "",
    },
  })

  const mutation = useMutation({
    mutationFn: (values: Values) =>
      submitApplication({ ...values, cvFileName: fileName ?? undefined }),
    onSuccess: () => {
      toast.success(t("successApplication"))
      reset()
      setFileName(null)
    },
    onError: () => toast.error(t("error")),
  })

  if (mutation.isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-10 text-center">
        <CheckCircle2 className="size-10 text-green-600" />
        <p className="font-heading text-lg font-semibold text-green-800">
          {t("successApplication")}
        </p>
      </div>
    )
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="grid gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldShell
          label={t("name")}
          htmlFor="app-name"
          required
          error={errors.name?.message}
        >
          <TextField
            id="app-name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </FieldShell>
        <FieldShell
          label={t("position")}
          htmlFor="app-position"
          required
          error={errors.position?.message}
        >
          <TextField
            id="app-position"
            aria-invalid={!!errors.position}
            {...register("position")}
          />
        </FieldShell>
        <FieldShell
          label={t("email")}
          htmlFor="app-email"
          required
          error={errors.email?.message}
        >
          <TextField
            id="app-email"
            type="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </FieldShell>
        <FieldShell
          label={t("phone")}
          htmlFor="app-phone"
          required
          error={errors.phone?.message}
        >
          <TextField
            id="app-phone"
            type="tel"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
        </FieldShell>
      </div>

      <FieldShell label={t("cv")} htmlFor="app-cv" hint={t("cvHint")}>
        {fileName ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-cream-200 bg-paper px-4 py-3">
            <span className="flex items-center gap-2 text-sm text-ink">
              <FileText className="size-4 text-green-600" />
              {fileName}
            </span>
            <button
              type="button"
              onClick={() => setFileName(null)}
              className="text-ink-muted transition-colors hover:text-destructive"
              aria-label="Remove file"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="app-cv"
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-cream-200 bg-paper px-4 py-3 text-sm text-ink-muted transition-colors hover:border-green-500 hover:text-ink"
          >
            <Upload className="size-4" />
            {t("cvUpload")}
            <input
              id="app-cv"
              type="file"
              accept=".pdf,.doc,.docx"
              className="sr-only"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
          </label>
        )}
      </FieldShell>

      <FieldShell
        label={t("message")}
        htmlFor="app-message"
        required
        error={errors.message?.message}
      >
        <TextAreaField
          id="app-message"
          aria-invalid={!!errors.message}
          {...register("message")}
        />
      </FieldShell>
      <button
        type="submit"
        disabled={mutation.isPending}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-green-800 disabled:opacity-60 sm:w-auto"
      >
        {mutation.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        {t("sendApplication")}
      </button>
    </form>
  )
}
