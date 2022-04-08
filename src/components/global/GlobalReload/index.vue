<template>
  <div class="global-reload" @click="reload">
    <a-icon type="sync" color="black"></a-icon>
    <span>刷新</span>
  </div>
</template>

<script>
  export default {
    name: 'GlobalReload',
    props: {
      test: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {}
    },
    methods: {
      reload() {
        this.$emit('parentReload')
      },
    },
  }
</script>

<style lang="less" scoped>
  .global-reload {
    margin-right: 24px;
    height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;

    .anticon,
    img {
      width: 14px;
      height: 14px;
      margin-left: 12px;
      margin-right: 6px;
    }
  }
</style>
