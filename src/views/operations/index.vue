<template>
  <div class="operation-content">
    <div class="no_task-content" v-if="JSON.stringify(taskInfo) === '{}'">
      <p class="no_task-text">{{ msg }}</p>
    </div>
    <div
      class="task-content"
      v-if="
        isTask &&
          (taskInfo.status == CONFIG.ORDER_STATUS_WAIT_DOING ||
            taskInfo.status == CONFIG.ORDER_STATUS_TIME_OUT)
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
              <span v-if="timeRemaining > 0">
                请在{{ timeRemaining }}分钟内完成
              </span>
              <span v-else>已超时！</span>
            </p>
            <p
              class="title"
              v-if="taskInfo.status == CONFIG.ORDER_STATUS_CANCEL"
            >
              该任务审核失败
            </p>

            <p class="title" v-if="taskInfo.status == CONFIG.ORDER_STATUS_DONE">
              该任务已完成
            </p>
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
        <div class="text" style="border-bottom:0.02rem solid #F1F1F1">
          <div style="float:left;">搜索关键字</div>
          <div class="key-text" style="float:right;font-weight:400;">
            {{ taskInfo.task_method_details }}
          </div>
        </div>
        <div class="text">
          <div style="float:left;">价格</div>
          <div
            style="float:right;color:#FD3B10;font-weight:400;font-size:0.28rem"
          >
            拍￥{{ taskInfo.single_task_price }}选项
          </div>
        </div>
      </div>
      <div class="shop">
        <div class="text">
          <div style="float:left;">店铺名</div>
          <div style="float:right;font-weight:400;">
            {{ taskInfo.shop_name }}
          </div>
        </div>
        <div class="imgs">
          <img class="img-mask" src="@/assets/png/mask.png" alt="" />
          <img :src="taskInfo.item_pic" alt="" />
        </div>
      </div>
      <div>
        <p class="finish_text">任务操作完成后</p>
        <div class="receivables">
          <div class="text">
            <div style="float:left;">微信收款码</div>
            <div
              style="float:right;font-weight:400;font-size:0.2rem;color:#FF0000"
            >
              *请将微信收款码图片上传并点击提交（必填）
            </div>
          </div>
        </div>
        <form>
          <div class="imgs ta-c">
            <upload
              v-if="
                taskInfo.status == CONFIG.ORDER_STATUS_WAIT_DOING ||
                  taskInfo.status == CONFIG.ORDER_STATUS_TIME_OUT
              "
              ref="idPic"
              :tid="2"
              @addOneImg="getImgUrl"
              :isShowImg="true"
            ></upload>
            <img
              v-else
              :src="CDN_UP_URL + taskInfo.buyer_collection_qr"
              alt=""
            />
          </div>
          <input
            type="button"
            :value="
              taskInfo.status == CONFIG.ORDER_STATUS_WAIT_DOING ||
              taskInfo.status == CONFIG.ORDER_STATUS_TIME_OUT
                ? '提交'
                : '任务已提交'
            "
            id="submit"
            @click="commitTask()"
            :class="{ ChangeColor: data.status }"
            :disabled="taskInfo.status != CONFIG.ORDER_STATUS_WAIT_DOING"
          />
        </form>
        <p class="beizhu">
          <img
            src="@/assets/png/gantanhao.png"
            alt=""
          />5分钟返款，请留意微信收款信息
        </p>
      </div>

      <div class="background" v-show="isshow">
        <div class="content">
          <img src="@/assets/png/book.png" alt="" />
          <p>提交成功</p>
          <button type="button" @click="onshow(isshow)">关闭</button>
        </div>
      </div>
    </div>

    <div
      class="has_push-content"
      v-if="
        isTask &&
          (taskInfo.status != CONFIG.ORDER_STATUS_WAIT_DOING &&
            taskInfo.status != CONFIG.ORDER_STATUS_TIME_OUT)
      "
    >
      <p class="no_task-text">提交成功</p>
    </div>
  </div>
