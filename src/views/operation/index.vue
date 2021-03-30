<template>
  <div class="layout-box payinfo-content">
    <div class="task-content" v-if="isShow">
      <div class="text-content operate-box">
        <div class="text-header">
          <div class="text-header__content">
            <p class="title">
              请填写收款信息
            </p>
            <p class="tb-nick">
              为了能及时收到返款，请务必填写准确
            </p>
          </div>
        </div>
      </div>
      <div class="form-box">
        <div class="receivables">
          <div class="text">
            <div style="float: left;">请上传微信收款码：</div>
          </div>
        </div>
        <div class="imgs">
          <upload
            ref="idPic"
            :tid="2"
            :isPayInfo="true"
            @addOneImg="getImgUrl"
            :isShowImg="true"
          ></upload>
          <div class="upload-tips">请上传小于1MB的图片</div>
        </div>
      </div>
      <div class="form-inputs">
        <mt-field
          label="真实姓名"
          placeholder="请输入您的真实姓名"
          v-model.trim="bankInfo.true_name"
        ></mt-field>
        <mt-field
          v-if="
            userInfo.industry_status == CONFIG.INDUSTRY_STATUS_OPEN && isCardId
          "
          label="身份证号"
          placeholder="请输入您的身份证号码"
          v-model.trim="id_card_num"
        ></mt-field>
        <mt-field
          label="开户银行"
          placeholder="请选择您的开户银行"
          v-model.trim="bankInfo.bank_name"
          @click.native="bankVisible = true"
          :readonly="true"
        ></mt-field>
        <!-- <mt-field
          label="开户支行"
          placeholder="请输入您的开户支行"
          v-model="bankInfo.bank_branch"
        ></mt-field> -->
        <mt-field
          label="银行卡号"
          type="number"
          placeholder="请输入您的银行卡号"
          v-model.trim="bankInfo.bank_card_num"
        ></mt-field>
      </div>
      <div class="form-box">
        <p class="beizhu" v-if="submitNum >= CONFIG.PAY_INFO_LIMIT">
          今天提交错误过多，请明天再试
        </p>
        <input
          type="button"
          id="submit"
          value="提交"
          @click="setUserRefundInfo"
          :disabled="submitNum >= CONFIG.PAY_INFO_LIMIT"
        />
      </div>
    </div>

    <mt-popup style="width: 100%;" v-model="bankVisible" position="bottom">
      <mt-picker :slots="bankSlots" @change="onValuesChange"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
