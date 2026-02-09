<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { clothingService, Clothing } from '@/services/clothing'

const router = useRouter()
const route = useRoute()

const clothing = ref<Clothing | null>(null)
const loading = ref(true)
const error = ref('')

const id = Number(route.params.id)

async function fetchClothing() {
  loading.value = true
  error.value = ''

  try {
    clothing.value = await clothingService.getById(id)
  } catch (e: any) {
    error.value = e.response?.data?.message || '加载衣物详情失败'
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  if (!confirm('确定要删除这件衣物吗？')) return

  try {
    await clothingService.delete(id)
    router.push('/clothing')
  } catch (e: any) {
    alert(e.response?.data?.message || '删除失败')
  }
}

function goToEdit() {
  router.push(`/clothing/${id}/edit`)
}

function goBack() {
  router.push('/clothing')
}

function getSeasonNames() {
  if (!clothing.value?.seasons || clothing.value.seasons.length === 0) {
    return '全季'
  }
  return clothing.value.seasons.map(s => s.name).join('、')
}

onMounted(() => {
  fetchClothing()
})
</script>

<template>
  <div class="clothing-detail-page">
    <header class="page-header">
      <button @click="goBack" class="back-btn">
        ← 返回列表
      </button>
    </header>

    <div v-if="loading" class="loading">
      加载中...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="clothing" class="detail-content">
      <div class="detail-image">
        <img
          v-if="clothing.imageUrl"
          :src="clothing.imageUrl"
          :alt="clothing.name"
        />
        <div v-else class="no-image">
          <span>暂无图片</span>
        </div>
      </div>

      <div class="detail-info">
        <h1 class="detail-title">{{ clothing.name }}</h1>

        <div class="detail-meta">
          <div v-if="clothing.room" class="meta-item">
            <span class="meta-label">房间</span>
            <span class="room-tag">{{ clothing.room.name }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">季节</span>
            <span class="season-tag">{{ getSeasonNames() }}</span>
          </div>
        </div>

        <div v-if="clothing.description" class="detail-description">
          <h3>描述</h3>
          <p>{{ clothing.description }}</p>
        </div>

        <div class="detail-actions">
          <button @click="goToEdit" class="edit-btn">
            编辑
          </button>
          <button @click="handleDelete" class="delete-btn">
            删除
          </button>
        </div>

        <div class="detail-footer">
          <p>添加时间：{{ new Date(clothing.createdAt).toLocaleString() }}</p>
          <p>更新时间：{{ new Date(clothing.updatedAt).toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clothing-detail-page {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.back-btn {
  background: none;
  border: none;
  color: #667eea;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #4c51bf;
}

.loading,
.error-message {
  text-align: center;
  padding: 60px 20px;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  border-radius: 8px;
}

.detail-content {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.detail-image {
  width: 100%;
  aspect-ratio: 16/9;
  background: #f3f4f6;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 18px;
}

.detail-info {
  padding: 32px;
}

.detail-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 24px;
}

.detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 24px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-label {
  font-size: 14px;
  color: #666;
}

.room-tag {
  display: inline-block;
  background: #e0e7ff;
  color: #4338ca;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
}

.season-tag {
  display: inline-block;
  background: #fef3c7;
  color: #b45309;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
}

.detail-description {
  margin-bottom: 32px;
}

.detail-description h3 {
  font-size: 16px;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 8px;
}

.detail-description p {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
}

.detail-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.edit-btn {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.delete-btn {
  flex: 1;
  background: #f3f4f6;
  color: #dc2626;
  padding: 14px;
  border: 2px solid #dc2626;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #dc2626;
  color: white;
}

.detail-footer {
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.detail-footer p {
  font-size: 13px;
  color: #999;
  margin: 4px 0;
}

@media (max-width: 640px) {
  .detail-actions {
    flex-direction: column;
  }
}
</style>
