<script setup lang="ts">
import type { Clothing } from '@/services/clothing'

const props = defineProps<{
  clothing: Clothing
}>()

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'delete'): void
}>()

function handleDelete(event: Event) {
  event.stopPropagation()
  emit('delete')
}

function getSeasonNames() {
  if (!props.clothing.seasons || props.clothing.seasons.length === 0) {
    return '全季'
  }
  return props.clothing.seasons.map(s => s.name).join('、')
}
</script>

<template>
  <div class="clothing-card" @click="emit('click')">
    <div class="card-image">
      <img
        v-if="clothing.imageUrl"
        :src="clothing.imageUrl"
        :alt="clothing.name"
      />
      <div v-else class="no-image">
        <span>暂无图片</span>
      </div>
      <button class="delete-btn" @click="handleDelete" title="删除">
        ×
      </button>
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ clothing.name }}</h3>
      <div class="card-meta">
        <span v-if="clothing.room" class="room-tag">
          {{ clothing.room.name }}
        </span>
        <span class="season-tag">{{ getSeasonNames() }}</span>
      </div>
      <p v-if="clothing.description" class="card-description">
        {{ clothing.description }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.clothing-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.clothing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-image {
  position: relative;
  aspect-ratio: 1;
  background: #f3f4f6;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s;
}

.clothing-card:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #dc2626;
}

.card-content {
  padding: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.room-tag,
.season-tag {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.room-tag {
  background: #e0e7ff;
  color: #4338ca;
}

.season-tag {
  background: #fef3c7;
  color: #b45309;
}

.card-description {
  font-size: 13px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
