<template>
  <div class="invalid-content">
    <div class="invalid_qrcode-content">
      <p class="invalid-text">该二维码已失效</p>
    </div>

    <!-- <div class="my-btn" @click="goTaskList">我的任务</div> -->
    <fixed-btn :urlInfo="backForm" ref="fiexdbtns" />
  </div>
</template>

<script>

import FixedBtn from '@/components/FixedBtn'
export default {
  components: { FixedBtn },
  data () {
    return {
      backForm: {
        back_url: '/invalid',
        qrOrderId: ''
      }
    }
  },
  methods: {
    goTaskList () {
      var _this = this
      _this.$router.push({ path: '/mytask', query: { qr_order_id: '', page_name: '/invalid' } })
    }
  }

}
</script>

<style lang="scss" scope>
.invalid-content {
  .invalid_qrcode-content {
    width: 100%;
    height: 100%;
    background: url("~@/assets/png/invalid.png");
    background-size: 3.96rem 3.94rem;
    background-repeat: no-repeat;
    background-position: 1.78rem 2.86rem;
    .invalid-text {
      text-align: center;
      padding-top: 6.54rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 0.44rem;
    }
  }
  .my-btn {
    position: fixed;
    right: -1px;
    top: 4.4rem;
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
}
</style>
