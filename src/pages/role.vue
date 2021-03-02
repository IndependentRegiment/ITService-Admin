<template>
  <div class="main">
    <el-card class="box-card">
      <div class="top">
        <el-row :gutter="20">
          <el-col :span="6"
            ><el-select
              v-model="value"
              placeholder="请选择角色"
              clearable
              @change="handleChange"
            >
              <el-option
                v-for="item in roleTypeList"
                :key="item.id"
                :label="item.roleName"
                :value="item.roleName"
              >
              </el-option> </el-select
          ></el-col>
          <el-col :span="6"
            ><el-input v-model="name" placeholder="请输入姓名"></el-input
          ></el-col>
          <el-col :span="12"
            ><el-button type="primary" @click="search">搜索</el-button></el-col
          >
        </el-row>
      </div>
      <el-table :data="roleList" style="width: 100%">
        <el-table-column type="index" width="80"> </el-table-column>
        <el-table-column prop="userName" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="roleName" label="角色" width="180">
          <template slot-scope="props">
            <el-tag v-if="props.row.roleName === '工程师'">{{
              props.row.roleName
            }}</el-tag>
            <el-tag
              type="success"
              v-else-if="props.row.roleName === '话务员'"
              >{{ props.row.roleName }}</el-tag
            >
            <el-tag type="warning" v-else>{{ props.row.roleName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="company" label="公司"> </el-table-column>
        <el-table-column prop="department" label="部门"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="props">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showEdit(props.row)"
            ></el-button></template
        ></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="posData.pageNo"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="posData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="修改角色"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <el-row>
          <el-col :span="6"><div class="text">姓名：</div></el-col>
          <el-col :span="12"
            ><div class="text">{{ userName }}</div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="6"><div class="text">角色：</div></el-col>
          <el-col :span="12"
            ><div class="text">{{ userRole }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><div class="text">新角色：</div></el-col>
          <el-col :span="12"
            ><div class="">
              <el-select v-model="newValue" placeholder="请选择" clearable>
                <el-option
                  v-for="item in roleTypeList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                >
                </el-option>
              </el-select></div
          ></el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRole, getRoleType, editRole } from "../api/api";
export default {
  data() {
    return {
      posData: {
        pageNo: 1,
        pageSize: 10,
        roleName: "工程师",
        userName: "",
      },
      value: "",
      newValue: "",
      roleList: [],
      roleTypeList: [],
      name: "",
      queryInfo: {
        pageNo: 1, // 当前的页数
        pageSize: 10, // 当前每页显示多少条数据
      },
      total: 0,
      editData: {
        oldRoleId: 0,
        openId: "",
        roleId: 0,
      },
      dialogVisible: false,
      userName: "",
      userRole: "",
    };
  },
  mounted() {
    this.getRole();
    this.getRoleType();
  },
  methods: {
    handleChange(val) {
      this.posData.roleName = val;
      this.getRole();
    },
    getRole() {
      getRole(this.posData).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.roleList = res.data.userList;
          this.total = res.data.totalCount;
        }
      });
    },
    getRoleType() {
      getRoleType().then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.roleTypeList = res.data;
        }
      });
    },
    search() {
      this.posData.roleName = this.value;
      this.posData.userName = this.name;
      console.log(this.posData);
      this.getRole();
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.posData.pageSize = newSize;
      this.getRole();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.posData.pageNo = newPage;
      this.getRole();
    },
    showEdit(val) {
      console.log(val);
      this.userRole = val.roleName;
      this.userName = val.userName;
      this.editData.oldRoleId = val.roleId;
      this.editData.openId = val.openId;
      this.openId = val.openId;
      this.dialogVisible = true;
    },
    editRole() {
      this.editData.roleId = this.newValue;
      console.log(this.editData);
      editRole(this.editData).then((res) => {
        console.log(res);
        this.$message({
          message: res.message,
          type: "success",
        });
        if (res.code === 200) {
          this.dialogVisible = false;
          this.userName = "";
          this.userRole = "";
          this.newValue = "";
          this.getRole();
        }
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.el-select {
  width: 100%;
}
.el-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>