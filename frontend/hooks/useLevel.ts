import { useMemo } from 'react'
import { User } from '@/types'
import { getLevelProgress, getNextLevel } from '@/lib/utils'

export function useLevel(user: User | null) {
  const levelInfo = useMemo(() => {
    if (!user) {
      return {
        currentLevel: 1,
        nextLevel: 100,
        progress: 0,
        pointsToNext: 100,
        totalPoints: 0
      }
    }

    const currentLevel = user.level
    const nextLevel = getNextLevel(currentLevel)
    const progress = getLevelProgress(user.total_points, currentLevel)
    const currentLevelPoints = currentLevel * 100
    const pointsToNext = nextLevel - user.total_points

    return {
      currentLevel,
      nextLevel,
      progress,
      pointsToNext: Math.max(pointsToNext, 0),
      totalPoints: user.total_points,
      currentLevelThreshold: currentLevelPoints
    }
  }, [user])

  return levelInfo
}