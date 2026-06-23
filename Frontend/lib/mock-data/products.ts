import type { Product } from "@/lib/types"

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    slug: "super-energy-farina",
    name: "SUPER ENERGY FARINA",
    taglineFr: "La farine infantile enrichie qui nourrit la croissance",
    taglineEn: "The enriched infant flour that fuels growth",
    descriptionFr:
      "SUPER ENERGY FARINA est une farine infantile enrichie, élaborée à partir de céréales et légumineuses locales soigneusement sélectionnées. Conçue pour combattre la malnutrition des jeunes enfants, elle apporte l'énergie et les nutriments essentiels au développement physique et cognitif.",
    descriptionEn:
      "SUPER ENERGY FARINA is an enriched infant flour made from carefully selected local cereals and legumes. Designed to fight malnutrition in young children, it delivers the energy and essential nutrients needed for physical and cognitive development.",
    ingredients: [
      "Maïs",
      "Soja",
      "Sorgho",
      "Arachide",
      "Vitamines & minéraux",
    ],
    benefitsFr: [
      "Riche en protéines et en énergie",
      "Enrichie en vitamines et minéraux",
      "100% ingrédients locaux",
      "Facile à préparer",
    ],
    benefitsEn: [
      "Rich in protein and energy",
      "Fortified with vitamins and minerals",
      "100% local ingredients",
      "Easy to prepare",
    ],
    targetAudienceFr: "Enfants de 6 mois à 5 ans",
    targetAudienceEn: "Children from 6 months to 5 years",
    imageUrl: "/images/product-super-energy.png",
    gallery: ["/images/product-super-energy.png"],
    availabilityFr: "Disponible en points de vente à Bukavu et Goma",
    availabilityEn: "Available at retail points in Bukavu and Goma",
    status: "available",
    order: 1,
    createdAt: "2023-09-01T00:00:00.000Z",
  },
  {
    id: "prod-2",
    slug: "petit-prince",
    name: "PETIT PRINCE",
    taglineFr: "Une nutrition premium pour les tout-petits",
    taglineEn: "Premium nutrition for little ones",
    descriptionFr:
      "PETIT PRINCE est notre prochaine farine infantile premium, formulée pour offrir un profil nutritionnel complet aux nourrissons. Bientôt disponible, elle prolongera notre mission d'une alimentation accessible et de qualité.",
    descriptionEn:
      "PETIT PRINCE is our upcoming premium infant flour, formulated to offer a complete nutritional profile for infants. Coming soon, it will extend our mission of accessible, high-quality nutrition.",
    ingredients: ["Riz", "Soja", "Mil", "Lait", "Vitamines & minéraux"],
    benefitsFr: [
      "Profil nutritionnel complet",
      "Digestion facile",
      "Goût adapté aux nourrissons",
    ],
    benefitsEn: [
      "Complete nutritional profile",
      "Easy digestion",
      "Taste tailored to infants",
    ],
    targetAudienceFr: "Nourrissons de 6 à 24 mois",
    targetAudienceEn: "Infants from 6 to 24 months",
    imageUrl: "/images/product-petit-prince.png",
    gallery: ["/images/product-petit-prince.png"],
    availabilityFr: "Bientôt disponible",
    availabilityEn: "Coming soon",
    status: "coming_soon",
    order: 2,
    createdAt: "2024-01-15T00:00:00.000Z",
  },
]
