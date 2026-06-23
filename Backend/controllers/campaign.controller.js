// Campagnes newsletter (admin) : composition, envoi, et suivi par abonné
// (qui a reçu quelle newsletter et quand) via la table NewsletterAbonne.
import {
  Newsletter,
  NewsletterAbonne,
  Abonne,
} from "../models/index.model.js";
import transporter from "../config/nodemailer.js";
import { EMAIL, FRONT_URL } from "../config/env.js";
import { newsletterEmailTemplate } from "../utils/email.template.js";
import { sanitizeHtml } from "../utils/sanitize.js";

function serializeCampaign(n, counts) {
  return {
    id: n.idNewsletter,
    title: n.titreInterne,
    subject: n.objetMail,
    content: n.contenu,
    status: n.statut,
    sentAt: n.dateEnvoi ? n.dateEnvoi.toISOString() : null,
    recipientCount: counts?.total,
    sentCount: counts?.sent,
    createdAt: n.createdAt ? n.createdAt.toISOString() : null,
  };
}

async function countsFor(idNewsletter) {
  const [total, sent] = await Promise.all([
    NewsletterAbonne.count({ where: { idNewsletter } }),
    NewsletterAbonne.count({ where: { idNewsletter, statut: "envoye" } }),
  ]);
  return { total, sent };
}

// Envoi en arrière-plan : met à jour chaque destinataire (envoye/echec + date).
async function dispatchCampaign(campaign, subject, html, abonnes) {
  for (const ab of abonnes) {
    let ok = true;
    try {
      await transporter.sendMail({
        from: `"Food For Life" <${EMAIL}>`,
        to: ab.email,
        subject,
        html: newsletterEmailTemplate(
          ab.nomComplet || ab.email,
          subject,
          html,
          `${FRONT_URL}/fr/contact?unsubscribe=${encodeURIComponent(ab.email)}`,
        ),
      });
    } catch (err) {
      ok = false;
      console.error(`Échec d'envoi campagne à ${ab.email}:`, err.message);
    }
    await NewsletterAbonne.update(
      { statut: ok ? "envoye" : "echec", dateEnvoi: new Date() },
      { where: { idNewsletter: campaign.idNewsletter, idAbonne: ab.idAbonne } },
    );
  }
}

export const listCampaigns = async (req, res, next) => {
  try {
    const rows = await Newsletter.findAll({ order: [["createdAt", "DESC"]] });
    const result = await Promise.all(
      rows.map(async (n) => serializeCampaign(n, await countsFor(n.idNewsletter))),
    );
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const getCampaign = async (req, res, next) => {
  try {
    const n = await Newsletter.findByPk(req.params.id);
    if (!n) return res.status(404).json({ message: "Introuvable" });

    const links = await NewsletterAbonne.findAll({
      where: { idNewsletter: n.idNewsletter },
      include: [
        {
          model: Abonne,
          as: "abonne",
          attributes: ["idAbonne", "nomComplet", "email"],
        },
      ],
      order: [["dateEnvoi", "DESC"]],
    });

    const recipients = links.map((l) => ({
      id: l.idAbonne,
      name: l.abonne?.nomComplet ?? null,
      email: l.abonne?.email ?? null,
      status: l.statut,
      sentAt: l.dateEnvoi ? l.dateEnvoi.toISOString() : null,
    }));

    return res.status(200).json({
      ...serializeCampaign(n, await countsFor(n.idNewsletter)),
      recipients,
    });
  } catch (e) {
    next(e);
  }
};

export const createCampaign = async (req, res, next) => {
  try {
    const { title, subject, content } = req.body;
    if (!subject || !content) {
      return res.status(400).json({ message: "Objet et contenu requis." });
    }
    const safe = sanitizeHtml(content);

    const campaign = await Newsletter.create({
      titreInterne: title || subject,
      objetMail: subject,
      contenu: safe,
      statut: "envoye",
      dateEnvoi: new Date(),
      writedBy: req.user?.idUtilisateur ?? null,
    });

    const abonnes = await Abonne.findAll({ where: { statut: "actif" } });

    // Enregistre les destinataires en "attente" (traçabilité immédiate)
    if (abonnes.length) {
      await NewsletterAbonne.bulkCreate(
        abonnes.map((ab) => ({
          idNewsletter: campaign.idNewsletter,
          idAbonne: ab.idAbonne,
          statut: "attente",
        })),
      );
    }

    // Répond tout de suite, l'envoi se fait en arrière-plan
    res.status(201).json(
      serializeCampaign(campaign, { total: abonnes.length, sent: 0 }),
    );

    void dispatchCampaign(campaign, subject, safe, abonnes);
  } catch (e) {
    if (!res.headersSent) next(e);
  }
};

export const deleteCampaign = async (req, res, next) => {
  try {
    const n = await Newsletter.findByPk(req.params.id);
    if (!n) return res.status(404).json({ message: "Introuvable" });
    await NewsletterAbonne.destroy({ where: { idNewsletter: n.idNewsletter } });
    await n.destroy();
    return res.status(200).json({ ok: true, id: req.params.id });
  } catch (e) {
    next(e);
  }
};
