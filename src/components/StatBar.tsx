interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'orange';
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  critical?: boolean; // Pulses when low
}

const colorClasses = {
  red: 'bg-red-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
};

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export function StatBar({
  label,
  value,
  maxValue = 100,
  color = 'blue',
  showValue = true,
  size = 'md',
  critical = false,
}: StatBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  const isCritical = critical && value <= 20;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-300">{label}</span>
        {showValue && (
          <span className={`text-sm font-mono ${isCritical ? 'text-red-400' : 'text-gray-400'}`}>
            {Math.round(value)}
          </span>
        )}
      </div>
      <div className={`stat-bar ${sizeClasses[size]}`}>
        <div
          className={`stat-bar-fill ${colorClasses[color]} ${isCritical ? 'animate-pulse' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
