import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-[var(--container-content)] px-6 py-24 md:px-10">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-4 h-16 w-3/4" />
      <Skeleton className="mt-3 h-16 w-1/2" />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
      </div>
    </div>
  )
}
