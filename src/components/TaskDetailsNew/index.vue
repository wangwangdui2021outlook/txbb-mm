<template>
  <div class="operation-content">
    <div class="operation-box" v-if="onProcess">
      <div class="no_task-content" v-if="JSON.stringify(taskInfo) === '{}'">
        <p class="no_task-text">{{ msg }}</p>
      </div>
      <div
        class="task-content"
        v-if="
          [
            CONFIG.ORDER_STATUS_WAIT_DOING,
            CONFIG.ORDER_STATUS_TIME_OUT,
            CONFIG.ORDER_STATUS_WAITING_AUDIT,
            CONFIG.ORDER_STATUS_DONE,
            CONFIG.ORDER_STATUS_FAIL,
            CONFIG.ORDER_STATUS_ADD_SHOPPING_CARD_DONE,
            CONFIG.ORDER_STATUS_WAIT_ADD,
          ].indexOf(taskInfo.status) > -1 && isTask
        "
      >
        <div class="text-content operate-box">
          <div class="text-header">
            <div class="text-header__content">
              <p
                class="title"
                v-if="taskInfo.status == CONFIG.ORDER_STATUS_TIME_OUT"
              >
                已超时！
              </p>
              <p
                class="title"
                v-if="taskInfo.status == CONFIG.ORDER_STATUS_WAIT_DOING"
              >
                <span v-if="timeRemaining > 0" style="font-size: 14px;">
                  请在<strong>{{ timeRemaining }}</strong
                  >分钟内完成加购截图提交<br />
                  <strong>第一天请勿拍下!请勿拍下!请勿拍下!(第二天可拍)</strong>
                </span>
                <span v-else>已失效</span>
              </p>
              <p
                class="title"
                v-if="
                  taskInfo.status == CONFIG.ORDER_STATUS_WAIT_ADD ||
                  taskInfo.status == CONFIG.ORDER_STATUS_ADD_SHOPPING_CARD_DONE
                "
              >
                使用（{{ asteriskText(taskInfo.buyer_tb_nick) }}）接单
              </p>
              <p
                class="title"
                v-if="taskInfo.status == CONFIG.ORDER_STATUS_CANCEL"
              >
                该任务已失效
              </p>

              <p
                class="title"
                v-if="taskInfo.status == CONFIG.ORDER_STATUS_WAITING_AUDIT"
              >
                待返款
              </p>

              <p
                class="title"
                v-if="taskInfo.status == CONFIG.ORDER_STATUS_FAIL"
              >
                该任务审核失败
              </p>

              <div v-if="taskInfo.status == CONFIG.ORDER_STATUS_DONE">
                <p
                  class="title"
                  v-if="taskInfo.refund_type == CONFIG.USER_REFUND_TYPE_WEIXIN"
                >
                  已返款至微信，预计24小时内到账
                  <br />
                  <span class="title-span">
                    微信系统处理可能延迟，请注意查看微信流水
                  </span>
                </p>
                <p class="title" v-else>
                  已返款至银行卡，预计24小时内到账
                  <br />
                  <span class="title-span">
                    银行卡系统处理可能延迟，请注意查看银行卡流水
                  </span>
                </p>
              </div>
              <p class="tb-nick">
                使用（{{ asteriskText(taskInfo.buyer_tb_nick) }}）接单
              </p>
            </div>
          </div>
          <div class="text-box">
            <div class="text-box__info">
              <p class="text-info__title">要求：</p>
              <p class="text-info__content">
                搜索关键词-{{ taskInfo.task_method_details }}-{{
                  taskInfo.task_note
                }}
              </p>
            </div>
            <div class="text-box__info">
              <p class="text-info__title">禁止：</p>
              <p class="text-info__content">
                操作过程中不要截图，做完任务不要点复制订单号；禁止使用花呗、信用卡、淘宝客付款；不允许私自更改关键词、筛选条件，禁止使用淘宝客拍照搜索宝贝
              </p>
            </div>
          </div>
        </div>
        <div class="search">
          <div
            class="text search-key"
            style="border-bottom: 0.02rem solid #f1f1f1;"
          >
            <div>搜索关键字</div>
            <div class="key-text">
              {{ taskInfo.task_method_details }}
            </div>
          </div>
          <div class="text">
            <div style="float: left;">价格</div>
            <div
              style="
                float: right;
                color: #fd3b10;
                font-weight: 400;
                font-size: 0.28rem;
              "
            >
              拍￥{{ taskInfo.single_task_price }}选项
            </div>
          </div>
        </div>
        <div class="shop">
          <div class="text">
            <div style="float: left;">店铺名</div>
            <div style="float: right; font-weight: 400;">
              {{ taskInfo.shop_name }}
            </div>
          </div>
          <div class="imgs">
            <img class="img-mask" src="@/assets/png/mask.png" alt="" />
            <img :src="taskInfo.item_pic" alt="" />
          </div>
        </div>

        <div class="tb-order" v-if="taskInfo.tkl_checked != 1">
          <div
            class="tb-order_price"
            v-if="
              (task_type == CONFIG.TASK_TYPE_IS || timeRemaining > 0) &&
              taskInfo.status == CONFIG.ORDER_STATUS_WAIT_ADD
            "
          >
            <p class="tb-order-header">请输入淘宝订单编号后八位:</p>
            <input-box
              :inputNum="CONFIG.TB_ORDER_NUM"
              ref="InputBox"
            ></input-box>
            <div
              class="text-box"
              v-if="taskInfo.canShow"
              style="padding-left: 0.9rem; padding-top: 0;"
            >
              *请在{{ taskInfo.priceTime }}时间里做单将额外获得{{
                taskInfo.buyer_award_price
              }}元
            </div>
          </div>

          <div
            class="tb-order_price"
            v-if="
              [
                CONFIG.ORDER_STATUS_WAITING_AUDIT,
                CONFIG.ORDER_STATUS_DONE,
                CONFIG.ORDER_STATUS_FAIL,
              ].indexOf(taskInfo.status) > -1
            "
          >
            <p class="tb-order-header">淘宝订单编号后八位:</p>
            <p class="tb-order-header ta-c">{{ taskInfo.tb_order_number }}</p>
          </div>
        </div>
        <div
          class="screenshot tb-order"
          v-if="task_type == CONFIG.TASK_TYPE_IS && taskInfo.tkl_checked != 1"
        >
          <div class="text tb-order_price">
            <p class="tb-order-header">
              上传购物车截图
              <span
                v-if="
                  [
                    CONFIG.ORDER_STATUS_WAIT_DOING,
                    CONFIG.ORDER_STATUS_ADD_SHOPPING_CARD_WAIT,
                    CONFIG.ORDER_STATUS_ADD_SHOPPING_CARD_DONE,
                  ].indexOf(taskInfo.status) > -1
                "
                style="color: red; font-weight: bold;"
                >(请勿拍下！请勿拍下！请勿拍下！)</span
              >
            </p>
            <img
              v-if="taskInfo.buyer_add_cart_pic"
              class="upload"
              :src="CDN_UP_URL + taskInfo.buyer_add_cart_pic"
              alt=""
            />
            <div v-else>
              <upload
                ref="idPic"
                :tid="2"
                @addOneImg="getImgUrl"
                :isShowImg="true"
                :isTianjia="true"
              ></upload>
            </div>
          </div>
        </div>
        <div
          class="screenshot-no"
          v-if="taskInfo.status == CONFIG.ORDER_STATUS_ADD_SHOPPING_CARD_DONE"
        >
          <div class="screenshot-button">未到付款时间</div>
        </div>
        <div
          class="tb-word"
          v-if="
            taskInfo.tkl_checked == 1 &&
            taskInfo.status == CONFIG.ORDER_STATUS_WAIT_DOING &&
            timeRemaining > 0
          "
        >
          <div class="tb-word-header">
            请粘贴该商品的淘口令，用于核对商品链接:
          </div>
          <div class="tb-word-input">
            <input
              type="text"
              class="left"
              placeholder="请输入该商品淘口令"
              v-model="tdWord"
            />
            <div class="right" @click="checkProductUri">核对商品链接</div>
          </div>
        </div>
        <div
          v-if="
            taskInfo.status == CONFIG.ORDER_STATUS_WAIT_DOING &&
            taskInfo.tkl_checked != 1
          "
        >
          <form>
            <input
              id="submit"
              type="button"
              value="提交截图"
              @click="commitAddCartPic"
            />
          </form>
        </div>
        <div v-if="taskInfo.tkl_checked != 1">
          <form>
            <input
              v-if="
                (task_type == CONFIG.TASK_TYPE_IS || timeRemaining > 0) &&
                taskInfo.status == CONFIG.ORDER_STATUS_WAIT_ADD
              "
              type="button"
              :value="
                taskInfo.status == CONFIG.ORDER_STATUS_WAIT_ADD ||
                taskInfo.status == CONFIG.ORDER_STATUS_TIME_OUT
                  ? '提交'
                  : '任务已提交'
              "
              id="submit"
              @click="commitTask()"
              :disabled="taskInfo.status != CONFIG.ORDER_STATUS_WAIT_ADD"
            />
          </form>
        </div>

        <div class="background" v-show="isshow">
          <div class="content">
            <img src="@/assets/png/book.png" alt="" />
            <p>提交成功</p>
            <p class="tip-content">
              任务资金会在24小时内返款到您的账户，您可以在“我的任务”中查询最新的返款状态，如有疑问可直接联系客服，请勿联系卖家或申请退款。
            </p>
            <button type="button" @click="onshow(isshow)">关闭</button>
          </div>
        </div>
      </div>
      <fixed-btn :urlInfo="backForm" ref="fiexdbtns" />
    </div>
    <!-- <div class="operation-process" v-if="!onProcess">
      <div class="process-box">
        <img class="process-gif" src="@/assets/png/process.gif" alt="" />
        <p class="process-title">正在加载，稍等片刻…</p>
      </div>
    </div> -->
  </div>
