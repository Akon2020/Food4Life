import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import { getLocale } from "next-intl/server"
import { NextIntlClientProvider } from "next-intl"
import { Analytics } from "@vercel/analytics/next"
import { Poppins, Inter } from "next/font/google"

import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://foodforlifedrc.org"

const description =
  "Entreprise sociale d'agro-transformation en RDC. Des farines infantiles enrichies, locales et abordables pour chaque famille."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Food For Life — Nourrir aujourd'hui, bâtir demain",
    template: "%s · Food For Life",
  },
  description,
  applicationName: "Food For Life",
  authors: [{ name: "Food For Life" }],
  keywords: [
    "Food For Life",
    "farine infantile",
    "malnutrition",
    "Sud-Kivu",
    "RDC",
    "agro-transformation",
    "nutrition",
    "Bukavu",
  ],
  icons: { icon: "/leaf-mark.jpeg" },
  alternates: {
    canonical: "/",
    languages: { fr: "/fr", en: "/en" },
  },
  openGraph: {
    type: "website",
    siteName: "Food For Life",
    title: "Food For Life — Nourrir aujourd'hui, bâtir demain",
    description,
    url: siteUrl,
    images: [{ url: "/images/hero.png", width: 1200, height: 630, alt: "Food For Life" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Food For Life",
    description,
    images: ["/images/hero.png"],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: "#14422a",
  colorScheme: "light",
}

// Layout RACINE : porte <html>/<body> (requis par Next 16). La langue suit la
// locale active via getLocale() (next-intl). Le segment [locale] valide la locale
// et appelle setRequestLocale.
export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      className={`${poppins.variable} ${inter.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          // Données structurées Organization (SEO)
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Food For Life",
              url: siteUrl,
              logo: `${siteUrl}/logo-green.jpeg`,
              description,
              areaServed: "CD",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bukavu",
                addressRegion: "Sud-Kivu",
                addressCountry: "CD",
              },
            }),
          }}
        />
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
          <Toaster position="top-center" richColors />
        </NextIntlClientProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
