<template>
  <div id="app">
    {{ awaitNum }}
    <div class="box"></div>
    <img src="@/assets/images/404.png" alt="" />
    <img src="@/assets/images/logo.svg" alt="" />
    <img src="@/assets/images/bg_jiexuqiu.svg" alt="" />
    <router-view></router-view>
    <div></div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      awaitNum: 0,
      img: require('@/assets/images/404.png'),
      dom: <div style="color:red">123</div>
    }
  },
  mounted() {
    console.log(this.img)
    console.log(this.dom)
  },
  methods: {},
}
</script>

<style lang="less">
.box {
  width: 100px;
  height: 100px;
  border: 1px solid black;
  box-shadow: 10px 10px red;
  transform: translateX(30px);
  display: flex;
}
</style>
