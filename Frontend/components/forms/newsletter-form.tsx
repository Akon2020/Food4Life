"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { ArrowRight, Loader2 } from "lucide-react"

import { subscribeNewsletter } from "@/lib/api/forms"
import type { Locale } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function NewsletterForm({
  variant = "footer",
}: {
  variant?: "footer" | "light"
}) {
  const t = useTranslations("footer")
  const locale = useLocale() as Locale
  const fr = locale !== "en"
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [open, setOpen] = useState(false)

  const mutation = useMutation({
    mutationFn: () => subscribeNewsletter({ email, name, locale }),
    onSuccess: () => {
      toast.success(
        fr
          ? "Inscription confirmée ! Un email de bienvenue vous a été envoyé."
          : "Subscribed! A welcome email is on its way."
      )
      setEmail("")
      setName("")
      setOpen(false)
    },
    onError: () => {
      toast.error(fr ? "Une erreur est survenue." : "Something went wrong.")
    },
  })

  const onLight = variant === "light"

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!email) return
          // Étape 2 : on demande le nom complet dans un modal avant l'envoi.
          setOpen(true)
        }}
        className="flex w-full max-w-md items-center gap-2"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          aria-label={t("emailPlaceholder")}
          className={cn(
            "h-12 flex-1 rounded-xl px-4 text-sm outline-none transition-colors",
            onLight
              ? "border border-cream-200 bg-paper text-ink placeholder:text-ink-muted focus:border-green-500 focus:ring-2 focus:ring-green-100"
              : "border border-white/15 bg-white/10 text-white placeholder:text-white/60 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30"
          )}
        />
        <button
          type="submit"
          className="inline-flex h-12 items-center gap-1.5 rounded-xl bg-gold-500 px-5 text-sm font-semibold text-ink transition-colors hover:bg-gold-600 disabled:opacity-60"
        >
          {t("subscribe")}
          <ArrowRight className="size-4" />
        </button>
      </form>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {fr ? "Finalisez votre inscription" : "Complete your subscription"}
            </DialogTitle>
            <DialogDescription>
              {fr
                ? "Indiquez votre nom complet pour recevoir notre newsletter."
                : "Enter your full name to receive our newsletter."}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              mutation.mutate()
            }}
            className="grid gap-4"
          >
            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-ink-muted">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full rounded-lg border border-border bg-stone-50 px-3 py-2 text-sm text-ink-muted"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-ink-muted">
                {fr ? "Nom complet" : "Full name"}
              </label>
              <input
                type="text"
                value={name}
                autoFocus
                required
                onChange={(e) => setName(e.target.value)}
                placeholder={fr ? "Votre nom" : "Your name"}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {fr ? "Annuler" : "Cancel"}
              </Button>
              <Button type="submit" disabled={mutation.isPending || !name.trim()}>
                {mutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                {fr ? "S'inscrire" : "Subscribe"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
