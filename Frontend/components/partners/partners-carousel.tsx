"use client"

import type { Partner } from "@/lib/types"

function PartnerTile({ partner }: { partner: Partner }) {
  return (
    <div className="flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-cream-200 bg-paper px-4 grayscale transition-all duration-300 hover:grayscale-0">
      <span className="text-center font-heading text-base font-bold leading-tight text-ink-muted transition-colors hover:text-green-700">
        {partner.name}
      </span>
    </div>
  )
}

export function PartnersCarousel({ partners }: { partners: Partner[] }) {
  const loop = [...partners, ...partners]

  return (
    <div className="marquee-paused relative overflow-hidden">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream to-transparent" />
      <div className="flex w-max animate-marquee gap-6">
        {loop.map((partner, i) => (
          <PartnerTile key={`${partner.id}-${i}`} partner={partner} />
        ))}
      </div>
    </div>
  )
}
