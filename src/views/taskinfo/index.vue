<template>
  <div class="operation-content">
    <task-details
      ref="taskDetails"
      detailType="detailHome"
      v-show="onProcess && !isNew"
    ></task-details>
    <task-details-new
      ref="taskDetailsNew"
      detailType="detailHome"
      v-show="onProcess && isNew"
    ></task-details-new>
    <div class="operation-process" v-if="!onProcess">
      <div class="process-box">
        <img class="process-gif" src="@/assets/png/process.gif" alt="" />
        <p class="process-title">正在加载，稍等片刻…</p>
      </div>
    </div>
  </div>
</template>

<script>

import TaskDetails from '@/components/TaskDetails'
import TaskDetailsNew from '@/components/TaskDetailsNew'

import {
  getTaskHandler
} from '@/api/operation'
export default {
  components: { TaskDetails, TaskDetailsNew },
  data () {
    return {
      onProcess: true,
      qrOrderId: null,
      industry_status: null,
      isNew: false
    }
  },
  mounted () {
    this.onProcess = false
    this.qrOrderId = this.$route.query.qr_order_id
    this.industry_status = this.$route.query.industry_status
    this.$refs.taskDetails.backForm.back_url = '/taskinfo'
    this.getTask()
    this.timeObj = setTimeout(() => {
      this.onProcess = true
      clearTimeout(this.timeObj)
    }, 5000)
  },
  destroyed () {
    var start = this.timeObj - 100 > 0 ? this.timeObj - 100 : 0
    for (var i = start; i <= this.timeObj; i++) {
      clearTimeout(i)
    }
    this.timeObj = null
    this.onProcess = false
  },
  methods: {
    // 接单
    async getTask () {
      let _this = this
      let params = {
        qr_id: this.qrOrderId
      }
      _this.isNew = false
      let childName = 'taskDetails'
      if (!_this.changeOV(params)) return false
      let data = await getTaskHandler(params)
      if (data.code === _this.CONFIG.CODE_TASK_ORDER_INVALID) return _this.$router.push('/invalid')
      if (data.code === _this.CONFIG.CODE_TOKEN_INVALID) return _this.$router.push({ path: '/login', query: { qr_order_id: _this.qrOrderId, industry_status: _this.industry_status } })
      if (data.code === _this.CONFIG.CODE_SUCCESS) {
        if (data.result.task_info.task_type === _this.CONFIG.TASK_TYPE_IS) _this.isNew = true
        let taskInfo = data.result.task_info
        if (_this.isNew) {
          childName = 'taskDetailsNew'
          if (taskInfo.gmt_start) {
            let gmtStart = new Date(taskInfo.gmt_start)
            let showTime = gmtStart.getHours()
            taskInfo.priceTime = showTime + ':00-' + (showTime + 1) + ':00'
            let tommore = new Date(gmtStart.getTime() + 24 * 60 * 60 * 1000)
            let nowData = new Date()
            taskInfo.canShow = false
            if (tommore.getFullYear() === nowData.getFullYear() && tommore.getMonth() === nowData.getMonth() && tommore.getDate() === nowData.getDate()) {
              taskInfo.canShow = true
            }
          }
        }
        _this.$refs[childName].taskInfo = taskInfo
        _this.$refs[childName].isTask = true
        _this.$refs[childName].countDown()
      } else {
        _this.$refs[childName].isTask = false
        _this.$refs[childName].taskInfo = {}
        _this.$refs[childName].msg = data.msg
      }
    }
  }
}
</script>

<style lang="scss" scope>
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
