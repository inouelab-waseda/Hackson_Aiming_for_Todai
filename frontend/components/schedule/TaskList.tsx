'use client'

import { Task } from '@/types'
import TaskItem from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  onCompleteTask: (taskId: number) => Promise<void>
  onDeleteTask: (taskId: number) => Promise<void>
}

export default function TaskList({ tasks, onCompleteTask, onDeleteTask }: TaskListProps) {
  const completedTasks = tasks.filter(task => task.completed)
  const incompleteTasks = tasks.filter(task => !task.completed)

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">今日のタスクはまだ追加されていません</p>
        <p className="text-sm text-gray-400 mt-2">「タスクを追加」ボタンから新しいタスクを追加しましょう</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 未完了タスク */}
      {incompleteTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            未完了のタスク ({incompleteTasks.length})
          </h3>
          <div className="space-y-2">
            {incompleteTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={() => onCompleteTask(task.id)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 完了タスク */}
      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-green-700 mb-3">
            完了したタスク ({completedTasks.length})
          </h3>
          <div className="space-y-2">
            {completedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={() => onCompleteTask(task.id)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}