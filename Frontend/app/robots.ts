import type { MetadataRoute } from "next"

const base =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://foodforlifedrc.org"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/*/admin"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
