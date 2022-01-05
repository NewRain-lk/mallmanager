<template>
  <div class="login-warp">
    <el-form label-position="top"
             label-width="80px"
             :model="formdata"
             class="login-form">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"
                  type="password"></el-input>
      </el-form-item>
      <el-button type="primary"
                 class="login-btn"
                 @click.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 登录请求
    async handleLogin () {
      // 异步操作
      // this.$http.post('login', this.formdata).then((res) => {
      //   console.log('res=', res)
      //   // 登录成功：跳转到HOME，提示成功
      //   // 登录失败：提示消息
      //   const {
      //     data,
      //     meta: {
      //       msg,
      //       status
      //     }
      //   } = res.data
      //   if (status === 200) {
      //     this.$router.push({
      //       name: 'home'
      //     })
      //     this.$message.success(msg)
      //   } else {
      //     this.$message.error(msg)
      //   }
      // })

      // 同步执行
      const res = await this.$http.post('login', this.formdata)

      const {
        data,
        meta: {
          msg,
          status
        }
      } = res.data
      if (status === 200) {
        // 保存token
        localStorage.setItem('token', data.token)
        this.$router.push({
          name: 'home'
        })
        // 用的是elementui的组件
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style>
.login-warp {
  height: 100%;
  background-color: #324152;
  /**弹性布局，居中 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-warp .login-form {
  width: 400px;
  background-color: #fff;
  border-radius: 5px;
  padding: 30px;
}

.login-warp .login-form .login-btn {
  width: 100%;
}
</style>
