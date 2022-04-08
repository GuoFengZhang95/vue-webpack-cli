<template>
  <span class="status-wrp">
    <span class="status-dot" :class="dotStatus"></span>
    <span :style="{ fontSize: fontSize }">{{ text }}</span>
  </span>
</template>

<script>
  export default {
    name: 'MuDotStatus',
    props: {
      test: {
        type: Boolean,
        default: false,
      },
      text: {
        type: String,
        required: true,
      },
      fontSize: {
        type: String,
        default: '13px',
      },
      dotStatus: {
        type: String,
        required: true,
      },
    },
    data() {
      return {}
    },
    computed: {},
    watch: {},
    methods: {},
  }
</script>

<style lang="less" scoped>
  .status-wrp {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    .status-dot {
      margin-right: 6px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      // 进行中
      &.status_underway {
        background: #fad337;
      }
      // 已完成
      &.status_normal {
        background: #52c41a;
      }
      // 异常结束
      &.status_abnormal {
        background: #ff4433;
      }
    }
  }
</style>
