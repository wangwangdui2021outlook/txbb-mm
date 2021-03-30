<template>
  <div class="register-success">
    <img class="success-img" src="@/assets/png/success.png" alt="" />
    <p class="success-title">注册成功</p>
    <input
      class="success-btn"
      type="button"
      value="返 回"
      @click="goto('/register')"
    />
  </div>
</template>

<script>

export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {
      device_id: ''
    }
  },
  created () {
    this.init()
  },
  mounted () { },
  methods: {
    // 初始化
    init () {
      let _this = this
      _this.device_id = _this.$route.query.device_id
    },
    // 返回注册
    goto (url) {
      this.$router.push({ path: url, query: { device_id: this.device_id } })
    }
  }
}
</script>

<style lang="scss" scoped>
.register-success {
  display: flex;
  width: 100%;
  height: 100%;
  background: #fff;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .success-img {
    width: 3.24rem;
    height: 1.8rem;
    margin-bottom: 0.5rem;
  }
  .success-title {
    color: #29b7a3;
    font-size: 0.45rem;
    font-weight: bolder;
    margin-bottom: 0.8rem;
  }
  .success-btn {
    width: 5rem;
    height: 0.85rem;
    border-radius: 0.45rem;
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
    border: none;
    transition: 0.1s;
    font-weight: 400;
    font-size: 0.32rem;
    line-height: 0.44rem;
  }
}
</style>
