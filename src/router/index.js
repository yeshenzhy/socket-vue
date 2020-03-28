import Vue from 'vue'
import Router from 'vue-router'
import socketDemo from '@/components/socketDemo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'socket',
      redirect: '/socket-demo'
    }, {
      path: '/socket-demo',
      name: 'socket',
      component: socketDemo
    }
  ]
})
