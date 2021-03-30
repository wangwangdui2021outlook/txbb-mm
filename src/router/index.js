import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/mm/',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/login')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register/index')
    },
    {
      path: '/successfully',
      name: 'successfully',
      component: () => import('@/views/register/successfully')
    },
    {
      path: '/forget',
      name: 'forget',
      component: () => import('@/views/forget/index')
    },
    {
      path: '/operation',
      name: 'operation',
      component: () => import('@/views/operation/index')
    },
    {
      path: '/invalid',
      name: 'invalid',
      component: () => import('@/views/invalid/index')
    },
    {
      path: '/mytask',
      name: 'mytask',
      component: () => import('@/views/mytask/index')
    },
    {
      path: '/taskdetails',
      name: 'taskdetails',
      component: () => import('@/views/mytask/details')
    },
    {
      path: '/taskinfo',
      name: 'taskinfo',
      component: () => import('@/views/taskinfo/index')
    },
    {
      path: '/payinfo',
      name: 'payinfo',
      component: () => import('@/views/mytask/payinfo')
    }
  ]
})