</template>

<script>
import { getTaskHandler, commitTaskHandler } from '@/api/operation'
import { MessageBox } from 'mint-ui'

export default {
  data () {
    return {
      isshow: false,
      isTask: false,
      dialogVisible: false,
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
      imgUrl: '',
      // 剩余时间
      timeRemaining: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 初始化
    init () {
      let _this = this
      // _this.qrOrderId = _this.$route.query.qr_order_id
      // if (!_this.qrOrderId) {
      //   _this.$router.push('/invalid')
      //   return false
      // }
      _this.getTask()
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
    },
    // 接单
    async getTask () {
      let _this = this
      let params = {
        qr_id: _this.qrOrderId
      }
      if (!_this.changeOV(params)) return false
      let data = await getTaskHandler(params)
      // if (data.code === _this.CONFIG.CODE_TASK_ORDER_INVALID) {
      //   _this.$router.push('/invalid')
      //   return false
      // }
      if (data.code === _this.CONFIG.CODE_USER_REFUND_INFO_NOT_EXIT) {
        _this.taskInfo = {}
        return false
      }

      if (data.code === _this.CONFIG.CODE_SUCCESS) {
        _this.taskInfo = data.result.task_info
        _this.isTask = true
        let lSecond = (new Date().getTime() - new Date((data.result.task_info.gmt_update).replace(/-/g, '/')).getTime())
        lSecond = parseInt(lSecond / 1000)

        _this.timeRemaining = (_this.ORDER_DOING_LIMIT_TIME * 60) - lSecond
        if (_this.timeRemaining < 0) {
          return false
        }
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
        return false
      } else {
        _this.isTask = false
        _this.taskInfo = {}
        _this.msg = data.msg
      }
      // return MessageBox.alert(data.msg)
    },
    // 做单
    async commitTask () {
      let _this = this
      let params = {
        task_id: _this.encodeId(_this.taskInfo.id),
        payment_url: _this.imgUrl
      }
      if (!_this.changeOV(params)) return MessageBox.alert('请上传收款码！')
      let data = await commitTaskHandler(params)
      if (data.code === this.CONFIG.CODE_SUCCESS) {
        _this.isshow = true
        _this.taskInfo.status = _this.CONFIG.ORDER_STATUS_WAITING_AUDIT
        _this.taskInfo.buyer_collection_qr = _this.imgUrl
        return false
      }
      return MessageBox.alert(data.msg)
    },
    asteriskText (tbnick) {
      if (!tbnick) return ''
      let str = tbnick.substr(0, parseInt(tbnick.split('').length / 2)) + '*' + tbnick.substr(parseInt(tbnick.split('').length / 2 + 1), tbnick.split('').length)
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
    height: 16.72rem;
    background: rgba(240, 241, 246, 1);
    // .ChangeColor {
    //   opacity: 0.5;
    // }
    .text-content {
      width: 100%;
      // background: rgba(255, 99, 30, 1);
      .title {
        text-align: center;
        font-size: 0.35rem;
        font-weight: 800;
        color: rgba(255, 255, 255, 1);
        padding-bottom: 0.2rem;
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
      height: 1.98rem;
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
      height: 16.72rem;
      background-color: rgba(0, 0, 0, 0.5);
      top: 0;
      .content {
        width: 4.74rem;
        height: 4.64rem;
        margin: 3.98rem auto 0;
        background: rgba(255, 255, 255, 1);
        border-radius: 0.24rem;
        text-align: center;
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
      height: 1.95rem;
      width: 7rem;
      background: url("~@/assets/png/taskbg.png");
      background-size: 7.02rem 1.96rem;
      background-repeat: no-repeat;
      margin-bottom: 0.2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .tb-nick {
      padding-top: 0.2rem;
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
  }
}
.operate-box {
  padding-top: 0.2rem;
}
</style>
