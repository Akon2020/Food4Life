import type { Testimonial } from "@/lib/types"

export const mockTestimonials: Testimonial[] = [
  {
    id: "test-1",
    authorName: "Marie Nsimire",
    authorRoleFr: "Mère de famille, Bukavu",
    authorRoleEn: "Mother, Bukavu",
    quoteFr:
      "Depuis que mon fils consomme SUPER ENERGY FARINA, il a repris des forces et grandit bien. C'est un soulagement pour toute la famille.",
    quoteEn:
      "Since my son started eating SUPER ENERGY FARINA, he has regained strength and is growing well. It is a relief for the whole family.",
    photoUrl: "/images/testimonial-1.png",
    order: 1,
  },
  {
    id: "test-2",
    authorName: "Patrick Mugisho",
    authorRoleFr: "Agriculteur partenaire, Kabare",
    authorRoleEn: "Partner farmer, Kabare",
    quoteFr:
      "Food For Life achète nos récoltes à un prix juste. Mon revenu a augmenté et je peux scolariser mes enfants.",
    quoteEn:
      "Food For Life buys our harvests at a fair price. My income has grown and I can send my children to school.",
    photoUrl: "/images/testimonial-2.png",
    order: 2,
  },
  {
    id: "test-3",
    authorName: "Dr. Chantal Bahati",
    authorRoleFr: "Pédiatre, centre de santé de Goma",
    authorRoleEn: "Pediatrician, Goma health centre",
    quoteFr:
      "Nous observons une nette amélioration de l'état nutritionnel des enfants que nous suivons grâce à ces farines enrichies.",
    quoteEn:
      "We see a clear improvement in the nutritional status of the children we monitor thanks to these enriched flours.",
    photoUrl: "/images/testimonial-3.png",
    order: 3,
  },
]
