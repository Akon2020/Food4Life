import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { HeroSection } from "@/components/home/hero-section"
import { HomePartnersStrip } from "@/components/home/partners-strip"
import { ImpactSection } from "@/components/home/impact-section"
import { ServicesSection } from "@/components/home/services-section"
import { HomeProductsSection } from "@/components/home/products-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { GalleryTeaser } from "@/components/home/gallery-teaser"
import { NewsSection } from "@/components/home/news-section"
import { CtaSection } from "@/components/home/cta-section"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "home" })
  const tc = await getTranslations({ locale, namespace: "common" })
  return {
    // Home uses the site's default title; provide a rich description + OG.
    description: t("heroSubtitle"),
    openGraph: {
      title: `${tc("brand")} — ${tc("tagline")}`,
      description: t("heroSubtitle"),
      images: ["/images/hero-field.png"],
      type: "website",
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <HeroSection />
      <HomePartnersStrip />
      <ImpactSection />
      <ServicesSection />
      <HomeProductsSection />
      <TestimonialsSection />
      <GalleryTeaser />
      <NewsSection />
      <CtaSection />
    </>
  )
}
