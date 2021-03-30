import router from './router'
import { getToken, removeToken, getUserName, removeUserName } from '@/util/userAuth'

const whiteList = ['/login', '/register', '/forget', '/invalid', '/successfully']
router.beforeEach((to, from, next) => {
  // 每次加载路由判断是否已经获取用户信息 若未获取用户信息则跳转到登录
  if (getToken() && getUserName()) {
    if (to.path === '/login') {
      removeToken()
      removeUserName()
    }
    next()
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?qr_order_id=${to.query.qr_order_id}&industry_status=${to.query.industry_status}`) // 否则全部重定向到登录页
    }
  }
  if (to.matched.length === 0) {
    from.name ? next({
      name: from.name
    }) : next('/invalid')
  } else {
    next() // 如果匹配到正确跳转
  }
})
