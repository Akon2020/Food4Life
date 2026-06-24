"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Loader2, Upload, User, Lock } from "lucide-react"

import { getProfile, updateProfile, changePassword } from "@/lib/api/profile"
import { uploadImage } from "@/lib/api/upload"
import { setStoredUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { TableSkeleton } from "@/components/admin/table-skeleton"

const inputCls =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"

export function ProfileView() {
  const t = useTranslations("adminUI")
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  })

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [avatar, setAvatar] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (data) {
      setName(data.name ?? "")
      setEmail(data.email ?? "")
      setAvatar(data.avatar ?? null)
    }
  }, [data])

  const profileMutation = useMutation({
    mutationFn: () => updateProfile({ name, email, avatar }),
    onSuccess: (u) => {
      toast.success(t("profileUpdated"))
      setStoredUser({ name: u.name, email: u.email, role: u.role })
      router.refresh()
    },
    onError: () => toast.error(t("saveError")),
  })

  // ---- Sécurité ----
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  const passwordMutation = useMutation({
    mutationFn: () => changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      toast.success(t("passwordChanged"))
      setCurrentPassword("")
      setNewPassword("")
      setConfirm("")
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : t("saveError")),
  })

  async function onAvatar(file?: File | null) {
    if (!file) return
    setUploading(true)
    try {
      const { url } = await uploadImage(file)
      setAvatar(url)
    } finally {
      setUploading(false)
    }
  }

  if (isLoading || !data) {
    return <TableSkeleton columns={2} rows={4} />
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Profil */}
      <form
        className="grid gap-4 rounded-xl border border-border bg-card p-6"
        onSubmit={(e) => {
          e.preventDefault()
          profileMutation.mutate()
        }}
      >
        <div className="flex items-center gap-2 text-ink">
          <User className="size-5 text-green-700" />
          <h2 className="font-heading text-lg font-semibold">{t("profile")}</h2>
        </div>

        <div className="flex items-center gap-4">
          <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-stone-100">
            {avatar ? (
              <Image src={avatar} alt={name} fill sizes="64px" className="object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center text-xl font-bold text-ink-muted">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
          </span>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-ink hover:bg-stone-50">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {t("avatar")}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onAvatar(e.target.files?.[0])} />
          </label>
        </div>

        <label className="grid gap-1.5">
          <span className="text-xs text-ink-muted">{t("name")}</span>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs text-ink-muted">{t("email")}</span>
          <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <div className="flex justify-end">
          <Button type="submit" disabled={profileMutation.isPending}>
            {profileMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {t("save")}
          </Button>
        </div>
      </form>

      {/* Sécurité */}
      <form
        className="grid gap-4 rounded-xl border border-border bg-card p-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (newPassword !== confirm) {
            toast.error(t("passwordMismatch"))
            return
          }
          passwordMutation.mutate()
        }}
      >
        <div className="flex items-center gap-2 text-ink">
          <Lock className="size-5 text-green-700" />
          <h2 className="font-heading text-lg font-semibold">{t("security")}</h2>
        </div>

        <label className="grid gap-1.5">
          <span className="text-xs text-ink-muted">{t("currentPassword")}</span>
          <input type="password" autoComplete="current-password" className={inputCls} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs text-ink-muted">{t("newPassword")}</span>
          <input type="password" autoComplete="new-password" className={inputCls} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs text-ink-muted">{t("confirmPassword")}</span>
          <input type="password" autoComplete="new-password" className={inputCls} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              passwordMutation.isPending ||
              !currentPassword ||
              !newPassword ||
              !confirm
            }
          >
            {passwordMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {t("changePassword")}
          </Button>
        </div>
      </form>
    </div>
  )
}
