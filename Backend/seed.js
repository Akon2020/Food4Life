// Seed de démonstration — peuple la base avec des données réalistes alignées
// sur le frontend (Frontend/lib/mock-data). Idempotent : ne réinsère pas si la
// table contient déjà des lignes. Lancement : `npm run seed`.
//
// Variante reset (vide tout d'abord) : DB_SYNC_FORCE=true npm run seed
import db from "./database/db.js";
import { DB_SYNC_FORCE } from "./config/env.js";
import {
  Product,
  Partner,
  TeamMember,
  Testimonial,
  GalleryItem,
  Article,
  SiteSetting,
  Abonne,
  Utilisateur,
} from "./models/index.model.js";
import { bootstrapAdmin } from "./utils/bootstrap.js";

async function seedIfEmpty(Model, rows, label) {
  const count = await Model.count();
  if (count > 0) {
    console.log(`• ${label}: déjà ${count} ligne(s), ignoré`);
    return;
  }
  await Model.bulkCreate(rows);
  console.log(`✓ ${label}: ${rows.length} ligne(s) insérée(s)`);
}

async function run() {
  const force = DB_SYNC_FORCE === "true";
  await db.sync({ force });
  if (force) await dropNote();
  await bootstrapAdmin();
  const admin = await Utilisateur.findOne({ where: { role: "admin" } });

  await seedIfEmpty(
    SiteSetting,
    [
      {
        impact: {
          tonnesProduced: 10,
          householdsServed: 800,
          farmersSupported: 250,
          jobsCreated: 35,
        },
        contact: {
          address: "Avenue du Lac, Bukavu, Sud-Kivu, RDC",
          phone: "+243 990 000 000",
          email: "contact@foodforlifedrc.org",
          mapUrl: "https://maps.google.com/?q=Bukavu+Sud-Kivu+RDC",
        },
        socials: {
          facebook: "https://facebook.com/foodforlife",
          instagram: "https://instagram.com/foodforlife",
          linkedin: "https://linkedin.com/company/foodforlife",
          x: "https://x.com/foodforlife",
          youtube: "https://youtube.com/@foodforlife",
        },
      },
    ],
    "SiteSetting",
  );

  await seedIfEmpty(
    Product,
    [
      {
        slug: "super-energy-farina",
        name: "SUPER ENERGY FARINA",
        taglineFr: "La farine infantile enrichie qui nourrit la croissance",
        taglineEn: "The enriched infant flour that fuels growth",
        descriptionFr:
          "Farine infantile enrichie à base de céréales et légumineuses locales, conçue pour combattre la malnutrition des jeunes enfants.",
        descriptionEn:
          "Enriched infant flour made from local cereals and legumes, designed to fight malnutrition in young children.",
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
        availabilityFr: "Disponible à Bukavu et Goma",
        availabilityEn: "Available in Bukavu and Goma",
        status: "available",
        order: 1,
      },
      {
        slug: "power-mix-cereales",
        name: "POWER MIX CÉRÉALES",
        taglineFr: "Le mélange énergétique pour toute la famille",
        taglineEn: "The energy blend for the whole family",
        descriptionFr:
          "Mélange de céréales complètes et légumineuses pour un petit-déjeuner nourrissant et équilibré.",
        descriptionEn:
          "A blend of whole grains and legumes for a nourishing, balanced breakfast.",
        ingredients: ["Blé", "Millet", "Soja", "Sucre de canne"],
        benefitsFr: ["Source de fibres", "Énergie durable", "Sans additifs"],
        benefitsEn: ["Source of fiber", "Sustained energy", "No additives"],
        targetAudienceFr: "Toute la famille",
        targetAudienceEn: "The whole family",
        imageUrl: "/images/product-petit-prince.png",
        gallery: ["/images/product-petit-prince.png"],
        availabilityFr: "Bientôt disponible",
        availabilityEn: "Coming soon",
        status: "coming_soon",
        order: 2,
      },
    ],
    "Product",
  );

  await seedIfEmpty(
    Partner,
    [
      {
        name: "UNICEF",
        logoUrl: "",
        descriptionFr: "Partenaire institutionnel pour la nutrition infantile.",
        descriptionEn: "Institutional partner for child nutrition.",
        websiteUrl: "https://www.unicef.org",
        category: "institutionnel",
        order: 1,
      },
      {
        name: "PAM",
        logoUrl: "",
        descriptionFr: "Appui logistique et financier aux programmes.",
        descriptionEn: "Logistical and financial support to programs.",
        websiteUrl: "https://www.wfp.org",
        category: "financier",
        order: 2,
      },
      {
        name: "Université de Bukavu",
        logoUrl: "",
        descriptionFr: "Partenaire technique et de formation.",
        descriptionEn: "Technical and training partner.",
        websiteUrl: "https://example.org",
        category: "formation",
        order: 3,
      },
    ],
    "Partner",
  );

  await seedIfEmpty(
    TeamMember,
    [
      {
        name: "Mirco Rubambura",
        roleFr: "Fondateur & Directeur",
        roleEn: "Founder & Director",
        bioFr: "Ingénieur agronome engagé contre la malnutrition au Sud-Kivu.",
        bioEn: "Agronomist committed to fighting malnutrition in South Kivu.",
        photoUrl: "/images/team-1.png",
        linkedinUrl: "https://linkedin.com/in/example",
        order: 1,
      },
      {
        name: "Esther Mwamini",
        roleFr: "Responsable Production",
        roleEn: "Head of Production",
        bioFr: "Pilote la chaîne de production des farines enrichies.",
        bioEn: "Leads the enriched flour production chain.",
        photoUrl: "/images/team-2.png",
        linkedinUrl: "https://linkedin.com/in/example",
        order: 2,
      },
    ],
    "TeamMember",
  );

  await seedIfEmpty(
    Testimonial,
    [
      {
        authorName: "Dr. Kabasele",
        authorRoleFr: "Pédiatre, Hôpital de Bukavu",
        authorRoleEn: "Pediatrician, Bukavu Hospital",
        quoteFr:
          "Les farines Food For Life ont nettement amélioré l'état nutritionnel de nos jeunes patients.",
        quoteEn:
          "Food For Life flours have clearly improved the nutritional status of our young patients.",
        photoUrl: "/images/testimonial-1.png",
        order: 1,
      },
      {
        authorName: "Mama Furaha",
        authorRoleFr: "Mère de famille",
        authorRoleEn: "Mother",
        quoteFr: "Mon enfant a repris des forces grâce à Super Energy Farina.",
        quoteEn: "My child regained strength thanks to Super Energy Farina.",
        photoUrl: "/images/testimonial-2.png",
        order: 2,
      },
    ],
    "Testimonial",
  );

  await seedIfEmpty(
    GalleryItem,
    [
      {
        titleFr: "Sur le terrain",
        titleEn: "On the field",
        imageUrl: "/images/gallery-field-1.png",
        category: "terrain",
        captionFr: "Distribution à Bukavu",
        captionEn: "Distribution in Bukavu",
        type: "image",
        order: 1,
      },
      {
        titleFr: "Atelier de production",
        titleEn: "Production workshop",
        imageUrl: "/images/gallery-production-1.png",
        category: "produits",
        captionFr: "Préparation des farines",
        captionEn: "Flour preparation",
        type: "image",
        order: 2,
      },
      {
        titleFr: "Notre équipe",
        titleEn: "Our team",
        imageUrl: "/images/gallery-team-1.png",
        category: "equipe",
        captionFr: "L'équipe Food For Life",
        captionEn: "The Food For Life team",
        type: "image",
        order: 3,
      },
    ],
    "GalleryItem",
  );

  await seedIfEmpty(
    Article,
    [
      {
        slug: "lancement-super-energy-farina",
        titleFr: "Lancement de Super Energy Farina",
        titleEn: "Launch of Super Energy Farina",
        excerptFr: "Notre farine infantile enrichie est désormais disponible.",
        excerptEn: "Our enriched infant flour is now available.",
        bodyFr:
          "Après des mois de recherche, Food For Life lance Super Energy Farina pour lutter contre la malnutrition au Sud-Kivu.",
        bodyEn:
          "After months of research, Food For Life launches Super Energy Farina to fight malnutrition in South Kivu.",
        coverImageUrl: "/images/news-children.png",
        category: "impact",
        status: "published",
        publishedAt: new Date("2026-01-15"),
        authorId: admin ? admin.idUtilisateur : null,
      },
      {
        slug: "partenariat-unicef",
        titleFr: "Nouveau partenariat avec l'UNICEF",
        titleEn: "New partnership with UNICEF",
        excerptFr: "Un partenariat pour étendre notre impact.",
        excerptEn: "A partnership to expand our impact.",
        bodyFr: "Food For Life et l'UNICEF unissent leurs forces.",
        bodyEn: "Food For Life and UNICEF join forces.",
        coverImageUrl: "/images/news-partnership.png",
        category: "presse",
        status: "published",
        publishedAt: new Date("2026-03-02"),
        authorId: admin ? admin.idUtilisateur : null,
      },
      {
        slug: "brouillon-evenement",
        titleFr: "Événement à venir (brouillon)",
        titleEn: "Upcoming event (draft)",
        excerptFr: "À paraître.",
        excerptEn: "To be published.",
        bodyFr: "Contenu en cours de rédaction.",
        bodyEn: "Content being written.",
        coverImageUrl: "/images/news-workshop.png",
        category: "evenement",
        status: "draft",
        publishedAt: null,
        authorId: admin ? admin.idUtilisateur : null,
      },
    ],
    "Article",
  );

  await seedIfEmpty(
    Abonne,
    [
      { email: "demo1@foodforlifedrc.org", locale: "fr", confirmed: true },
      { email: "demo2@foodforlifedrc.org", locale: "en", confirmed: true },
    ],
    "Abonne (newsletter)",
  );

  console.log("\nSeed terminé.");
  process.exit(0);
}

async function dropNote() {
  console.log("(mode reset : schéma recréé)");
}

run().catch((err) => {
  console.error("Erreur de seed:", err);
  process.exit(1);
});
