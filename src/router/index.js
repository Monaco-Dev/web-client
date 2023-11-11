// Composables
import { createRouter, createWebHistory } from 'vue-router'
import GuardService from '@/composables/guard'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/home/Home.vue'),
    beforeEach: (to, from, next) => GuardService.authorized(next),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue')
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
        component: () => import('@/views/ForgotPassword.vue'),
        beforeEnter: (to, from, next) => GuardService.registration(from, next)
      }
      // {
      //   path: '/reset-password',
      //   name: 'ResetPassword',
      //   component: () => import('@/views/ResetPassword.vue')
      // },
      // {
      //   path: '/verify-email',
      //   name: 'VerifyEmail',
      //   component: () => import('@/views/VerifyEmail.vue')
      // }
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
