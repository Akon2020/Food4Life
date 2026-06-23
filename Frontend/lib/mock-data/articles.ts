import type { Article } from "@/lib/types"

export const mockArticles: Article[] = [
  {
    id: "art-1",
    slug: "1000-enfants-nourris-sud-kivu",
    titleFr: "1 000 enfants nourris au Sud-Kivu",
    titleEn: "1,000 children nourished in South Kivu",
    excerptFr:
      "Notre programme de distribution a atteint un nouveau cap avec plus de 1 000 enfants bénéficiant de SUPER ENERGY FARINA.",
    excerptEn:
      "Our distribution programme reached a new milestone with over 1,000 children receiving SUPER ENERGY FARINA.",
    bodyFr:
      "Depuis le lancement de notre programme, plus de 1 000 enfants de la région du Sud-Kivu bénéficient désormais d'un accès régulier à une alimentation enrichie. Ce résultat est le fruit d'un partenariat étroit avec les centres de santé locaux et les coopératives agricoles.\n\nLes équipes de terrain rapportent une amélioration notable des indicateurs nutritionnels chez les enfants suivis.",
    bodyEn:
      "Since the launch of our programme, more than 1,000 children in the South Kivu region now have regular access to enriched nutrition. This result stems from close partnership with local health centres and farming cooperatives.\n\nField teams report a notable improvement in nutritional indicators among the children being monitored.",
    coverImageUrl: "/images/news-children.png",
    category: "impact",
    status: "published",
    publishedAt: "2024-11-20T00:00:00.000Z",
    authorId: "user-1",
    createdAt: "2024-11-18T00:00:00.000Z",
    updatedAt: "2024-11-20T00:00:00.000Z",
  },
  {
    id: "art-2",
    slug: "partenariat-mastercard-foundation",
    titleFr: "Nouveau partenariat avec la MasterCard Foundation",
    titleEn: "New partnership with the MasterCard Foundation",
    excerptFr:
      "Un soutien stratégique qui accélère notre capacité de production et notre portée régionale.",
    excerptEn:
      "Strategic support that accelerates our production capacity and regional reach.",
    bodyFr:
      "Food For Life est fière d'annoncer un partenariat avec la MasterCard Foundation. Ce soutien permettra d'augmenter notre capacité de transformation et de toucher davantage de familles vulnérables.",
    bodyEn:
      "Food For Life is proud to announce a partnership with the MasterCard Foundation. This support will increase our processing capacity and reach more vulnerable families.",
    coverImageUrl: "/images/news-partnership.png",
    category: "presse",
    status: "published",
    publishedAt: "2024-10-05T00:00:00.000Z",
    authorId: "user-1",
    createdAt: "2024-10-01T00:00:00.000Z",
    updatedAt: "2024-10-05T00:00:00.000Z",
  },
  {
    id: "art-3",
    slug: "atelier-agriculteurs-goma",
    titleFr: "Atelier de formation des agriculteurs à Goma",
    titleEn: "Farmer training workshop in Goma",
    excerptFr:
      "Plus de 80 agriculteurs formés aux bonnes pratiques agricoles et à la qualité post-récolte.",
    excerptEn:
      "Over 80 farmers trained in good agricultural practices and post-harvest quality.",
    bodyFr:
      "Dans le cadre de notre engagement envers les communautés agricoles, nous avons organisé un atelier de formation à Goma. Les agriculteurs ont appris des techniques pour améliorer leurs rendements et la qualité de leurs récoltes.",
    bodyEn:
      "As part of our commitment to farming communities, we held a training workshop in Goma. Farmers learned techniques to improve their yields and harvest quality.",
    coverImageUrl: "/images/news-workshop.png",
    category: "evenement",
    status: "published",
    publishedAt: "2024-08-12T00:00:00.000Z",
    authorId: "user-1",
    createdAt: "2024-08-10T00:00:00.000Z",
    updatedAt: "2024-08-12T00:00:00.000Z",
  },
]
