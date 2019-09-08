// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import Home from './components/Home'
import OrderInfo from './components/OrderInfo'
import Vuex from 'vuex'
import Uuid from 'vue-uuid'
import VueCookie from 'vue-cookie'
import * as globalData from './util/config'
import { ToastPlugin, AjaxPlugin } from 'vux'
import echarts from 'echarts'

Vue.use(ToastPlugin)
Vue.use(AjaxPlugin)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Uuid)
Vue.use(VueCookie)
Vue.use(globalData)

Vue.prototype.$echarts = echarts

const store = new Vuex.Store({
  state: {
    openid: ''
  }
})

const routes = [{
  path: '/',
  component: Home
}, {
  path: '/info/:orderid',
  component: OrderInfo
}]

const router = new VueRouter({
  routes
})

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  store,
  router,
  mounted: function () {
    if (this.$cookie.get('openid') == null) {
      this.$cookie.set('openid', 'tp-' + this.$uuid.v1(), {expires: 30})
    }
    globalData.default.openid = this.$cookie.get('openid')
  },
  render: h => h(App)
}).$mount('#app-box')
