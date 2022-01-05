<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="../../assets/heima.png"
                 alt="无法显示图片">
          </div>
        </el-col>
        <el-col :span="18"
                class="middle">
          <h3>电商后台管理系统</h3>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <a href="#"
               class="loginout"
               @click.prevent="handelSingout()">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px"
                class="aside">
        <el-menu :unique-opened="true"
                 :router="true">
          <!--1-->
          <el-submenu :index="''+item.order"
                      v-for="item in menus"
                      :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <!--index：路由-->
            <el-menu-item :index="subItem.path"
                          v-for="subItem in item.children"
                          :key="subItem.id">
              <i class="el-icon-user"></i>
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <!--此处为子组件创建容器-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menus: []
    }
  },
  // 获取token
  // 如果没有token，则跳转至登录，否则进行组件渲染
  // newVue之间自动触发并执行
  // 使用路由守卫后，以下这段代码注销
  // beforeCreate () {
  //   const token = localStorage.getItem('token')
  //   if (!token) {
  //     // 没有token，执行登录
  //     this.$router.push({
  //       name: 'login'
  //     })
  //   }
  // },
  created () {
    this.getMenus()
  },
  methods: {
    // 清除token
    handelSingout () {
      localStorage.clear()
      this.$message.success('退出成功！')
      this.$router.push({
        name: 'login'
      })
    },
    async getMenus () {
      const res = await this.$http.get(`menus`)
      this.menus = res.data.data
    }
  }
}
</script>

<style>
.container {
  background-color: #b3c0d1;
  height: 100%;
}

.header {
}

.middle {
  /* line-height: 60px; */
  text-align: center;
}

.loginout {
  line-height: 60px;
}

.aside {
  background-color: #d3dcd6;
}

.main {
  background-color: #e9eef3;
}
</style>
