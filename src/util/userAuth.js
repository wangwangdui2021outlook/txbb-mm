// import Cookies from 'js-cookie'
import GLOBAL from '@/util/common'
const Token = 'mm_user_token'
const UserName = 'mm_user_name'
const UserInfo = 'mm_user_info'

export function setToken (token) {
  return GLOBAL.zyLocalStorage.set(Token, token, 900)
}

export function getToken () {
  return GLOBAL.zyLocalStorage.get(Token)
}

export function removeToken () {
  return localStorage.removeItem(Token)
}

export function setUserName (username) {
  return GLOBAL.zyLocalStorage.set(UserName, username, 900)
}

export function getUserName () {
  return GLOBAL.zyLocalStorage.get(UserName)
}

export function removeUserName () {
  return localStorage.removeItem(UserName)
}

export function setUserInfo (userinfo) {
  return GLOBAL.zyLocalStorage.set(UserInfo, userinfo, 900)
}

export function getUserInfo () {
  return JSON.parse(GLOBAL.zyLocalStorage.get(UserInfo))
}

export function removeUserInfo () {
  return localStorage.removeItem(UserInfo)
}

// export function setToken (token) {
//   return Cookies.set(Token, token, { expires: 1 / 96 })
// }

// export function getToken () {
//   return Cookies.get(Token)
// }

// export function removeToken () {
//   return Cookies.remove(Token)
// }

// export function setUserName (username) {
//   return Cookies.set(UserName, username, { expires: 1 / 96 })
// }

// export function getUserName () {
//   return Cookies.get(UserName)
// }

// export function removeUserName () {
//   return Cookies.remove(UserName)
// }

// export function setUserInfo (userinfo) {
//   return Cookies.set(UserInfo, userinfo, { expires: 1 / 96 })
// }

// export function getUserInfo () {
//   return Cookies.get(UserInfo)
// }

// export function removeUserInfo () {
//   return Cookies.remove(UserInfo)
// }
