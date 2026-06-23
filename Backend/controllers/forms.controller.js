// Soumissions publiques (formulaires) — réponses { ok: true, id }.
import { ContactMessage, Abonne } from "../models/index.model.js";
import transporter from "../config/nodemailer.js";
import { EMAIL, FRONT_URL, HOST_URL, CONTACT_EMAIL } from "../config/env.js";
import { valideEmail } from "../middlewares/email.middleware.js";
import {
  confirmationReceptionEmailTemplate,
  newsletterSubscriptionConfirmationTemplate,
} from "../utils/email.template.js";

const MESSAGE_TYPES = ["contact", "partenariat", "candidature"];

// Envoi d'email best-effort : ne fait jamais échouer la requête.
async function sendMailSafe(mailOptions) {
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Erreur d'envoi d'email (non bloquant) :", err.message);
    return false;
  }
}

// POST /messages -> persiste un message (contact|partenariat|candidature)
export const createMessage = async (req, res, next) => {
  try {
    // Honeypot anti-spam : champ caché `_hp`. Rempli => bot, on ignore silencieusement.
    if (req.body._hp) {
      return res.status(201).json({ ok: true, id: "ignored" });
    }
    const {
      type = "contact",
      name,
      email,
      phone,
      organization,
      partnershipType,
      position,
      subject,
      message,
      cvUrl,
      cvFileName,
    } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Champs requis manquants (name, email, message)." });
    }
    if (!valideEmail(email)) {
      return res.status(400).json({ message: "Adresse email invalide." });
    }
    const finalType = MESSAGE_TYPES.includes(type) ? type : "contact";

    // CV uploadé (candidature) -> URL absolue ; sinon cvUrl/cvFileName du body
    const uploadedCvUrl = req.file
      ? `${HOST_URL}/${req.file.path.replace(/\\/g, "/")}`
      : null;

    const record = await ContactMessage.create({
      type: finalType,
      name,
      email,
      phone: phone ?? null,
      organization: organization ?? null,
      partnershipType: partnershipType ?? null,
      position: position ?? null,
      subject: subject ?? null,
      message,
      // Priorité au fichier uploadé, sinon cvUrl, sinon cvFileName (mode mock)
      cvUrl: uploadedCvUrl ?? cvUrl ?? (cvFileName ? cvFileName : null),
      status: "new",
    });

    // Accusé de réception (best-effort, non bloquant)
    void sendMailSafe({
      from: `"Food For Life" <${EMAIL}>`,
      to: email,
      subject: "Confirmation de réception de votre message",
      html: confirmationReceptionEmailTemplate(
        name,
        subject || "Votre message",
        FRONT_URL,
      ),
    });

    // Notification interne à l'équipe (best-effort, non bloquant)
    const adminRecipient = CONTACT_EMAIL || EMAIL;
    if (adminRecipient) {
      void sendMailSafe({
        from: `"Food For Life" <${EMAIL}>`,
        to: adminRecipient,
        replyTo: email,
        subject: `[${finalType}] Nouveau message de ${name}`,
        html: `
          <h2>Nouveau message (${finalType})</h2>
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          ${phone ? `<p><strong>Téléphone :</strong> ${phone}</p>` : ""}
          ${organization ? `<p><strong>Organisation :</strong> ${organization}</p>` : ""}
          ${partnershipType ? `<p><strong>Type de partenariat :</strong> ${partnershipType}</p>` : ""}
          ${position ? `<p><strong>Poste :</strong> ${position}</p>` : ""}
          ${subject ? `<p><strong>Objet :</strong> ${subject}</p>` : ""}
          <p><strong>Message :</strong></p>
          <p>${String(message).replace(/\n/g, "<br/>")}</p>
        `,
      });
    }

    return res.status(201).json({ ok: true, id: record.id });
  } catch (error) {
    next(error);
  }
};

// POST /newsletter/subscribe -> inscription simple (confirmed=true) + bienvenue
export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email, locale = "fr" } = req.body;

    if (!email || !valideEmail(email)) {
      return res.status(400).json({ message: "Adresse email invalide." });
    }
    const finalLocale = locale === "en" ? "en" : "fr";

    const existing = await Abonne.findOne({ where: { email } });
    let abonne;
    if (existing) {
      abonne = await existing.update({
        locale: finalLocale,
        confirmed: true,
        statut: "actif",
        dateDesabonnement: null,
      });
    } else {
      abonne = await Abonne.create({
        email,
        locale: finalLocale,
        confirmed: true,
        statut: "actif",
        dateAbonnement: new Date(),
      });
    }

    void sendMailSafe({
      from: `"Food For Life" <${EMAIL}>`,
      to: email,
      subject: "Bienvenue dans la newsletter Food For Life",
      html: newsletterSubscriptionConfirmationTemplate(email, FRONT_URL),
    });

    return res.status(201).json({ ok: true, id: abonne.idAbonne });
  } catch (error) {
    next(error);
  }
};
