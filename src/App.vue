<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
  mounted() {
    const fn = () => {
      console.log(1)
    }
    console.log(fn)
    const arr = [1, 2, 3]
    let bool = arr.includes(1)
    console.log(bool)
    let p = new Promise((resolve, reject) => {})
    console.log(p)
  },
};
</script>

<style lang="less">
</style>
