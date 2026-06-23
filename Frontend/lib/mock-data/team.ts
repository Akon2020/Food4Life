import type { TeamMember } from "@/lib/types"

export const mockTeam: TeamMember[] = [
  {
    id: "team-1",
    name: "Esther Mwangaza",
    roleFr: "Fondatrice & Directrice générale",
    roleEn: "Founder & CEO",
    bioFr:
      "Ingénieure agronome passionnée par la nutrition infantile, Esther a fondé Food For Life pour répondre à l'insécurité alimentaire dans l'Est de la RDC.",
    bioEn:
      "An agronomist passionate about child nutrition, Esther founded Food For Life to tackle food insecurity in eastern DRC.",
    photoUrl: "/images/team-1.png",
    linkedinUrl: "#",
    order: 1,
  },
  {
    id: "team-2",
    name: "Jean-Paul Bisimwa",
    roleFr: "Responsable production",
    roleEn: "Head of Production",
    bioFr:
      "Expert en transformation agroalimentaire, il supervise la qualité et la sécurité de nos farines enrichies.",
    bioEn:
      "An expert in agri-food processing, he oversees the quality and safety of our enriched flours.",
    photoUrl: "/images/team-2.png",
    linkedinUrl: "#",
    order: 2,
  },
  {
    id: "team-3",
    name: "Aline Furaha",
    roleFr: "Coordinatrice terrain",
    roleEn: "Field Coordinator",
    bioFr:
      "Aline anime le réseau d'agriculteurs partenaires et coordonne les distributions communautaires.",
    bioEn:
      "Aline leads the network of partner farmers and coordinates community distributions.",
    photoUrl: "/images/team-3.png",
    linkedinUrl: "#",
    order: 3,
  },
  {
    id: "team-4",
    name: "David Kasongo",
    roleFr: "Responsable partenariats",
    roleEn: "Partnerships Lead",
    bioFr:
      "David développe les alliances stratégiques avec les bailleurs, institutions et distributeurs.",
    bioEn:
      "David develops strategic alliances with donors, institutions and distributors.",
    photoUrl: "/images/team-4.png",
    linkedinUrl: "#",
    order: 4,
  },
]
