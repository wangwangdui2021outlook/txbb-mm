<template>
  <div class="login-content">
    <div class="login-box">
      <p class="login-text">登录</p>
      <form action="">
        <div class="phone" style="margin-bottom:0.48rem">
          <input
            v-model="loginForm.phone_number"
            type="number"
            autocomplete="off"
            placeholder="手机号"
            required
          />
        </div>
        <div class="password">
          <input
            v-model="loginForm.pwd"
            type="password"
            autocomplete="off"
            placeholder="密码"
            required
          />
        </div>
        <p class="forget-text" style="text-align:right">
          <button type="button" @click="goto('/forget')">忘记密码？</button>
        </p>
        <div class="login">
          <input type="button" value="登录" @click="login" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { loginHandler } from '@/api/login'
import { MessageBox } from 'mint-ui'
import { setToken, setUserName, setUserInfo } from '@/util/userAuth'
export default {
  data () {
    return {
      qrOrderId: null,
      industry_status: null,
      loginForm: {
        phone_number: null,
        pwd: null
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 初始化
    init () {
      let _this = this
      let qrOrderId = _this.$route.query.qr_order_id
      if (qrOrderId.indexOf('&industry_status') != -1) {
        qrOrderId = qrOrderId.split('&industry_status')[0]
      }
      this.qrOrderId = qrOrderId
      let industry_status = _this.$route.query.industry_status
      _this.industry_status = industry_status == _this.CONFIG.INDUSTRY_STATUS_OPEN ? _this.CONFIG.INDUSTRY_STATUS_OPEN : _this.CONFIG.INDUSTRY_STATUS_CLOSE
      localStorage.setItem('qrOrderId', _this.$route.query.qr_order_id)
      if (!_this.qrOrderId) {
        _this.$router.push('/invalid')
      }
    },
    async login () {
      let _this = this
      if (!_this.changeOV(_this.loginForm) || _this.loginForm.phone_number.length !== 11) return MessageBox.alert('请输入正确的用户名和密码！')
      let params = { ..._this.loginForm }
      params.qr_order_id = _this.qrOrderId
      params.industry_status = _this.industry_status
      let data = await loginHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return MessageBox.alert(data.msg)
      setToken(data.result.token)
      setUserName(data.result.user_name)
      setUserInfo(JSON.stringify(data.result))
      _this.$router.push({ path: '/operation', query: { qr_order_id: _this.qrOrderId, industry_status: this.industry_status } })
    },
    goto (url) {
      if (!this.qrOrderId) return this.$router.push('/invalid')
      this.$router.push({ path: url, query: { qr_order_id: this.qrOrderId, industry_status: this.industry_status } })
    }
  }
}
</script>

<style lang="scss">
.login-content {
  width: 100%;
  height: 100%;
  background: url("~@/assets/png/banner.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .login-box {
    text-align: center;
    .password,
    .phone {
      font-size: 0;
      input {
        width: 6.74rem;
        height: 0.84rem;
        border-radius: 0.42rem;
        border: 0.04rem solid rgba(209, 209, 209, 1);
        padding-left: 1rem;
        background-color: #fff;
        box-sizing: border-box;
        display: inline-block;
        outline: 0;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        font-size: 0.28rem;
        font-weight: 400;
        color: rgba(188, 188, 188, 1);
        line-height: 0.4rem;
      }
    }
    .password {
      input {
        background-image: url("~@/assets/png/password.png"); /*设置小图标*/
        background-size: 0.28rem 0.3rem; /*小图标的大小*/
        background-position: 0.4rem 0.28rem; /*小图标在input的位置*/
        background-repeat: no-repeat; /*背景小图标不重复*/
      }
    }
    .phone {
      input {
        background-image: url("~@/assets/png/phone.png"); /*设置小图标*/
        background-size: 0.28rem 0.3rem; /*小图标的大小*/
        background-position: 0.4rem 0.28rem; /*小图标在input的位置*/
        background-repeat: no-repeat; /*背景小图标不重复*/
      }
    }
    .login-text {
      font-size: 0.44rem;
      font-family: PingFangSC-Medium, PingFangSC;
      font-weight: 500;
      color: rgba(41, 183, 163, 1);
      line-height: 0.6rem;
      padding: 2.56rem 0 0.9rem;
    }
    .forget-text {
      font-size: 0;
      button {
        color: #666;
        background: 0 0;
        display: inline-block;
        cursor: pointer;
        border: none;
        text-align: center;
        box-sizing: border-box;
        outline: 0;
        transition: 0.1s;
        font-weight: 400;
        margin: 0.28rem 0.56rem 0.6rem 0;
        padding: 0;
        font-size: 0.24rem;
        line-height: 0.34rem;
      }
    }
    .login {
      font-size: 0;
      input {
        width: 6.74rem;
        height: 0.82rem;
        border-radius: 0.42rem;
        color: #fff;
        background-color: #29b7a3;
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        border: 1px solid #dcdfe6;
        text-align: center;
        box-sizing: border-box;
        outline: 0;
        margin: 0;
        transition: 0.1s;
        font-weight: 500;
        font-size: 0.3rem;
        line-height: 0.42rem;
      }
    }
  }
}
</style>
