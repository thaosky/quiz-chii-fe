import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import TestIndex from './views/tests/index.vue'
import EmptyHeader from '@/layout/empty/EmptyHeader.vue'
import EmptyFooter from '@/layout/empty/EmptyFooter.vue'
import AdminHeader from '@/layout/admin/AdminHeader.vue'
import AdminFooter from '@/layout/admin/AdminFooter.vue'
import UserHeader from '@/layout/user/UserHeader.vue'
import UserFooter from '@/layout/user/UserFooter.vue'

Vue.use(Router)

export default new Router({
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'components',
      components: {
        header: EmptyHeader,
        default: Home,
        footer: EmptyFooter
      }
    },
    {
      path: '/tests',
      name: 'tests',
      components: {
        header: UserHeader,
        default: TestIndex,
        footer: UserFooter
      }
    },
    {
      path: '/tests/create',
      name: 'tests.create',
      components: {
        header: AdminHeader,
        default: () => import('@/views/tests/create.vue'),
        footer: AdminFooter
      }
    },
    {
      path: '/tests/:id/edit',
      name: 'tests.edit',
      components: {
        header: AdminHeader,
        default: () => import('@/views/tests/edit.vue'),
        footer: AdminFooter
      }
    },
    {
      path: '/tests/:id',
      name: 'tests.detail',
      components: {
        header: UserHeader,
        default: () => import('@/views/tests/detail.vue'),
        footer: UserFooter
      }
    },
    {
      path: '/tests/:id/start',
      name: 'tests.start',
      components: {
        header: UserHeader,
        default: () => import('@/views/tests/start.vue'),
        footer: UserFooter
      }
    },
    {
      path: '/questions',
      name: 'questions',
      components: {
        header: AdminHeader,
        default: () => import('@/views/questions/index.vue'),
        footer: AdminFooter
      }
    },
    {
      path: '/tags',
      name: 'tags',
      components: {
        header: AdminHeader,
        default: () => import('@/views/tags/index.vue'),
        footer: AdminFooter
      }
    },
    {
      path: '/login',
      name: 'login',
      components: {
        header: EmptyHeader,
        default: Login,
        footer: EmptyFooter
      }
    },
    {
      path: '/register',
      name: 'register',
      components: {
        header: EmptyHeader,
        default: Register,
        footer: EmptyFooter
      }
    },
    {
      path: '/users',
      name: 'users',
      components: {
        header: AdminHeader,
        default: () => import('@/views/users/index.vue'),
        footer: AdminFooter
      }
    },
    {
      path: '/users/profile',
      name: 'user-profile',
      components: {
        header: UserHeader,
        default: () => import('@/views/users/Profile.vue'),
        footer: UserFooter
      }
    },
    {
      path: '/users/profile/change-password',
      name: 'user-password',
      components: {
        header: UserHeader,
        default: () => import('@/views/users/Password.vue'),
        footer: UserFooter
      }
    },
    {
      path: '/statistics',
      name: 'statistics',
      components: {
        header: AdminHeader,
        default: () => import('@/views/statistics/index.vue'),
        footer: AdminFooter
      }
    },
    {
      path: '/statistics/my-results',
      name: 'statistics.my-results',
      components: {
        header: UserHeader,
        default: () => import('@/views/statistics/my-results.vue'),
        footer: UserFooter
      }
    },
    {
      path: '/statistics/quiz/:id',
      name: 'statistics.test',
      components: {
        header: AdminHeader,
        default: () => import('@/views/statistics/quiz.vue'),
        footer: AdminFooter
      }
    },
    {
      path: '/statistics/:id',
      name: 'statistics-detail',
      components: {
        header: UserHeader,
        default: () => import('@/views/statistics/detail.vue'),
        footer: UserFooter
      }
    },
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash }
    } else {
      return { x: 0, y: 0 }
    }
  }
})
