<script setup lang="ts">
import { computed } from 'vue'
import type { Room, Season } from '@/services/clothing'

const props = defineProps<{
  rooms: Room[]
  seasons: Season[]
  filters: {
    roomId?: number
    seasonId?: number
    search: string
  }
}>()

const emit = defineEmits<{
  (e: 'change', filters: typeof props.filters): void
}>()

function updateFilter(key: keyof typeof props.filters, value: any) {
  emit('change', { ...props.filters, [key]: value })
}

function clearFilters() {
  emit('change', {
    roomId: undefined,
    seasonId: undefined,
    search: '',
  })
}

const hasActiveFilters = computed(() => {
  return props.filters.roomId || props.filters.seasonId || props.filters.search
})
</script>

<template>
  <div class="filter-panel">
    <div class="filter-row">
      <div class="filter-group">
        <label>搜索</label>
        <input
          type="text"
          :value="filters.search"
          @input="updateFilter('search', ($event.target as HTMLInputElement).value)"
          placeholder="搜索衣物名称..."
          class="search-input"
        />
      </div>

      <div class="filter-group">
        <label>房间</label>
        <select
          :value="filters.roomId"
          @change="updateFilter('roomId', Number(($event.target as HTMLSelectElement).value) || undefined)"
        >
          <option :value="undefined">全部房间</option>
          <option v-for="room in rooms" :key="room.id" :value="room.id">
            {{ room.name }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>季节</label>
        <select
          :value="filters.seasonId"
          @change="updateFilter('seasonId', Number(($event.target as HTMLSelectElement).value) || undefined)"
        >
          <option :value="undefined">全部季节</option>
          <option v-for="season in seasons" :key="season.id" :value="season.id">
            {{ season.name }}
          </option>
        </select>
      </div>

      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="clear-btn"
      >
        清除筛选
      </button>
    </div>
  </div>
</template>

<style scoped>
.filter-panel {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 150px;
}

.filter-group label {
  font-size: 13px;
  font-weight: 500;
  color: #666;
}

.search-input,
.filter-group select {
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus,
.filter-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.clear-btn {
  background: #f3f4f6;
  color: #666;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.clear-btn:hover {
  background: #e5e7eb;
}

@media (max-width: 640px) {
  .filter-group {
    min-width: 100%;
  }

  .clear-btn {
    width: 100%;
  }
}
</style>
