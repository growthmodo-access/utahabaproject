export default function ProviderRowSkeleton() {
  return (
    <div className="border border-border rounded-xl bg-card p-5 sm:p-6 animate-pulse">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        {/* Rank and Name */}
        <div className="flex-shrink-0 flex items-center gap-4 sm:gap-6 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-16 bg-muted rounded-xl" />
          <div className="flex-1 sm:flex-none min-w-0">
            <div className="h-6 bg-muted rounded w-48 mb-2" />
            <div className="h-4 bg-muted rounded w-32" />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-4 bg-muted rounded w-32" />
        </div>

        {/* CTA Buttons */}
        <div className="flex-shrink-0 flex gap-3">
          <div className="h-10 bg-muted rounded-lg w-24" />
          <div className="h-10 bg-muted rounded-lg w-28" />
        </div>
      </div>
    </div>
  )
}
