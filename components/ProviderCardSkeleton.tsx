export default function ProviderCardSkeleton() {
  return (
    <div className="border border-border rounded-xl bg-card p-5 sm:p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 bg-muted rounded-lg" />
            <div className="h-5 bg-muted rounded w-3/4" />
          </div>
          <div className="h-4 bg-muted rounded w-16 mb-3" />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="h-3 bg-muted rounded w-2/3" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>

      <div className="h-3 bg-muted rounded w-full mb-2" />
      <div className="h-3 bg-muted rounded w-5/6 mb-4" />

      <div className="flex flex-wrap gap-1.5 mb-4">
        <div className="h-6 bg-muted rounded w-20" />
        <div className="h-6 bg-muted rounded w-24" />
        <div className="h-6 bg-muted rounded w-16" />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
        <div className="h-4 bg-muted rounded w-24" />
        <div className="h-4 bg-muted rounded w-4" />
      </div>
    </div>
  )
}
