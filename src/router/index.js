// Composables
import { createRouter, createWebHistory } from 'vue-router'
import GuardService from '@/guards'

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
        path: 'networks',
        name: 'Networks',
        component: () => import('@/views/networks/Index.vue'),
        beforeEnter: (to, from, next) => GuardService.authorized(next),
        children: [
          {
            path: 'incoming-invites',
            name: 'NetworksIncomingInvites',
            component: () => import('@/views/networks/IncomingInvites.vue'),
            beforeEnter: (to, from, next) => GuardService.authorized(next)
          },
          {
            path: 'outgoing-invites',
            name: 'NetworksOutgoingInvites',
            component: () => import('@/views/networks/OutgoingInvites.vue'),
            beforeEnter: (to, from, next) => GuardService.authorized(next)
          },
          {
            path: 'connections',
            name: 'NetworksConnections',
            component: () => import('@/views/networks/Connections.vue'),
            beforeEnter: (to, from, next) => GuardService.authorized(next)
          },
          {
            path: 'followers',
            name: 'NetworksFollowers',
            component: () => import('@/views/networks/Followers.vue'),
            beforeEnter: (to, from, next) => GuardService.authorized(next)
          },
          {
            path: 'following',
            name: 'NetworksFollowing',
            component: () => import('@/views/networks/Following.vue'),
            beforeEnter: (to, from, next) => GuardService.authorized(next)
          }
        ]
      },
      {
        path: 'pins',
        name: 'Pins',
        component: () => import('@/views/Pins.vue'),
        beforeEnter: (to, from, next) => GuardService.authorized(next)
      },
      {
        path: 'posts/:uuid',
        name: 'PostView',
        component: () => import('@/views/PostView.vue'),
        beforeEnter: (to, from, next) => GuardService.authorized(next)
      },
      {
        path: 'profile/:uuid',
        name: 'ProfileIndex',
        component: () => import('@/views/profile/Index.vue'),
        children: [
          {
            path: '',
            name: 'ProfileWall',
            component: () => import('@/views/profile/Wall.vue'),
            beforeEnter: (to, from, next) => GuardService.authorized(next)
          },
          {
            path: 'about',
            name: 'ProfileAbout',
            component: () => import('@/views/profile/About.vue'),
            beforeEnter: (to, from, next) => GuardService.authorized(next)
          },
          {
            path: 'archive',
            name: 'ProfileArchive',
            component: () => import('@/views/profile/Archive.vue'),
            beforeEnter: (to, from, next) => GuardService.authorized(next)
          }
        ]
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
        beforeEnter: (to, from, next) => GuardService.authorized(next),
        children: [
          {
            path: 'profile',
            name: 'SettingsProfile',
            component: () => import('@/views/settings/Profile.vue'),
            beforeEnter: (to, from, next) => GuardService.authorized(next)
          },
          {
            path: 'account',
            name: 'SettingsAccount',
            component: () => import('@/views/settings/Account.vue'),
            beforeEnter: (to, from, next) => GuardService.authorized(next)
          }
        ]
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
      },
      {
        path: '/verify-license',
        name: 'VerifyLicense',
        component: () => import('@/views/VerifyLicense.vue'),
        beforeEnter: (to, from, next) => GuardService.verifyLicense(to, from, next)
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
