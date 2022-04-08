<template>
  <div
    class="mumu-divid-wrp"
    :style="{ height: height + 'px', backgroundColor }"
  ></div>
</template>

<script>
  export default {
    name: 'MuDivid',
    props: {
      height: {
        type: [String, Number],
        default: '10',
      },
      backgroundColor: {
        type: String,
        default: '#e3e5e6',
      },
    },
  }
</script>

<style lang="less" scoped>
  .mumu-divid-wrp {
    width: 100%;
  }
</style>
