export interface User {
  id: number;
  email: string;
  username: string;
  level: number;
  total_points: number;
  created_at: string;
  week_points?: number;
}

export interface TaskType {
  id: number;
  category: string;
  name: string;
  points: number;
}

export interface Task {
  id: number;
  user_id: number;
  task_type: TaskType;
  date: string;
  completed: boolean;
  created_at: string;
}

export interface Checklist {
  id: number;
  title: string;
  description: string;
  deadline: string | null;
  order: number;
  completed: boolean;
}

export interface RankingUser {
  rank: number;
  username: string;
  level: number;
  points?: number;
  total_points?: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export type RankingPeriod = 'week' | 'month' | 'all';