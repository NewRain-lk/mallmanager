<template>
  <el-card class="box-card">
    <!--1.面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--2.搜索框-->
    <el-row class="searchRow">
      <el-col>
        <!--查看文档后，有一个clear事件-->
        <el-input placeholder="请输入内容"
                  v-model="query"
                  class="input-with-select"
                  clearable
                  @clear="loaduserlist()">
          <el-button slot="append"
                     icon="el-icon-search"
                     @click.prevent="serachUser"></el-button>
        </el-input>
        <el-button type="success"
                   plain
                   @click.prevent="showAddUserForm">添加用户</el-button>
      </el-col>
    </el-row>
    <!--3.表格-->
    <el-table :data="userlist"
              style="width: 100%">
      <el-table-column type="index"
                       label="#"
                       width="60">
      </el-table-column>
      <el-table-column prop="username"
                       label="姓名"
                       width="180">
      </el-table-column>
      <el-table-column prop="email"
                       label="邮箱">
      </el-table-column>
      <el-table-column prop="mobile"
                       label="电话">
      </el-table-column>
      <!--【|】不好用，prop属性不能直接使用-->
      <el-table-column label="创建时间">
        <!--
            1、相当于创建一个组件，所以需要引用数据源，数据源必须使用原始数据源
            2、数据源自带ROW属性
            3、最后使用{{}}进行数据的处理
            4、如果将数据源改为其他名称，则会自动找上一级的数据源，比如scope自动会找userlist
          -->
        <template slot-scope="scope">
          {{ scope.row.create_time | fmtdate }}
        </template>
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     @change="changeState(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!--scope是user，user中本身就有ID，所以在渲染的时候可以直接将ID给到函数的参数中-->
        <template slot-scope="scope">
          <el-row>
            <!--此处需要将数据显示到对话框中，所以应该传递整个模型-->
            <el-button type="primary"
                       icon="el-icon-edit"
                       circle
                       size="mini"
                       plain
                       @click.prevent="showEditFrom(scope.row)"></el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       circle
                       size="mini"
                       plain
                       @click.prevent="showDelForm(scope.row.id)"></el-button>
            <el-button type="success"
                       icon="el-icon-s-tools"
                       circle
                       size="mini"
                       plain
                       @click.prevent="showRoleForm(scope.row)"></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!--4.分页-->
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pagenum"
                   :page-sizes="[2, 4, 6, 8]"
                   :page-size="pagesize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
    <!--5.添加用户-->
    <el-dialog title="添加用户"
               :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名"
                      :label-width="formLabelWidth">
          <el-input v-model="form.username"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      :label-width="formLabelWidth">
          <el-input v-model="form.password"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      :label-width="formLabelWidth">
          <el-input v-model="form.email"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      :label-width="formLabelWidth">
          <el-input v-model="form.mobile"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary"
                   @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!--6.编辑用户-->
    <el-dialog title="添加用户"
               :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名"
                      :label-width="formLabelWidth">
          <el-input v-model="form.username"
                    autocomplete="off"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      :label-width="formLabelWidth">
          <el-input v-model="form.email"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      :label-width="formLabelWidth">
          <el-input v-model="form.mobile"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary"
                   @click="editUser(form.id)">确 定</el-button>
      </div>
    </el-dialog>
    <!--6.角色配置-->
    <el-dialog title="分配角色"
               :visible.sync="dialogFormVisibleRole">
      <el-form>
        <el-form-item label="用户名称"
                      :label-width="formLabelWidth">
          {{curUserName}}
        </el-form-item>
        <el-form-item label="所属角色"
                      :label-width="formLabelWidth">
          <!--
              1、如果外层select绑定数据的值，和option的value一样，应当显示该option的值
              2、当前没有，所以默认的角色应该为“请选择”
            -->
          <el-select v-model="curRoleId"
                     placeholder="请选择活动区域">
            <el-option label="请选择"
                       :value="-1"></el-option>
            <el-option :label="item.roleName"
                       :value="item.id"
                       :key="item.id"
                       v-for="item in roles"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary"
                   @click.prevent="changeUserRoles">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      userlist: [],
      total: -1,
      pagenum: 1,
      pagesize: 2,
      // 对话框的相关属性
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      formLabelWidth: '100px',
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 角色处理
      curRoleId: -1,
      curUserName: '',
      curUserId: -1,
      roles: []
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      /**
       * 查看接口文档
       * query 查询参数可以为空
       * pagenum 当前页码不能为空
       * pagesize 每页显示条数不能为空
       *
       * 接口文档规定，须有设置请求头，并给token
       * 已在http.js的插件中进行了请求拦截，此处可以不用写了
       */
      // const AUTH_TOKEN = localStorage.getItem('token')
      // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      // console.log('res=', res)
      const {
        meta: {
          msg,
          status
        },
        data: {
          total,
          users
        }
      } = res.data
      if (status === 200) {
        // 1.给表格数据赋值
        this.userlist = users
        // 2.给total赋值
        this.total = total
        // 3.提示
        this.$message.success(msg)
      }
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    serachUser () {
      this.getUserList()
    },
    loaduserlist () {
      this.getUserList()
    },
    showAddUserForm () {
      this.form = {}
      this.dialogFormVisibleAdd = true
    },
    async addUser () {
      const res = await this.$http.post(`users`, this.form)
      this.dialogFormVisibleAdd = false
      // console.log('res=', res)
      const {
        meta
      } = res.data
      if (meta.status === 201) {
        this.getUserList()
        this.$message.success(meta.msg)
      } else {
        this.$message.warning(meta.msg)
      }
      this.form = {}
    },
    showDelForm (userid) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        /**
         * async：必须写在离await最近的位置
         */
        const res = await this.$http.delete(`users/${userid}`)
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
          this.pagenum = 1
          this.getUserList()
        } else {
          this.$message.warning(res.data.meta.msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showEditFrom (userInfo) {
      this.form = userInfo
      this.dialogFormVisibleEdit = true
    },
    async editUser (userid) {
      const res = await this.$http.put(`users/${userid}`, this.form)
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
        this.pagenum = 1
        this.getUserList()
      } else {
        this.$message.warning(res.data.meta.msg)
      }
      this.dialogFormVisibleEdit = false
    },
    async changeState (user) {
      // console.log('user=', user)
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      // console.log('res_edit', res)
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
      } else {
        this.$message.warning(res.data.meta.msg)
      }
    },
    async showRoleForm (user) {
      const resRol = await this.$http.get(`roles`)
      this.roles = resRol.data.data
      // console.log('roleget', resRol.data.data)
      this.curUserName = user.username
      this.curUserId = user.id
      const res = await this.$http.get(`users/${user.id}`)

      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
        this.dialogFormVisibleRole = true
        this.curRoleId = res.data.data.rid
      } else {
        this.$message.warning(res.data.meta.msg)
      }
    },
    async changeUserRoles () {
      // 根据不同的接口进行不同的参数发送
      const res = await this.$http.put(`users/${this.curUserId}/role`, {
        rid: this.curRoleId
      })
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
      } else {
        this.$message.warning(res.data.meta.msg)
      }
      this.dialogFormVisibleRole = false
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}

.input-with-select {
  width: 300px;
}

.searchRow {
  margin-top: 20px;
}
</style>
