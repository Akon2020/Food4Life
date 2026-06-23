import type { Partner } from "@/lib/types"

export const mockPartners: Partner[] = [
  {
    id: "ptr-1",
    name: "MasterCard Foundation",
    logoUrl: "/images/partner-mastercard.png",
    descriptionFr:
      "Soutien stratégique au développement de notre capacité de production.",
    descriptionEn: "Strategic support to grow our production capacity.",
    websiteUrl: "https://mastercardfdn.org",
    category: "financier",
    order: 1,
  },
  {
    id: "ptr-2",
    name: "Tony Elumelu Foundation",
    logoUrl: "/images/partner-tef.png",
    descriptionFr: "Accompagnement entrepreneurial et financement d'amorçage.",
    descriptionEn: "Entrepreneurial mentorship and seed funding.",
    websiteUrl: "https://tonyelumelufoundation.org",
    category: "financier",
    order: 2,
  },
  {
    id: "ptr-3",
    name: "IITA",
    logoUrl: "/images/partner-iita.png",
    descriptionFr:
      "Appui technique en agronomie et qualité nutritionnelle des produits.",
    descriptionEn:
      "Technical support in agronomy and nutritional product quality.",
    websiteUrl: "https://iita.org",
    category: "technique",
    order: 3,
  },
  {
    id: "ptr-4",
    name: "YALI",
    logoUrl: "/images/partner-yali.png",
    descriptionFr: "Réseau de leadership et formation des jeunes africains.",
    descriptionEn: "Leadership network and training for young Africans.",
    websiteUrl: "https://yali.state.gov",
    category: "formation",
    order: 4,
  },
  {
    id: "ptr-5",
    name: "FAST",
    logoUrl: "/images/partner-fast.png",
    descriptionFr: "Accélérateur de startups agroalimentaires.",
    descriptionEn: "Agri-food startup accelerator.",
    websiteUrl: "#",
    category: "institutionnel",
    order: 5,
  },
  {
    id: "ptr-6",
    name: "TBI",
    logoUrl: "/images/partner-tbi.png",
    descriptionFr: "Appui institutionnel et conseil stratégique.",
    descriptionEn: "Institutional support and strategic advisory.",
    websiteUrl: "#",
    category: "institutionnel",
    order: 6,
  },
]
