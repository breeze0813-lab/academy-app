interface EmptyStateProps {
    icon?: string;
    message: string;
    description?: string;
}

export default function EmptyState({ icon = '📝', message, description }: EmptyStateProps) {
    return (
          <div className="card text-center py-16">
                <div className="text-4xl mb-3">{icon}</div>div>
                <p className="text-gray-500 font-medium">{message}</p>p>
            {description && (
                    <p className="text-gray-400 text-sm mt-1">{description}</p>p>
                )}
          </div>div>
        );
}</div>