</template>

<script>
/* eslint-disable */
import {
  commitTaskHandler,
  checkProductUriHandler,
  commitAddCartPicHandler
} from '@/api/operation'
import { MessageBox, Indicator } from 'mint-ui'
import InputBox from '@/components/InputBox'
import FixedBtn from '@/components/FixedBtn'

export default {
  components: { InputBox, FixedBtn },
  props: {
    detailType: {
      default: 'detailHome'
    }
  },
  data () {
    return {
      canShow: false, // 是否显示额外金额提示
      isshow: false,
      isTask: false,
      onProcess: true,
      dialogVisible: false,
      timeObj: null,
      msg: '暂无任务',
      data: {
        key: '蓝牙耳机',
        price: 399,
        shop: '质感旗舰店',
        status: false
      },
      qrOrderId: null,
      taskInfo: {
        status: null
      },
      task_type: null,
      imgUrl: '',
      // 剩余时间
      timeRemaining: null,
      backForm: {
        back_url: '/taskinfo',
        qrOrderId: ''
      },
      tdWord: ''
    }
  },
  watch: {
    taskInfo (val) {
      this.task_type = val.task_type
    }
  },

  mounted () {
    if (this.$route.query.isDelay) {
      this.init()
    } else {
      this.init()
    }
  },
  destroyed () { },
  methods: {
    // 初始化
    init () {
      let _this = this
      _this.tdWord = ''
      _this.qrOrderId = _this.$route.query.qr_order_id
      if (!_this.qrOrderId) return _this.$router.push('/invalid')
      _this.backForm.qrOrderId = _this.qrOrderId
    },
    // 获取图片上传路径
    getImgUrl (imgUrl) {
      this.imgUrl = imgUrl
    },
    goto (url) {
      this.$router.push(url)
    },
    onshow (isshow) {
      this.isshow = !isshow
      this.init()
    },
    // 倒计时
    countDown () {
      let _this = this
      _this.isTask = true
      let lSecond =
        new Date().getTime() -
        new Date(_this.taskInfo.gmt_update.replace(/-/g, '/')).getTime()
      lSecond = parseInt(lSecond / 1000)
      _this.timeRemaining = _this.ORDER_DOING_LIMIT_TIME_NEW * 60 - lSecond
      if (_this.timeRemaining < 0) return false
      // 还剩下多少分钟
      _this.timeRemaining = parseInt(_this.timeRemaining / 60)
      if (_this.timeRemaining < 1) {
        _this.timeRemaining = 1
        return false
      }
      setInterval(() => {
        if (_this.timeRemaining < 1) {
          _this.timeRemaining = 1
        } else {
          _this.timeRemaining = _this.timeRemaining - 1
        }
      }, 1000 * 60)
    },
    // 审核淘口令
    async checkProductUri () {
      if (!this.tdWord) return MessageBox.alert('请输入淘口令')
      let params = {
        tkl: this.tdWord,
        task_id: this.encodeId(this.taskInfo.id)
      }
      let data = await checkProductUriHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) {
        return MessageBox.alert(data.msg)
      }
      this.taskInfo.tkl_checked = 2
    },
    // 提交购物车截图
    async commitAddCartPic () {
      let params = {
        task_id: this.encodeId(this.taskInfo.id),
        buyer_add_cart_pic: this.imgUrl
      }
      if (!params.buyer_add_cart_pic) return
      let data = await commitAddCartPicHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return MessageBox.alert(data.msg)
      // 重新请求接口，有延迟，改为手动改变状态
      // this.$parent.getTask()
      this.taskInfo.status = this.CONFIG.ORDER_STATUS_ADD_SHOPPING_CARD_DONE
    },
    // 做单
    async commitTask () {
      let _this = this
      let tbOrderNumberArr = [..._this.$refs.InputBox.inputArr]
      let params = {
        task_id: _this.encodeId(_this.taskInfo.id),
        tb_order_number: tbOrderNumberArr.join('')
      }
      if (params.tb_order_number.length !== _this.CONFIG.TB_ORDER_NUM) return MessageBox.alert('请输入正确的淘宝订单编号后八位！')
      if (!_this.changeOV(params)) return MessageBox.alert('所有内容不能为空！')
      let data = await commitTaskHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) {
        return MessageBox.alert(data.msg)
      }
      // this.$parent.getTask()
      Indicator.open({ text: '加载中...', spinnerType: 'fading-circle' })
      setTimeout(() => {
        _this.isshow = true
        _this.taskInfo.tb_order_number = params.tb_order_number
        _this.taskInfo.status = this.CONFIG.ORDER_STATUS_WAITING_AUDIT
        Indicator.close()
      }, 1200)
    },
    asteriskText (tbnick) {
      if (!tbnick) return ''
      let str =
        tbnick.substr(0, parseInt(tbnick.split('').length / 2)) +
        '*' +
        tbnick.substr(
          parseInt(tbnick.split('').length / 2 + 1),
          tbnick.split('').length
        )
      return str
    }
  }
}
</script>

