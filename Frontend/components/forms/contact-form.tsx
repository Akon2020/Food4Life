"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Send, Loader2, CheckCircle2 } from "lucide-react"

import { submitContact } from "@/lib/api/forms"
import { FieldShell, TextField, TextAreaField } from "@/components/forms/fields"

export function ContactForm() {
  const t = useTranslations("contact")

  const schema = z.object({
    name: z.string().min(2, t("required")),
    email: z.string().email(t("emailInvalid")),
    subject: z.string().min(2, t("required")),
    message: z.string().min(10, t("required")),
  })

  type Values = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  })

  const mutation = useMutation({
    mutationFn: (values: Values) => submitContact(values),
    onSuccess: () => toast.success(t("successContact")),
    onError: () => toast.error(t("error")),
  })

  if (mutation.isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-10 text-center">
        <CheckCircle2 className="size-10 text-green-600" />
        <p className="font-heading text-lg font-semibold text-green-800">
          {t("successContact")}
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
          htmlFor="contact-name"
          required
          error={errors.name?.message}
        >
          <TextField
            id="contact-name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </FieldShell>
        <FieldShell
          label={t("email")}
          htmlFor="contact-email"
          required
          error={errors.email?.message}
        >
          <TextField
            id="contact-email"
            type="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </FieldShell>
      </div>
      <FieldShell
        label={t("subject")}
        htmlFor="contact-subject"
        required
        error={errors.subject?.message}
      >
        <TextField
          id="contact-subject"
          aria-invalid={!!errors.subject}
          {...register("subject")}
        />
      </FieldShell>
      <FieldShell
        label={t("message")}
        htmlFor="contact-message"
        required
        error={errors.message?.message}
      >
        <TextAreaField
          id="contact-message"
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
        {t("send")}
      </button>
    </form>
  )
}
