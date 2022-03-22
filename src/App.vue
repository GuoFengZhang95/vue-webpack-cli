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
  async mounted() {
    const  fn =   () => {
      console.log(1)
    }
    await fn()
    const arr = [1, 2, 3]
    let bool = arr.includes(1)
    console.log(bool)
    let p = new Promise((resolve, reject) => {})
    console.log(p)
    let map = new Map()
    console.log('map', map)
  },
};
</script>

<style lang="less">
</style>
