'use client'

import { useState } from 'react'
import { Checklist } from '@/types'
import { formatDisplayDate } from '@/lib/utils'

interface ChecklistItemProps {
  checklist: Checklist
  index: number
  onComplete: () => Promise<void>
}

export default function ChecklistItem({ checklist, index, onComplete }: ChecklistItemProps) {
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    setLoading(true)
    try {
      await onComplete()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`
      flex items-start space-x-4 p-4 border rounded-lg transition-all
      ${checklist.completed 
        ? 'bg-green-50 border-green-200' 
        : 'bg-white border-gray-200 hover:border-gray-300'
      }
    `}>
      <button
        onClick={handleComplete}
        disabled={loading}
        className={`
          mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
          ${checklist.completed
            ? 'bg-green-500 border-green-500 text-white hover:bg-green-400 hover:border-green-400'
            : 'border-gray-300 hover:border-indigo-500 focus:border-indigo-500'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {checklist.completed && (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">
                {index}.
              </span>
              <h3 className={`
                font-medium text-base
                ${checklist.completed ? 'line-through text-gray-500' : 'text-gray-900'}
              `}>
                {checklist.title}
              </h3>
            </div>
            
            {checklist.description && (
              <p className={`
                mt-1 text-sm
                ${checklist.completed ? 'text-gray-400' : 'text-gray-600'}
              `}>
                {checklist.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 mt-2">
              {checklist.deadline && (
                <span className={`
                  text-xs px-2 py-1 rounded-full
                  ${checklist.completed 
                    ? 'bg-gray-100 text-gray-500'
                    : new Date(checklist.deadline) < new Date()
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                  }
                `}>
                  期限: {formatDisplayDate(checklist.deadline)}
                </span>
              )}
              
              {checklist.completed && (
                <span className="text-xs text-green-600 font-medium">
                  ✓ 完了
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}