<template>
  <div class="main">
    <el-container>
      <el-header>
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
          <el-radio-button :label="false">展开</el-radio-button>
          <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group> -->
      </el-header>
      <el-container class="content">
        <el-aside width="200px">
          <el-menu
            :default-active="activePath"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            :collapse="isCollapse"
            router
          >
            <el-menu-item
              index="/home/index"
              @click="saveNavState(`/home/index`)"
            >
              <!-- <i class="el-icon-tickets"></i> -->
              <span slot="title">首页</span>
            </el-menu-item>
            <el-menu-item
              index="/home/order"
              @click="saveNavState(`/home/order`)"
            >
              <i class="el-icon-tickets"></i>
              <span slot="title">工单管理</span>
            </el-menu-item>
            <el-menu-item
              index="/home/role"
              @click="saveNavState(`/home/role`)"
            >
              <i class="el-icon-s-check"></i>
              <span slot="title">角色管理</span>
            </el-menu-item>
            <el-menu-item
              index="/home/type"
              @click="saveNavState(`/home/type`)"
            >
              <i class="el-icon-s-release"></i>
              <span slot="title">故障管理</span>
            </el-menu-item>
            <el-menu-item
              index="/home/score"
              @click="saveNavState(`/home/score`)"
            >
              <i class="el-icon-medal-1"></i>
              <span slot="title">评分管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view v-if="isRouterAlive"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import order from "./order";
export default {
  components: { order },
  data() {
    return {
      activePath: "/home",
      isCollapse: false,
      isRouterAlive: true,
    };
  },
  // inject: ["reload"],
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    saveNavState(index) {
      console.log(index);
      this.reload();
      window.sessionStorage.setItem("activePath", index);
      this.activePath = index;
    },
  },
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  height: 100vh;
}
.el-header {
  background-color: RGB(69, 159, 117);
  color: #333;
  text-align: center;
  line-height: 7vh;
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
  height: 100vh;
}
.content {
  height: 91.5vh;
}
</style>