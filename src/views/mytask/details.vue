<template>
  <div class="operation-content">
    <task-details ref="taskDetails" detailType="detailMy" v-show="!isNew"></task-details>
    <task-details-new ref="taskDetailsNew" detailType="detailMy" v-show="isNew"></task-details-new>

  </div>
</template>

<script>

import TaskDetails from '@/components/TaskDetails'
import TaskDetailsNew from '@/components/TaskDetailsNew'

import {
  getTaskInfoHandler
} from '@/api/operation'
export default {
  components: { TaskDetails, TaskDetailsNew },
  data () {
    return {
      isNew: true
    }
  },
  mounted () {
    this.$refs.taskDetails.backForm.back_url = '/taskdetails'
    this.qrOrderId = this.$route.query.qr_order_id
    this.getTask()
  },
  destroyed () {

  },
  methods: {
    // 获取任务详情
    async getTask () {
      let _this = this
      let params = {
        task_id: this.qrOrderId
      }
      let childName = 'taskDetails'
      _this.isNew = false
      if (!_this.changeOV(params)) return false
      let data = await getTaskInfoHandler(params)
      if (data.code === _this.CONFIG.CODE_TASK_ORDER_INVALID) return _this.$router.push('/invalid')
      if (data.code === _this.CONFIG.CODE_SUCCESS) {
        if (data.result.task_type === _this.CONFIG.TASK_TYPE_IS) _this.isNew = true
        let taskInfo = data.result
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

</style>
