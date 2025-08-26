import { api } from './api'
import { User } from '@/types'

export class AuthManager {
  static setToken(token: string) {
    localStorage.setItem('access_token', token)
  }

  static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('access_token')
  }

  static removeToken() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }

  static setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  static getUser(): User | null {
    if (typeof window === 'undefined') return null
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }

  static async login(email: string, password: string): Promise<User> {
    const response = await api.login(email, password)
    this.setToken(response.access_token)
    this.setUser(response.user)
    return response.user
  }

  static async register(email: string, username: string, password: string): Promise<User> {
    const response = await api.register(email, username, password)
    this.setToken(response.access_token)
    this.setUser(response.user)
    return response.user
  }

  static async logout(): Promise<void> {
    try {
      await api.logout()
    } catch (error) {
      // Ignore logout errors
    } finally {
      this.removeToken()
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      if (!this.isAuthenticated()) return null
      const user = await api.getCurrentUser()
      this.setUser(user)
      return user
    } catch (error) {
      this.removeToken()
      return null
    }
  }
}

export const auth = AuthManager