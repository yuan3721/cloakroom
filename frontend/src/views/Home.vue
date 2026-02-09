<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const healthStatus = ref<string>('检查中...')

const isLoggedIn = computed(() => authStore.isAuthenticated)

onMounted(async () => {
  // Check backend health
  try {
    const response = await fetch('/api/health')
    const data = await response.json()
    healthStatus.value = data.status === 'ok' ? '✅ 后端服务正常' : '❌ 后端服务异常'
  } catch (error) {
    healthStatus.value = '❌ 无法连接后端服务'
  }

  // Fetch user if logged in
  if (isLoggedIn.value && !authStore.user) {
    await authStore.fetchUser()
  }
})

function goToClothing() {
  router.push('/clothing')
}

function goToProfile() {
  router.push('/profile')
}

function goToLogin() {
  router.push('/login')
}

function goToRegister() {
  router.push('/register')
}
</script>

<template>
  <div class="home">
    <h1>🏠 欢迎使用 Cloakroom</h1>
    <p class="subtitle">智能衣橱管理系统</p>

    <!-- Logged in user quick access -->
    <div v-if="isLoggedIn" class="user-section">
      <p class="welcome-text">
        欢迎回来，{{ authStore.user?.username || authStore.user?.email || '用户' }}！
      </p>
      <div class="quick-actions">
        <button @click="goToClothing" class="primary-btn">
          👕 我的衣橱
        </button>
        <button @click="goToProfile" class="secondary-btn">
          👤 个人资料
        </button>
      </div>
    </div>

    <!-- Guest access -->
    <div v-else class="guest-section">
      <p class="welcome-text">开始管理您的衣物</p>
      <div class="quick-actions">
        <button @click="goToLogin" class="primary-btn">
          登录
        </button>
        <button @click="goToRegister" class="secondary-btn">
          注册
        </button>
      </div>
    </div>

    <div class="status-card">
      <h2>系统状态</h2>
      <p>{{ healthStatus }}</p>
    </div>

    <div class="features">
      <div class="feature">
        <span class="feature-icon">👗</span>
        <h3>衣物管理</h3>
        <p>轻松添加、编辑和管理您的所有衣物</p>
      </div>
      <div class="feature">
        <span class="feature-icon">🏷️</span>
        <h3>分类筛选</h3>
        <p>按房间和季节分类，快速找到衣物</p>
      </div>
      <div class="feature">
        <span class="feature-icon">📱</span>
        <h3>移动友好</h3>
        <p>响应式设计，手机也能轻松使用</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.user-section,
.guest-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.welcome-text {
  font-size: 18px;
  color: #1a1a2e;
  margin-bottom: 24px;
}

.quick-actions {
  display: flex;
  gap: 12px;
}

.primary-btn {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.secondary-btn {
  flex: 1;
  background: #f3f4f6;
  color: #4a4a4a;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.secondary-btn:hover {
  background: #e5e7eb;
}

.status-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
  width: 100%;
  max-width: 400px;
}

.status-card h2 {
  font-size: 1rem;
  color: #666;
  margin-bottom: 8px;
}

.status-card p {
  font-size: 1.1rem;
  color: #1a1a2e;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
}

.feature {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 40px;
  display: block;
  margin-bottom: 12px;
}

.feature h3 {
  font-size: 18px;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.feature p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

@media (max-width: 640px) {
  h1 {
    font-size: 2rem;
  }

  .quick-actions {
    flex-direction: column;
  }
}
</style>
