export function TableSkeleton({
  columns = 4,
  rows = 6,
}: {
  columns?: number
  rows?: number
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-stone-50/80 px-4 py-3">
        <div className="h-3 w-24 animate-pulse rounded bg-stone-200" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4">
            {Array.from({ length: columns }).map((_, j) => (
              <div
                key={j}
                className="h-3 flex-1 animate-pulse rounded bg-stone-100"
                style={{ animationDelay: `${(i * columns + j) * 40}ms` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
