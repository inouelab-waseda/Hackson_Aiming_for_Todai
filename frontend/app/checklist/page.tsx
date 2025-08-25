'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Checklist } from '@/types'
import ChecklistCard from '@/components/checklist/ChecklistCard'

export default function ChecklistPage() {
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchChecklists()
  }, [])

  const fetchChecklists = async () => {
    try {
      setLoading(true)
      const data = await api.getChecklists()
      setChecklists(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'チェックリストの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteItem = async (checklistId: number) => {
    try {
      await api.completeChecklist(checklistId)
      setChecklists(prev => prev.map(item => 
        item.id === checklistId ? { ...item, completed: true } : item
      ))
    } catch (err) {
      console.error('Failed to complete checklist item:', err)
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-0">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
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
                  onClick={fetchChecklists}
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          受験準備チェックリスト
        </h1>
        <p className="text-gray-600">
          東大受験に必要な準備項目をチェックしましょう。忘れがちな手続きも漏れなく管理できます。
        </p>
      </div>

      <ChecklistCard
        checklists={checklists}
        onCompleteItem={handleCompleteItem}
      />

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              チェックリストについて
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• 各項目は受験準備の重要なステップです</p>
              <p>• 完了した項目にチェックを入れて進捗を管理しましょう</p>
              <p>• 期限のある項目は余裕を持って準備することをお勧めします</p>
              <p>• 不明な点があれば学校の先生や保護者に相談しましょう</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}