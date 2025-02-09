interface StatProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isUpward: boolean;
  };
  className?: string;
}

export function Stat({ title, value, trend, className = '' }: StatProps) {
  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      {trend && (
        <div className="mt-2 flex items-center space-x-2">
          {trend.isUpward ? (
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
            </svg>
          )}
          <span className={`text-sm font-medium ${trend.isUpward ? 'text-green-600' : 'text-red-600'}`}>
            {trend.value}%
          </span>
        </div>
      )}
    </div>
  );
} 