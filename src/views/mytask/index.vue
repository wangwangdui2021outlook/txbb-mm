<template>
  <div class="mytask-container">
    <div class="mytask-header">
      <div class="mytask-header__left header-item" @click="goback">
        <img class="back-icon" src="@/assets/png/back-icon.png" alt="" />
      </div>
      <div class="mytask-header__center header-item">我的任务</div>
      <div class="mytask-header__right header-item"></div>
    </div>
    <ul class="task-list" v-if="taskList.length > 0">
      <li
        @click="taskDetails(item)"
        class="task-list__item"
        v-for="(item, index) in taskList"
        :key="index"
      >
        <p class="search-shop">
          <span>店铺名</span>
          <span class="search-text">{{ item.shop_name }}</span>
        </p>
        <p class="search-img">
          <img class="img-mask" src="@/assets/png/mask.png" alt="" />
          <img :src="item.item_pic" alt="" />
        </p>
      </li>
    </ul>
    <div class="no_task-content" v-else>
      <p class="no_task-text">暂无任务</p>
    </div>
  </div>
</template>

<script>
import { getMyTaskListHandler } from '@/api/operation'
export default {
  data () {
    return {
      qrOrderId: '',
      pageView: '',
      taskList: []
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
      _this.getMyTaskList()
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
    // 隐藏店铺部分
    parseStringToStar (str) {
      if (!str) return ''
      return str.length > 2 ? str.substr(0, 1) + new Array(str.length - 2).join('*') + str.substr(-1) : str
    },
    // 获取热表我的任务列表
    async getMyTaskList () {
      var _this = this
      let data = await getMyTaskListHandler()
      _this.taskList = (data.code === _this.CONFIG.CODE_SUCCESS) ? data.result : []
    },
    // 任务详情
    taskDetails (item) {
      this.$router.push({ path: '/taskdetails', query: { qr_order_id: item.id, isDelay: true } })
    }
  }
}
</script>

<style lang="scss" scope>
html,
body {
  background-color: #f0f1f6;
}
.mytask-container {
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
      height: 0.88rem;
      line-height: 0.88rem;
    }
    &__left {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      padding-left: 0.15rem;
      height: 0.88rem;
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
      height: 2.5rem;
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-top: 0.12rem;
      img {
        width: 2.22rem;
        height: 2.22rem;
      }
      .img-mask {
        width: 2.22rem;
        height: 2.22rem;
        position: absolute;
        z-index: 10;
      }
    }
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
