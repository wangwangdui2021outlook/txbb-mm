/* eslint-disable */
let DAMAINCONFIG = require('./../../config/domainConfig/config')
const APIURL = `http://${window.location.host}`
// const apiURL = DAMAINCONFIG.APIURL
const CDNURL = DAMAINCONFIG.CDNURL

export default {
  api: process.env.NODE_ENV === 'development' ? '/api' : APIURL + '/User',
  PLAT_NAME: DAMAINCONFIG.PLAT_NAME,
  CODE_SUCCESS: 0,
  CODE_RESULT: 1012,
  CODE_FAILED: 1000,
  PAGE_SIZE: 20,
  TOTAL: 100,
  sizeArr: [20, 50, 100, 200, 500],
  register: APIURL + '/register?',
  login: APIURL + '/login?',
  formLabelWidth: '110px',
  TOKEN_TIME: 60 * 60 * 6,
  // 上传图片常量
  CDN_UP_URL: process.env.NODE_ENV === 'development' ? 'http://cdn..com' : CDNURL,
  UPLOAD_IMAGE_SIZE: 300,
  UPLOAD_IMAGE_QUALITY: 0.3,
  // 线上
  upload: process.env.NODE_ENV === 'development' ? '/upload' : CDNURL,
  // 做单时间限制
  ORDER_DOING_LIMIT_TIME: 45,
  ORDER_DOING_LIMIT_TIME_UNIT: 'minutes',
  ORDER_CLEAR_MAX_LIMIT: 1000,
  // 隔日单做单时间限制
  ORDER_DOING_LIMIT_TIME_NEW: 45,
  CONFIG: {
    TB_ORDER_NUM: 8,
    CODE_SUCCESS: 0, // 成功返回状态码
    CODE_BAD_PASSWORD: 1001, // 密码错误
    CODE_BANED: 1002, // 禁止登录
    CODE_BAD_PARAMETER: 1003, // 参数异常
    CODE_DB_ERROR: 1004, // DB操作异常
    CODE_BAD_REQUEST: 1005, // 非法请求
    CODE_UNKNOWN_ERROR: 1006, // 未知错误
    CODE_PERMISSION_DENIED: 1007, // 权限不够
    CODE_BAD_PROVCODE: 1008, // 验证码不正确
    CODE_USER_EXIT: 1009, // 用户已经存在
    CODE_PAGE_END: 1010, // 分页结束/数据为空
    CODE_USER_NOT_EXIT: 1011, // 用户不存在
    CODE_TOKEN_INVALID: 1012, // token已失效
    CODE_USER_INVALID: 2001, // 无效用户
    CODE_TASK_INSERT_BAD: 3001, // 任务插入失败
    CODE_TASK_CHECK_BAD: 3002, // 任务数据验证失败
    CODE_TASK_ORDER_INVALID: 3003, // 二维码失效
    CODE_TASK_ACCEPT_FAILED: 3004, // 接单失败
    CODE_USER_REFUND_INFO_NOT_EXIT: 1013, // 收款信息不存在
    // ################  一般状态  ##################
    STATUS_ABLE: 1, // 正常
    STATUS_ING: 2, // 审核中/留空
    STATUS_DISABLE: 3, // 拒绝/留空/拉黑/停用
    STATUS_DEL: 4, // 删除
    STATUS_HARD_DISABLE: 99, // 彻底不可用状态
    STATUS_FALSE: 0, // 否
    STATUS_TRUE: 1, // 是
    // ################## 分销机构状态 ##############################
    INDUSTRY_STATUS_OPEN: 1, // 有行业版权限
    INDUSTRY_STATUS_NOT: 2, // 禁止发单
    INDUSTRY_STATUS_CLOSE: 3, // 无权限
    // ################  订单状态  ##################
    ORDER_STATUS_NOT_ALLOT: 5, // 未分配
    ORDER_STATUS_ALLOTED: 10, // 已分配，待生成二维码
    ORDER_STATUS_WAIT_ACCEPT: 15, // 已生成二维码，待接单
    ORDER_STATUS_WAIT_DOING: 20, // 已接单，待完成
    ORDER_STATUS_ADD_SHOPPING_CARD_WAIT: 21, // 提交购物车截图待审核
    ORDER_STATUS_ADD_SHOPPING_CARD_DONE: 23, // 购物车截图审核通过
    ORDER_STATUS_WAIT_ADD: 24, // 任务待提交
    ORDER_STATUS_WAITING_AUDIT: 25, // 已提交，待审核
    ORDER_STATUS_DONE: 30, // 已完成
    ORDER_STATUS_TIME_OUT: 50, // 已超时
    ORDER_STATUS_FAIL: 90, // 审核失败
    ORDER_STATUS_CANCEL: 99, // 已撤销

    // ################## 二维码类型 ##################
    QR_TYPE_COUNT: 1, // 次数类型
    QR_TYPE_TIME: 2, // 时间类型ORDER_STATUS_CANCEL

    // ################## 短信发生类型 ##################
    SMS_REGISTER: 'register', // 注册
    SMS_RESET_PWD: 'forget_pwd', // 忘记密码

    // ################### 性别 ####################
    SEX_MAN: 1, // 男
    SEX_WOMAN: 2, // 女

    // ################### 任务处理方法类型 ####################
    TASK_FANKUAN: 1,
    TASK_FENPEI: 2,
    TASK_CHEHUI: 3,
    TASK_SHENGCHENG: 4,
    TASK_SHANCHU: 5,

    // ################### 当天提交返款信息次数 ####################
    PAY_INFO_LIMIT: 3,

    // ################### 返款方式 ####################
    USER_REFUND_TYPE_WEIXIN: 1,
    USER_REFUND_TYPE_BANK: 2,
    // ################### 任务类型 ####################
    TASK_TYPE_NOT: 1, // 普通单
    TASK_TYPE_IS: 2, // 隔日单

    // ################### 是否需要填写身份证信息 ####################
    PAY_CARDID_NO: 1,  // 不许要
    PAY_CARDID_YES: 2,  // 需要
  },
  // 加密/解密ID
  encodeId: (id) => {
    if (!id) return ''
    let sid = (id & 0xff000000)
    sid += (id & 0x0000ff00) << 8
    sid += (id & 0x00ff0000) >> 8
    sid += (id & 0x0000000f) << 4
    sid += (id & 0x000000f0) >> 4
    // sid ^= 11184810
    sid ^= 2147483648
    return sid
  },
  // 封装localStorage 带过期时间，单位为秒
  zyLocalStorage: {
    set: function (key, value, ttlMs) {
      var data = { value: value, expirse: new Date(new Date().getTime() + ttlMs * 1000).getTime() }
      localStorage.setItem(key, JSON.stringify(data))
    },
    get: function (key) {
      var data = JSON.parse(localStorage.getItem(key))
      if (data !== null) {
        if (data.expirse != null && data.expirse < new Date().getTime()) {
          localStorage.removeItem(key)
        } else {
          return data.value
        }
      }
      return null
    }
  },
  // 格式化时间格式
  formatTime: (number, format) => {
    function formatNumber (n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    }
    let time = new Date(number)
    let newArr = []
    let formatArr = ['Y', 'M', 'D', 'h', 'm', 's']
    newArr.push(time.getFullYear())
    newArr.push(formatNumber(time.getMonth() + 1))
    newArr.push(formatNumber(time.getDate()))

    newArr.push(formatNumber(time.getHours()))
    newArr.push(formatNumber(time.getMinutes()))
    newArr.push(formatNumber(time.getSeconds()))

    for (let i in newArr) {
      format = format.replace(formatArr[i], newArr[i])
    }
    return format
  },
  // 检查对象value是否有空值
  changeOV: (data = {}) => {
    let isExist = true
    for (let key in data) {
      if (data[key] === null || data[key] === '' || data[key] === undefined) {
        isExist = false
      }
    }
    return isExist
  }

}
