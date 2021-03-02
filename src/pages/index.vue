<template>
  <div class="home-warp">
    <!--            工单统计-->
    <div class="home-top">
      <p class="title-sty">今日工单总计</p>
      <el-row :gutter="40">
        <el-col :span="8">
          <div class="conttBlock conttBlock1" @click="toPage('')">
            <div class="total">
              <img :src="img1" />
              <span> 总工单数<br />{{ totalCount }} </span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="conttBlock conttBlock2" @click="toPage('未处理')">
            <div class="wait">
              <img :src="img2" />
              <span> 待处理<br />{{ untreateCount }} </span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="conttBlock conttBlock3" @click="toPage('已处理')">
            <div class="handle">
              <img :src="img3" />
              <span> 已处理<br />{{ treateCount }} </span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--            统计报表-->
    <div class="home-bottom">
      <p class="title-sty title-bot">统计报表</p>
      <div>
        <el-row :gutter="20">
          <el-col :span="16">
            <p class="port-title"><span></span>季度统计报表</p>
            <div class="container">
              <div class="select-wrap">
                <span>年份:</span>
                <div class="selectYear">
                  <el-date-picker
                    v-model="year1"
                    type="year"
                    value-format="yyyy"
                    placeholder="选择年"
                  >
                  </el-date-picker>
                </div>
                <span>季度:</span>
                <el-select v-model="quarter1" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-button
                  type="primary"
                  style="margin-left: 10px"
                  @click="searchValue1"
                  >确定</el-button
                >
              </div>
              <p
                v-show="quarterPart !== null"
                style="position: absolute; margin: -10px 0 0 15px"
              >
                季度满意度：<span style="color: #136ccf">{{
                  quarterPart
                }}</span>
              </p>
              <p
                v-show="yearPart !== null"
                style="margin: -10px 0 0 15px; position: absolute"
              >
                年度满意度：<span style="color: #136ccf">{{ yearPart }}</span>
              </p>
              <div style="height: 400px" ref="chart1"></div>
            </div>
          </el-col>
          <el-col :span="8">
            <p class="port-title"><span></span>服务方式</p>
            <div class="ways-wrap">
              <div class="select-wrap">
                <span>年份:</span>
                <div class="selectYear">
                  <el-date-picker
                    v-model="year2"
                    type="year"
                    value-format="yyyy"
                    placeholder="选择年"
                  >
                  </el-date-picker>
                </div>
              </div>
              <div class="select-wrap">
                <span>季度:</span>
                <el-select v-model="quarter2" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-button
                  type="primary"
                  style="margin-left: 10px"
                  @click="searchValue2"
                  >确定</el-button
                >
              </div>
            </div>
            <div style="height: 300px" ref="chart2"></div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import totalImg from "../assets/icon-total.png";
import waitImg from "../assets/icon-wait.png";
import handleImg from "../assets/icon-handle.png";
import { getCount, getMonthPort, serveWays } from "../api/api";
import order from "./order";

