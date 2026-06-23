import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validate,
  messageSchema,
  subscribeSchema,
} from "../middlewares/validate.middleware.js";

// Exécute le middleware de validation sur un body et capture le résultat.
function run(schema, body) {
  let status = 200;
  let json = null;
  let nexted = false;
  const req = { body };
  const res = {
    status(c) {
      status = c;
      return this;
    },
    json(o) {
      json = o;
      return this;
    },
  };
  validate(schema)(req, res, () => {
    nexted = true;
  });
  return { status, json, nexted };
}

test("message valide → next()", () => {
  const r = run(messageSchema, {
    type: "contact",
    name: "Alice",
    email: "alice@example.cd",
    message: "Bonjour",
  });
  assert.equal(r.nexted, true);
  assert.equal(r.status, 200);
});

test("message: email invalide → 400", () => {
  const r = run(messageSchema, { name: "A", email: "pas-un-email", message: "x" });
  assert.equal(r.status, 400);
  assert.equal(r.nexted, false);
});

test("message: message manquant → 400", () => {
  const r = run(messageSchema, { name: "A", email: "a@b.cd" });
  assert.equal(r.status, 400);
});

test("message: type hors enum → 400", () => {
  const r = run(messageSchema, {
    type: "spam",
    name: "A",
    email: "a@b.cd",
    message: "x",
  });
  assert.equal(r.status, 400);
});

test("message: type optionnel absent → next()", () => {
  const r = run(messageSchema, { name: "A", email: "a@b.cd", message: "x" });
  assert.equal(r.nexted, true);
});

test("subscribe valide → next()", () => {
  const r = run(subscribeSchema, { email: "a@b.cd", locale: "fr" });
  assert.equal(r.nexted, true);
});

test("subscribe: locale hors enum → 400", () => {
  const r = run(subscribeSchema, { email: "a@b.cd", locale: "de" });
  assert.equal(r.status, 400);
});

test("subscribe: email manquant → 400", () => {
  const r = run(subscribeSchema, { locale: "fr" });
  assert.equal(r.status, 400);
});
