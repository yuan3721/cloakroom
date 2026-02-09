import api from './api'

export interface Room {
  id: number
  name: string
  description?: string | null
  icon?: string | null
  displayOrder?: number
  createdAt: string
}

export interface Season {
  id: number
  name: string
  icon?: string | null
  displayOrder?: number
}

export interface Clothing {
  id: number
  name: string
  description?: string | null
  color?: string | null
  size?: string | null
  brand?: string | null
  purchaseDate?: string | null
  imageUrl?: string | null
  roomId?: number | null
  room?: Room | null
  seasons?: Season[]
  createdAt: string
  updatedAt: string
}

export interface ClothingListResponse {
  data: Clothing[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ClothingFilters {
  roomId?: number
  seasonId?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface CreateClothingData {
  name: string
  description?: string
  imageUrl?: string
  roomId?: number
  seasonIds?: number[]
}

export const clothingService = {
  async getList(filters: ClothingFilters = {}): Promise<ClothingListResponse> {
    const params = new URLSearchParams()
    
    if (filters.roomId !== undefined) params.append('roomId', String(filters.roomId))
    if (filters.seasonId !== undefined) params.append('seasonId', String(filters.seasonId))
    if (filters.search) params.append('search', filters.search)
    if (filters.sort) params.append('sort', filters.sort)
    if (filters.order) params.append('order', filters.order)
    if (filters.page) params.append('page', String(filters.page))
    if (filters.limit) params.append('limit', String(filters.limit))

    const response = await api.get(`/clothing?${params.toString()}`)
    return response.data
  },

  async getById(id: number): Promise<Clothing> {
    const response = await api.get(`/clothing/${id}`)
    return response.data
  },

  async create(data: CreateClothingData): Promise<Clothing> {
    const response = await api.post('/clothing', data)
    return response.data
  },

  async update(id: number, data: Partial<CreateClothingData>): Promise<Clothing> {
    const response = await api.put(`/clothing/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/clothing/${id}`)
  },

  async uploadImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData()
    formData.append('image', file)
    const response = await api.post('/clothing/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}

export const roomService = {
  async getList(): Promise<Room[]> {
    const response = await api.get('/rooms')
    return response.data
  },

  async create(data: { name: string; description?: string }): Promise<Room> {
    const response = await api.post('/rooms', data)
    return response.data
  },

  async update(id: number, data: { name?: string; description?: string }): Promise<Room> {
    const response = await api.put(`/rooms/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/rooms/${id}`)
  },
}

export const seasonService = {
  async getList(): Promise<Season[]> {
    const response = await api.get('/seasons')
    return response.data
  },
}
