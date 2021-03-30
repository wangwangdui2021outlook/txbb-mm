// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable no-new */
import Vue from 'vue'
import App from './App'
import router from '@/router'
import '../src/assets/common/remConfig.js'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import Config from './util/common'
import * as filters from '@/filters'
import './permission.js'
import upload from './components/Upload/index.js'

Vue.use(MintUI)
Vue.config.productionTip = false
Object.keys(Config).forEach(key => {
  Vue.prototype[key] = Config[key]
})
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))
Vue.use(upload)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
