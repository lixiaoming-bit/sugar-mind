import Vue from 'vue'
import App from './App.vue'
import store from './store'

import Antd, { Icon } from 'ant-design-vue'
import { Sketch, Compact } from 'vue-color'

import 'ant-design-vue/dist/antd.less'
import './icon/iconfont'
import './common/common.css'

import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'

// import ' '
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: ''
})
Vue.use(Antd)
Vue.use(contentmenu)

Vue.component('IconFont', IconFont)
Vue.component('SketchPicker', Sketch)
Vue.component('Compact', Compact)
Vue.config.productionTip = false
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
