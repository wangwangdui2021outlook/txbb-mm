<template>
  <div class="Upload" :class="isTianjia ? 'bac-img2' : 'bac-img1'" @click="uploadImg(this)">
    <input
      type="file"
      @change="addImg"
      ref="inputer"
      accept="image/*"
      style="display:none"
      :id="'upload' + tid"
    />
    <img
      v-if="isShowImg && id_card_pic"
      :src="CDN_UP_URL + id_card_pic"
      alt=""
    />
  </div>
</template>

<script>
import lrz from 'lrz'
import { uploaderFileHandle } from '@/api/uploaderFile'
import { MessageBox } from 'mint-ui'

export default {
  props: ['tid', 'isShowImg', 'isPayInfo', 'isTianjia'],
  name: 'Upload',
  data () {
    return {
      fil: null,
      id_card_pic: null
    }
  },
  mounted () { },
  methods: {
    uploadImg (a) {
      var _this = this
      document.getElementById('upload' + _this.tid).click()
    },
    addImg () {
      let _this = this
      let inputDOM = _this.$refs.inputer
      // 通过DOM取文件数据
      if (!inputDOM.files[0]) return false
      _this.fil = inputDOM.files[0]
      let size = Math.floor(_this.fil.size / 1024)
      if (size > 1024) return MessageBox.alert('请上传小于1MB的图片')
      lrz(_this.fil, {
        width: _this.UPLOAD_IMAGE_SIZE,
        quality: _this.UPLOAD_IMAGE_QUALITY
      }).then(async results => {
        // 你需要的数据都在这里，可以以字符串的形式传送base64给服务端转存为图片。
        if (!results.base64) return MessageBox.alert('上传出错！请重新登录后再尝试上传图片！')
        let params = { img_base: encodeURIComponent(results.base64) }
        if (_this.isPayInfo) {
          params.type = 'COL_QR'
        }
        let data = await uploaderFileHandle(params)
        if (data.code !== _this.CONFIG.CODE_SUCCESS) return MessageBox.alert(data.msg)
        _this.id_card_pic = data.msg
        if (!_this.isShowImg) return _this.$emit('addImg', data.msg)
        _this.$emit('addOneImg', data.msg)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Upload {
  width: 2.22rem;
  height: 2.22rem;
  overflow: hidden;
  margin: 0 auto;
  img {
    width: 2.22rem;
    height: 2.22rem;
  }
}
.bac-img1{
  background-repeat: no-repeat;
  background-size: 100%;
  background-image: url("~@/assets/png/cross.png");
}
.bac-img2{
  background-repeat: no-repeat;
  background-size: 100%;
  background-image: url("~@/assets/png/tianjia.png");
}
</style>
