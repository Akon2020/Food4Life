import { apiSend } from "./client"
import type {
  ApplicationPayload,
  ContactPayload,
  NewsletterPayload,
  PartnerPayload,
} from "@/lib/types"

export interface SubmitResult {
  ok: true
  id: string
}

function fakeId() {
  return `mock-${Math.random().toString(36).slice(2, 10)}`
}

export function submitContact(payload: ContactPayload): Promise<SubmitResult> {
  return apiSend(
    "/messages",
    { type: "contact", ...payload },
    () => ({ ok: true, id: fakeId() })
  )
}

export function submitPartner(payload: PartnerPayload): Promise<SubmitResult> {
  return apiSend(
    "/messages",
    { type: "partenariat", ...payload },
    () => ({ ok: true, id: fakeId() })
  )
}

export function submitApplication(
  payload: ApplicationPayload
): Promise<SubmitResult> {
  // In mock mode the CV upload is simulated (no real file is sent).
  return apiSend(
    "/messages",
    { type: "candidature", ...payload },
    () => ({ ok: true, id: fakeId() })
  )
}

export function subscribeNewsletter(
  payload: NewsletterPayload
): Promise<SubmitResult> {
  return apiSend("/newsletter/subscribe", payload, () => ({
    ok: true,
    id: fakeId(),
  }))
}