/* eslint-disable */
import { getUserRefundTimeHandler, setUserRefundInfoHandler, setIndustryUserRefundInfoHandler, getRefundInfoHandler } from '@/api/operation'
import { MessageBox } from 'mint-ui'
import { getUserInfo } from '@/util/userAuth'
export default {
  data () {
    return {
      bankVisible: false,
      isShow: false,
      bankInfo: {
        true_name: '',
        bank_name: '',
        bank_card_num: '',
        collection_qr: ''
      },
      userInfo: getUserInfo(),
      id_card_num: '', // 身份证号，行业版要用
      bankSlots: [
        {
          flex: 1,
          values: [
            '中国银行',
            '中国工商银行',
            '中国建设银行',
            '中国农业银行',
            '交通银行',
            '中国邮政储蓄银行',
            '兴业银行',
            '中信银行',
            '招商银行',
            '中国民生银行',
            '中国光大银行'
          ],
          className: 'slot1',
          textAlign: 'center'
        }
      ],
      isCardId: false,
      qrOrderId: null,
      industry_status: null,
      imgUrl: '',
      submitNum: 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.bankSlots[0].defaultIndex = 0
    })
    this.init()
  },
  methods: {
    // 获取当天提交返款次数
    async getUserRefundTime () {
      let _this = this
      const data = await getUserRefundTimeHandler()
      if (data.code !== _this.CONFIG.CODE_SUCCESS) MessageBox.alert(data.msg)
      _this.submitNum = data.result.num
    },
    // 初始化
    init () {
      let _this = this
      _this.qrOrderId = _this.$route.query.qr_order_id
      _this.industry_status = _this.$route.query.industry_status
      localStorage.setItem('qrOrderId', _this.$route.query.qr_order_id)
      if (!_this.qrOrderId) return _this.$router.push('/invalid')
      _this.getRefundInfo()
    },
    // 银行卡选择
    onValuesChange (picker, values) {
      var _this = this
      if (_this.bankVisible) {
        _this.bankInfo.bank_name = values[0]
      }
    },
    // 获取图片上传路径
    getImgUrl (imgUrl) {
      this.imgUrl = imgUrl
    },
    // 接单
    async getRefundInfo () {
      let _this = this
      let params = { qr_id: _this.qrOrderId }
      if (!_this.changeOV(params)) return false
      let data = await getRefundInfoHandler(params)
      if (data.code === _this.CONFIG.CODE_USER_REFUND_INFO_NOT_EXIT) {
        _this.isShow = true
        _this.isCardId = (data.result.refund_type == _this.CONFIG.PAY_CARDID_YES) ? true : false
        _this.getUserRefundTime()
        return false
      }
      _this.$router.push({ path: '/taskinfo', query: { qr_order_id: _this.qrOrderId, industry_status: _this.industry_status } })
    },
    // 提交返款信息
    async setUserRefundInfo () {
      var _this = this
      _this.bankInfo.bank_card_num = _this.bankInfo.bank_card_num.replace(/\s*/g, '')
      let params = { ...this.bankInfo }
      params.collection_qr = _this.imgUrl
      if (!_this.changeOV(params)) return MessageBox.alert('所有信息不能为空！')
      let bankNumLen = params.bank_card_num.length
      let twoStr = params.bank_card_num.substr(0, 2)
      if (twoStr !== '62' || bankNumLen < 14 || bankNumLen > 19) return MessageBox.alert('请使用标准银联银行卡，感谢您的配合！')
      let data = {}
      if (_this.userInfo.industry_status == _this.CONFIG.INDUSTRY_STATUS_OPEN && _this.isCardId) {
        if (!_this.id_card_num) return MessageBox.alert('身份证号不能为空！')
        params.id_card_num = _this.id_card_num
        data = await setIndustryUserRefundInfoHandler(params)
      } else {
        data = await setUserRefundInfoHandler(params)
      }
      if (data.code === _this.CONFIG.CODE_SUCCESS) {
        setTimeout(() => {
          return MessageBox({
            title: '提示',
            message: data.msg,
            showCancelButton: false,
            closeOnClickModal: false,
            confirmButtonHighlight: true,
            confirmButtonText: '继续任务'
          }).then(action => {
            _this.$router.push({ path: '/taskinfo', query: { qr_order_id: _this.qrOrderId, industry_status: _this.industry_status } })
          })
        }, 1000)
      } else {
        MessageBox({
          title: '提示',
          message: data.msg,
          showCancelButton: false,
          closeOnClickModal: false,
          confirmButtonHighlight: true,
          confirmButtonText: '重新填写'
        }).then(action => {
          _this.getUserRefundTime()
        })
      }
    }
  }
}
</script>

<style lang="scss" scope>
html,
body {
  background-color: #f0f1f6;
}
.layout-box >>> .mint-popup {
  width: 100%;
  background-color: #fff;
  text-align: center;
}
.payinfo-conten >>> .mint-cell-wrapper {
  border-bottom: 1px solid #f1f1f1;
  font-size: 0.3rem;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}
.payinfo-conten >>> .mint-popup {
  background-color: transparent;
  text-align: center;
}
.payinfo-conten >>> .mint-popup {
  width: 100%;
  background-color: #fff;
  text-align: center;
}
.mint-cell-wrapper {
  .mint-cell-title {
    width: 1.6rem;
  }
  .mint-cell-text {
    font-size: 0.3rem;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
  }
  .mint-field-core {
    font-size: 0.3rem;
  }
}
.layout-box {
  width: 100%;
  padding-bottom: 0.3rem;
  .task-content {
    width: 100%;
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
    .form-inputs {
      width: 100%;
      height: auto;
      background-color: #fff;
      margin-top: 0.18rem;
      .input-item {
        .text {
          height: 0.98rem;
          width: 6.9rem;
          margin: 0 auto;
          p {
            font-size: 0.3rem;
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
            line-height: 0.98rem;
            height: 0.98rem;
          }
        }
        .input-box {
          width: 6.9rem;
          margin: 0 auto;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          input {
            width: 100%;
            height: 0.7rem;
            border: 1px solid #dcdfe6;
            border-radius: 0.1rem;
            padding: 0 0.2rem;
            outline: 0;
            font-size: 0.24rem;
            transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          }
        }
      }
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
    .form-box {
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
        .upload-tips {
          font-size: 0.25rem;
          padding-top: 0.5rem;
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
      margin-top: 0.4rem;
      text-align: center;
      font-size: 0.2rem;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 0.28rem;
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
}
</style>
