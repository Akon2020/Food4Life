import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import { Analytics } from "@vercel/analytics/next"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { Poppins, Inter } from "next/font/google"

import { routing } from "@/i18n/routing"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"

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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Food For Life — Nourrir aujourd'hui, bâtir demain",
    template: "%s · Food For Life",
  },
  description:
    "Entreprise sociale d'agro-transformation en RDC. Des farines infantiles enrichies, locales et abordables pour chaque famille.",
  icons: { icon: "/leaf-mark.jpeg" },
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#14422a",
  colorScheme: "light",
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  return (
    <html
      lang={locale}
      className={`${poppins.variable} ${inter.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
          <Toaster position="top-center" richColors />
        </NextIntlClientProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
