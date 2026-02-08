import { request } from './api'

export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams {
  email: string
  password: string
  name: string
}

export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface AuthResponse {
  token: string
  user: User
}

export const authService = {
  login: (data: LoginParams) =>
    request.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterParams) =>
    request.post<AuthResponse>('/auth/register', data),

  getMe: () =>
    request.get<User>('/auth/me'),

  logout: () => {
    localStorage.removeItem('token')
  },
}
