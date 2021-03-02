import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Home = () => import("@/pages/home")
const Order = () => import("@/pages/order")
const Role = () => import("@/pages/role")
const Type = () => import("@/pages/type")
const Index = () => import("@/pages/index")
const Score = () => import("@/pages/score")

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/home/index' },
    {
      path: '/home/index',
      component: Home,
      children: [
        { path: '/home/order', component: Order },
        { path: '/home/role', component: Role },
        { path: '/home/type', component: Type },
        { path: '/home/score', component: Score },
        { path: '/home/index', component: Index },
      ]
    },


  ]
})
