'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useLevel } from '@/hooks/useLevel'
import LevelBadge from './LevelBadge'

export default function Header() {
  const { user, logout } = useAuth()
  const levelInfo = useLevel(user)

  if (!user) return null

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
              東大柱育成アプリ
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                ダッシュボード
              </Link>
              <Link href="/schedule" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                スケジュール
              </Link>
              <Link href="/checklist" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                チェックリスト
              </Link>
              <Link href="/ranking" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                ランキング
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <LevelBadge level={levelInfo.currentLevel} />
              <span className="text-sm text-gray-600">
                {levelInfo.totalPoints}pt
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link href="/profile" className="text-gray-700 hover:text-indigo-600">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </Link>
              
              <button
                onClick={logout}
                className="text-gray-700 hover:text-red-600 text-sm"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600">
            ダッシュボード
          </Link>
          <Link href="/schedule" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600">
            スケジュール
          </Link>
          <Link href="/checklist" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600">
            チェックリスト
          </Link>
          <Link href="/ranking" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600">
            ランキング
          </Link>
        </div>
      </div>
    </header>
  )
}