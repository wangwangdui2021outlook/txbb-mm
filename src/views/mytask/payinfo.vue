<template>
  <div class="payinfo-container">
    <div class="mytask-header">
      <div class="mytask-header__left header-item" @click="goback">
        <img class="back-icon" src="@/assets/png/back-icon.png" alt="" />
      </div>
      <div class="mytask-header__center header-item">我的收款信息</div>
      <div class="mytask-header__right header-item"></div>
    </div>
    <ul class="task-list" v-if="JSON.stringify(refundInfo) != '{}'">
      <li class="task-list__item">
        <p class="search-shop">
          <span>收款二维码：</span>
        </p>
        <p class="search-img" v-if="refundInfo.cdn_url">
          <img :src="refundInfo.cdn_url + refundInfo.collection_qr" alt="" />
        </p>
        <p class="pay-item">
          <span>真实姓名：</span>
          <span class="search-text">{{ refundInfo.true_name }}</span>
        </p>
        <p class="pay-item">
          <span>银行名称：</span>
          <span class="search-text">{{ refundInfo.bank_name }}</span>
        </p>
        <p class="pay-item">
          <span>银行卡号：</span>
          <span class="search-text">{{ refundInfo.bank_card_num }}</span>
        </p>
      </li>
    </ul>
    <div class="no_task-content" v-else>
      <p class="no_task-text">暂无信息</p>
    </div>
  </div>
</template>

<script>
import { getRefundInfoHandler } from '@/api/operation'
export default {
  data () {
    return {
      qrOrderId: '',
      pageView: '',
      refundInfo: {}
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
      _this.pageView = _this.$route.query.page_name
      _this.getRefundInfo()
    },
    // 返回上页面
    goback () {
      let qrOrderId = localStorage.getItem('qrOrderId')
      if (this.pageView === '/taskinfo') {
        this.$router.push({ path: this.pageView, query: { qr_order_id: qrOrderId, isDelay: true } })
      } else {
        this.$router.push({ path: this.pageView, query: { qr_order_id: this.qrOrderId, isDelay: true } })
      }
    },
    // 获取收款信息
    async getRefundInfo () {
      var _this = this
      let data = await getRefundInfoHandler()
      _this.refundInfo = (data.code === _this.CONFIG.CODE_SUCCESS) ? data.result : {}
    }
  }
}
</script>

<style lang="scss" scope>
html,
body {
  background-color: #f0f1f6;
}
.payinfo-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .mytask-header {
    display: flex;
    flex-direction: row;
    flex-direction: space-between;
    align-items: center;
    height: 0.88rem;
    width: 100%;
    background-color: #26a2ff;
    font-size: 0.32rem;
    color: #fff;
    .header-item {
      flex: 1;
      text-align: center;
    }
    &__left {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      padding-left: 0.15rem;
    }
    .back-icon {
      width: 0.5rem;
      height: 0.5rem;
    }
  }
  .task-list {
    padding: 0.3rem 0.2rem;
    list-style: none;
    &__item {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0.2rem;
      background-color: #fff;
      margin-bottom: 0.3rem;
      font-size: 0.3rem;
      border-radius: 3px;
      color: rgba(102, 102, 102, 1);
      .search-text {
        color: black;
        font-weight: 400;
      }
    }
    .search-shop {
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .search-img {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-top: 0.12rem;
      img {
        width: 2.22rem;
      }
      .img-mask {
        width: 2.22rem;
        position: absolute;
        z-index: 10;
      }
    }
  }
  .pay-item {
    margin-top: 15px;
  }
  .no_task-content {
    width: 100%;
    display: flex;
    flex: 1;
    justify-content: center;
    background: url("~@/assets/png/notask.png");
    background-size: 3.96rem 3.94rem;
    background-repeat: no-repeat;
    background-position: 1.78rem 2.86rem;
    .no_task-text {
      text-align: center;
      padding-top: 6.2rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 0.44rem;
    }
  }
}
</style>
