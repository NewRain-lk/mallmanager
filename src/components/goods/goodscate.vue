<template>
  <el-card class="box-card">
    <my-bread level1="商品管理"
              level2="商品分类"></my-bread>
    <el-row class="searchRow">
      <el-col>
        <!--查看文档后，有一个clear事件-->
        <el-button type="success"
                   plain
                   @click.prevent="addGoodsCate">添加分类</el-button>
      </el-col>
    </el-row>

    <!--5.添加分类-->
    <el-dialog title="添加分类"
               :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="分类名称"
                      :label-width="formLabelWidth">
          <el-input v-model="form.cat_name"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类"
                      :label-width="formLabelWidth">
          <el-cascader v-model="selectOptions"
                       :options="catlist"
                       :props="defaultProp"
                       :clearable="true"
                       filterable></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary"
                   @click="addCate">确 定</el-button>
      </div>
    </el-dialog>

    <el-table :data="options"
              border
              height="400px"
              style="width: 100%;"
              class="dataTable">
      <el-table-column type="index"
                       label="#"
                       width="60">
      </el-table-column>
      <!--此处就不再需要了-->
      <!-- <el-table-column label="分类名称"
                       prop="cat_name">
      </el-table-column> -->
      <el-tree-grid prop="cat_name"
                    label="分类名称"
                    treeKey="cat_id"
                    parentKey="cat_pid"
                    levelKey="cat_level"
                    childKey="children"
                    folderIcon="">
      </el-tree-grid>
      <el-table-column label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level===0">一级</span>
          <span v-else-if="scope.row.cat_level===1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted===false">有效</span>
          <span v-else>有效</span>
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
          </el-row>
        </template>
      </el-table-column>
    </el-table>
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
// 引入第三方插件：npm install element-tree-grid --save
var ElTreeGrid = require('element-tree-grid')

export default {
  components: {
    ElTreeGrid
  },
  data () {
    return {
      dialogFormVisibleAdd: false,
      formLabelWidth: '100px',
      selectOptions: [],
      options: [],
      catlist: [],
      defaultProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      form: {
        cat_pid: -1,
        cat_name: '',
        cat_level: -1
      },
      total: -1,
      pagenum: 1,
      pagesize: 2,
      type: 3
    }
  },
  created () {
    this.getGoodCate()
  },
  methods: {
    async addCate () {
      this.dialogFormVisibleAdd = false
      this.form.cat_pid = this.selectOptions.length === 0 ? 0 : this.selectOptions[this.selectOptions.length - 1]
      this.form.cat_level = this.selectOptions.length
      const res = await this.$http.post(`categories`, this.form)
      this.getGoodCate()
    },
    async addGoodsCate () {
      this.dialogFormVisibleAdd = true
      const res = await this.$http.get(`categories?type=2`)
      this.catlist = res.data.data
    },
    async getGoodCate () {
      const res = await this.$http.get(`categories?type=${this.type}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      this.options = res.data.data.result
      this.total = res.data.data.total
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getGoodCate()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getGoodCate()
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}
.searchRow {
  margin-top: 20px;
}
.dataTable {
  /**
   * 给TABLE设置固定的heiht亦可固定表头
   */
  margin-top: 30px;
}
</style>
