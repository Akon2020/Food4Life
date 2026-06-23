"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Image from "next/image"
import { Loader2 } from "lucide-react"

import { login } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export default function AdminLoginPage() {
  const t = useTranslations("admin")
  const tc = useTranslations("common")
  const locale = useLocale()
  const router = useRouter()
  const params = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  const schema = z.object({
    email: z.string().email(t("emailInvalid")),
    password: z.string().min(1, t("passwordRequired")),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    setError(null)
    try {
      await login(values.email, values.password)
      const from = params.get("from")
      router.push(from && from.includes("/admin") ? from : `/${locale}/admin`)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : t("loginError"))
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-green-900 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-cream p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo-green.jpeg"
            alt="Food For Life"
            width={150}
            height={64}
            className="h-12 w-auto rounded-md"
          />
          <h1 className="mt-6 font-heading text-2xl font-bold text-ink">
            {t("loginTitle")}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">{t("loginSubtitle")}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 grid gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" placeholder="admin@foodforlife.cd" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error ? (
              <p className="text-sm font-medium text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("loggingIn")}
                </>
              ) : (
                t("login")
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-center text-xs text-green-800">
          {t("loginHint")}
        </p>

        <p className="mt-4 text-center text-xs text-ink-muted">
          <a href={`/${locale}`} className="underline-offset-2 hover:underline">
            {tc("backHome")}
          </a>
        </p>
      </div>
    </main>
  )
}
