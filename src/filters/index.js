import common from '@/util/common'
const CONFIG = common.CONFIG

// 匹配菜单
let matchMenuTitle = (val) => {
  let titleArr = []
  let newTitle = ''
  if (val.length < 5) {
    titleArr = val.split('')
    for (let i = 0; i < titleArr.length; i++) {
      newTitle += (' ' + titleArr[i] + ' ')
    }
  } else {
    newTitle = val
  }
  return newTitle
}

// 加密id
let encodeId = (id) => {
  if (!id) return ''
  let sid = (id & 0xff000000)
  sid += (id & 0x0000ff00) << 8
  sid += (id & 0x00ff0000) >> 8
  sid += (id & 0x0000000f) << 4
  sid += (id & 0x000000f0) >> 4
  // sid ^= 11184810
  sid ^= 2147483647
  return sid
}

// 匹配状态
let matchNomalStatus = (status) => {
  let arr = {}
  arr[CONFIG.STATUS_ABLE] = '正常'
  arr[CONFIG.STATUS_DISABLE] = '失效'
  arr[CONFIG.STATUS_DEL] = '删除'
  arr[CONFIG.STATUS_HARD_DISABLE] = '彻底不可用状态'
  return arr[status] ? arr[status] : '暂无'
}

// 匹配用户状态
let matchEmployeeStatus = (status) => {
  let arr = {}
  arr[CONFIG.STATUS_ABLE] = '正常'
  arr[CONFIG.STATUS_DISABLE] = '停用'
  return arr[status] ? arr[status] : '暂无'
}

// 匹配用户状态
let matchUserStatus = (status) => {
  let arr = {}
  arr[CONFIG.STATUS_ABLE] = '正常'
  arr[CONFIG.STATUS_DISABLE] = '拉黑'
  arr[CONFIG.STATUS_HARD_DISABLE] = '彻底拉黑'
  return arr[status] ? arr[status] : '暂无'
}

// 匹配性别类型
let matchSexStatus = (status) => {
  let arr = {}
  arr[CONFIG.SEX_MAN] = '男'
  arr[CONFIG.SEX_WOMAN] = '女'
  return arr[status] ? arr[status] : '暂无'
}

// 匹配任务状态
let matchTaskStatus = (status) => {
  let arr = {}
  arr[CONFIG.ORDER_STATUS_NOT_ALLOT] = '未分配'
  arr[CONFIG.ORDER_STATUS_ALLOTED] = '已分配，待生成二维码'
  arr[CONFIG.ORDER_STATUS_WAIT_ACCEPT] = '已生成二维码，待接单'
  arr[CONFIG.ORDER_STATUS_WAIT_DOING] = '已接单，待完成'
  arr[CONFIG.ORDER_STATUS_WAITING_AUDIT] = '待审核'
  arr[CONFIG.ORDER_STATUS_DONE] = '已完成'
  arr[CONFIG.ORDER_STATUS_CANCEL] = '已失效'
  return arr[status] ? arr[status] : '暂无'
}

let matchTaskLimit = (json) => {
  let newArr = JSON.parse(json)
  let str = ''
  let arr = {
    sexLimit: {}
  }
  arr.sexLimit[CONFIG.SEX_MAN] = '男'
  arr.sexLimit[CONFIG.SEX_WOMAN] = '女'
  arr.sexLimit[CONFIG.STATUS_FALSE] = '不限'

  str += arr.sexLimit[newArr.sex_limit]
  return str
}
export { matchMenuTitle, encodeId, matchNomalStatus, matchTaskStatus, matchTaskLimit, matchSexStatus, matchUserStatus, matchEmployeeStatus }
