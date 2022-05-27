<template>
  <div id="app">
    <button @click="$router.push({name: 'WebStorage'})">WebStorage</button>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    components: {},
    data() {
      return {}
    },
    async mounted() {
      console.log('App mounted1')
    },
    methods: {},
  }
</script>

<style lang="less">
</style>
