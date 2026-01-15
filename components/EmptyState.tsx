import { Search, Filter, MapPin } from 'lucide-react'

interface EmptyStateProps {
  type?: 'no-results' | 'no-providers' | 'no-county'
  message?: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ 
  type = 'no-results', 
  message,
  actionLabel,
  onAction 
}: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case 'no-results':
        return {
          icon: Search,
          title: 'No providers found',
          description: message || 'Try adjusting your search or filters to find more providers.',
          actionLabel: actionLabel || 'Clear Filters',
        }
      case 'no-providers':
        return {
          icon: MapPin,
          title: 'No providers available',
          description: message || 'There are no providers in the directory yet.',
          actionLabel: actionLabel || 'View All Counties',
        }
      case 'no-county':
        return {
          icon: Filter,
          title: 'No providers in this county',
          description: message || 'Try selecting a different county or clearing your filters.',
          actionLabel: actionLabel || 'Clear Filters',
        }
      default:
        return {
          icon: Search,
          title: 'No results',
          description: message || 'No items match your criteria.',
          actionLabel: actionLabel || 'Clear Filters',
        }
    }
  }

  const content = getContent()
  const Icon = content.icon

  return (
    <div className="text-center py-12 sm:py-16 md:py-20" role="status" aria-live="polite">
      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent mb-4 sm:mb-6">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
        {content.title}
      </h3>
      <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
        {content.description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:bg-foreground/90 transition-colors"
          aria-label={content.actionLabel}
        >
          {content.actionLabel}
        </button>
      )}
    </div>
  )
}
