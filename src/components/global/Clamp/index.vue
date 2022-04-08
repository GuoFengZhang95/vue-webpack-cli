<template>
  <div class="mumu-clamp">
    <div :class="isExpandShow ? 'facts-box expanded' : 'facts-box'">
      <div class="facts-detail" v-html="content"></div>
    </div>
    <div v-if="isExpand" class="expand" @click="isExpandShow = !isExpandShow">
      {{ isExpandShow ? '收起' : '更多' }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MuClamp',
    props: {
      content: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        isExpand: false,
        isExpandShow: false,
      }
    },
    watch: {
      content: {
        handler(val) {
          if (val) {
            this.$nextTick(() => {
              if (document.getElementsByClassName('facts-detail')[0]) {
                this.isExpand =
                  document.getElementsByClassName('facts-detail')[0]
                    .offsetHeight > 416
              }
            })
          }
        },
        deep: true,
        immediate: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .mumu-clamp {
    .facts-box {
      max-height: 416px;
      height: fit-content;
      overflow: hidden;
      .facts-detail {
        display: flex;
        flex-direction: column;
        line-height: 1.5;
        font-size: 16px;
        color: #666;
        word-break: break-all;
        white-space: pre-wrap;
      }
      &.expanded {
        max-height: unset;
      }
    }
    .expand {
      width: 200px;
      height: 37px;
      line-height: 37px;
      text-align: center;
      margin: 24px auto 0;
      border-radius: 2px;
      border: 1px solid #00c7db;
      font-size: 14px;
      color: #00c7db;
      &:hover {
        cursor: pointer;
      }
    }
  }
</style>
