<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const saving = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({
  username: '',
})

const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)

function initForm() {
  if (authStore.user) {
    form.username = authStore.user.username || ''
    if (authStore.user.avatar) {
      avatarPreview.value = authStore.user.avatar
    }
  }
}

function handleAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    avatarFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

async function handleAvatarUpload() {
  if (!avatarFile.value) return

  saving.value = true
  error.value = ''
  success.value = ''

  try {
    await authStore.updateAvatar(avatarFile.value)
    avatarFile.value = null
    success.value = '头像更新成功'
  } catch (e: any) {
    error.value = e.response?.data?.message || '头像更新失败'
  } finally {
    saving.value = false
  }
}

async function handleSubmit() {
  saving.value = true
  error.value = ''
  success.value = ''

  try {
    await authStore.updateProfile({ username: form.username || undefined })
    success.value = '个人信息更新成功'
  } catch (e: any) {
    error.value = e.response?.data?.message || '更新失败'
  } finally {
    saving.value = false
  }
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  loading.value = true
  try {
    await authStore.fetchUser()
    initForm()
  } catch (e) {
    error.value = '加载用户信息失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="profile-page">
    <header class="page-header">
      <h1>个人资料</h1>
    </header>

    <div v-if="loading" class="loading">
      加载中...
    </div>

    <div v-else class="profile-content">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="success" class="success-message">
        {{ success }}
      </div>

      <!-- Avatar Section -->
      <div class="avatar-section">
        <div class="avatar-wrapper">
          <img
            v-if="avatarPreview"
            :src="avatarPreview"
            alt="头像"
            class="avatar"
          />
          <div v-else class="avatar-placeholder">
            {{ authStore.user?.username?.[0] || authStore.user?.email?.[0] || '?' }}
          </div>
        </div>
        <div class="avatar-actions">
          <label class="upload-btn">
            <input
              type="file"
              accept="image/*"
              @change="handleAvatarChange"
              hidden
            />
            选择头像
          </label>
          <button
            v-if="avatarFile"
            @click="handleAvatarUpload"
            :disabled="saving"
            class="save-avatar-btn"
          >
            {{ saving ? '上传中...' : '上传头像' }}
          </button>
        </div>
      </div>

      <!-- Profile Form -->
      <form @submit.prevent="handleSubmit" class="profile-form">
        <div class="form-group">
          <label for="email">邮箱</label>
          <input
            id="email"
            type="email"
            :value="authStore.user?.email"
            disabled
          />
          <p class="form-hint">邮箱不可修改</p>
        </div>

        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            placeholder="请输入用户名"
          />
        </div>

        <button type="submit" class="submit-btn" :disabled="saving">
          {{ saving ? '保存中...' : '保存修改' }}
        </button>
      </form>

      <!-- Quick Links -->
      <div class="quick-links">
        <router-link to="/rooms" class="link-btn">
          管理房间
        </router-link>
        <router-link to="/clothing" class="link-btn">
          我的衣橱
        </router-link>
      </div>

      <!-- Logout -->
      <div class="logout-section">
        <button @click="handleLogout" class="logout-btn">
          退出登录
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a2e;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.profile-content {
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

.success-message {
  background: #d1fae5;
  color: #059669;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #eee;
}

.avatar-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  font-weight: 600;
  text-transform: uppercase;
}

.avatar-actions {
  display: flex;
  gap: 12px;
}

.upload-btn {
  background: #f3f4f6;
  color: #4a4a4a;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.upload-btn:hover {
  background: #e5e7eb;
}

.save-avatar-btn {
  background: #667eea;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.save-avatar-btn:hover:not(:disabled) {
  background: #5567d6;
}

.save-avatar-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.profile-form {
  margin-bottom: 32px;
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

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.form-group input:disabled {
  background: #f3f4f6;
  color: #999;
  cursor: not-allowed;
}

.form-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.submit-btn {
  width: 100%;
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

.quick-links {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.link-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  background: #f3f4f6;
  border-radius: 8px;
  color: #4a4a4a;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}

.link-btn:hover {
  background: #e5e7eb;
}

.logout-section {
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.logout-btn {
  width: 100%;
  background: transparent;
  color: #dc2626;
  padding: 14px;
  border: 2px solid #dc2626;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #dc2626;
  color: white;
}
</style>
