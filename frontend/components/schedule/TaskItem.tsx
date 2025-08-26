'use client'

import { useState } from 'react'
import { Task } from '@/types'
import { getCategoryColor } from '@/lib/utils'

interface TaskItemProps {
  task: Task
  onComplete: () => Promise<void>
  onDelete: () => Promise<void>
}

export default function TaskItem({ task, onComplete, onDelete }: TaskItemProps) {
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    setLoading(true)
    try {
      await onComplete()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('このタスクを削除しますか？')) {
      await onDelete()
    }
  }

  return (
    <div className={`
      flex items-center justify-between p-4 border rounded-lg transition-all
      ${task.completed 
        ? 'bg-green-50 border-green-200 opacity-75' 
        : 'bg-white border-gray-200 hover:border-gray-300'
      }
    `}>
      <div className="flex items-center space-x-4 flex-1">
        <button
          onClick={handleComplete}
          disabled={loading}
          className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center
            ${task.completed
              ? 'bg-green-500 border-green-500 text-white hover:bg-green-400 hover:border-green-400'
              : 'border-gray-300 hover:border-indigo-500 focus:border-indigo-500'
            }
            ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {task.completed && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <span className={`
              text-lg font-medium
              ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}
            `}>
              {task.task_type.name}
            </span>
            <span className={`
              px-2 py-1 text-xs font-medium rounded-full
              ${getCategoryColor(task.task_type.category)}
            `}>
              {task.task_type.category}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 mt-1">
            <span className={`
              text-sm font-medium
              ${task.task_type.points >= 0 ? 'text-green-600' : 'text-red-600'}
            `}>
              {task.task_type.points >= 0 ? '+' : ''}{task.task_type.points}pt
            </span>
            {task.completed && (
              <span className="text-xs text-gray-500">
                完了済み
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
        title="タスクを削除"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}