import request from '@/util/request'
import qs from 'qs'
import globalDefine from '@/util/common'

// 用户登录
export function loginHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Auth/loginHandler',
    data: qs.stringify(data)
  })
}
