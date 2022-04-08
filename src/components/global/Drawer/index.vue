<template>
  <div ref="mdrawer" class="mdrawer" :class="drawerStyleList" :style="style">
    <div class="mdrawer-wrap">
      <div class="mdrawer-close" @click="close"></div>
      <header class="mdrawer-header">
        <h3 class="title">{{ title }}</h3>
        <div class="actions">
          <!-- 头部操作区域插槽 -->
          <slot name="actions"></slot>
        </div>
      </header>
      <main class="mdrawer-content">
        <!-- 内容区域默认插槽 -->
        <slot></slot>
      </main>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'MuDrawer',
    components: {},
    props: {
      spinning: {
        type: Boolean,
        default: false,
      },
      // 是否展示侧拉
      value: {
        type: Boolean,
        default: () => false,
      },
      // 标题
      title: {
        type: String,
        default: () => '',
      },
      // 侧拉定位，默认fixed定位, 可选absolute(可相对当前父元素定位)
      position: {
        type: String,
        default: () => 'fixed',
      },
      // 自定义侧拉的宽度
      width: {
        type: String,
        default: () => '',
      },
      // 侧拉最小宽度
      minWidth: {
        type: String,
        default: () => '',
      },
    },
    data() {
      return {
        style: {
          width: '',
          minWidth: '',
          transition: '',
        },
      }
    },
    computed: {
      // 侧拉样式
      drawerStyleList() {
        // 如果是打开侧拉，给侧拉添加打开样式
        let style = []
        if (this.value) {
          if (this.position && this.position === 'absolute') {
            style = ['absolute', 'out']
          } else {
            style = ['fix', 'out']
          }
        } else {
          // 如果是关闭侧拉
          if (this.position && this.position === 'absolute') {
            style = ['absolute']
          } else {
            style = ['fix']
          }
        }
        return style
      },
    },
    watch: {},
    mounted() {
      this.init()
    },
    destroyed() {},
    methods: {
      // 初始化侧拉
      init() {
        // 设置侧拉宽度、初始定位
        if (this.width) {
          this.style.width = this.width
        }
        // 最小宽度
        if (this.minWidth) {
          this.style.minWidth = this.minWidth
        }
        // 设置侧拉过渡效果
        setTimeout(() => {
          this.style.transition = 'transform .2s ease'
        })
      },
      // 关闭侧拉
      close() {
        this.$emit('input', false)
        this.$emit('toggleDrawer', false)
      },
    },
  }
</script>
<style lang="less" scoped>
  .mdrawer {
    background: white;
    box-shadow: -10px 0px 20px 0px rgba(0, 0, 0, 0.16);
    transform: translateX(100% + 24px);
    margin-right: 0;
    width: ~'calc(100vw - 500px)';
    .spinning {
      height: 100%;
      .ant-spin-container {
        height: 100%;
        .ant-spin-container {
          height: 100%;
        }
      }
    }
    &.fix {
      position: fixed;
      top: 110px;
      right: 0;
      height: ~'calc(100vh - 110px)';
      z-index: 99;
      &.out {
        transform: none !important;
      }
    }
    &.absolute {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      z-index: 99;
      margin-right: 0;
      &.out {
        transform: none !important;
      }
    }
    .mdrawer-wrap {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      .mdrawer-close {
        position: absolute;
        top: 0;
        left: -24px;
        height: 56px;
        width: 24px;
        border-radius: 6px 0 0 6px;
        background: black;
        opacity: 0.7;
        cursor: pointer;
        &::after {
          content: '';
          position: absolute;
          top: 19px;
          left: 9px;
          border: 8px solid transparent;
          border-left-color: #ffffff;
        }
      }
      .mdrawer-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 700;
        padding: 16px 24px;
        box-sizing: border-box;
        margin: 0;
        padding: 0 24px;
        height: 56px;
        // box-shadow: 0 0px 10px 4px #f6f6f6;
        // box-shadow: -10px 0px 20px 0px rgba(0,0,0,0.16);
        border: 1px solid #ebebeb;
        .title {
          color: @primary-color;
          font-size: 18px;
          font-weight: 400;
          margin: 0;
        }
        .actions {
        }
      }
      .mdrawer-content {
        box-sizing: border-box;
        padding: 0 0;
        height: ~'calc(100% - 56px)';
        overflow: hidden;
        overflow-y: auto;
      }
    }
  }
</style>
