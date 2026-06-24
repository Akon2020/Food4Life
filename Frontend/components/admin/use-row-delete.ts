"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

/**
 * Hook réutilisable pour la suppression d'une ligne admin :
 * mutation + toast + invalidation du cache TanStack Query.
 */
export function useRowDelete(
  mutationFn: (id: string) => Promise<unknown>,
  queryKey: readonly unknown[]
) {
  const t = useTranslations("adminUI")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success(t("deleted"))
      queryClient.invalidateQueries({ queryKey })
    },
    onError: () => toast.error(t("deleteError")),
  })
}
