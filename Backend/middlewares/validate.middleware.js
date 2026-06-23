// Validation légère (sans dépendance) basée sur un schéma déclaratif.
// Chaque règle: { field, required, type, enum, max, min }
// type: "string" | "email" | "enum" | "int" | "array"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function checkRule(value, rule) {
  const present = value !== undefined && value !== null && value !== "";

  if (!present) {
    return rule.required ? `${rule.field} est requis` : null;
  }

  switch (rule.type) {
    case "email":
      if (typeof value !== "string" || !EMAIL_RE.test(value))
        return `${rule.field} doit être un email valide`;
      break;
    case "enum":
      if (!rule.enum.includes(value))
        return `${rule.field} doit être l'une des valeurs: ${rule.enum.join(", ")}`;
      break;
    case "int":
      if (!Number.isInteger(Number(value)))
        return `${rule.field} doit être un entier`;
      break;
    case "array":
      if (!Array.isArray(value)) return `${rule.field} doit être un tableau`;
      break;
    case "string":
    default:
      if (typeof value !== "string") return `${rule.field} doit être du texte`;
      break;
  }

  if (rule.max && typeof value === "string" && value.length > rule.max)
    return `${rule.field} dépasse ${rule.max} caractères`;

  return null;
}

export function validate(schema) {
  return (req, res, next) => {
    const errors = [];
    for (const rule of schema) {
      const err = checkRule(req.body[rule.field], rule);
      if (err) errors.push(err);
    }
    if (errors.length) {
      return res.status(400).json({ message: errors[0], errors });
    }
    next();
  };
}

// ---- Schémas ----

export const messageSchema = [
  {
    field: "type",
    type: "enum",
    enum: ["contact", "partenariat", "candidature"],
  },
  { field: "name", required: true, type: "string", max: 150 },
  { field: "email", required: true, type: "email" },
  { field: "message", required: true, type: "string", max: 5000 },
  { field: "subject", type: "string", max: 255 },
  { field: "phone", type: "string", max: 50 },
];

export const subscribeSchema = [
  { field: "email", required: true, type: "email" },
  { field: "locale", type: "enum", enum: ["fr", "en"] },
];
