import { apiGet, apiSend } from "./client"
import type { ManagedUser } from "@/lib/types"

const mockUser: ManagedUser = {
  id: "mock",
  name: "Administrateur",
  email: "admin@foodforlifedrc.org",
  role: "admin",
  avatar: null,
  lastLogin: null,
  createdAt: null,
}

export function getProfile(): Promise<ManagedUser> {
  return apiGet("/profile", () => mockUser)
}

export interface ProfilePayload {
  name?: string
  email?: string
  avatar?: string | null
}

export function updateProfile(payload: ProfilePayload): Promise<ManagedUser> {
  return apiSend<ManagedUser, ProfilePayload>(
    "/profile",
    payload,
    (b) => ({ ...mockUser, ...b }),
    "PUT"
  )
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export function changePassword(
  payload: ChangePasswordPayload
): Promise<{ ok: true }> {
  return apiSend<{ ok: true }, ChangePasswordPayload>(
    "/profile/password",
    payload,
    () => ({ ok: true }),
    "PUT"
  )
}
