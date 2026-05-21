interface LoadingSpinnerProps {
    message?: string;
}

export default function LoadingSpinner({ message = '불러오는 중...' }: LoadingSpinnerProps) {
    return (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-3" />
                <span className="text-sm">{message}</span>span>
          </div>div>
        );
}</div>
