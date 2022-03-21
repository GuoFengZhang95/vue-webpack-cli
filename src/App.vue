<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {}
    },
    mounted() {
      console.log(this)
    },
  }
</script>

<style lang="less">
</style>
