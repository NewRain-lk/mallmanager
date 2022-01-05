<template>
  <el-card>
    <!--1.面包屑-->
    <my-bread level1="权限管理"
              level2="权限列表"></my-bread>
    <!--2.表格-->
    <el-table :data="rightList"
              border
              height="400px"
              style="width: 100%;"
              class="dataTable">
      <el-table-column type="index"
                       label="#"
                       width="60">
      </el-table-column>
      <el-table-column prop="authName"
                       label="权限名称"
                       width="180">
      </el-table-column>
      <el-table-column prop="path"
                       label="路径"
                       width="180">
      </el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level==='0'">一级</span>
          <span v-else-if="scope.row.level==='1'">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  created () {
    this.getRightslist()
  },
  methods: {
    async getRightslist () {
      const res = await this.$http.get(`rights/list`)
      if (res.data.meta.status === 200) {
        this.rightList = res.data.data
        this.$message.success(res.data.meta.msg)
      }
    }
  }
}
</script>

<style>
.dataTable {
  /**
   * 给TABLE设置固定的heiht亦可固定表头
   */
  margin-top: 30px;
}
</style>
