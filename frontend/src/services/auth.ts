import api from './api'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  username?: string
}

export interface User {
  id: string
  email: string
  username: string | null
  avatar: string | null
  avatarUrl?: string | null  // alias for avatar
  createdAt?: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data)
    return response.data.data
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data)
    return response.data.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async getMe(): Promise<User> {
    const response = await api.get('/users/me')
    return response.data.data
  },

  async updateProfile(data: { username?: string }): Promise<User> {
    const response = await api.put('/users/me', data)
    return response.data.data
  },

  async updateAvatar(file: File): Promise<User> {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await api.put('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  },
}
