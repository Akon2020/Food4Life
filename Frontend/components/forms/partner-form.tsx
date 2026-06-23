"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Send, Loader2, CheckCircle2 } from "lucide-react"

import { submitPartner } from "@/lib/api/forms"
import {
  FieldShell,
  TextField,
  TextAreaField,
  SelectField,
} from "@/components/forms/fields"

const TYPES = ["financier", "technique", "formation", "institutionnel"] as const

export function PartnerForm() {
  const t = useTranslations("contact")
  const tp = useTranslations("partners")

  const schema = z.object({
    name: z.string().min(2, t("required")),
    organization: z.string().min(2, t("required")),
    email: z.string().email(t("emailInvalid")),
    phone: z.string().min(6, t("required")),
    partnershipType: z.enum(TYPES, { message: t("required") }),
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
      organization: "",
      email: "",
      phone: "",
      partnershipType: undefined,
      message: "",
    },
  })

  const mutation = useMutation({
    mutationFn: (values: Values) => submitPartner(values),
    onSuccess: () => {
      toast.success(t("successPartner"))
      reset()
    },
    onError: () => toast.error(t("error")),
  })

  if (mutation.isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-10 text-center">
        <CheckCircle2 className="size-10 text-green-600" />
        <p className="font-heading text-lg font-semibold text-green-800">
          {t("successPartner")}
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
          htmlFor="partner-name"
          required
          error={errors.name?.message}
        >
          <TextField
            id="partner-name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </FieldShell>
        <FieldShell
          label={t("organization")}
          htmlFor="partner-org"
          required
          error={errors.organization?.message}
        >
          <TextField
            id="partner-org"
            aria-invalid={!!errors.organization}
            {...register("organization")}
          />
        </FieldShell>
        <FieldShell
          label={t("email")}
          htmlFor="partner-email"
          required
          error={errors.email?.message}
        >
          <TextField
            id="partner-email"
            type="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </FieldShell>
        <FieldShell
          label={t("phone")}
          htmlFor="partner-phone"
          required
          error={errors.phone?.message}
        >
          <TextField
            id="partner-phone"
            type="tel"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
        </FieldShell>
      </div>
      <FieldShell
        label={t("partnershipType")}
        htmlFor="partner-type"
        required
        error={errors.partnershipType?.message}
      >
        <SelectField
          id="partner-type"
          defaultValue=""
          aria-invalid={!!errors.partnershipType}
          {...register("partnershipType")}
        >
          <option value="" disabled>
            —
          </option>
          {TYPES.map((type) => (
            <option key={type} value={type}>
              {tp(type)}
            </option>
          ))}
        </SelectField>
      </FieldShell>
      <FieldShell
        label={t("message")}
        htmlFor="partner-message"
        required
        error={errors.message?.message}
      >
        <TextAreaField
          id="partner-message"
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
        {t("sendPartner")}
      </button>
    </form>
  )
}
