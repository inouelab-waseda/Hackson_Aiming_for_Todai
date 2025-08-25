import { AuthResponse, User, Task, TaskType, Checklist, RankingUser, RankingPeriod } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

class ApiClient {
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }
    
    return headers
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const headers = {
      ...this.getAuthHeaders(),
      ...(options.headers as Record<string, string> || {}),
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }))
      throw new Error(error.message || 'Something went wrong')
    }

    return response.json()
  }

  // Auth
  async register(email: string, username: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    })
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    })
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/api/auth/me')
  }

  // Tasks
  async getTasks(date?: string): Promise<Task[]> {
    const params = date ? `?date=${date}` : ''
    return this.request<Task[]>(`/api/tasks${params}`)
  }

  async createTask(taskTypeId: number, date: string): Promise<Task> {
    return this.request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ task_type_id: taskTypeId, date }),
    })
  }

  async deleteTask(taskId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
  }

  async completeTask(taskId: number): Promise<{ task: Task; user: User }> {
    return this.request<{ task: Task; user: User }>(`/api/tasks/${taskId}/complete`, {
      method: 'PUT',
    })
  }

  // Task Types
  async getTaskTypes(): Promise<TaskType[]> {
    return this.request<TaskType[]>('/api/task-types')
  }

  // Checklists
  async getChecklists(): Promise<Checklist[]> {
    return this.request<Checklist[]>('/api/checklists')
  }

  async completeChecklist(checklistId: number): Promise<Checklist> {
    return this.request<Checklist>(`/api/checklists/${checklistId}/complete`, {
      method: 'PUT',
    })
  }

  // Profile
  async getMyProfile(): Promise<User> {
    return this.request<User>('/api/users/profile')
  }

  async getUserProfile(userId: number): Promise<User> {
    return this.request<User>(`/api/users/${userId}/profile`)
  }

  // Rankings
  async getRankings(period: RankingPeriod = 'all'): Promise<RankingUser[]> {
    return this.request<RankingUser[]>(`/api/rankings?period=${period}`)
  }

  async getTopRankings(): Promise<RankingUser[]> {
    return this.request<RankingUser[]>('/api/rankings/top')
  }
}

export const api = new ApiClient()