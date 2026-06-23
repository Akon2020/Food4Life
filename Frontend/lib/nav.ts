// Public navigation links. `key` maps to messages/*.json "nav" entries.
export const publicNav = [
  { key: "home", href: "/" },
  { key: "about", href: "/a-propos" },
  { key: "products", href: "/produits" },
  { key: "impact", href: "/impact" },
  { key: "news", href: "/actualites" },
  { key: "gallery", href: "/galerie" },
  { key: "partners", href: "/partenaires" },
  { key: "contact", href: "/contact" },
] as const

export const adminNav = [
  { key: "dashboard", href: "/admin", icon: "LayoutDashboard" },
  { key: "news", href: "/admin/actualites", icon: "Newspaper" },
  { key: "products", href: "/admin/produits", icon: "Package" },
  { key: "partners", href: "/admin/partenaires", icon: "Handshake" },
  { key: "team", href: "/admin/equipe", icon: "Users" },
  { key: "testimonials", href: "/admin/temoignages", icon: "Quote" },
  { key: "gallery", href: "/admin/galerie", icon: "Images" },
  { key: "messages", href: "/admin/messages", icon: "Mail" },
  { key: "newsletter", href: "/admin/newsletter", icon: "Send" },
  { key: "settings", href: "/admin/parametres", icon: "Settings" },
] as const
