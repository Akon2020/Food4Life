"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import type { FormValues } from "./admin-form-dialog"

/**
 * Gère l'état d'un formulaire admin create/edit :
 * - dialog ouvert/fermé, élément en cours d'édition (ou null = création)
 * - mutation create/update + toast + invalidation du cache
 */
export function useEntityForm<T extends { id: string }>({
  create,
  update,
  queryKey,
}: {
  create: (payload: FormValues) => Promise<unknown>
  update: (id: string, payload: FormValues) => Promise<unknown>
  queryKey: readonly unknown[]
}) {
  const t = useTranslations("adminUI")
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      editing ? update(editing.id, values) : create(values),
    onSuccess: () => {
      toast.success(t("saved"))
      queryClient.invalidateQueries({ queryKey })
      setOpen(false)
      setEditing(null)
    },
    onError: () => toast.error(t("saveError")),
  })

  return {
    open,
    setOpen,
    editing,
    openCreate: () => {
      setEditing(null)
      setOpen(true)
    },
    openEdit: (item: T) => {
      setEditing(item)
      setOpen(true)
    },
    submit: (values: FormValues) => mutation.mutate(values),
    submitting: mutation.isPending,
  }
}
