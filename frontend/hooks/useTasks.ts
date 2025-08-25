import { useState, useEffect } from 'react'
import { Task, TaskType } from '@/types'
import { api } from '@/lib/api'
import { useAuth } from './useAuth'

export function useTasks(date?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, updateUser } = useAuth()

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const [tasksData, taskTypesData] = await Promise.all([
        api.getTasks(date),
        api.getTaskTypes()
      ])
      setTasks(tasksData)
      setTaskTypes(taskTypesData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchTasks()
    }
  }, [user, date])

  const createTask = async (taskTypeId: number, taskDate: string) => {
    try {
      const newTask = await api.createTask(taskTypeId, taskDate)
      setTasks(prev => [...prev, newTask])
      return newTask
    } catch (err) {
      throw err
    }
  }

  const deleteTask = async (taskId: number) => {
    try {
      await api.deleteTask(taskId)
      setTasks(prev => prev.filter(task => task.id !== taskId))
    } catch (err) {
      throw err
    }
  }

  const completeTask = async (taskId: number) => {
    try {
      const response = await api.completeTask(taskId)
      setTasks(prev => prev.map(task => 
        task.id === taskId ? response.task : task
      ))
      updateUser(response.user)
      return response
    } catch (err) {
      throw err
    }
  }

  return {
    tasks,
    taskTypes,
    loading,
    error,
    createTask,
    deleteTask,
    completeTask,
    refetch: fetchTasks
  }
}