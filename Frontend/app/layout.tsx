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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Food For Life — Nourrir aujourd'hui, bâtir demain",
    template: "%s · Food For Life",
  },
  description:
    "Entreprise sociale d'agro-transformation en RDC. Des farines infantiles enrichies, locales et abordables pour chaque famille.",
  icons: { icon: "/leaf-mark.jpeg" },
  applicationName: "Food For Life",
  authors: [{ name: "Food For Life" }],
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
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
          <Toaster position="top-center" richColors />
        </NextIntlClientProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
