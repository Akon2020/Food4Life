"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import { AnimatePresence, motion } from "framer-motion"
import {
  X,
  Mail,
  Phone,
  Building2,
  Briefcase,
  FileText,
  Check,
  Archive,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import {
  getAdminMessages,
  updateMessageStatus,
  deleteMessage,
} from "@/lib/api/admin"
import { formatDateTime } from "@/lib/format"
import type { ContactMessage, Locale, MessageStatus } from "@/lib/types"
import {
  TableCard,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  EmptyRow,
} from "@/components/admin/admin-table"
import { StatusBadge, statusTone } from "@/components/admin/status-badge"
import { AdminToolbar, FilterPills } from "@/components/admin/admin-toolbar"
import { TableSkeleton } from "@/components/admin/table-skeleton"

const types = ["all", "contact", "partenariat", "candidature"] as const

const typeKey: Record<string, string> = {
  contact: "typeContact",
  partenariat: "typePartenariat",
  candidature: "typeCandidature",
}
const statusKey: Record<string, string> = {
  new: "msgNew",
  read: "msgRead",
  archived: "msgArchived",
}

export function MessagesList() {
  const t = useTranslations("adminUI")
  const locale = useLocale() as Locale
  const [search, setSearch] = useState("")
  const [type, setType] = useState<string>("all")
  const [selected, setSelected] = useState<ContactMessage | null>(null)

  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: getAdminMessages,
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MessageStatus }) =>
      updateMessageStatus(id, status),
    onSuccess: (updated) => {
      toast.success(t("statusUpdated"))
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] })
      setSelected((cur) => (cur && cur.id === updated.id ? updated : cur))
    },
    onError: () => toast.error(t("updateError")),
  })

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteMessage(id),
    onSuccess: () => {
      toast.success(t("deleted"))
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] })
      setSelected(null)
    },
    onError: () => toast.error(t("deleteError")),
  })

  const rows = useMemo(() => {
    return (data ?? [])
      .filter((m) => {
        const haystack = `${m.name} ${m.email} ${m.message}`.toLowerCase()
        const matchSearch = haystack.includes(search.toLowerCase())
        const matchType = type === "all" || m.type === type
        return matchSearch && matchType
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [data, search, type])

  return (
    <div className="grid gap-4">
      <AdminToolbar
        search={search}
        onSearch={setSearch}
        showAdd={false}
        filters={
          <FilterPills
            options={types.map((c) => ({
              value: c,
              label: c === "all" ? t("filterAll") : t(typeKey[c]),
            }))}
            active={type}
            onChange={setType}
          />
        }
      />

      {isLoading ? (
        <TableSkeleton columns={5} />
      ) : (
        <TableCard>
          <Thead>
            <Tr>
              <Th>{t("name")}</Th>
              <Th>{t("type")}</Th>
              <Th>{t("status")}</Th>
              <Th>{t("date")}</Th>
              <Th className="text-right">{t("actions")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.length === 0 ? (
              <EmptyRow colSpan={5} label={t("noResults")} />
            ) : (
              rows.map((m) => (
                <Tr
                  key={m.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(m)}
                >
                  <Td>
                    <div className="min-w-0">
                      <p className="font-medium text-ink">{m.name}</p>
                      <p className="truncate text-xs text-ink-muted">{m.email}</p>
                    </div>
                  </Td>
                  <Td className="text-ink-muted">{t(typeKey[m.type])}</Td>
                  <Td>
                    <StatusBadge label={t(statusKey[m.status])} tone={statusTone(m.status)} />
                  </Td>
                  <Td className="whitespace-nowrap text-ink-muted">
                    {formatDateTime(m.createdAt, locale)}
                  </Td>
                  <Td className="text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelected(m)
                      }}
                      className="text-sm font-medium text-green-700 hover:text-green-900"
                    >
                      {t("view")}
                    </button>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </TableCard>
      )}

      <AnimatePresence>
        {selected ? (
          <MessageDetail
            message={selected}
            onClose={() => setSelected(null)}
            onStatusChange={(status) =>
              statusMutation.mutate({ id: selected.id, status })
            }
            onDelete={() => {
              if (window.confirm(t("confirmDelete"))) removeMutation.mutate(selected.id)
            }}
            busy={statusMutation.isPending || removeMutation.isPending}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function MessageDetail({
  message,
  onClose,
  onStatusChange,
  onDelete,
  busy = false,
}: {
  message: ContactMessage
  onClose: () => void
  onStatusChange: (status: MessageStatus) => void
  onDelete: () => void
  busy?: boolean
}) {
  const t = useTranslations("adminUI")
  const locale = useLocale() as Locale

  const fields: { icon: typeof Mail; label: string; value?: string }[] = [
    { icon: Mail, label: t("email"), value: message.email },
    { icon: Phone, label: t("phone"), value: message.phone },
    { icon: Building2, label: t("organization"), value: message.organization },
    { icon: Briefcase, label: t("position"), value: message.position },
  ]

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        aria-label={t("close")}
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />
      <motion.aside
        className="relative z-10 flex h-full w-full max-w-md flex-col overflow-y-auto bg-card shadow-2xl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <StatusBadge label={t(statusKey[message.status])} tone={statusTone(message.status)} />
              <span className="text-xs font-medium text-ink-muted">
                {t(typeKey[message.type])}
              </span>
            </div>
            <h2 className="font-heading text-xl font-bold text-ink">{message.name}</h2>
            <p className="text-xs text-ink-muted">
              {formatDateTime(message.createdAt, locale)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-stone-100"
          >
            <X className="size-5" />
            <span className="sr-only">{t("close")}</span>
          </button>
        </div>

        <div className="grid gap-5 p-6">
          <dl className="grid gap-3">
            {fields
              .filter((f) => f.value)
              .map((f) => (
                <div key={f.label} className="flex items-center gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                    <f.icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs text-ink-muted">{f.label}</dt>
                    <dd className="truncate text-sm font-medium text-ink">{f.value}</dd>
                  </div>
                </div>
              ))}
          </dl>

          {message.partnershipType ? (
            <div className="rounded-lg bg-stone-50 px-4 py-3">
              <p className="text-xs text-ink-muted">{t("type")}</p>
              <p className="text-sm font-medium text-ink">{message.partnershipType}</p>
            </div>
          ) : null}

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Message
            </p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink">
              {message.message}
            </p>
          </div>

          {message.cvUrl ? (
            <a
              href={message.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-green-700 transition-colors hover:bg-green-50"
            >
              <FileText className="size-4" />
              {t("downloadCv")}
            </a>
          ) : null}

          <a
            href={`mailto:${message.email}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800"
          >
            <Mail className="size-4" />
            {message.email}
          </a>

          {/* Actions de modération */}
          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            <button
              type="button"
              disabled={busy || message.status === "read"}
              onClick={() => onStatusChange("read")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-stone-50 disabled:opacity-40"
            >
              <Check className="size-4" />
              {t("markRead")}
            </button>
            <button
              type="button"
              disabled={busy || message.status === "archived"}
              onClick={() => onStatusChange("archived")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-stone-50 disabled:opacity-40"
            >
              <Archive className="size-4" />
              {t("markArchived")}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40"
            >
              <Trash2 className="size-4" />
              {t("delete")}
            </button>
          </div>
        </div>
      </motion.aside>
    </motion.div>
  )
}
