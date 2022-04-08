<template>
  <div
    :class="
      hasBottomBorder
        ? 'page-top-operations-wrp has-bottom-border'
        : 'page-top-operations-wrp'
    "
  >
    <div class="operation-content">
      <div class="left-area">
        <!-- 操作区域 -->
        <slot name="operations"></slot>
      </div>
      <!-- 刷新 返回等 -->
      <div class="right-area">
        <global-reload
          v-if="showReload"
          @parentReload="parentReload"
        ></global-reload>
      </div>
    </div>
  </div>
</template>

<script>
  import GlobalReload from '../GlobalReload'
  export default {
    name: 'MuTopOperations',
    components: {
      GlobalReload,
    },
    props: {
      showReload: {
        type: Boolean,
        default: false,
      },
      hasBottomBorder: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {}
    },
    computed: {},
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {
      parentReload() {
        this.$emit('parentReload')
      },
    },
  }
</script>

<style lang="less" scoped>
  .page-top-operations-wrp {
    position: sticky;
    top: 0px;
    z-index: 100;
    width: 100%;
    height: 56px;
    background: white;
    &.has-bottom-border {
      border-bottom: 1px solid #ebebeb;
    }
    .operation-content {
      height: 100%;
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      .left-area {
        padding-right: 24px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .right-area {
        display: flex;
        align-items: center;
      }
      .ant-divider.ant-divider-vertical {
        margin: 0 24px;
      }
    }
  }
</style>
<style lang="less"></style>
