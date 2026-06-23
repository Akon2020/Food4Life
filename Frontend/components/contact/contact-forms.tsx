"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { AnimatePresence, motion } from "framer-motion"
import { MessageSquare, Handshake, Briefcase } from "lucide-react"

import { cn } from "@/lib/utils"
import { ContactForm } from "@/components/forms/contact-form"
import { PartnerForm } from "@/components/forms/partner-form"
import { ApplicationForm } from "@/components/forms/application-form"

type TabKey = "contact" | "partner" | "career"

export function ContactForms() {
  const t = useTranslations("contact")
  const searchParams = useSearchParams()
  const initial = searchParams.get("tab")
  const [tab, setTab] = useState<TabKey>(
    initial === "partner" || initial === "career" ? initial : "contact"
  )

  const tabs: { key: TabKey; label: string; icon: typeof MessageSquare }[] = [
    { key: "contact", label: t("tabContact"), icon: MessageSquare },
    { key: "partner", label: t("tabPartner"), icon: Handshake },
    { key: "career", label: t("tabCareer"), icon: Briefcase },
  ]

  return (
    <div className="rounded-3xl border border-cream-200 bg-paper p-2 shadow-sm">
      <div
        role="tablist"
        aria-label={t("title")}
        className="grid grid-cols-3 gap-1 rounded-2xl bg-cream-100 p-1"
      >
        {tabs.map(({ key, label, icon: Icon }) => {
          const active = tab === key
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(key)}
              className={cn(
                "relative flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "text-green-800" : "text-ink-muted hover:text-ink"
              )}
            >
              {active ? (
                <motion.span
                  layoutId="contact-tab"
                  className="absolute inset-0 rounded-xl bg-paper shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              ) : null}
              <Icon className="relative z-10 size-4" />
              <span className="relative z-10 hidden sm:inline">{label}</span>
            </button>
          )
        })}
      </div>

      <div className="p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "contact" && <ContactForm />}
            {tab === "partner" && <PartnerForm />}
            {tab === "career" && <ApplicationForm />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
