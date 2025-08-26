'use client'

import { RankingUser, RankingPeriod } from '@/types'
import LevelBadge from '../common/LevelBadge'

interface RankingTableProps {
  rankings: RankingUser[]
  period: RankingPeriod
  loading?: boolean
}

export default function RankingTable({ rankings, period, loading }: RankingTableProps) {
  const getPointsLabel = () => {
    switch (period) {
      case 'week':
        return '今週のポイント'
      case 'month':
        return '今月のポイント'
      case 'all':
        return '累計ポイント'
      default:
        return 'ポイント'
    }
  }

  const getPointsValue = (user: RankingUser) => {
    if (period === 'all') {
      return user.total_points || 0
    }
    return user.points || 0
  }

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank.toString()
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (rankings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 text-center">
          <p className="text-gray-500">ランキングデータがありません</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          ランキング - {getPointsLabel()}
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {rankings.map((user, index) => (
          <div 
            key={`${user.username}-${index}`}
            className={`
              flex items-center justify-between p-4 hover:bg-gray-50 transition-colors
              ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''}
            `}
          >
            <div className="flex items-center space-x-4">
              <div className={`
                w-8 h-8 flex items-center justify-center font-bold text-lg
                ${user.rank <= 3 ? 'text-2xl' : 'text-gray-600'}
              `}>
                {getRankDisplay(user.rank)}
              </div>

              <div className="flex items-center space-x-3">
                <LevelBadge level={user.level} size="md" />
                <div>
                  <p className="font-medium text-gray-900">
                    {user.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    レベル {user.level}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-lg text-gray-900">
                {getPointsValue(user).toLocaleString()}pt
              </p>
              {period !== 'all' && user.total_points && (
                <p className="text-sm text-gray-500">
                  累計: {user.total_points.toLocaleString()}pt
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {rankings.length >= 100 && (
        <div className="p-4 bg-gray-50 text-center">
          <p className="text-sm text-gray-500">
            上位100位までを表示しています
          </p>
        </div>
      )}
    </div>
  )
}