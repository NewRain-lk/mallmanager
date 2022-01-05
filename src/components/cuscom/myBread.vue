<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  /**
   * 使用name属性，为自己的组件定义一个名字
   */
  name: 'my-bread',
  /**
   * 1.来源于组件船只
   * 2.数组中的组件属性<child-a :msg="abc"></child-a>
   */
  props: [
    'level1', 'level2'
  ]
}
</script>

<style>
</style>
