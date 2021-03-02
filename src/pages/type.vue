<template>
  <div class="main">
    <el-button type="primary" class="add" @click="addType"
      >添加故障类型</el-button
    >
    <el-card class="box-card">
      <el-table
        :data="typeList"
        style="width: 100%; margin-bottom: 20px"
        row-key="typeId"
        border
        :tree-props="{ children: 'problemList', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="类型排序" width="500">
          <template slot-scope="props">
            <el-input
              class="input-new-tag"
              v-model="props.row.typeNo"
              size="small"
              @keyup.enter.native="
                handleInputConfirm(props.row.typeId, props.row.typeNo)
              "
              @focus="showBtn(props.row.typeId, props.row.typeNo)"
              @blur="handleInputConfirm(props.row.typeId, props.row.typeNo)"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="typeName" label="故障类型" width="500">
        </el-table-column>
        <el-table-column prop="parentId" label="级别">
          <template slot-scope="props">
            <el-tag v-if="props.row.parentId === -1">一级</el-tag>
            <el-tag type="success" v-else>二级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="props">
            <el-button
              type="danger"
              size="mini"
              @click="delType(props.row.typeId)"
              v-if="props.row.parentId === -1"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              @click="delType(props.row.typeId)"
              v-else
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加类型"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <el-row>
          <el-col :span="6"
            ><div class="text">
              <span style="color: red"> * </span>故障分类：
            </div></el-col
          >
          <el-col :span="12"
            ><div class="">
              <el-cascader
                v-model="value1"
                :options="wayList"
                :props="wayProp"
                @change="handleWayChange"
                clearable
              >
              </el-cascader></div
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"
            ><div class="text">
              <span style="color: red">*</span> 故障名称:
            </div></el-col
          >
          <el-col :span="12"
            ><div class="">
              <el-input
                v-model="newType"
                placeholder="请输入内容"
              ></el-input></div
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"
            ><div class="text">
              <span style="color: white"> * </span>父级分类：
            </div></el-col
          >
          <el-col :span="12"
            ><div class="">
              <el-cascader
                v-model="value"
                :options="typeList"
                :props="setKesLabel"
                @change="handleChange"
                clearable
              >
              </el-cascader></div
          ></el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getType, getWay, addType, delType, editNo } from "../api/api";
export default {
  data() {
    return {
      typeList: [],
      wayList: [],
      dialogVisible: false,
      newType: "",
      parentType: "",
      value: [],
      value1: [],
      setKesLabel: {
        value: "typeId",
        label: "typeName",
        // children: "problemList",
        expandTrigger: "hover",
      }, //自定义  级联选择器value label
      wayProp: {
        value: "serviceId",
        label: "serviceName",
        expandTrigger: "hover",
      },
      sortData: {
        typeId: 0,
        typeName: "",
        typeNo: 0,
      },
      inputValue: "",
    };
  },
  mounted() {
    this.getTypeList();
    this.getWay();
  },
  methods: {
    showBtn(id, val) {
      this.sortData.typeNo = val;
      this.sortData.typeId = id;
      console.log(this.sortData);
    },
    handleInputConfirm(id, val) {
      this.sortData.typeNo = val;
      this.sortData.typeId = id;
      editNo(this.sortData).then((res) => {
        console.log(res);
        this.getTypeList();
        this.$message({
          message: "修改成功",
          type: "success",
        });
      });
    },
    getWay() {
      getWay().then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.wayList = res.data;
        }
      });
    },
    getTypeList() {
      getType().then((res) => {
        console.log(res);
        // this.typeList = res.data;
        // 调用递归方法，去除级联数据后将数据赋值给级联选择器
        this.typeList = this.getTreeData(res.data);
      });
    },
    // 递归方法
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].problemList.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].problemList = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].problemList);
        }
      }
      return data;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.value1 = [];
          this.value = [];
          this.newType = "";
          done();
        })
        .catch((_) => {});
    },
    addType() {
      this.dialogVisible = true;
    },
    handleChange(value) {
      console.log(value);
      //   if(value)
    },
    handleWayChange(value) {
      console.log(value[0]);
    },
    confirmAdd() {
      var id = this.value[0];
      if (id === undefined) {
        id = "";
      }
      var wayId = this.value1[0];
      if (this.wayId !== "" && this.newType !== "") {
        addType(id, this.newType, wayId).then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.getTypeList();
          }
          this.value1 = [];
          this.value = [];
          this.newType = "";
          this.dialogVisible = false;
        });
      } else {
        this.$message({
          message: "必填项不能为空",
          type: "warning",
        });
      }
    },
    delType(val) {
      console.log(val);
      delType(val).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.getTypeList();
        }
      });
    },
  },
};
</script>

<style scoped>
.add {
  margin-bottom: 20px;
}
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.text {
  height: 40px;
  line-height: 40px;
}
.el-cascader {
  width: 100%;
}
.input-new-tag {
  width: 50px;
}
.el-input--small .el-input__inner {
  height: 28px;
  line-height: 28px;
}
</style>