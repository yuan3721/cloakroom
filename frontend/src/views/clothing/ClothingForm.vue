<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { clothingService, roomService, seasonService, Room, Season } from '@/services/clothing'
import SeasonSelector from '@/components/clothing/SeasonSelector.vue'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const id = computed(() => Number(route.params.id))

const rooms = ref<Room[]>([])
const seasons = ref<Season[]>([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  description: '',
  imageUrl: '',
  roomId: undefined as number | undefined,
  seasonIds: [] as number[],
})

const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

async function fetchData() {
  loading.value = true
  try {
    const [roomsData, seasonsData] = await Promise.all([
      roomService.getList(),
      seasonService.getList(),
    ])
    rooms.value = roomsData
    seasons.value = seasonsData

    if (isEdit.value) {
      const clothing = await clothingService.getById(id.value)
      form.name = clothing.name
      form.description = clothing.description || ''
      form.imageUrl = clothing.imageUrl || ''
      form.roomId = clothing.roomId || undefined
      form.seasonIds = clothing.seasons?.map(s => s.id) || []
      
      if (form.imageUrl) {
        imagePreview.value = form.imageUrl
      }
    }
  } catch (e: any) {
    error.value = e.response?.data?.message || '加载数据失败'
  } finally {
    loading.value = false
  }
}

function handleImageChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (file) {
    imageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function removeImage() {
  imageFile.value = null
  imagePreview.value = null
  form.imageUrl = ''
}

async function handleSubmit() {
  if (!form.name.trim()) {
    error.value = '请输入衣物名称'
    return
  }

  saving.value = true
  error.value = ''

  try {
    // First upload image if there's a new one
    let imageUrl = form.imageUrl
    if (imageFile.value) {
      const uploaded = await clothingService.uploadImage(imageFile.value)
      imageUrl = uploaded.imageUrl
    }

    const data = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      imageUrl: imageUrl || undefined,
      roomId: form.roomId,
      seasonIds: form.seasonIds.length > 0 ? form.seasonIds : undefined,
    }

    if (isEdit.value) {
      await clothingService.update(id.value, data)
    } else {
      await clothingService.create(data)
    }

    router.push('/clothing')
  } catch (e: any) {
    error.value = e.response?.data?.message || '保存失败'
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.back()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="clothing-form-page">
    <header class="page-header">
      <button @click="goBack" class="back-btn">
        ← 返回
      </button>
      <h1>{{ isEdit ? '编辑衣物' : '添加衣物' }}</h1>
    </header>

    <div v-if="loading" class="loading">
      加载中...
    </div>

    <form v-else @submit.prevent="handleSubmit" class="form-content">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="form-group">
        <label for="name">名称 <span class="required">*</span></label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="请输入衣物名称"
          required
        />
      </div>

      <div class="form-group">
        <label for="description">描述</label>
        <textarea
          id="description"
          v-model="form.description"
          placeholder="请输入衣物描述（可选）"
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label>图片</label>
        <div class="image-upload">
          <div v-if="imagePreview" class="image-preview">
            <img :src="imagePreview" alt="预览" />
            <button type="button" @click="removeImage" class="remove-image">×</button>
          </div>
          <label v-else class="upload-area">
            <input
              type="file"
              accept="image/*"
              @change="handleImageChange"
              hidden
            />
            <span>点击上传图片</span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label for="room">房间</label>
        <select id="room" v-model="form.roomId">
          <option :value="undefined">请选择房间</option>
          <option v-for="room in rooms" :key="room.id" :value="room.id">
            {{ room.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>适用季节</label>
        <SeasonSelector
          :seasons="seasons"
          v-model="form.seasonIds"
        />
      </div>

      <div class="form-actions">
        <button type="button" @click="goBack" class="cancel-btn">
          取消
        </button>
        <button type="submit" class="submit-btn" :disabled="saving">
          {{ saving ? '保存中...' : '保存' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.clothing-form-page {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
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

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a2e;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.form-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #4a4a4a;
  margin-bottom: 8px;
}

.required {
  color: #dc2626;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.image-upload {
  width: 100%;
}

.upload-area {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.upload-area:hover {
  border-color: #667eea;
  background: #f9fafb;
}

.upload-area span {
  color: #666;
  font-size: 16px;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #f3f4f6;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s;
}

.remove-image:hover {
  background: #dc2626;
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.cancel-btn {
  flex: 1;
  background: #f3f4f6;
  color: #4a4a4a;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.submit-btn {
  flex: 2;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
