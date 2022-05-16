<template>
  <div id="app">
    <button @click="$router.push({name: 'WebStorage'})">WebStorage</button>
    <router-view></router-view>
  </div>
</template>

<script>
  import { fn1Mixin as a,fn2Mixin} from '@/mixins/index'
  export default {
    name: 'App',
    mixins: [a(), fn2Mixin()],
    data() {
      return {}
    },
    async mounted() {
      console.log('App mounted')
    },
    methods: {},
  }
</script>

<style lang="less">
</style>
