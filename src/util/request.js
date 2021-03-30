import axios from 'axios'
import { Indicator, MessageBox } from 'mint-ui'
import { getToken, getUserName } from '@/util/userAuth'

function startLoading () {
  Indicator.open({
    text: '加载中...',
    spinnerType: 'fading-circle'
  })
}

function closeLoading () {
  Indicator.close()
}

const service = axios.create({
  withCredentials: true
})

service.interceptors.request.use(config => {
  config.headers['token'] = getToken()
  config.headers['username'] = getUserName()
  config.headers['X-Requested-With'] = 'XMLHttpRequest'
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  if (config.data.indexOf('noLoading') < 0) {
    startLoading()
  }
  return config
}, error => {
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    closeLoading()
    if (response) return response.data
    MessageBox.alert('网路错误，请稍后再试！')
  }, error => {
    return Promise.reject(error)
  })

export default service
