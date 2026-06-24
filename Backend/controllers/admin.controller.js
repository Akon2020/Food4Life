// CRUD admin — protégé par JWT + rôles (voir admin.route.js).
import slugify from "slugify";
import { fn, col, literal, Op } from "sequelize";
import { sanitizeHtml } from "../utils/sanitize.js";
import {
  Article,
  Product,
  Partner,
  TeamMember,
  Testimonial,
  GalleryItem,
  ContactMessage,
  SiteSetting,
  Abonne,
  Newsletter,
  NewsletterAbonne,
  Utilisateur,
} from "../models/index.model.js";
import {
  serializeArticle,
  serializeProduct,
  serializePartner,
  serializeTeamMember,
  serializeTestimonial,
  serializeGalleryItem,
  serializeMessage,
  serializeSettings,
  serializeSubscriber,
} from "../utils/serialize.js";

// ---- Fabrique CRUD générique (entités simples triées par `order`) ----
function makeCrud(Model, serialize, { editable }) {
  const pick = (body) => {
    const data = {};
    for (const key of editable) {
      if (body[key] !== undefined) data[key] = body[key];
    }
    return data;
  };

  return {
    list: async (req, res, next) => {
      try {
        const rows = await Model.findAll({ order: [["order", "ASC"]] });
        return res.status(200).json(rows.map(serialize));
      } catch (e) {
        next(e);
      }
    },
    getOne: async (req, res, next) => {
      try {
        const row = await Model.findByPk(req.params.id);
        if (!row) return res.status(404).json({ message: "Introuvable" });
        return res.status(200).json(serialize(row));
      } catch (e) {
        next(e);
      }
    },
    create: async (req, res, next) => {
      try {
        const row = await Model.create(pick(req.body));
        return res.status(201).json(serialize(row));
      } catch (e) {
        next(e);
      }
    },
    update: async (req, res, next) => {
      try {
        const row = await Model.findByPk(req.params.id);
        if (!row) return res.status(404).json({ message: "Introuvable" });
        await row.update(pick(req.body));
        return res.status(200).json(serialize(row));
      } catch (e) {
        next(e);
      }
    },
    remove: async (req, res, next) => {
      try {
        const row = await Model.findByPk(req.params.id);
        if (!row) return res.status(404).json({ message: "Introuvable" });
        await row.destroy();
        return res.status(200).json({ ok: true, id: req.params.id });
      } catch (e) {
        next(e);
      }
    },
  };
}

export const productsCrud = makeCrud(Product, serializeProduct, {
  editable: [
    "slug",
    "name",
    "taglineFr",
    "taglineEn",
    "descriptionFr",
    "descriptionEn",
    "ingredients",
    "benefitsFr",
    "benefitsEn",
    "targetAudienceFr",
    "targetAudienceEn",
    "imageUrl",
    "gallery",
    "availabilityFr",
    "availabilityEn",
    "status",
    "order",
  ],
});

export const partnersCrud = makeCrud(Partner, serializePartner, {
  editable: [
    "name",
    "logoUrl",
    "descriptionFr",
    "descriptionEn",
    "websiteUrl",
    "category",
    "order",
  ],
});

export const teamCrud = makeCrud(TeamMember, serializeTeamMember, {
  editable: [
    "name",
    "roleFr",
    "roleEn",
    "bioFr",
    "bioEn",
    "photoUrl",
    "linkedinUrl",
    "order",
  ],
});

export const testimonialsCrud = makeCrud(Testimonial, serializeTestimonial, {
  editable: [
    "authorName",
    "authorRoleFr",
    "authorRoleEn",
    "quoteFr",
    "quoteEn",
    "photoUrl",
    "order",
  ],
});

export const galleryCrud = makeCrud(GalleryItem, serializeGalleryItem, {
  editable: [
    "titleFr",
    "titleEn",
    "imageUrl",
    "category",
    "captionFr",
    "captionEn",
    "type",
    "videoUrl",
    "order",
  ],
});

