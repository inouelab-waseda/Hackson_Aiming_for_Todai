interface LevelBadgeProps {
  level: number
  size?: 'sm' | 'md' | 'lg'
}

export default function LevelBadge({ level, size = 'md' }: LevelBadgeProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-lg'
  }

  const getLevelColor = (level: number) => {
    if (level >= 50) return 'bg-purple-500 text-white'
    if (level >= 30) return 'bg-blue-500 text-white'
    if (level >= 20) return 'bg-green-500 text-white'
    if (level >= 10) return 'bg-yellow-500 text-white'
    return 'bg-gray-500 text-white'
  }

  return (
    <div className={`
      ${sizeClasses[size]} 
      ${getLevelColor(level)}
      rounded-full flex items-center justify-center font-bold shadow-sm
    `}>
      {level}
    </div>
  )
}