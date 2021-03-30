<template>
  <div class="input-box">
    <input
      v-model="inputArr[n - 1]"
      type="number"
      class="number-input"
      v-for="n in inputNum"
      :key="n"
      oninput="if(value.length>1)value=value.slice(0,1);value=value.replace(/[^0-9.]+/,'')"
      onpaste="return false"
      v-on:input="getIndex(n)"
      ref="orderInput"
      pattern="[0-9]*"
    />
  </div>
</template>

<script>
export default {
  name: 'inputBox',
  props: {
    inputNum: {
      type: Number
    }
  },
  data () {
    return {
      inputArr: []
    }
  },
  mounted () { },

  methods: {
    getIndex (n) {
      if (n < this.CONFIG.TB_ORDER_NUM && this.inputArr[n - 1]) {
        this.$refs.orderInput[n].focus()
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.input-box {
  height: 100%;
  width: 100%;
  text-align: center;
  .number-input {
    width: 0.5rem;
    height: 0.5rem;
    margin: 0.1rem;
    text-align: center;
    border: 1px solid #ddd;
    outline: none;
  }
}

*:not(input) {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
