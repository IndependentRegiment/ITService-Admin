<template>
  <div class="main">
    <el-card class="box-card">
      <div class="top">
        <el-row :gutter="20">
          <el-col :span="6"
            ><el-select
              v-model="value"
              placeholder="请选择季度"
              clearable
              @change="handleChange"
            >
              <el-option
                v-for="item in quarterList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option> </el-select
          ></el-col>
          <el-col :span="12"
            ><el-button type="primary" @click="search">搜索</el-button></el-col
          >
        </el-row>
      </div>
      <el-table :data="list" style="width: 100%">
        <el-table-column type="index" width="80"> </el-table-column>
        <el-table-column prop="engName" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="quarter" label="季度" width="180">
        </el-table-column>
        <!-- <el-table-column prop="part" label="满意度百分比"> </el-table-column> -->
        <el-table-column label="满意度百分比" prop="satisfaction" width="200px">
          <template slot-scope="props">
            <div v-if="props.row.part !== null">
              <el-progress
                :percentage="Number(props.row.part)"
                :format="format"
                :color="customColorMethod"
              ></el-progress>
            </div>
            <div v-else>暂无评分</div>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="单数" min-width="50px">
        </el-table-column>
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
  </div>
</template>

<script>
import { getRoleScore } from "../api/api";

export default {
  data() {
    return {
      posData: {
        pageNo: 1,
        pageSize: 10,
        quarter: "",
      },
      list: [],
      queryInfo: {
        pageNo: 1, // 当前的页数
        pageSize: 10, // 当前每页显示多少条数据
      },
      total: 0,
      quarterList: [
        {
          id: 1,
          name: "第一季度",
        },
        {
          id: 2,
          name: "第二季度",
        },
        {
          id: 3,
          name: "第三季度",
        },
        {
          id: 4,
          name: "第四季度",
        },
      ],
      value: "",
    };
  },
  mounted() {
    this.RoleScore();
  },
  methods: {
    customColorMethod(percentage) {
      if (percentage === 100) {
        return "#8DC63F";
      } else if (percentage >= 80) {
        return "#F37B1D";
      } else if (percentage >= 60) {
        return "#FBBD08";
      } else {
        return "#E54D42";
      }
    },
    format(percentage) {
      return percentage === 100 ? "100%" : `${percentage}%`;
    },
    RoleScore() {
      console.log(this.posData);
      getRoleScore(this.posData).then((res) => {
        console.log(res);
        this.list = res.data.engComments;
        this.total = res.data.totalCount;
      });
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.posData.pageSize = newSize;
      this.RoleScore();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.posData.pageNo = newPage;
      this.RoleScore();
    },
    handleChange(val) {
      console.log(val);
      this.posData.quarter = val;
      this.RoleScore();
    },
    search() {
      this.posData.quarter = this.value;
      this.RoleScore();
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