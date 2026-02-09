import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

// Lazy load views
const Home = () => import('@/views/Home.vue')
const NotFound = () => import('@/views/NotFound.vue')
const Login = () => import('@/views/auth/Login.vue')
const Register = () => import('@/views/auth/Register.vue')
const ClothingList = () => import('@/views/clothing/ClothingList.vue')
const ClothingDetail = () => import('@/views/clothing/ClothingDetail.vue')
const ClothingForm = () => import('@/views/clothing/ClothingForm.vue')
const Profile = () => import('@/views/user/Profile.vue')
const RoomManage = () => import('@/views/user/RoomManage.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { guest: true },
    },
    {
      path: '/clothing',
      name: 'clothing-list',
      component: ClothingList,
      meta: { requiresAuth: true },
    },
    {
      path: '/clothing/new',
      name: 'clothing-new',
      component: ClothingForm,
      meta: { requiresAuth: true },
    },
    {
      path: '/clothing/:id',
      name: 'clothing-detail',
      component: ClothingDetail,
      meta: { requiresAuth: true },
    },
    {
      path: '/clothing/:id/edit',
      name: 'clothing-edit',
      component: ClothingForm,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true },
    },
    {
      path: '/rooms',
      name: 'room-manage',
      component: RoomManage,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
    },
  ],
})

// Navigation guard
router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const token = localStorage.getItem('accessToken')
  const isAuthenticated = !!token

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if auth required but not logged in
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.guest && isAuthenticated) {
    // Redirect to home if guest-only page but already logged in
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
