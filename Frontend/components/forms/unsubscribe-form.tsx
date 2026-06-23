"use client"

import { useState } from "react"
import { useLocale } from "next-intl"
import { useMutation } from "@tanstack/react-query"
import { CheckCircle2, Loader2, MailX } from "lucide-react"

import { unsubscribeNewsletter } from "@/lib/api/forms"
import type { Locale } from "@/lib/types"
import { Button } from "@/components/ui/button"

export function UnsubscribeForm({ initialEmail = "" }: { initialEmail?: string }) {
  const locale = useLocale() as Locale
  const fr = locale !== "en"
  const [email, setEmail] = useState(initialEmail)
  const [done, setDone] = useState(false)

  const mutation = useMutation({
    mutationFn: () => unsubscribeNewsletter(email),
    onSuccess: () => setDone(true),
  })

  if (done) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 size-12 text-green-600" />
        <h2 className="font-heading text-xl font-bold text-ink">
          {fr ? "Vous êtes désabonné(e)" : "You're unsubscribed"}
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          {fr
            ? "Vous ne recevrez plus nos newsletters. Vous nous manquerez !"
            : "You will no longer receive our newsletters. We'll miss you!"}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (email) mutation.mutate()
      }}
      className="mx-auto grid max-w-md gap-4 rounded-2xl border border-border bg-card p-8"
    >
      <MailX className="mx-auto size-12 text-ink-muted" />
      <p className="text-center text-sm text-ink-muted">
        {fr
          ? "Confirmez votre adresse pour vous désabonner de notre newsletter."
          : "Confirm your address to unsubscribe from our newsletter."}
      </p>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@exemple.com"
        className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-ink outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
      />
      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
        {fr ? "Me désabonner" : "Unsubscribe"}
      </Button>
    </form>
  )
}
