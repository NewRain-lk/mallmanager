<template>
  <el-card class="box-card">
    <!--1.面包屑-->
    <my-bread level1="商品管理"
              level2="商品列表"></my-bread>
    <!--2.搜索框-->
    <el-row class="searchRow">
      <el-col>
        <!--查看文档后，有一个clear事件-->
        <el-input placeholder="请输入内容"
                  v-model="query"
                  class="input-with-select"
                  clearable
                  @clear="loadgoodslist()">
          <el-button slot="append"
                     icon="el-icon-search"
                     @click.prevent="serachGood"></el-button>
        </el-input>
        <el-button type="success"
                   plain
                   @click.prevent="$router.push({name: 'goodsadd'})">添加商品</el-button>
      </el-col>
    </el-row>
    <!--3.表格-->
    <el-table :data="goodslist"
              style="width: 100%">
      <el-table-column type="index"
                       label="#"
                       width="60">
      </el-table-column>
      <el-table-column prop="goods_name"
                       label="商品名称">
      </el-table-column>
      <el-table-column prop="goods_price"
                       label="商品价格">
      </el-table-column>
      <el-table-column prop="goods_number"
                       label="商品数量">
      </el-table-column>
      <!--【|】不好用，prop属性不能直接使用-->
      <el-table-column label="添加事件">
        <!--
            1、相当于创建一个组件，所以需要引用数据源，数据源必须使用原始数据源
            2、数据源自带ROW属性
            3、最后使用{{}}进行数据的处理
            4、如果将数据源改为其他名称，则会自动找上一级的数据源，比如scope自动会找userlist
          -->
        <template slot-scope="scope">
          {{ scope.row.add_time | fmtdate }}
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
                       plain></el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       circle
                       size="mini"
                       plain></el-button>
            <el-button type="success"
                       icon="el-icon-s-tools"
                       circle
                       size="mini"
                       plain></el-button>
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
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      goodslist: [],
      total: -1,
      pagenum: 1,
      pagesize: 2,
      // 对话框的相关属性
      dialogFormVisibleAdd: false,
      formLabelWidth: '100px',
      form: {
        goods_id: -1,
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_state: 0,
        add_time: ''
      },
      // 角色处理
      curRoleId: -1,
      curUserName: '',
      curUserId: -1,
      roles: []
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
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
      const res = await this.$http.get(`goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      // console.log('res=', res)
      const {
        meta: {
          msg,
          status
        },
        data: {
          total,
          goods
        }
      } = res.data
      if (status === 200) {
        // 1.给表格数据赋值
        this.goodslist = goods
        // 2.给total赋值
        this.total = total
        // 3.提示
        this.$message.success(msg)
      }
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getGoodsList()
    },
    serachGood () {
      this.getGoodsList()
    },
    loadgoodslist () {
      this.getGoodsList()
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