const echarts = require("echarts");
export default {
  components: {
    order,
  },
  data() {
    return {
      activePath: "",
      isCollapse: false,
      img1: totalImg,
      img2: waitImg,
      img3: handleImg,
      totalCount: 0,
      treateCount: 0,
      untreateCount: 0,
      satisfaction: {
        dataX: [],
        dataY: [],
        per: [],
      },
      year1: "",
      quarter1: "",
      year2: "",
      quarter2: "",
      options: [
        {
          value: "1",
          label: "第一季度",
        },
        {
          value: "2",
          label: "第二季度",
        },
        {
          value: "3",
          label: "第三季度",
        },
        {
          value: "4",
          label: "第四季度",
        },
        {
          value: "5",
          label: "全年",
        },
      ],
      ways: [],
      quarterPart: null,
      yearPart: null,
    };
  },
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  mounted() {
    this.getcountList();
    this.getMonthPortFun();
    this.getWays();
  },
  methods: {
    currentTime() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    toPage(type) {
      //页面跳转
      const curDate = this.currentTime();
      const createTime = curDate;
      const endTime = curDate;
      // console.log(createTime,endTime);
      this.$router.push({
        path: "/home/order",
        query: {
          type: type,
          createTime,
          endTime,
        },
      });
    },
    //请求当天工单数
    getcountList() {
      getCount({
        countId: 1,
      }).then((res) => {
        // console.log(res);
        if (res.code === 200) {
          this.totalCount = res.data.totalCount;
          this.treateCount = res.data.treateCount;
          this.untreateCount = res.data.untreateCount;
        }
      });
    },
    //月度统计图表
    getMonthPortFun() {
      getMonthPort({}).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.satisfaction.dataX = res.data.timeList;
          this.satisfaction.dataY = res.data.countList;
          this.satisfaction.per = res.data.partList;
          this.quarterPart = res.data.quarterPart;
          this.yearPart = res.data.yearPart;
          this.updateChart1(this.satisfaction);
        }
      });
    },
    //服务方式
    getWays() {
      serveWays({}).then((res) => {
        // console.log(res);
        if (res.code === 200) {
          const list = res.data;
          let listArr = [];
          list.map((item) => {
            listArr.push({
              name: item.serviceName,
              value: item.count,
            });
          });
          this.ways = listArr;
          this.updateChart2(this.ways);
        }
      });
    },
    //月度报表搜索
    searchValue1() {
      const year = this.year1;
      const quarter = this.quarter1;
      getMonthPort({
        year,
        quarter,
      }).then((res) => {
        // console.log(res);
        if (res.code === 200) {
          this.satisfaction.dataX = res.data.timeList;
          this.satisfaction.dataY = res.data.countList;
          this.satisfaction.per = res.data.partList;
          this.quarterPart = res.data.quarterPart;
          this.yearPart = res.data.yearPart;
          this.updateChart1(this.satisfaction);
        }
      });
    },
    //服务方式搜索
    searchValue2() {
      const quarter = this.quarter2;
      const year = this.year2;
      serveWays({
        quarter,
        year,
      }).then((res) => {
        // console.log(res);
        if (res.code === 200) {
          const list = res.data;
          let listArr = [];
          list.map((item) => {
            listArr.push({
              name: item.serviceName,
              value: item.count,
            });
          });
          this.ways = listArr;
          this.updateChart2(this.ways);
        }
      });
    },
    //月度统计图表---柱状图
    updateChart1(value) {
      let myChart = echarts.init(this.$refs.chart1);
      // 绘制图表
      myChart.setOption({
        tooltip: {},
        xAxis: {
          data: value.dataX,
        },
        legend: {
          x: "10%",
          top: 10,
          textStyle: {
            color: "#90979c",
          },
          data: ["任务量", "用户满意度"],
        },
        yAxis: {
          axisLine: {
            show: true,
          },
        },
        series: [
          {
            name: "任务量",
            type: "bar",
            barMaxWidth: 35,
            itemStyle: {
              normal: {
                color: "rgba(19,108,207,1)",
              },
            },
            data: value.dataY,
          },
          {
            name: "用户满意度",
            type: "line",
            stack: "用户满意度",
            symbolSize: 20,
            symbol: "circle",
            itemStyle: {
              normal: {
                color: "rgba(252,230,48,1)",
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: "top",
                  formatter: function (p) {
                    return p.value > 0 ? p.value : "";
                  },
                },
              },
            },
            data: value.per,
          },
        ],
      });
    },
    //服务方式统计图
    updateChart2(value) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(this.$refs.chart2);
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          right: 10,
          top: 20,
          textStyle: {
            color: "#90979c",
          },
          data: ["远程服务", "现场服务"],
        },
        series: [
          {
            name: "服务方式占比",
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            selectedMode: "single",
            data: value,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  height: 100vh;
}

.el-header,
.el-footer {
  background-color: RGB(69, 159, 117);
  color: #333;
  text-align: center;
  line-height: 60px;
  border-bottom: 1px solid #f2f2f2;
}

.el-aside {
  background-color: #fff;
  color: #333;
  text-align: center;
}

.el-main {
  color: #333;
  height: 100%;
}

.el-menu {
  height: 100%;
}

el-container {
  height: 100%;
}

/*首页样式*/
.title-sty {
  color: #636e7c;
  font-size: 20px;
  padding-bottom: 10px;
  font-weight: 600;
  border-bottom: 1px solid #efefef;
}

.title-bot {
  padding-top: 30px;
}

.conttBlock {
  height: 120px;
  background-color: #d95141;
}

.conttBlock > div {
  display: flex;
  justify-content: center;
}

.conttBlock img {
  width: 70px;
  height: 70px;
  padding-top: 25px;
  padding-right: 30px;
}

.conttBlock span {
  color: white;
  font-size: 24px;
  font-weight: 600;
  padding-top: 20px;
  text-align: center;
  line-height: 40px;
}

.conttBlock1 {
  background-color: #d95141;
}

.conttBlock2 {
  background-color: #13cfb4;
}

.conttBlock3 {
  background-color: #f8a646;
}

.port-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  color: #636e7c;
}

.port-title span {
  width: 6px;
  height: 14px;
  margin-right: 5px;
  display: inline-block;
  background-color: #2f85d0;
}

.select-wrap {
  display: flex;
  margin-bottom: 20px;
}

.select-wrap > span {
  line-height: 32px;
  padding: 0 15px;
}

.select-wrap .el-date-editor.el-input {
  width: 190px !important;
}

.select-wrap .el-select {
  width: 110px !important;
}

.ways-wrap {
  display: block;
}
</style>
