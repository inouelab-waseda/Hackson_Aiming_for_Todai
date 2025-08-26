import { TaskType } from '@/types'

export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export const formatDisplayDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const getNextLevel = (currentLevel: number): number => {
  return (currentLevel + 1) * 100
}

export const getLevelProgress = (totalPoints: number, currentLevel: number): number => {
  const currentLevelPoints = currentLevel * 100
  const nextLevelPoints = (currentLevel + 1) * 100
  const progressPoints = totalPoints - currentLevelPoints
  const totalProgressNeeded = nextLevelPoints - currentLevelPoints
  return Math.min(Math.max(progressPoints / totalProgressNeeded * 100, 0), 100)
}

export const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    '主要科目': 'bg-blue-100 text-blue-800',
    '試験': 'bg-red-100 text-red-800', 
    '生活習慣': 'bg-green-100 text-green-800',
    '息抜き': 'bg-yellow-100 text-yellow-800',
    'ペナルティ': 'bg-gray-100 text-gray-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

export const getTaskTypesByCategory = (taskTypes: TaskType[]) => {
  return taskTypes.reduce((acc, taskType) => {
    if (!acc[taskType.category]) {
      acc[taskType.category] = []
    }
    acc[taskType.category].push(taskType)
    return acc
  }, {} as { [key: string]: TaskType[] })
}