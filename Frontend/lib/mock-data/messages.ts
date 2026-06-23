import type { ContactMessage, NewsletterSubscriber } from "@/lib/types"

export const mockMessages: ContactMessage[] = [
  {
    id: "msg-1",
    type: "partenariat",
    name: "Olivier Tshisekedi",
    email: "olivier@ongpartenaire.org",
    phone: "+243 991 111 111",
    organization: "ONG Espoir",
    partnershipType: "Financier",
    message:
      "Nous souhaitons explorer un partenariat de financement pour étendre votre programme à Uvira.",
    status: "new",
    createdAt: "2024-12-01T09:30:00.000Z",
  },
  {
    id: "msg-2",
    type: "contact",
    name: "Sarah Mukendi",
    email: "sarah.mukendi@example.com",
    message:
      "Bonjour, où puis-je acheter SUPER ENERGY FARINA à Goma ? Merci.",
    status: "new",
    createdAt: "2024-12-02T14:10:00.000Z",
  },
  {
    id: "msg-3",
    type: "candidature",
    name: "Benjamin Kalala",
    email: "b.kalala@example.com",
    phone: "+243 992 222 222",
    position: "Technicien de production",
    message:
      "Je suis très motivé à rejoindre votre mission. Vous trouverez mon CV en pièce jointe.",
    cvUrl: "/uploads/cv-benjamin-kalala.pdf",
    status: "read",
    createdAt: "2024-11-28T11:00:00.000Z",
  },
  {
    id: "msg-4",
    type: "contact",
    name: "Grace Furaha",
    email: "grace.furaha@example.com",
    message: "Félicitations pour votre travail formidable !",
    status: "archived",
    createdAt: "2024-11-20T16:45:00.000Z",
  },
]

export const mockSubscribers: NewsletterSubscriber[] = [
  {
    id: "sub-1",
    email: "marie.n@example.com",
    locale: "fr",
    confirmed: true,
    createdAt: "2024-11-10T08:00:00.000Z",
  },
  {
    id: "sub-2",
    email: "john.doe@example.com",
    locale: "en",
    confirmed: true,
    createdAt: "2024-11-15T12:30:00.000Z",
  },
  {
    id: "sub-3",
    email: "patrick.m@example.com",
    locale: "fr",
    confirmed: false,
    createdAt: "2024-12-01T18:20:00.000Z",
  },
]
