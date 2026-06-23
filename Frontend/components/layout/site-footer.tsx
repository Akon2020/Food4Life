import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/icons/social-icons"
import { publicNav } from "@/lib/nav"
import { NewsletterForm } from "@/components/forms/newsletter-form"
import { BuiltByModal } from "@/components/site/built-by-modal"
import { mockSettings } from "@/lib/mock-data/settings"

export function SiteFooter() {
  const t = useTranslations("footer")
  const tn = useTranslations("nav")
  const year = new Date().getFullYear()
  const socials = mockSettings.socials

  return (
    <footer className="relative overflow-hidden bg-green-900 text-cream">
      {/* Leaf watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 opacity-[0.04]"
      >
        <Image
          src="/leaf-mark.jpeg"
          alt=""
          width={842}
          height={595}
          className="h-80 w-auto mix-blend-screen"
        />
      </div>

      <div className="relative mx-auto max-w-[var(--container-content)] px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand + newsletter */}
          <div>
            <Image
              src="/logo-white.png"
              alt="Food For Life"
              width={594}
              height={420}
              className="h-12 w-auto"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/75">
              {t("about")}
            </p>
            <div className="mt-6">
              <p className="font-heading text-lg font-semibold text-white">
                {t("newsletterTitle")}
              </p>
              <p className="mt-1 text-sm text-cream/70">{t("newsletterText")}</p>
              <div className="mt-4">
                <NewsletterForm variant="footer" />
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-gold-400">
              {t("explore")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {publicNav.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-cream/75 transition-colors hover:text-white"
                  >
                    {tn(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + legal */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-gold-400">
              {t("company")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/carrieres"
                  className="text-cream/75 transition-colors hover:text-white"
                >
                  {tn("careers")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact?tab=partner"
                  className="text-cream/75 transition-colors hover:text-white"
                >
                  {tn("becomePartner")}
                </Link>
              </li>
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-cream/75 transition-colors hover:text-white"
                >
                  {t("legalNotice")}
                </Link>
              </li>
              <li>
                <Link
                  href="/politique-confidentialite"
                  className="text-cream/75 transition-colors hover:text-white"
                >
                  {t("privacy")}
                </Link>
              </li>
            </ul>

            <h3 className="mt-8 font-heading text-sm font-semibold uppercase tracking-wider text-gold-400">
              {t("followUs")}
            </h3>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={socials.facebook}
                aria-label="Facebook"
                className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
              >
                <FacebookIcon className="size-4" />
              </a>
              <a
                href={socials.instagram}
                aria-label="Instagram"
                className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href={socials.linkedin}
                aria-label="LinkedIn"
                className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
              >
                <LinkedinIcon className="size-4" />
              </a>
              <a
                href={socials.youtube}
                aria-label="YouTube"
                className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
              >
                <YoutubeIcon className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-cream/60 sm:flex-row">
          <p>
            © {year} Food For Life. {t("rights")}
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <p>Bukavu · Goma — RDC</p>
            <BuiltByModal />
          </div>
        </div>
      </div>
    </footer>
  )
}
