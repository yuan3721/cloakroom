<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { roomService, Room } from '@/services/clothing'

const router = useRouter()

const rooms = ref<Room[]>([])
const loading = ref(false)
const error = ref('')

const showModal = ref(false)
const editingRoom = ref<Room | null>(null)
const saving = ref(false)

const form = reactive({
  name: '',
  description: '',
})

async function fetchRooms() {
  loading.value = true
  error.value = ''

  try {
    rooms.value = await roomService.getList()
  } catch (e: any) {
    error.value = e.response?.data?.message || '加载房间列表失败'
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  editingRoom.value = null
  form.name = ''
  form.description = ''
  showModal.value = true
}

function openEditModal(room: Room) {
  editingRoom.value = room
  form.name = room.name
  form.description = room.description || ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingRoom.value = null
}

async function handleSubmit() {
  if (!form.name.trim()) {
    error.value = '请输入房间名称'
    return
  }

  saving.value = true
  error.value = ''

  try {
    const data = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
    }

    if (editingRoom.value) {
      const updated = await roomService.update(editingRoom.value.id, data)
      const index = rooms.value.findIndex(r => r.id === editingRoom.value!.id)
      if (index > -1) {
        rooms.value[index] = updated
      }
    } else {
      const created = await roomService.create(data)
      rooms.value.push(created)
    }

    closeModal()
  } catch (e: any) {
    error.value = e.response?.data?.message || '保存失败'
  } finally {
    saving.value = false
  }
}

async function handleDelete(room: Room) {
  if (!confirm(`确定要删除房间"${room.name}"吗？\n注意：删除后该房间下的衣物将变为"未分类"。`)) {
    return
  }

  try {
    await roomService.delete(room.id)
    rooms.value = rooms.value.filter(r => r.id !== room.id)
  } catch (e: any) {
    alert(e.response?.data?.message || '删除失败')
  }
}

function goBack() {
  router.back()
}

onMounted(() => {
  fetchRooms()
})
</script>

<template>
  <div class="room-manage-page">
    <header class="page-header">
      <button @click="goBack" class="back-btn">
        ← 返回
      </button>
      <h1>房间管理</h1>
      <button @click="openAddModal" class="add-btn">
        + 添加
      </button>
    </header>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="loading" class="loading">
      加载中...
    </div>

    <div v-else-if="rooms.length === 0" class="empty">
      <p>还没有房间</p>
      <button @click="openAddModal" class="add-btn-secondary">添加第一个房间</button>
    </div>

    <div v-else class="room-list">
      <div v-for="room in rooms" :key="room.id" class="room-item">
        <div class="room-info">
          <h3>{{ room.name }}</h3>
          <p v-if="room.description">{{ room.description }}</p>
        </div>
        <div class="room-actions">
          <button @click="openEditModal(room)" class="edit-btn">编辑</button>
          <button @click="handleDelete(room)" class="delete-btn">删除</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ editingRoom ? '编辑房间' : '添加房间' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">名称 <span class="required">*</span></label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="请输入房间名称"
              required
            />
          </div>
          <div class="form-group">
            <label for="description">描述</label>
            <textarea
              id="description"
              v-model="form.description"
              placeholder="请输入房间描述（可选）"
              rows="3"
            ></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">
              取消
            </button>
            <button type="submit" class="submit-btn" :disabled="saving">
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.room-manage-page {
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
  flex: 1;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a2e;
}

.add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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

.room-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.room-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.room-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 4px;
}

.room-info p {
  font-size: 14px;
  color: #666;
}

.room-actions {
  display: flex;
  gap: 8px;
}

.edit-btn,
.delete-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn {
  background: #f3f4f6;
  color: #4a4a4a;
  border: none;
}

.edit-btn:hover {
  background: #e5e7eb;
}

.delete-btn {
  background: transparent;
  color: #dc2626;
  border: 1px solid #dc2626;
}

.delete-btn:hover {
  background: #dc2626;
  color: white;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 32px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
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
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn {
  flex: 1;
  background: #f3f4f6;
  color: #4a4a4a;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.submit-btn {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px;
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
