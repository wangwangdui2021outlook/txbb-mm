<template>
  <div class="forget-content">
    <div class="forget-box">
      <p class="forget-text">忘记密码</p>
      <form action="">
        <div class="phone" style="margin-bottom:0.24rem">
          <input
            type="number"
            placeholder="手机号"
            autocomplete="off"
            required
            v-model="resetForm.phone_number"
          /><button
            type="button"
            @click="getSms"
            :disabled="smsBtnText != '发送验证码'"
          >
            {{ smsBtnText }}
          </button>
        </div>
        <div class="code" style="margin-bottom:0.24rem">
          <input
            type="text"
            v-model="resetForm.prove_code"
            autocomplete="off"
            placeholder="验证码"
            required
          />
        </div>
        <div class="NewPassword">
          <input
            type="password"
            autocomplete="off"
            placeholder="新密码"
            v-model="resetForm.pwd"
            required
          />
        </div>
        <p class="register-back" style="text-align:right;">
          <button type="button" @click="goto('/login')">返回登陆</button>
        </p>
        <div class="confirm">
          <input type="button" value="确认修改" @click="resetSubmit" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { resetPwdHandler, sendSmsHandler } from '@/api/register'
import { MessageBox } from 'mint-ui'
export default {
  data () {
    return {
      qrOrderId: null,
      industry_status: null,
      smsBtnText: '发送验证码',
      resetForm: {
        phone_number: null,
        pwd: null,
        prove_code: null
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
      _this.qrOrderId = _this.$route.query.qr_order_id
      this.industry_status = this.$route.query.industry_status
    },
    // 点击得到验证码
    getSms () {
      let _this = this
      let params = {
        phone_number: _this.resetForm.phone_number,
        send_type: _this.CONFIG.SMS_RESET_PWD,
        qr_id: _this.qrOrderId
      }
      if (!_this.changeOV(params) || params.phone_number.length !== 11) return MessageBox.alert('请输入正确的手机号码')
      let sec = 30
      let timerInt = setInterval(() => {
        if (sec > 0) {
          sec--
          _this.smsBtnText = sec + '秒后再试'
        } else {
          _this.smsBtnText = '发送验证码'
          clearInterval(timerInt)
        }
      }, 1000)
      _this.sendSms(params)
    },
    // 获取短信验证码-接口
    async sendSms (params) {
      let data = await sendSmsHandler(params)
      return MessageBox.alert(data.msg)
    },
    // 重置密码提交
    async resetSubmit () {
      let _this = this
      let params = { ..._this.resetForm }
      params.qr_order_id = _this.qrOrderId
      params.industry_status = _this.industry_status
      if (!_this.changeOV(params)) return false
      if (params.phone_number.length !== 11) return MessageBox.alert('请输入正确的手机号码')
      let data = await resetPwdHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return MessageBox.alert(data.msg)
      MessageBox.alert(data.msg).then(action => {
        this.$router.push({ path: '/login', query: { qr_order_id: this.qrOrderId, industry_status: this.industry_status } })
      })
    },
    // 返回登陆
    goto (url) {
      this.$router.push({ path: url, query: { qr_order_id: this.qrOrderId, industry_status: this.industry_status } })
    }
  }
}
</script>

<style lang="scss">
.forget-content {
  width: 100%;
  height: 100%;
  background: url("~@/assets/png/banner.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .forget-box {
    text-align: center;
    .forget-text {
      font-size: 0.44rem;
      font-family: PingFangSC-Medium, PingFangSC;
      font-weight: 500;
      color: rgba(41, 183, 163, 1);
      line-height: 0.6rem;
      padding: 2.56rem 0 0.9rem;
    }
    .NewPassword,
    .code {
      font-size: 0;
      input {
        width: 6.74rem;
        height: 0.84rem;
        border-radius: 0.42rem;
        border: 0.04rem solid rgba(209, 209, 209, 1);
        padding: 0 0 0 1rem;
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
    .NewPassword {
      input {
        background-image: url("~@/assets/png/password.png"); /*设置小图标*/
        background-size: 0.28rem 0.3rem; /*小图标的大小*/
        background-position: 0.4rem 0.28rem; /*小图标在input的位置*/
        background-repeat: no-repeat; /*背景小图标不重复*/
      }
    }
    .code {
      input {
        background-image: url("~@/assets/png/code.png"); /*设置小图标*/
        background-size: 0.28rem 0.3rem; /*小图标的大小*/
        background-position: 0.4rem 0.28rem; /*小图标在input的位置*/
        background-repeat: no-repeat; /*背景小图标不重复*/
      }
    }
    .confirm {
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
    .phone {
      display: flex;
      flex-direction: row;
      align-items: center;
      background-image: url("~@/assets/png/phone.png"); /*设置小图标*/
      background-size: 0.28rem 0.3rem; /*小图标的大小*/
      background-position: 0.4rem 0.28rem; /*小图标在input的位置*/
      background-repeat: no-repeat; /*背景小图标不重复*/
      font-size: 0;
      border-radius: 0.42rem;
      border: 0.04rem solid rgba(209, 209, 209, 1);
      width: 6.75rem;
      height: 0.84rem;
      margin: 0 auto;
      box-sizing: border-box;
      padding-left: 1rem;
      text-align: left;
      input {
        height: 0.76rem;
        border: none;
        padding: 0;
        width: 3.5rem;
        font-size: 0.28rem;
        font-weight: 400;
        color: rgba(188, 188, 188, 1);
        box-sizing: border-box;
        display: inline-block;
        outline: 0;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      button {
        color: #ffa900;
        background: 0 0;
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        box-sizing: border-box;
        outline: 0;
        transition: 0.1s;
        font-weight: 500;
        font-size: 0.28rem;
        line-height: 0.4rem;
        padding-left: 0.36rem;
        border: none;
        border-left: 0.02rem solid rgba(216, 216, 216, 1);
      }
    }

    .register-back {
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
  }
}
</style>
