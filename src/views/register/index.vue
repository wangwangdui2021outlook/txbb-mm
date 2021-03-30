<template>
  <div class="register-content">
    <div class="register-box">
      <p class="register-text">注册</p>
      <form action="">
        <div class="wx" style="margin-bottom:0.24rem">
          <input
            v-model.trim="registerForm.wechat_num"
            type="text"
            autocomplete="off"
            placeholder="微信号"
            required
          />
        </div>
        <div class="wangwang">
          <input
            type="text"
            autocomplete="off"
            placeholder="淘宝会员名"
            required
            v-model.trim="registerForm.tb_nick"
          />
        </div>
        <p class="text">
          *后期任务只能用此淘宝号，请仔细核对，注册成功后无法修改
        </p>
        <div class="phone">
          <input
            type="number"
            placeholder="手机号"
            autocomplete="off"
            v-model.trim="registerForm.phone_number"
            required
          /><button
            type="button"
            @click="getSms"
            :disabled="smsBtnText != '发送验证码'"
          >
            {{ smsBtnText }}
          </button>
        </div>
        <p class="text">*此手机号做为账号登录</p>
        <div class="code" style="margin-bottom:0.24rem">
          <input
            type="text"
            v-model.trim="registerForm.prove_code"
            autocomplete="off"
            placeholder="验证码"
            required
          />
        </div>
        <div class="password" style="margin-bottom:0.26rem">
          <input
            type="password"
            autocomplete="off"
            placeholder="密码"
            required
            v-model.trim="registerForm.pwd"
          />
        </div>
        <div class="sex-box" style="margin-bottom:0.46rem">
          <span>性别：</span>&nbsp;
          <input
            id="sex1"
            type="radio"
            name="sex"
            :value="CONFIG.SEX_MAN"
            v-model="registerForm.sex"
          />
          <label for="sex1">男</label>
          &nbsp; &nbsp;
          <input
            id="sex2"
            type="radio"
            name="sex"
            :value="CONFIG.SEX_WOMAN"
            v-model="registerForm.sex"
          />
          <label for="sex2">女</label>
        </div>
        <div class="register">
          <input type="button" value="注册" @click="register" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { registerHandler, sendSmsHandler } from '@/api/register'
import { MessageBox } from 'mint-ui'
export default {
  data () {
    return {
      smsBtnText: '发送验证码',
      deviceId: null,
      registerForm: {
        wechat_num: null,
        tb_nick: null,
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
      _this.deviceId = _this.$route.query.device_id
      if (!_this.deviceId) return _this.$router.push('/invalid')
    },
    // 点击得到验证码
    getSms () {
      let _this = this
      let params = {
        phone_number: _this.registerForm.phone_number,
        send_type: _this.CONFIG.SMS_REGISTER,
        qr_id: _this.deviceId
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
    // 注册-接口
    async register () {
      let _this = this
      let params = { ..._this.registerForm, ...{ qr_id: _this.deviceId } }
      if (!_this.changeOV(params)) return false
      if (params.phone_number.length !== 11) return MessageBox.alert('请输入正确的手机号码')
      let data = await registerHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return MessageBox.alert(data.msg)
      _this.$router.push({ path: '/successfully', query: { device_id: _this.deviceId } })
    },
    goto (url) {
      this.$router.push(url)
    }
  }
}
</script>

<style lang="scss">
.register-content {
  width: 100%;
  height: 100%;
  background: url("~@/assets/png/banner.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .register-box {
    text-align: center;
    .text {
      text-align: left;
      font-size: 0.22rem;
      font-weight: 400;
      color: rgba(255, 0, 0, 1);
      line-height: 0.32rem;
      margin: 0.1rem 0.37rem 0.2rem 0.37rem;
    }
    .register-text {
      font-size: 0.44rem;
      font-family: PingFangSC-Medium, PingFangSC;
      font-weight: 500;
      color: rgba(41, 183, 163, 1);
      line-height: 0.6rem;
      padding: 2.56rem 0 0.9rem;
    }
    .password,
    .wx,
    .wangwang,
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
    .phone {
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
      position: relative;
      overflow: hidden;
      input {
        height: 0.76rem;
        border: none;
        padding: 0;
        font-size: 0.28rem;
        font-weight: 400;
        color: rgba(188, 188, 188, 1);
        box-sizing: border-box;
        outline: 0;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      button {
        position: absolute;
        top: 0.15rem;
        right: 0.3rem;
        color: #ffa900;
        background: 0;
        white-space: nowrap;
        box-sizing: border-box;
        outline: 0;
        transition: 0.1s;
        font-weight: 500;
        font-size: 0.28rem;
        border: none;
        padding-left: 0.2rem;
        border-left: 0.02rem solid rgba(216, 216, 216, 1);
      }
    }
    .register {
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
    .code {
      input {
        background-image: url("~@/assets/png/code.png"); /*设置小图标*/
        background-size: 0.28rem 0.3rem; /*小图标的大小*/
        background-position: 0.4rem 0.28rem; /*小图标在input的位置*/
        background-repeat: no-repeat; /*背景小图标不重复*/
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
    .wangwang {
      input {
        background-image: url("~@/assets/png/wangwang.png"); /*设置小图标*/
        background-size: 0.28rem 0.3rem; /*小图标的大小*/
        background-position: 0.4rem 0.28rem; /*小图标在input的位置*/
        background-repeat: no-repeat; /*背景小图标不重复*/
      }
    }
    .wx {
      input {
        background-image: url("~@/assets/png/wx.png"); /*设置小图标*/
        background-size: 0.28rem 0.3rem; /*小图标的大小*/
        background-position: 0.4rem 0.28rem; /*小图标在input的位置*/
        background-repeat: no-repeat; /*背景小图标不重复*/
      }
    }
    .sex-box {
      font-size: 0.3rem;
      text-align: center;
      padding-left: 0.24rem;
    }
  }
}
</style>
