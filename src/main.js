// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
// 导入自定义的组件
import MyBread from '@/components/cuscom/myBread.vue'
import router from './router'
// 引入自定义样式，全局样式
import '@/assets/css/reset.css'

// 导入自定义的axios插件
import MyHttpServer from '@/plugins/http.js'

// 导入时间处理函数
import moment from 'moment'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(MyHttpServer)
/**
 * 使用自定义组件
 * 1.如果未定义名字，则使用：Vue.component('my-bread', MyBread)
 * 2.如果定义了名字，则使用：Vue.component('my-bread', MyBread)
 */
Vue.component(MyBread.name, MyBread)

/**
 * 全局过滤器，用于处理时间
 */
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
