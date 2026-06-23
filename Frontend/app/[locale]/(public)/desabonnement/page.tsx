import type { Metadata } from "next"

import { PageHero } from "@/components/site/page-hero"
import { UnsubscribeForm } from "@/components/forms/unsubscribe-form"

export const metadata: Metadata = {
  title: "Désabonnement",
  robots: { index: false, follow: false },
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams
  return (
    <>
      <PageHero
        title="Désabonnement"
        subtitle="Gérez vos préférences de newsletter."
      />
      <section className="bg-background py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <UnsubscribeForm initialEmail={email ?? ""} />
        </div>
      </section>
    </>
  )
}
