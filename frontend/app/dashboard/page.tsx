'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useLevel } from '@/hooks/useLevel'
import { useTasks } from '@/hooks/useTasks'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { RankingUser } from '@/types'
import Link from 'next/link'
import LevelBadge from '@/components/common/LevelBadge'

export default function DashboardPage() {
  const { user } = useAuth()
  const levelInfo = useLevel(user)
  const { tasks, loading: tasksLoading } = useTasks(formatDate(new Date()))
  const [topRankings, setTopRankings] = useState<RankingUser[]>([])
  const [rankingsLoading, setRankingsLoading] = useState(true)

  useEffect(() => {
    const fetchTopRankings = async () => {
      try {
        const data = await api.getTopRankings()
        setTopRankings(data)
      } catch (error) {
        console.error('Failed to fetch top rankings:', error)
      } finally {
        setRankingsLoading(false)
      }
    }

    fetchTopRankings()
  }, [])

  const todayCompletedTasks = tasks.filter(task => task.completed).length
  const todayTotalTasks = tasks.length
  const todayPoints = tasks.filter(task => task.completed).reduce((sum, task) => sum + task.task_type.points, 0)

  const myRank = topRankings.findIndex(ranking => ranking.username === user?.username) + 1

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          おかえりなさい、{user?.username}さん
        </h1>
        <p className="mt-2 text-gray-600">
          今日も頑張って東大柱を目指しましょう！
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Level Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <LevelBadge level={levelInfo.currentLevel} size="lg" />
              <div>
                <p className="text-sm text-gray-500">現在のレベル</p>
                <p className="text-2xl font-bold text-gray-900">{levelInfo.currentLevel}</p>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            次のレベルまで {levelInfo.pointsToNext}pt
          </p>
        </div>

        {/* Total Points Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-500">累計ポイント</p>
              <p className="text-2xl font-bold text-gray-900">
                {levelInfo.totalPoints.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Today's Progress */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-500">今日の進捗</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayCompletedTasks} / {todayTotalTasks}
              </p>
              <p className="text-xs text-green-600 font-medium">
                +{todayPoints}pt
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Ranking */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-500">現在の順位</p>
              <p className="text-2xl font-bold text-gray-900">
                {myRank > 0 ? `${myRank}位` : '圏外'}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            クイックアクション
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/schedule"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
            >
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">スケジュール</span>
            </Link>

            <Link
              href="/checklist"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">チェックリスト</span>
            </Link>

            <Link
              href="/ranking"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors"
            >
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">ランキング</span>
            </Link>

            <Link
              href="/profile"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">プロフィール</span>
            </Link>
          </div>
        </div>

        {/* Top Rankings Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              トップランキング
            </h2>
            <Link
              href="/ranking"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              すべて表示
            </Link>
          </div>

          {rankingsLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {topRankings.slice(0, 5).map((ranking, index) => (
                <div key={ranking.username} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500 w-6">
                      {index + 1}.
                    </span>
                    <LevelBadge level={ranking.level} size="sm" />
                    <span className={`
                      text-sm font-medium
                      ${ranking.username === user?.username ? 'text-indigo-600' : 'text-gray-900'}
                    `}>
                      {ranking.username}
                      {ranking.username === user?.username && ' (あなた)'}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {ranking.total_points?.toLocaleString() || 0}pt
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}