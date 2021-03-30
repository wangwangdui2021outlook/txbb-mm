<template>
  <div class="fiex-btn__box">
    <div
      v-for="(item, index) in btnLists"
      :key="index"
      :class="[item.className, 'btn-item']"
      @click="goView(item)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'fiexBtn',
  props: {
    urlInfo: {
      type: Object,
      default () {
        return {
          back_url: '',
          qrOrderId: ''
        }
      }
    }
  },

  data () {
    return {
      btnLists: [
        { name: '我的任务', url: '/mytask', className: 'mybtn' },
        { name: '收款信息', url: '/payInfo', className: 'paybtn' }
      ]
    }
  },
  mounted () { },
  methods: {
    goView (item) {
      var _this = this
      if (_this.urlInfo.back_url === '/taskinfo') {
        localStorage.setItem('qrOrderId', _this.urlInfo.qrOrderId)
      }
      _this.$router.push({ path: item.url, query: { qr_order_id: _this.urlInfo.qrOrderId, page_name: _this.urlInfo.back_url } })
    }
  }
}
</script>
<style lang='scss' scoped>
.fiex-btn__box {
  position: fixed;
  right: -1px;
  top: 8.4rem;
  .btn-item {
    width: 1.7rem;
    height: 0.65rem;
    line-height: 0.65rem;
    text-align: center;
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
    color: #ffffff;
    font-size: 0.31rem;
    margin-bottom: 15px;
  }
  .mybtn {
    border: 1px solid #ff9a29;
    background-color: #ff9a29;
  }
  .paybtn {
    border: 1px solid #2e6da4;
    background-color: #2e6da4;
  }
}
</style>
