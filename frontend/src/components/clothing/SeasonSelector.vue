<script setup lang="ts">
import { computed } from 'vue'
import type { Season } from '@/services/clothing'

const props = defineProps<{
  seasons: Season[]
  modelValue: number[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[]): void
}>()

const selectedIds = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function toggleSeason(seasonId: number) {
  const newValue = [...selectedIds.value]
  const index = newValue.indexOf(seasonId)
  
  if (index > -1) {
    newValue.splice(index, 1)
  } else {
    newValue.push(seasonId)
  }
  
  emit('update:modelValue', newValue)
}

function isSelected(seasonId: number) {
  return selectedIds.value.includes(seasonId)
}
</script>

<template>
  <div class="season-selector">
    <button
      v-for="season in seasons"
      :key="season.id"
      type="button"
      :class="['season-btn', { selected: isSelected(season.id) }]"
      @click="toggleSeason(season.id)"
    >
      {{ season.name }}
    </button>
    <p v-if="selectedIds.length === 0" class="hint">
      不选择表示全季适用
    </p>
  </div>
</template>

<style scoped>
.season-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.season-btn {
  padding: 10px 20px;
  border: 2px solid #ddd;
  border-radius: 24px;
  background: white;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.season-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.season-btn.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
}

.hint {
  width: 100%;
  font-size: 13px;
  color: #999;
  margin: 8px 0 0 0;
}
</style>
