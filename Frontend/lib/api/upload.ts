// Upload d'image vers le backend (champ "image") -> URL absolue persistable.
// En mode mock, renvoie une URL placeholder sans réseau.

const USE_MOCKS =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_USE_MOCKS === "true"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

export interface UploadResult {
  url: string
  path: string
}

export async function uploadImage(file: File): Promise<UploadResult> {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 300))
    return { url: URL.createObjectURL(file), path: `mock/${file.name}` }
  }

  const form = new FormData()
  form.append("image", file)

  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("ffl_admin_token")
      : null

  const res = await fetch(`${API_BASE_URL}/admin/uploads`, {
    method: "POST",
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  })
  if (!res.ok) throw new Error(`Upload échoué (${res.status})`)
  return res.json()
}
