'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useLevel } from '@/hooks/useLevel'
import { api } from '@/lib/api'
import { User } from '@/types'
import LevelBadge from '@/components/common/LevelBadge'

export default function ProfilePage() {
  const { user } = useAuth()
  const levelInfo = useLevel(user)
  const [profileData, setProfileData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await api.getMyProfile()
      setProfileData(data)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-0">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !profileData) {
    return (
      <div className="px-4 sm:px-0">
        <div className="text-center py-12">
          <p className="text-gray-500">プロフィールデータを読み込めませんでした</p>
        </div>
      </div>
    )
  }

  const joinDate = new Date(user.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          プロフィール
        </h1>
        <p className="text-gray-600">
          あなたの学習の進捗と統計情報を確認できます
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start space-x-6 mb-8">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-indigo-600">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.username}
                  </h2>
                  <LevelBadge level={levelInfo.currentLevel} size="lg" />
                </div>
                <p className="text-gray-600 mb-4">{user.email}</p>
                <p className="text-sm text-gray-500">
                  参加日: {joinDate}
                </p>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                レベル進捗
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    レベル {levelInfo.currentLevel}
                  </span>
                  <span className="text-sm text-gray-500">
                    {levelInfo.totalPoints} / {levelInfo.nextLevel} pt
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-indigo-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${levelInfo.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  次のレベルまで {levelInfo.pointsToNext} ポイント
                </p>
              </div>
            </div>

            {/* Profile Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                詳細情報
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ユーザー名
                  </label>
                  <p className="text-lg text-gray-900">{user.username}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    メールアドレス
                  </label>
                  <p className="text-lg text-gray-900">{user.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    現在のレベル
                  </label>
                  <div className="flex items-center space-x-2">
                    <LevelBadge level={levelInfo.currentLevel} size="md" />
                    <span className="text-lg font-semibold text-gray-900">
                      レベル {levelInfo.currentLevel}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    累計ポイント
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {levelInfo.totalPoints.toLocaleString()} pt
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Weekly Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              今週の統計
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">獲得ポイント</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {profileData.week_points || 0} pt
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(((profileData.week_points || 0) / 500) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              達成バッジ
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {levelInfo.currentLevel >= 10 && (
                <div className="text-center p-2 bg-yellow-50 rounded-lg">
                  <div className="text-2xl mb-1">🏆</div>
                  <p className="text-xs text-gray-600">レベル10</p>
                </div>
              )}
              
              {levelInfo.totalPoints >= 1000 && (
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="text-2xl mb-1">💎</div>
                  <p className="text-xs text-gray-600">1000pt</p>
                </div>
              )}
              
              {levelInfo.currentLevel >= 20 && (
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                  <div className="text-2xl mb-1">🌟</div>
                  <p className="text-xs text-gray-600">レベル20</p>
                </div>
              )}
            </div>
            
            {levelInfo.currentLevel < 10 && levelInfo.totalPoints < 1000 && (
              <p className="text-sm text-gray-500 text-center py-4">
                頑張って勉強してバッジを獲得しよう！
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              クイックアクション
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">今日のタスクを確認</p>
                    <p className="text-xs text-gray-500">スケジュール画面を開く</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">ランキングを確認</p>
                    <p className="text-xs text-gray-500">現在の順位をチェック</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}