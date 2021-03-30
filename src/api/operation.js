import request from '@/util/request'
import qs from 'qs'
import globalDefine from '@/util/common'

// 用户接单
export function getTaskHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/getTaskHandler',
    data: qs.stringify({ ...data, ...{ noLoading: true } })
  })
}

// 用户做单
export function commitTaskHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/commitTaskHandler',
    data: qs.stringify(data)
  })
}

// 获取我的任务列表
export function getMyTaskListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/getMyTaskListHandler',
    data: qs.stringify(data)
  })
}

// 获取提交返款信息次数
export function getUserRefundTimeHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/getUserRefundTimeHandler',
    data: qs.stringify(data)
  })
}

// 提交返款信息
export function setUserRefundInfoHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/setUserRefundInfoHandler',
    data: qs.stringify(data)
  })
}

// 任务详情
export function getTaskInfoHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/getTaskInfoHandler',
    data: qs.stringify(data)
  })
}

// 获取收款信息
export function getRefundInfoHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/getRefundInfoHandler',
    data: qs.stringify(data)
  })
}
// 核对商品
export function checkProductUriHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/checkProductUriHandler',
    data: qs.stringify(data)
  })
}

// 提交购物车截图
export function commitAddCartPicHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/commitAddCartPicHandler',
    data: qs.stringify(data)
  })
}

// 行业版提交用户返款信息
export function setIndustryUserRefundInfoHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/setIndustryUserRefundInfoHandler',
    data: qs.stringify(data)
  })
}