// ---- Articles (CRUD spécifique : slug + publishedAt) ----
const ARTICLE_FIELDS = [
  "slug",
  "titleFr",
  "titleEn",
  "excerptFr",
  "excerptEn",
  "bodyFr",
  "bodyEn",
  "coverImageUrl",
  "category",
  "status",
  "publishedAt",
];

function pickArticle(body) {
  const data = {};
  for (const key of ARTICLE_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  // Le corps est du HTML riche -> on le sanitise (défense en profondeur).
  if (data.bodyFr !== undefined) data.bodyFr = sanitizeHtml(data.bodyFr);
  if (data.bodyEn !== undefined) data.bodyEn = sanitizeHtml(data.bodyEn);
  return data;
}

export const listAdminArticles = async (req, res, next) => {
  try {
    const rows = await Article.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(200).json(rows.map(serializeArticle));
  } catch (e) {
    next(e);
  }
};

export const getAdminArticle = async (req, res, next) => {
  try {
    const row = await Article.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Introuvable" });
    return res.status(200).json(serializeArticle(row));
  } catch (e) {
    next(e);
  }
};

export const createArticle = async (req, res, next) => {
  try {
    const data = pickArticle(req.body);
    if (!data.titleFr && !data.titleEn) {
      return res.status(400).json({ message: "Le titre est requis." });
    }
    if (!data.slug) {
      data.slug = slugify(data.titleFr || data.titleEn || "article", {
        lower: true,
        strict: true,
      });
    }
    // Auto-date de publication si publié sans date
    if (data.status === "published" && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    data.authorId = req.user?.idUtilisateur ?? null;
    const row = await Article.create(data);
    return res.status(201).json(serializeArticle(row));
  } catch (e) {
    if (e?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Ce slug existe déjà." });
    }
    next(e);
  }
};

export const updateArticle = async (req, res, next) => {
  try {
    const row = await Article.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Introuvable" });
    const data = pickArticle(req.body);
    // Passage à "published" sans date -> on date maintenant
    if (data.status === "published" && !data.publishedAt && !row.publishedAt) {
      data.publishedAt = new Date();
    }
    await row.update(data);
    return res.status(200).json(serializeArticle(row));
  } catch (e) {
    if (e?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Ce slug existe déjà." });
    }
    next(e);
  }
};

export const deleteArticle = async (req, res, next) => {
  try {
    const row = await Article.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Introuvable" });
    await row.destroy();
    return res.status(200).json({ ok: true, id: req.params.id });
  } catch (e) {
    next(e);
  }
};

// ---- Messages ----
export const listMessages = async (req, res, next) => {
  try {
    const rows = await ContactMessage.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json(rows.map(serializeMessage));
  } catch (e) {
    next(e);
  }
};

export const updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["new", "read", "archived"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide." });
    }
    const row = await ContactMessage.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Introuvable" });
    await row.update({ status });
    return res.status(200).json(serializeMessage(row));
  } catch (e) {
    next(e);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const row = await ContactMessage.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Introuvable" });
    await row.destroy();
    return res.status(200).json({ ok: true, id: req.params.id });
  } catch (e) {
    next(e);
  }
};

// ---- Abonnés newsletter ----
export const listSubscribers = async (req, res, next) => {
  try {
    const rows = await Abonne.findAll({ order: [["dateAbonnement", "DESC"]] });
    return res.status(200).json(rows.map(serializeSubscriber));
  } catch (e) {
    next(e);
  }
};

export const deleteSubscriber = async (req, res, next) => {
  try {
    const row = await Abonne.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Introuvable" });
    await row.destroy();
    return res.status(200).json({ ok: true, id: req.params.id });
  } catch (e) {
    next(e);
  }
};

