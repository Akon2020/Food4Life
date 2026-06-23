"use client"

import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

import { getSettings } from "@/lib/api/content"
import { Reveal } from "@/components/motion/reveal"

export function ContactInfo() {
  const t = useTranslations("contact")
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: getSettings })
  const contact = settings?.contact

  const items = [
    { icon: MapPin, label: t("address"), value: contact?.address },
    { icon: Phone, label: t("phone"), value: contact?.phone, href: `tel:${contact?.phone}` },
    { icon: Mail, label: t("email"), value: contact?.email, href: `mailto:${contact?.email}` },
    { icon: Clock, label: t("hours"), value: t("hoursValue") },
  ]

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Reveal>
            <h2 className="font-heading text-2xl font-bold text-foreground">{t("infoTitle")}</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <Reveal key={item.label}>
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-1 block font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1 font-medium text-foreground">{item.value}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="h-full min-h-80 overflow-hidden rounded-2xl border border-border shadow-sm">
            <iframe
              title={t("address")}
              src="https://www.openstreetmap.org/export/embed.html?bbox=28.84%2C-2.52%2C28.88%2C-2.48&layer=mapnik&marker=-2.5%2C28.86"
              className="h-full min-h-80 w-full"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
