'use client'

import { useState, useEffect } from 'react'
import { TaskType } from '@/types'
import { getTaskTypesByCategory, getCategoryColor } from '@/lib/utils'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTask: (taskTypeId: number) => Promise<void>
  taskTypes: TaskType[]
  selectedDate: string
}

export default function AddTaskModal({ 
  isOpen, 
  onClose, 
  onAddTask, 
  taskTypes, 
  selectedDate 
}: AddTaskModalProps) {
  const [selectedTaskTypeId, setSelectedTaskTypeId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const taskTypesByCategory = getTaskTypesByCategory(taskTypes)

  useEffect(() => {
    if (isOpen) {
      setSelectedTaskTypeId(null)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTaskTypeId) return

    setLoading(true)
    try {
      await onAddTask(selectedTaskTypeId)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            タスクを追加
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-96 overflow-y-auto">
            <p className="text-sm text-gray-600 mb-4">
              日付: {new Date(selectedDate).toLocaleDateString('ja-JP')}
            </p>

            <div className="space-y-6">
              {Object.entries(taskTypesByCategory).map(([category, types]) => (
                <div key={category}>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {types.map(taskType => (
                      <label
                        key={taskType.id}
                        className={`
                          relative flex items-center p-4 border rounded-lg cursor-pointer transition-all
                          ${selectedTaskTypeId === taskType.id
                            ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="taskType"
                          value={taskType.id}
                          checked={selectedTaskTypeId === taskType.id}
                          onChange={() => setSelectedTaskTypeId(taskType.id)}
                          className="sr-only"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {taskType.name}
                            </span>
                            <span className={`
                              px-2 py-1 text-xs font-medium rounded-full
                              ${getCategoryColor(taskType.category)}
                            `}>
                              {taskType.category}
                            </span>
                          </div>
                          <span className={`
                            text-sm font-medium mt-1
                            ${taskType.points >= 0 ? 'text-green-600' : 'text-red-600'}
                          `}>
                            {taskType.points >= 0 ? '+' : ''}{taskType.points}pt
                          </span>
                        </div>

                        {selectedTaskTypeId === taskType.id && (
                          <div className="absolute top-2 right-2">
                            <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 p-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!selectedTaskTypeId || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '追加中...' : 'タスクを追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}