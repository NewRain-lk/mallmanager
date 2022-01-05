<template>
  <el-card>
    <my-bread level1="权限管理"
              level2="角色列表"></my-bread>

    <el-row class="el-row-style">
      <el-button type="info">添加角色</el-button>
    </el-row>

    <el-table :data="roleList"
              style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="r1 in scope.row.children"
                  type="flex"
                  :key="r1.id">
            <el-col :span="4"
                    :offset="1">
              <el-tag closable
                      @close="delRights(scope.row, r1.id)">{{r1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row v-for="r2 in r1.children"
                      :key="r2.id">
                <el-col :span="4">
                  <el-tag closable
                          @close="delRights(scope.row, r2.id)"
                          type='success'>{{r2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag closable
                          @close="delRights(scope.row, r3.id)"
                          v-for="r3 in r2.children"
                          :key="r3.id"
                          type='warning'>{{r3.authName}}</el-tag>

                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.children.length===0">未分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index"
                       label="#"
                       width="60">
      </el-table-column>
      <el-table-column prop="roleName"
                       label="角色名称"
                       width="180">
      </el-table-column>
      <el-table-column prop="roleDesc"
                       label="角色描述">
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
                       plain
                       @click.prevent="showRightForm(scope.row)"></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="角色权限"
               :visible.sync="dialogRightVisible"
               width="30%">
      <!--
        1、:default-expanded-keys="[2, 3]"
        2、:default-checked-keys="[5]" ，用三级循环，且只放三级的即可，因为tree会自动进行一级、二级的全选和半选
        3、在vue中调用dom元素，必须使用ref属性，使用this.$refs进行调用
      -->
      <el-tree :data="treeList"
               ref="rightTree"
               show-checkbox
               node-key="id"
               :default-expand-all="true"
               :default-checked-keys="arrChecked"
               :props="defaultProps">
      </el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogRightVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="setRoleRights">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      treeList: [],
      arrChecked: [],
      curRole: -1,
      dialogRightVisible: false,
      defaultProps: {
        label: 'authName',
        children: 'children'
      }
    }
  },
  created () {
    this.getRoleslist()
  },
  methods: {
    async getRoleslist () {
      const res = await this.$http.get(`roles`)
      if (res.data.meta.status === 200) {
        this.roleList = res.data.data
        this.$message.success(res.data.meta.msg)
      }
    },
    async delRights (role, rightid) {
      // roles/:roleId/rights/:rightId
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
      // 返回值会返回相应角色的剩余的权限列表
      // 删除完成后更新视图，用this.getRoleslist()会更新整个视图
      // 如果更新有变更的角色的视图，所以此处只传递角色即可
      role.children = res.data.data
    },
    async showRightForm (role) {
      // 获取树形结构的权限数据
      const res = await this.$http.get(`rights/tree`)
      this.curRole = role
      this.treeList = res.data.data
      var tempArrChecked = []
      role.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            tempArrChecked.push(item3.id)
          })
        })
      })
      this.arrChecked = tempArrChecked

      this.dialogRightVisible = true
    },
    async setRoleRights () {
      // roles/:roleId/rights
      let arr1 = this.$refs.rightTree.getCheckedKeys()
      let arr2 = this.$refs.rightTree.getHalfCheckedKeys()
      // ES6的展开运算符：...
      let arr = [...arr1, ...arr2]
      const res = await this.$http.post(`roles/${this.curRole.id}/rights`, { rids: arr.join(',') })
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
      } else {
        this.$message.warning(res.data.meta.msg)
      }
      this.getRoleslist()
      this.dialogRightVisible = false
    }
  }
}
</script>

<style>
.el-row-style {
  margin-top: 20px;
}
</style>
