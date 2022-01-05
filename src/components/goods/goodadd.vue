<template>
  <el-card>
    <my-bread level1="商品管理"
              level2="商品添加"
              style="margin-top:20px"></my-bread>

    <el-alert title="添加商品信息"
              type="success"
              center
              show-icon
              style="margin-top:20px">
    </el-alert>
    <el-steps :space="200"
              :active="active*1"
              finish-status="success"
              simple
              style="margin-top:20px">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!--
      此处整个应该为一个表单，用于提交数据，所以tabs的最外层为必须为一个表单
    -->
    <el-form label-position="top"
             :model="form">
      <el-tabs @tab-click="tabChange"
               tab-position="left"
               style="height: 300px;overflow:auto"
               v-model="active">
        <el-tab-pane label="基本信息"
                     name="1">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item>
            <el-cascader v-model="selectOptions"
                         :options="options"
                         :props="defaultProp"
                         @change="handleChange"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数"
                     name="2">
          <!--显示三级分类的商品参数-->
          <el-form-item :label="item.attr_name"
                        v-for="item in arrDyparams"
                        :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="itemC"
                           border
                           v-for="(itemC, i) in item.attr_vals"
                           :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性"
                     name="3">
          <el-form-item :label="item.attr_name"
                        v-for="item in arrSaticparmas"
                        :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片"
                     name="4">
          <el-form-item>
            <!-- baseUrl是给axios设置的，此处得设置全路径 -->
            <el-upload action="http://127.0.0.1:8888/api/private/v1/upload"
                       :headers="headers"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       :on-success="handelSuccess"
                       :file-list="fileList"
                       list-type="picture">
              <el-button size="small"
                         type="primary">点击上传</el-button>
              <div slot="tip"
                   class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品内容"
                     name="5">
          <el-form-item>
            <el-button>点我-添加商品</el-button>
            <quillEditor></quillEditor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  data () {
    return {
      // 此处给赋值为字符串，匹配了tabs的name属性，但是进度条的话必须为数值，所以用acitve*1给转为数值
      active: '1',
      form: {
        goods_name: '',
        // 级联选择器，已处理完成，需要将级联选择器调整为已“,”分割的字符串
        goods_cat: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      selectOptions: [1, 3, 6],
      options: [],
      defaultProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 动态参数
      arrDyparams: [],
      arrSaticparmas: [],
      fileList: [],
      // 文件上传，现在为临时上传，除了登录请求，均需要设置头部，上传的位置为服务器的临时位置
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  created () {
    this.getGoodCate()
  },
  methods: {
    handleChange () {

    },
    async getGoodCate () {
      const res = await this.$http.get(`categories`)
      this.options = res.data.data
    },
    async tabChange () {
      // 需要点击第二个tab的时候才会触发
      if (this.active === '2') {
        if (this.selectOptions.length !== 3) {
          this.$message.warning('请先选择三级分类')
        } else {
          // 当前分类的分类ID
          const res = await this.$http.get(`categories/${this.selectOptions[2]}/attributes?sel=many`)
          this.arrDyparams = res.data.data
          this.arrDyparams.forEach(element => {
            // 此处空字符串会报错
            element.attr_vals = element.attr_vals.length === 0 ? [] : element.attr_vals.trim().split(',')
          })
        }
      } else if (this.active === '3') {
        if (this.selectOptions.length !== 3) {
          this.$message.warning('请先选择三级分类')
        } else {
          // 当前分类的分类ID
          const res = await this.$http.get(`categories/${this.selectOptions[2]}/attributes?sel=only`)
          this.arrSaticparmas = res.data.data
        }
      }
      // const res = await
    },
    handlePreview (file) {

    },
    handleRemove (file) {

    },
    handelSuccess (file) {

    }
  }
}
</script>

<style>
</style>