// ---- Settings ----
export const getAdminSettings = async (req, res, next) => {
  try {
    const [settings] = await SiteSetting.findOrCreate({
      where: {},
      defaults: {},
    });
    return res.status(200).json(serializeSettings(settings));
  } catch (e) {
    next(e);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const [settings] = await SiteSetting.findOrCreate({
      where: {},
      defaults: {},
    });
    const { impact, contact, socials } = req.body;
    await settings.update({
      impact: impact ?? settings.impact,
      contact: contact ?? settings.contact,
      socials: socials ?? settings.socials,
    });
    return res.status(200).json(serializeSettings(settings));
  } catch (e) {
    next(e);
  }
};

// ---- Dashboard (KPIs) ----
// Série mensuelle (6 derniers mois) du nombre de lignes d'un modèle.
async function monthlySeries(Model, dateField) {
  const start = new Date();
  start.setMonth(start.getMonth() - 5);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const rows = await Model.findAll({
    attributes: [
      [fn("DATE_FORMAT", col(dateField), "%Y-%m"), "month"],
      [fn("COUNT", literal("*")), "count"],
    ],
    where: { [dateField]: { [Op.gte]: start } },
    group: [literal("month")],
    raw: true,
  });

  const map = Object.fromEntries(rows.map((r) => [r.month, Number(r.count)]));
  const result = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    result.push({ month: key, count: map[key] ?? 0 });
  }
  return result;
}

export const getDashboard = async (req, res, next) => {
  try {
    const [
      products,
      articles,
      publishedArticles,
      partners,
      team,
      testimonials,
      gallery,
      messages,
      newMessages,
      readMessages,
      archivedMessages,
      contactMessages,
      partnerMessages,
      applicationMessages,
      subscribers,
      confirmedSubscribers,
      campaigns,
      emailsSent,
      users,
    ] = await Promise.all([
      Product.count(),
      Article.count(),
      Article.count({ where: { status: "published" } }),
      Partner.count(),
      TeamMember.count(),
      Testimonial.count(),
      GalleryItem.count(),
      ContactMessage.count(),
      ContactMessage.count({ where: { status: "new" } }),
      ContactMessage.count({ where: { status: "read" } }),
      ContactMessage.count({ where: { status: "archived" } }),
      ContactMessage.count({ where: { type: "contact" } }),
      ContactMessage.count({ where: { type: "partenariat" } }),
      ContactMessage.count({ where: { type: "candidature" } }),
      Abonne.count(),
      Abonne.count({ where: { confirmed: true } }),
      Newsletter.count(),
      NewsletterAbonne.count({ where: { statut: "envoye" } }),
      Utilisateur.count(),
    ]);

    const [recentMessages, recentCampaigns, messagesSeries, subscribersSeries] =
      await Promise.all([
        ContactMessage.findAll({ order: [["createdAt", "DESC"]], limit: 5 }),
        Newsletter.findAll({ order: [["createdAt", "DESC"]], limit: 5 }),
        monthlySeries(ContactMessage, "createdAt"),
        monthlySeries(Abonne, "dateAbonnement"),
      ]);

    return res.status(200).json({
      counts: {
        products,
        articles,
        publishedArticles,
        partners,
        team,
        testimonials,
        gallery,
        messages,
        newMessages,
        subscribers,
        confirmedSubscribers,
        campaigns,
        emailsSent,
        users,
      },
      messagesByStatus: {
        new: newMessages,
        read: readMessages,
        archived: archivedMessages,
      },
      messagesByType: {
        contact: contactMessages,
        partenariat: partnerMessages,
        candidature: applicationMessages,
      },
      contentDistribution: {
        products,
        articles,
        partners,
        team,
        testimonials,
        gallery,
      },
      monthly: messagesSeries.map((m, i) => ({
        month: m.month,
        messages: m.count,
        subscribers: subscribersSeries[i]?.count ?? 0,
      })),
      recentMessages: recentMessages.map(serializeMessage),
      recentCampaigns: recentCampaigns.map((n) => ({
        id: n.idNewsletter,
        subject: n.objetMail,
        status: n.statut,
        sentAt: n.dateEnvoi ? n.dateEnvoi.toISOString() : null,
      })),
    });
  } catch (e) {
    next(e);
  }
};
