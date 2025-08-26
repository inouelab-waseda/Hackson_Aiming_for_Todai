'use client'

import { useState } from 'react'
import { Checklist } from '@/types'
import ChecklistItem from './ChecklistItem'

interface ChecklistCardProps {
  checklists: Checklist[]
  onCompleteItem: (checklistId: number) => Promise<void>
}

export default function ChecklistCard({ checklists, onCompleteItem }: ChecklistCardProps) {
  const completedCount = checklists.filter(item => item.completed).length
  const progressPercentage = checklists.length > 0 ? (completedCount / checklists.length) * 100 : 0

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            受験準備チェックリスト
          </h2>
          <span className="text-sm text-gray-500">
            {completedCount} / {checklists.length} 完了
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          進捗: {Math.round(progressPercentage)}%
        </p>
      </div>

      <div className="p-6">
        {checklists.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">チェックリストが読み込まれていません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {checklists.map((checklist, index) => (
              <ChecklistItem
                key={checklist.id}
                checklist={checklist}
                index={index + 1}
                onComplete={() => onCompleteItem(checklist.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}