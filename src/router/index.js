import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
import Right from '@/components/rights/right.vue'
import Role from '@/components/rights/role.vue'
import GoodsList from '@/components/goods/goodslist.vue'
import GoodsAdd from '@/components/goods/goodadd.vue'
import Cateparams from '@/components/goods/cateparams.vue'
import GoodsCate from '@/components/goods/goodscate.vue'
// 此处不能使用this，必须用单独使用的方式进行引用
import { Message } from 'element-ui'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [{
        name: 'users',
        path: 'users',
        component: Users
      },
      {
        name: 'rights',
        path: 'rights',
        component: Right
      },
      {
        name: 'roles',
        path: 'roles',
        component: Role
      },
      {
        name: 'goods',
        path: 'goods',
        component: GoodsList
      },
      {
        name: 'goodsadd',
        // 由于没有请求访问，所以路由可以随便写
        path: 'goodsadd',
        component: GoodsAdd
      },
      {
        name: 'params',
        // 由于没有请求访问，所以路由可以随便写
        path: 'params',
        component: Cateparams
      },
      {
        name: 'categories',
        // 由于没有请求访问，所以路由可以随便写
        path: 'categories',
        component: GoodsCate
      }]
    }
  ]
})

// 路由配置生效之前，统一设置一些内容或判断token等是否生效
// 路由守卫：任何路由发起前所要的请求
router.beforeEach((to, from, next) => {
  // to：路由的目标
  // from：路由的来源
  // next：下一步
  // 判断token是否有效
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      // 此处不能使用this，必须用单独使用的方式进行引用
      Message.warning('没有登录，请首先登录！')
      // 没有token，执行登录
      router.push({
        name: 'login'
      })
    }
    next()
  }
})
export default router
