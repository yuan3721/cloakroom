import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService, User } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!accessToken.value)

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const response = await authService.login({ email, password })
      user.value = response.user
      accessToken.value = response.accessToken
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      return response.user
    } finally {
      loading.value = false
    }
  }

  async function register(email: string, password: string, username?: string) {
    loading.value = true
    try {
      const response = await authService.register({ email, password, username })
      user.value = response.user
      accessToken.value = response.accessToken
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      return response.user
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } catch (e) {
      // Ignore logout errors
    } finally {
      user.value = null
      accessToken.value = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }

  async function fetchUser() {
    if (!accessToken.value) return null
    try {
      user.value = await authService.getMe()
      return user.value
    } catch (e) {
      logout()
      return null
    }
  }

  async function updateProfile(data: { username?: string }) {
    user.value = await authService.updateProfile(data)
    return user.value
  }

  async function updateAvatar(file: File) {
    user.value = await authService.updateAvatar(file)
    return user.value
  }

  return {
    user,
    accessToken,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    updateAvatar,
  }
})
