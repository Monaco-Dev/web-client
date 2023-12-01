// Composables
import { createRouter, createWebHistory } from 'vue-router'
import GuardService from '@/composables/guard'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/home/Home.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        beforeEnter: (to, from, next) => GuardService.authorized(next)
      },
      {
        path: 'posts/:uuid',
        name: 'PostView',
        component: () => import('@/views/PostView.vue'),
        beforeEnter: (to, from, next) => GuardService.authorized(next)
      },
      {
        path: 'profile/:slug',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
        beforeEnter: (to, from, next) => GuardService.authorized(next)
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/Menu.vue'),
        beforeEnter: (to, from, next) => GuardService.authorized(next)
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/settings/Index.vue'),
        beforeEnter: (to, from, next) => GuardService.authorized(next)
      },
      {
        path: 'settings/profile',
        name: 'SettingsProfile',
        component: () => import('@/views/settings/Profile.vue'),
        beforeEnter: (to, from, next) => GuardService.authorized(next)
      },
      {
        path: 'settings/account',
        name: 'SettingsAccount',
        component: () => import('@/views/settings/Account.vue'),
        beforeEnter: (to, from, next) => GuardService.authorized(next)
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Register.vue'),
        beforeEnter: (to, from, next) => GuardService.registration(from, next)
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        beforeEnter: (to, from, next) => GuardService.registration(from, next)
      },
      {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/views/ForgotPassword.vue')
      },
      {
        path: '/reset-password',
        name: 'ResetPassword',
        component: () => import('@/views/ResetPassword.vue'),
        beforeEnter: (to, from, next) => GuardService.resetPassword(to, from, next)
      },
      {
        path: '/verify-email',
        name: 'VerifyEmail',
        component: () => import('@/views/VerifyEmail.vue'),
        beforeEnter: (to, from, next) => GuardService.unauthorized(to, from, next)
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'PageNotFound',
    component: () => import('@/views/PageNotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
