import { test } from "node:test";
import assert from "node:assert/strict";
import {
  serializeProduct,
  serializeArticle,
  serializeMessage,
  serializeSettings,
  serializeSubscriber,
} from "../utils/serialize.js";

test("serializeProduct: shape conforme + valeurs par défaut", () => {
  const now = new Date("2026-01-01T00:00:00.000Z");
  const p = serializeProduct({
    id: "uuid-1",
    slug: "super",
    name: "Super",
    ingredients: ["maïs"],
    benefitsFr: ["riche"],
    benefitsEn: [],
    gallery: [],
    status: "available",
    order: 2,
    createdAt: now,
  });
  assert.equal(p.id, "uuid-1");
  assert.equal(p.slug, "super");
  assert.deepEqual(p.ingredients, ["maïs"]);
  assert.equal(p.order, 2);
  assert.equal(p.createdAt, now.toISOString());
  assert.equal(p.taglineFr, ""); // défaut quand absent
});

test("serializeArticle: publishedAt null préservé + dates ISO", () => {
  const created = new Date("2026-02-02T00:00:00.000Z");
  const a = serializeArticle({
    id: "a1",
    slug: "x",
    titleFr: "T",
    titleEn: "T",
    category: "impact",
    status: "draft",
    publishedAt: null,
    createdAt: created,
    updatedAt: created,
  });
  assert.equal(a.publishedAt, null);
  assert.equal(a.createdAt, created.toISOString());
  assert.equal(a.category, "impact");
});

test("serializeArticle: publishedAt en ISO quand présent", () => {
  const pub = new Date("2026-03-03T00:00:00.000Z");
  const a = serializeArticle({
    id: "a2",
    slug: "y",
    titleFr: "T",
    titleEn: "T",
    category: "presse",
    status: "published",
    publishedAt: pub,
    createdAt: pub,
    updatedAt: pub,
  });
  assert.equal(a.publishedAt, pub.toISOString());
});

test("serializeMessage: optionnels absents → undefined", () => {
  const m = serializeMessage({
    id: "m1",
    type: "contact",
    name: "N",
    email: "e@x.cd",
    message: "hi",
    status: "new",
    createdAt: new Date(),
  });
  assert.equal(m.type, "contact");
  assert.equal(m.phone, undefined);
  assert.equal(m.cvUrl, undefined);
});

test("serializeSettings: ne renvoie que impact/contact/socials", () => {
  const s = serializeSettings({
    id: "ignored",
    impact: { tonnesProduced: 1 },
    contact: { email: "c@x.cd" },
    socials: { facebook: "fb" },
    createdAt: new Date(),
  });
  assert.deepEqual(Object.keys(s).sort(), ["contact", "impact", "socials"]);
});

test("serializeSubscriber: mappe idAbonne/dateAbonnement", () => {
  const d = new Date("2026-04-04T00:00:00.000Z");
  const s = serializeSubscriber({
    idAbonne: "ab1",
    email: "s@x.cd",
    locale: "en",
    confirmed: true,
    dateAbonnement: d,
  });
  assert.equal(s.id, "ab1");
  assert.equal(s.locale, "en");
  assert.equal(s.confirmed, true);
  assert.equal(s.createdAt, d.toISOString());
});

test("serializeProduct(null) → null", () => {
  assert.equal(serializeProduct(null), null);
});
