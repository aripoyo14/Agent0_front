interface EmptyStateProps {
  message: string
  className?: string
}

export function EmptyState({ message, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex items-center justify-center pt-8 ${className}`}>
      <div className="text-sm text-gray-500">
        {message}
      </div>
    </div>
  )
}