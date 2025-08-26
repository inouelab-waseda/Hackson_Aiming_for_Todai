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
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (jsonError) {
          // JSON解析に失敗した場合はHTTPエラーメッセージを使用
          console.warn('Failed to parse error response as JSON:', jsonError)
        }
        
        throw new Error(errorMessage)
      }

      return response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('サーバーに接続できません。サーバーが起動しているか確認してください。')
      }
      throw error
    }
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

  async toggleTaskCompletion(taskId: number): Promise<{ task: Task; user: User }> {
    return this.request<{ task: Task; user: User }>(`/api/tasks/${taskId}/complete`, {
      method: 'PUT',
    })
  }

  // 後方互換性のため古い名前も残す
  async completeTask(taskId: number): Promise<{ task: Task; user: User }> {
    return this.toggleTaskCompletion(taskId)
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
    return this.request<Checklist>(`/api/checklists/${checklistId}/toggle`, {
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