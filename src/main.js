import Vue from 'vue'
import App from './App.vue'
import store from './store'

import Antd, { Icon } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import './icon/iconfont'
import './common/common.css'

import './icon/iconfont'
import KityMinder from '../src/core/kityminder'
console.log('KityMinder: ', KityMinder)

// import ' '
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: ''
})
Vue.use(Antd)
Vue.component('IconFont', IconFont)
Vue.config.productionTip = false
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
