"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"

import { getUsers, createUser, updateUser, deleteUser } from "@/lib/api/admin"
import type { Locale, ManagedUser } from "@/lib/types"
import { formatDate } from "@/lib/format"
import {
  TableCard,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  EmptyRow,
} from "@/components/admin/admin-table"
import { Users, Shield, Pencil } from "lucide-react"
import { StatusBadge } from "@/components/admin/status-badge"
import { AdminToolbar } from "@/components/admin/admin-toolbar"
import { RowActions } from "@/components/admin/row-actions"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import { ListStats } from "@/components/admin/list-stats"
import {
  AdminFormDialog,
  type FieldDef,
} from "@/components/admin/admin-form-dialog"
import { useEntityForm } from "@/components/admin/use-entity-form"
import { useRowDelete } from "@/components/admin/use-row-delete"

export function UsersList() {
  const t = useTranslations("adminUI")
  const locale = useLocale() as Locale
  const [search, setSearch] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: getUsers,
  })

  const del = useRowDelete(deleteUser, ["admin", "users"])
  const form = useEntityForm<ManagedUser>({
    create: (v) => createUser(v as Parameters<typeof createUser>[0]),
    update: (id, v) => updateUser(id, v as Parameters<typeof updateUser>[1]),
    queryKey: ["admin", "users"],
  })

  const fields: FieldDef[] = [
    { name: "name", label: t("name"), type: "text", required: true },
    { name: "email", label: t("email"), type: "text", required: true },
    {
      name: "role",
      label: t("role"),
      type: "select",
      options: [
        { value: "admin", label: t("roleAdmin") },
        { value: "editeur", label: t("roleEditor") },
      ],
    },
    {
      name: "password",
      label: form.editing
        ? `${t("password")} — ${t("passwordEditHint")}`
        : t("password"),
      type: "password",
      required: !form.editing,
    },
  ]

  const rows = useMemo(() => {
    return (data ?? []).filter((u) =>
      `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    )
  }, [data, search])

  const all = data ?? []
  const stats = [
    { label: t("statUsers"), value: all.length, icon: Users, accent: "green" as const },
    { label: t("roleAdmin"), value: all.filter((u) => u.role === "admin").length, icon: Shield, accent: "blue" as const },
    { label: t("roleEditor"), value: all.filter((u) => u.role === "editeur").length, icon: Pencil, accent: "gold" as const },
  ]

  return (
    <div className="grid gap-6">
      <ListStats items={stats} />
      <AdminToolbar search={search} onSearch={setSearch} onAdd={form.openCreate} />

      {isLoading ? (
        <TableSkeleton columns={4} />
      ) : (
        <TableCard>
          <Thead>
            <Tr>
              <Th>{t("name")}</Th>
              <Th>{t("role")}</Th>
              <Th>{t("lastLogin")}</Th>
              <Th className="text-right">{t("actions")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.length === 0 ? (
              <EmptyRow colSpan={4} label={t("noResults")} />
            ) : (
              rows.map((u) => (
                <Tr key={u.id}>
                  <Td>
                    <div className="min-w-0">
                      <p className="font-medium text-ink">{u.name}</p>
                      <p className="truncate text-xs text-ink-muted">{u.email}</p>
                    </div>
                  </Td>
                  <Td>
                    <StatusBadge
                      label={u.role === "admin" ? t("roleAdmin") : t("roleEditor")}
                      tone={u.role === "admin" ? "green" : "blue"}
                    />
                  </Td>
                  <Td className="whitespace-nowrap text-ink-muted">
                    {u.lastLogin ? formatDate(u.lastLogin, locale) : t("never")}
                  </Td>
                  <Td>
                    <RowActions
                      onEdit={() =>
                        form.openEdit({ ...u, password: "" } as ManagedUser)
                      }
                      onDelete={() => del.mutate(u.id)}
                      deleting={del.isPending && del.variables === u.id}
                    />
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </TableCard>
      )}

      <AdminFormDialog
        open={form.open}
        onOpenChange={form.setOpen}
        title={form.editing ? t("editTitle") : t("createTitle")}
        fields={fields}
        initial={form.editing as Record<string, unknown> | null}
        onSubmit={form.submit}
        submitting={form.submitting}
      />
    </div>
  )
}
