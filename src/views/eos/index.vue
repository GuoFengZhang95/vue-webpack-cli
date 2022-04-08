<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
  import { getShopcartList } from '@/api/eos/index'
  export default {
    name: 'Eos',
    data() {
      return {}
    },
    mounted() {
      console.log('EosIndex mounted')
      this.init()
    },
    methods: {
      init() {
        getShopcartList().then(res => {
          this.$store.dispatch('shopcart/getShopcartCount', res.data.length)
        })
      },
    },
  }
</script>

<style lang="less" scoped></style>

<style lang="less"></style>
