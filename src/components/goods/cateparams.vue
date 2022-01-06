<template>
  <el-card>
    <my-bread level1="商品管理"
              level2="参数分类"></my-bread>

    <el-alert class="alert"
              title="只允许为第三级分类设置参数"
              type="error"></el-alert>
    <el-form>
      <el-form-item label="商品分类">
        <el-cascader v-model="selectOptions"
                     :show-all-levels="false"
                     :options="options"
                     :props="defaultProp"
                     @change="handleChange"></el-cascader>
      </el-form-item>
    </el-form>
    <el-tabs v-model="active"
             @tab-click="handleClick">
      <el-tab-pane label="动态参数"
                   name="1">
        <el-button type="danger">设置动态参数</el-button>
        <el-table :data="arrDyparams"
                  style="width: 100%">
          <el-table-column type="expand"
                           label="#">
            <template slot-scope="scope">
              <el-row>
                <el-tag :key="tag"
                        v-for="tag in scope.row.attr_vals"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(scope.row, tag)">
                  {{tag}}
                </el-tag>
                <el-input class="input-new-tag"
                          v-if="inputVisible"
                          v-model="inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput">+ New Tag</el-button>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="属性名称"
                           prop="attr_name">
          </el-table-column>
          <el-table-column label="操作">
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

          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数"
                   name="2">
        <el-button type="danger">设置静态参数</el-button>
        <el-table :data="arrStaticparams"
                  style="width: 100%">
          <el-table-column type="index"
                           label="#">
          </el-table-column>
          <el-table-column label="属性名称"
                           prop="attr_name">
          </el-table-column>
          <el-table-column label="属性值"
                           prop="attr_vals">
          </el-table-column>
          <el-table-column label="操作">
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

          </el-table-column>
        </el-table>
      </el-tab-pane>

    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      selectOptions: [],
      options: [],
      defaultProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      arrDyparams: [],
      active: '1',
      inputVisible: false,
      inputValue: '',
      arrStaticparams: []
    }
  },
  created () {
    this.getGoodCate()
  },
  methods: {
    async handleChange () {
      if (this.selectOptions.length !== 3) {
        this.$message.warning('请先选择三级分类')
      } else {
        // 当前分类的分类ID
        const res = await this.$http.get(`categories/${this.selectOptions[2]}/attributes?sel=many`)
        this.arrDyparams = res.data.data
      }
    },
    async getGoodCate () {
      const res = await this.$http.get(`categories`)
      this.options = res.data.data
    },
    async handleClick () {
      if (this.active === '2') {
        if (this.selectOptions.length === 3) {
          const res = await this.$http.get(`categories/${this.selectOptions[2]}/attributes?sel=only`)
          this.arrStaticparams = res.data.data
          this.arrStaticparams.forEach(element => {
            // 此处空字符串会报错
            element.attr_vals = element.attr_vals.length === 0 ? [] : element.attr_vals.trim().split(',')
          })
        }
      }
    },
    async handleClose (row, tag) {
      row.attr_vals.splice(row.attr_vals.indexOf(tag), 1)
      const res = await this.$http.put(`categories/${this.selectOptions[2]}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: 'many',
        attr_vals: row.attr_vals.join(',')
      })
    },
    async handleInputConfirm (row) {
      let inputValue = this.inputValue
      if (inputValue) {
        row.attr_vals.push(inputValue)
        const res = await this.$http.put(`categories/${this.selectOptions[2]}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: 'many',
          attr_vals: row.attr_vals.join(',')
        })
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  }
}
</script>

<style>
.alert {
  margin-top: 20px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
