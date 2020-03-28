// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { Dialog, Input, Button, Message, Row, Col, Notification } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Dialog)
Vue.use(Input)
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
// Vue.use(Notification)
// Vue.use(Message)

Vue.config.productionTip = false

Vue.prototype.$message = Message
Vue.prototype.$notify = Notification
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
