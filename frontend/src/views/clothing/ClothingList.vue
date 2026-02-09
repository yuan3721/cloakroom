<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { clothingService, roomService, seasonService, Clothing, Room, Season } from '@/services/clothing'
import ClothingCard from '@/components/clothing/ClothingCard.vue'
import FilterPanel from '@/components/clothing/FilterPanel.vue'

const router = useRouter()

const clothingList = ref<Clothing[]>([])
const rooms = ref<Room[]>([])
const seasons = ref<Season[]>([])
const loading = ref(false)
const error = ref('')

// Filter state
const filters = ref({
  roomId: undefined as number | undefined,
  seasonId: undefined as number | undefined,
  search: '',
})

// Pagination
const page = ref(1)
const limit = ref(20)
const total = ref(0)
const hasMore = ref(false)

async function fetchClothing(reset = false) {
  if (reset) {
    page.value = 1
    clothingList.value = []
  }

  loading.value = true
  error.value = ''

  try {
    const response = await clothingService.getList({
      page: page.value,
      limit: limit.value,
      roomId: filters.value.roomId,
      seasonId: filters.value.seasonId,
      search: filters.value.search || undefined,
    })
    
    if (reset) {
      clothingList.value = response.data
    } else {
      clothingList.value.push(...response.data)
    }
    
    total.value = response.pagination.total
    hasMore.value = page.value < response.pagination.pages
  } catch (e: any) {
    error.value = e.response?.data?.message || '加载衣物列表失败'
  } finally {
    loading.value = false
  }
}

async function fetchFilters() {
  try {
    const [roomsData, seasonsData] = await Promise.all([
      roomService.getList(),
      seasonService.getList(),
    ])
    rooms.value = roomsData
    seasons.value = seasonsData
  } catch (e) {
    console.error('Failed to load filter data', e)
  }
}

function loadMore() {
  if (hasMore.value && !loading.value) {
    page.value++
    fetchClothing()
  }
}

function handleFilterChange(newFilters: { roomId?: number; seasonId?: number; search: string }) {
  filters.value = {
    roomId: newFilters.roomId,
    seasonId: newFilters.seasonId,
    search: newFilters.search,
  }
  fetchClothing(true)
}

function goToAdd() {
  router.push('/clothing/new')
}

function goToDetail(id: number) {
  router.push(`/clothing/${id}`)
}

async function handleDelete(id: number) {
  if (!confirm('确定要删除这件衣物吗？')) return
  
  try {
    await clothingService.delete(id)
    clothingList.value = clothingList.value.filter(c => c.id !== id)
    total.value--
  } catch (e: any) {
    alert(e.response?.data?.message || '删除失败')
  }
}

onMounted(() => {
  fetchFilters()
  fetchClothing(true)
})

watch(() => filters.value.search, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    // Debounce search
    const timer = setTimeout(() => {
      if (filters.value.search === newVal) {
        fetchClothing(true)
      }
    }, 300)
    return () => clearTimeout(timer)
  }
})
</script>

<template>
  <div class="clothing-list-page">
    <header class="page-header">
      <h1>我的衣橱</h1>
      <button @click="goToAdd" class="add-btn">
        <span>+</span> 添加衣物
      </button>
    </header>

    <FilterPanel
      :rooms="rooms"
      :seasons="seasons"
      :filters="filters"
      @change="handleFilterChange"
    />

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="loading && clothingList.length === 0" class="loading">
      加载中...
    </div>

    <div v-else-if="clothingList.length === 0" class="empty">
      <p>还没有衣物</p>
      <button @click="goToAdd" class="add-btn-secondary">添加第一件衣物</button>
    </div>

    <div v-else class="clothing-grid">
      <ClothingCard
        v-for="item in clothingList"
        :key="item.id"
        :clothing="item"
        @click="goToDetail(item.id)"
        @delete="handleDelete(item.id)"
      />
    </div>

    <div v-if="hasMore" class="load-more">
      <button @click="loadMore" :disabled="loading">
        {{ loading ? '加载中...' : '加载更多' }}
      </button>
    </div>

    <div v-if="total > 0" class="total-count">
      共 {{ total }} 件衣物
    </div>
  </div>
</template>

<style scoped>
.clothing-list-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a2e;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.add-btn span {
  font-size: 20px;
  font-weight: 600;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.loading,
.empty {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty p {
  font-size: 18px;
  margin-bottom: 16px;
}

.add-btn-secondary {
  background: #f3f4f6;
  color: #667eea;
  padding: 12px 24px;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn-secondary:hover {
  background: #667eea;
  color: white;
}

.clothing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.load-more {
  text-align: center;
  margin-top: 32px;
}

.load-more button {
  background: #f3f4f6;
  color: #4a4a4a;
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.load-more button:hover:not(:disabled) {
  background: #e5e7eb;
}

.load-more button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.total-count {
  text-align: center;
  margin-top: 24px;
  color: #888;
  font-size: 14px;
}
</style>
