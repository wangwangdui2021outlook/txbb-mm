import request from '@/util/request'
import qs from 'qs'
import globalDefine from '@/util/common'

// 用户注册
export function registerHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Auth/registerHandler',
    data: qs.stringify(data)
  })
}

// 发送短信
export function sendSmsHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Sms/sendSmsHandler',
    data: qs.stringify(data)
  })
}

// 重置密码
export function resetPwdHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/User/resetPwdHandler',
    data: qs.stringify(data)
  })
}
