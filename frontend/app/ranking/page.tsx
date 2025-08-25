'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { RankingUser, RankingPeriod } from '@/types'
import RankingTable from '@/components/ranking/RankingTable'

export default function RankingPage() {
  const [rankings, setRankings] = useState<RankingUser[]>([])
  const [period, setPeriod] = useState<RankingPeriod>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRankings()
  }, [period])

  const fetchRankings = async () => {
    try {
      setLoading(true)
      const data = await api.getRankings(period)
      setRankings(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ランキングの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const getPeriodLabel = (p: RankingPeriod) => {
    switch (p) {
      case 'week': return '今週'
      case 'month': return '今月'
      case 'all': return '累計'
      default: return '累計'
    }
  }

  if (error) {
    return (
      <div className="px-4 sm:px-0">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">エラーが発生しました</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchRankings}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 text-sm font-medium rounded-md transition-colors"
                >
                  再試行
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ランキング
            </h1>
            <p className="text-gray-600">
              全国の受験生と競い合い、モチベーションを高めましょう
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['week', 'month', 'all'] as RankingPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`
                  px-4 py-2 text-sm font-medium rounded-md transition-colors
                  ${period === p
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {getPeriodLabel(p)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-yellow-100 text-sm">1位</p>
              <p className="text-2xl font-bold">
                {rankings[0]?.username || '---'}
              </p>
            </div>
            <div className="text-4xl">🥇</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-gray-100 text-sm">2位</p>
              <p className="text-2xl font-bold">
                {rankings[1]?.username || '---'}
              </p>
            </div>
            <div className="text-4xl">🥈</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-orange-100 text-sm">3位</p>
              <p className="text-2xl font-bold">
                {rankings[2]?.username || '---'}
              </p>
            </div>
            <div className="text-4xl">🥉</div>
          </div>
        </div>
      </div>

      {/* Ranking Table */}
      <RankingTable
        rankings={rankings}
        period={period}
        loading={loading}
      />

      {/* Motivation Section */}
      <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-indigo-800 mb-2">
              ランキング上位を目指すコツ
            </h3>
            <div className="text-sm text-indigo-700 space-y-1">
              <p>• 毎日コツコツとタスクを継続することが重要です</p>
              <p>• 主要科目（英語・数学・国語）は高ポイントなので優先的に取り組みましょう</p>
              <p>• 模試受験や過去問演習でまとまったポイントを獲得できます</p>
              <p>• 生活習慣を整えることも着実にポイントに繋がります</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}