<template>
  <div class="module-home">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'SystemIndex',
    mounted() {
      console.log('SystemIndex mounted')
    },
  }
</script>

<style lang="less" scoped></style>
