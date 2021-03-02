<template>
  <div>
    <el-card class="box-card">
      <div class="top">
        <el-select
          v-model="value"
          placeholder="请选择状态"
          clearable
          @change="handleChange"
          style="width: 200px; margin-right: 20px"
        >
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
        <el-input
          style="width: 200px; margin-right: 20px"
          v-model="applyName"
          placeholder="请输入姓名"
        ></el-input>
        <el-date-picker
          style="width: 400px; margin-right: 20px"
          v-model="value2"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          :default-value="nowTime"
          @change="dateChange"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <el-button type="primary" @click="search" icon="el-icon-search"
          >搜索</el-button
        >
        <div
          class="send"
          style="display: flex; padding-left: 10px"
          v-show="isShow"
        >
          <el-button type="warning" @click="toggleSelection()"
            >取消选择</el-button
          >
          <el-button type="success" icon="el-icon-message" @click="sendMail"
            >发送</el-button
          >
        </div>
      </div>
      <el-table
        :data="list"
        style="width: 100%"
        ref="multipleTable"
        height="600"
        max-width="1000"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"> </el-table-column>
        <el-table-column label="工单号" prop="cardId"></el-table-column>
        <el-table-column label="申请人" prop="applyName"></el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="props">
            <el-tag type="danger" v-if="props.row.status === '未处理'">{{
              props.row.status
            }}</el-tag>
            <el-tag type="info" v-else-if="props.row.status === '处理中'">{{
              props.row.status
            }}</el-tag>
            <el-tag type="success" v-else-if="props.row.status === '已处理'">{{
              props.row.status
            }}</el-tag>
            <el-tag type="warning" v-else-if="props.row.status === '未评价'">{{
              props.row.status
            }}</el-tag>
            <el-tag v-else>{{ props.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="评分" prop="satisfaction" width="150px">
          <template slot-scope="props">
            <div v-if="props.row.satisfaction !== null">
              <el-progress
                :percentage="Number(props.row.satisfaction)"
                :format="format"
                :color="customColorMethod"
              ></el-progress>
            </div>
            <div v-else>暂无评分</div>
          </template>
        </el-table-column>
        <el-table-column label="处理时间" prop="solution" class="time">
          <template slot-scope="scope">
            {{ scope.row.createTime | dataFormat(scope.row.endTime, "minute") }}
          </template>
        </el-table-column>
        <el-table-column label="故障类型" prop="problemType"></el-table-column>
        <el-table-column label="工程师" prop="deal" min-width="150px">
          <template slot-scope="scope">
            <div v-if="scope.row.assistName !== null" class="deal-item">
              <div class="name-text">{{ scope.row.deal }}</div>
              <img class="help-img" src="../assets/change.png" />
              <div class="name-text">{{ scope.row.assistName }}</div>
            </div>
            <div v-else>{{ scope.row.deal }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="故障描述"
          prop="description"
          min-width="200px"
        ></el-table-column>
        <el-table-column label="故障原因" prop="reason"> </el-table-column>
        <el-table-column label="故障解决方案" prop="solution"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              class="editBtn"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNo"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="修改工程师"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <div class="content">
        <el-row>
          <el-col :span="6"><div class="">工程师</div></el-col>
          <el-col :span="12"
            ><div class="">{{ name }}</div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="6"><div class="text">修改工程师</div></el-col>
          <el-col :span="12">
            <div class="">
              <el-select v-model="valueName" placeholder="请选择">
                <el-option
                  v-for="(item, index) in dealList"
                  :key="index"
                  :label="item.userName"
                  :value="item.openId"
                >
                </el-option>
              </el-select></div
          ></el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDeal()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, getDeal, editDeal, sendMail } from "../api/api";
export default {
  data() {
    return {
      list: [],
      queryInfo: {
        pageNo: 1, // 当前的页数
        pageSize: 10, // 当前每页显示多少条数据
        applyName: "",
        status: "",
        createTime: "",
        endTime: "",
      },
      total: 0,
      dealList: [],
      dialogVisible: false,
      name: "",
      value: "",
      cardId: "",
      applyName: "",
      //未处理、处理中、已处理、未评价、已评价
      statusList: [
        {
          id: "未处理",
          name: "未处理",
        },
        {
          id: "处理中",
          name: "处理中",
        },
        {
          id: "已处理",
          name: "已处理",
        },
        {
          id: "未评价",
          name: "未评价",
        },
        {
          id: "已评价",
          name: "已评价",
        },
      ],
      handleTime: "",
      isShow: false,
      selectList: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      value2: "",
      nowTime: "",
      valueName: "",
    };
  },
  watch: {
    selectList: function (newSel, oldSel) {
      if (newSel.length > 0) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
  },
  filters: {
    dataFormat(startTime, endTime, diffType) {
      if (endTime !== null) {
        startTime = startTime.replace(/-/g, "/");
        endTime = endTime.replace(/-/g, "/");
        //将计算间隔类性字符转换为小写
        diffType = diffType.toLowerCase();
        var sTime = new Date(startTime); //开始时间
        var eTime = new Date(endTime); //结束时间
        //作为除数的数字
        var divNum = 1;
        switch (diffType) {
          case "second":
            divNum = 1000;
            break;
          case "minute":
            divNum = 1000 * 60;
            break;
          case "hour":
            divNum = 1000 * 3600;
            break;
          case "day":
            divNum = 1000 * 3600 * 24;
            break;
          default:
            break;
        }
        return (
          parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum)) +
          "分钟"
        );
      } else {
        return "";
      }
    },
  },
  mounted() {
    this.queryInfo.status = this.$route.query.type;
    this.queryInfo.createTime = this.$route.query.createTime;
    this.queryInfo.endTime = this.$route.query.endTime;
    console.log(this.queryInfo);
    this.nowTime = new Date();
    console.log(this.nowTime);
    this.getList();
  },
  methods: {
    dateChange(val) {
      if (val !== null) {
        this.queryInfo.createTime = val.toString().split(",")[0];
        this.queryInfo.endTime = val.toString().split(",")[1];
        this.getList();
      } else {
        this.queryInfo.createTime = "";
        this.queryInfo.endTime = "";
        this.getList();
      }
    },
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
      return percentage === 100 ? "100" : `${percentage}`;
    },
    search() {
      console.log(this.applyName);
      this.queryInfo.applyName = this.applyName;
      if (this.value2 !== null && this.value2.length > 0) {
        console.log(this.value2);
        this.queryInfo.createTime = this.value2[0];
        this.queryInfo.endTime = this.value2[1];
      }
      console.log(this.queryInfo);
      this.getList();
    },
    getList() {
      console.log(this.queryInfo);
      const posData = this.queryInfo;
      getList(posData).then((res) => {
        console.log(res);
        this.list = res.data.cardList;
        this.total = res.data.totalCount;
      });
      this.applyName = "";
    },
    handleEdit(index, row) {
      console.log(row.deal);
      this.dialogVisible = true;
      this.name = row.deal;
      this.cardId = row.cardId;
      getDeal(this.name).then((res) => {
        console.log(res);
        if (res.code === 200) {
          console.log("编辑" + res);
          this.dealList = res.data;
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
    editDeal() {
      console.log(this.valueName);
      const openId = this.valueName;
      const cardId = this.cardId;
      editDeal(cardId, openId).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.cardId = "";
          this.valueName = "";
          this.getList();
        }
      });
      this.dialogVisible = false;
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pageSize = newSize;
      this.getList();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNo = newPage;
      this.getList();
    },
    handleChange(val) {
      this.queryInfo.status = val;
      this.getList();
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.selectList = val;
    },
    sendMail() {
      var selList = [];
      console.log(this.selectList);
      if (
        this.selectList.findIndex((c) => {
          return c.satisfaction === null && c.status === "已处理";
        }) >= 0
      ) {
        //未评价工单
        console.log("未评价");
        this.selectList.forEach((e) => {
          selList.push(e.cardId);
        });
        console.log(selList);
        sendMail(selList).then((res) => {
          console.log(res);
        });
      } else {
        this.$message({
          message: "请选择未评价工单！",
          type: "warning",
        });
      }
    },
  },
};
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 100%;
}
.el-pagination {
  margin-top: 20px;
  text-align: right;
}
.editBtn {
  background-color: RGB(69, 159, 117);
  color: #fff;
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
.el-select {
  width: 100%;
}
.text {
  height: 40px;
  line-height: 40px;
}
.top {
  display: flex;
}
.help-img {
  height: 20px;
  width: 20px;
  margin: 0 5px;
}
.name-text {
  height: 20px;
  line-height: 20px;
  text-align: center;
}
.deal-item {
  display: flex;
}
</style>