<style lang="scss" scope>
html,
body {
  background-color: #f0f1f6;
}
.operation-content {
  width: 100%;
  height: 100%;
  .no_task-content {
    width: 100%;
    height: 100%;
    background: url("~@/assets/png/notask.png");
    background-size: 3.96rem 3.94rem;
    background-repeat: no-repeat;
    background-position: 1.78rem 2.86rem;
    .no_task-text {
      text-align: center;
      padding-top: 6.54rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 0.44rem;
    }
  }
  .has_push-content {
    width: 100%;
    height: 100%;
    background: url("~@/assets/png/book.png");
    background-size: 3.56rem 3.14rem;
    background-repeat: no-repeat;
    background-position: 1.98rem 2.36rem;
    .no_task-text {
      text-align: center;
      padding-top: 6.54rem;
      font-size: 0.42rem;
      font-weight: 500;
      color: rgba(102, 102, 102, 1);
      line-height: 0.44rem;
    }
  }
  .task-content {
    width: 100%;
    height: 13.5rem;
    background: rgba(240, 241, 246, 1);
    .ChangeColor {
      opacity: 0.5;
    }
    .text-content {
      width: 100%;
      .title {
        text-align: center;
        font-size: 0.35rem;
        font-weight: 800;
        color: rgba(255, 255, 255, 1);
        padding-bottom: 0.2rem;
        .title-span {
          font-size: 0.15rem;
          font-weight: 400;
        }
      }
      .content {
        width: 6.9rem;
        div {
          font-size: 0.24rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 0.34rem;
        }
        p {
          font-size: 0.23rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 0.34rem;
          padding: 0.1rem;
          margin-bottom: 0.15rem;
          letter-spacing: 0.03rem;
        }
      }
    }
    .search {
      width: 100%;
      height: auto;
      // height: 1.98rem;
      background-color: #fff;
      .text {
        height: 0.98rem;
        width: 6.9rem;
        margin: 0 auto;
        div {
          font-size: 0.3rem;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          line-height: 0.98rem;
          height: 0.98rem;
        }
      }
      .search-key {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 6.9rem;
        margin: 0 auto;
        padding: 0.15rem 0;
        height: auto;
        div {
          height: auto;
        }
        .key-text {
          width: 5rem;
          line-height: 0.35rem;
          text-align: right;
        }
      }
    }
    .shop {
      width: 100%;
      height: 3.68rem;
      background-color: #fff;
      margin-top: 0.18rem;
      .text {
        height: 0.98rem;
        width: 6.9rem;
        margin: 0 auto;
        div {
          font-size: 0.3rem;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          line-height: 0.98rem;
          height: 0.98rem;
        }
      }
      .imgs {
        text-align: center;
        margin-top: 0.12rem;
        position: relative;
        img {
          width: 2.22rem;
          height: 2.22rem;
        }
        .img-mask {
          position: absolute;
          z-index: 10;
        }
      }
    }
    .finish_text {
      font-size: 0.28rem;
      font-weight: 500;
      color: rgba(102, 102, 102, 1);
      line-height: 0.4rem;
      margin: 0.22rem 0.3rem 0 0.28rem;
    }
    .receivables {
      width: 100%;
      height: 0.98rem;
      background-color: #fff;
      margin-top: 0.18rem;
      .text {
        height: 0.98rem;
        width: 6.9rem;
        margin: 0 auto;
        div {
          font-size: 0.3rem;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          line-height: 0.98rem;
          height: 0.98rem;
        }
      }
    }
    form {
      text-align: center;
      .imgs {
        text-align: center;
        background: #fff;
        position: relative;
        padding-bottom: 0.5rem;
        img {
          width: 2.22rem;
          height: 2.22rem;
        }
        input {
          position: absolute;
          width: 2.22rem;
          height: 2.22rem;
          margin-top: 0.12rem;
          opacity: 0;
          top: 0;
          left: 2.5rem;
        }
      }
      #submit {
        width: 6.54rem;
        height: 0.92rem;
        border-radius: 0.46rem;
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
        margin-bottom: 0.5rem;
        position: relative;
        top: -0.2rem;
        transition: 0.1s;
        font-weight: 500;
        font-size: 0.32rem;
        line-height: 0.44rem;
      }
      #submit[disabled] {
        opacity: 0.5;
      }
    }
    .beizhu {
      margin-top: 0.16rem;
      margin-bottom: 0.36rem;
      img {
        width: 0.2rem;
        height: 0.2rem;
        margin-right: 0.04rem;
      }
      text-align: center;
      font-size: 0.2rem;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 0.28rem;
    }
    .background {
      position: fixed;
      width: 100%;
      height: 13.5rem;
      background-color: rgba(0, 0, 0, 0.5);
      top: 0;
      z-index: 20;
      .content {
        width: 5rem;
        height: 6.5rem;
        margin: 3.98rem auto 0;
        background: rgba(255, 255, 255, 1);
        border-radius: 0.24rem;
        text-align: center;
        .tip-content {
          font-size: 0.25rem;
          padding: 0.2rem;
          text-align: left;
          text-indent: 0.35rem;
        }
        img {
          width: 2rem;
          height: 1.64rem;
          margin-top: 0.44rem;
        }
        p {
          font-size: 0.32rem;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 0.44rem;
        }
        button {
          width: 3.08rem;
          height: 0.8rem;
          border-radius: 0.46rem;
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
          font-weight: 400;
          font-size: 0.32rem;
          line-height: 0.44rem;
        }
      }
    }
  }
  .text-box {
    background-color: #fff;
    color: #ff0000;
    font-size: 0.24rem;
    margin-bottom: 0.2rem;
    padding: 0.3rem 0.2rem 0.15rem 0.2rem;
    display: flex;
    flex-direction: column;
    width: 100%;
    .text-box__info {
      width: 100%;
      display: flex !important;
      flex-direction: row;
      margin-bottom: 0.2rem;
    }
    .text-info__title {
      font-weight: 600;
    }
    .text-info__content {
      font-weight: 400;
      flex: 1;
      text-align: left;
    }
  }
  .text-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    &__content {
      height: 2rem;
      width: 7rem;
      background: url("~@/assets/png/taskbg.png");
      background-size: 7.02rem 2rem;
      background-repeat: no-repeat;
      margin-bottom: 0.2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .tb-nick {
      padding-top: 0.1rem;
      font-size: 0.28rem;
      font-weight: 800;
      color: #fff;
      width: 5rem;
      text-align: center;
      border-top: 1px dashed #ff9a29;
    }
  }
  .key-text {
    -webkit-touch-callout: none;
    -moz-touch-callout: none;
    -ms-touch-callout: none;
    touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-weight: 400;
  }
}
.operate-box {
  padding-top: 0.2rem;
}
.my-btn {
  position: fixed;
  right: -1px;
  top: 7.8rem;
  width: 1.7rem;
  height: 0.65rem;
  line-height: 0.65rem;
  text-align: center;
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
  border: 1px solid #ff9a29;
  background-color: #ff9a29;
  color: #ffffff;
  font-size: 0.31rem;
}
.tb-order {
  // height: 2.1rem;
  // background-color: #fff;
  width: 100%;
  margin-top: 0.18rem;
  padding-bottom: 0;
  .tb-order_price {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 0.35rem;
    background-color: #fff;
  }
  .tb-order-header {
    font-size: 0.3rem;
    font-weight: 500;
    width: 6.9rem;
    margin: 0 auto;
    height: 0.98rem;
    line-height: 0.98rem;
  }
  .upload {
    width: 2.22rem;
    height: 2.22rem;
    margin: 0 auto;
  }
  .goods-price {
    width: 6.9rem;
    padding: 0 0.1rem;
    height: 0.65rem;
    outline: none;
    -webkit-appearance: none;
    box-shadow: none;
    border-radius: 3px;
    border: 1px solid #ddd;
    margin: 0 auto;
  }
  .input-box {
    position: relative;
    top: -0.2rem;
  }
  // .ta-c {
  //  padding-top: 0.3rem;
  // }
}
.screenshot {
  margin-bottom: 0.44rem;
}
.screenshot-no {
  margin: 0.44rem 0;
  .screenshot-button {
    margin-left: 0.35rem;
    width: 6.52rem;
    height: 0.92rem;
    line-height: 0.92rem;
    text-align: center;
    font-size: 0.32rem;
    color: #fff;
    background: rgba(255, 111, 0, 1);
    border-radius: 0.46rem;
    opacity: 0.5;
  }
}
.tb-word {
  width: 100%;
  height: 2.8rem;
  background-color: #fff;
  margin-top: 0.18rem;
  font-size: 0.3rem;
  .tb-word-header {
    width: 6.9rem;
    margin: 0 auto;
    height: 0.98rem;
    line-height: 0.98rem;
  }
  .tb-word-input {
    width: 6.9rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .left {
      width: 6.9rem;
      padding: 0 0.1rem;
      height: 0.6rem;
      outline: none;
      -webkit-appearance: none;
      box-shadow: none;
      border-radius: 3px;
      border: 1px solid #ddd;
    }
    .right {
      width: 6.9rem;
      height: 0.7rem;
      line-height: 0.7rem;
      border-radius: 0.46rem;
      color: #fff;
      margin-top: 0.3rem;
      background-color: #29b7a3;
      font-size: 0.32rem;
      text-align: center;
    }
  }
}

.operation-process {
  position: fixed;
  width: 100%;
  height: 13.5rem;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  z-index: 25;
  .process-box {
    width: 6.5rem;
    height: 2.3rem;
    margin: 3.98rem auto 0;
    background: rgba(255, 255, 255, 1);
    border-radius: 0.24rem;
    text-align: center;
    .process-title {
      font-size: 0.35rem;
      padding: 0.2rem;
      text-align: center;
    }
    img {
      width: 6.25rem;
    }
  }
}
</style>
