<template>
  <div class="container" @click="toNewsDetail(renderItem)">
    <img :src="cover" alt="cover" class="cover" />
    <img
      v-if="renderItem.isExplained == 1"
      src="@/assets/images/pic/news/unscramble.svg"
      alt=""
      class="unscramble"
    />
    <div class="content">
      <div class="title-box show-line_1">
        <div v-if="renderItem.isTop == 1" class="top">置顶</div>
        <div v-if="renderItem.isChoice == 1" class="choice">精选</div>
        <div
          v-if="highLight"
          class="title show-line_1"
          v-html="renderItem.title"
        ></div>
        <div v-else class="title show-line_1">{{ renderItem.title }}</div>
      </div>
      <div
        v-if="highLight"
        class="abstract"
        v-html="renderItem.abstract || renderItem.content"
      ></div>
      <div v-else class="abstract">{{ renderItem.abstract }}</div>
      <div class="bottom">
        <div class="left">
          <div v-if="renderItem.origin" class="from">
            来源于{{ renderItem.origin }}
          </div>
          <div class="time">
            {{ renderItem.publishTime || renderItem.createtime }}
          </div>
        </div>
        <div class="right">
          <div class="color">{{ renderItem.viewCount }}</div>
          浏览
          <template v-if="isCollectShow && renderItem.collectCount >= 0">
            <div class="color">{{ renderItem.collectCount }}</div>
            收藏
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { FormateNum } from '@/utils/index'
  import NewsDetail from './NewsDetail.vue'
  export default {
    name: 'NewsCard',
    components: {},
    props: {
      item: {
        type: Object,
        default: () => ({}),
      },
      highLight: {
        type: Boolean,
        default: false,
      },
      isCollectShow: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        renderItem: {},
      }
    },
    computed: {
      cover() {
        return (
          this.renderItem.cover ||
          (this.renderItem.coverImg &&
          this.renderItem.coverImg instanceof Array &&
          this.renderItem.coverImg[0]
            ? this.renderItem.coverImg[0]
            : this.renderItem.coverImg
            ? this.renderItem.coverImg
            : '')
        )
      },
    },
    watch: {
      item: {
        handler(val) {
          if (val) {
            let renderItem = this.$lodash.cloneDeep(val)
            if (this.highLight) {
              renderItem.title = renderItem.title
                ? this.highLightText(renderItem.title)
                : ''
              renderItem.abstract =
                renderItem.abstract || renderItem.content
                  ? this.highLightText(
                      renderItem.abstract || renderItem.content
                    )
                  : ''
            }
            if (typeof renderItem.viewCount == 'number') {
              renderItem.viewCount = FormateNum(renderItem.viewCount)
            }
            if (typeof renderItem.collectCount == 'number') {
              renderItem.collectCount = FormateNum(renderItem.collectCount)
            }
            this.renderItem = renderItem
          }
        },
        deep: true,
        immediate: true,
      },
    },
    mounted() {},
    methods: {
      highLightText(str) {
        const reg1 = /<em>/g
        const reg2 = /<\/em>/g
        return str
          .replace(reg1, '<span style="color:#00c7db">')
          .replace(reg2, '</span>')
      },
      async toNewsDetail(item) {
        let id = item.articleId || item.contentId || item.objectId
        this.$globalDrawer.show({
          component: NewsDetail,
          options: {
            name: 'NewsDetail',
            title: '重大商情详情',
            props: { id: id },
          },
        })
        this.$globalDrawer.reload()
      },
    },
  }
</script>

<style lang="less" scoped>
  .container {
    position: relative;
    height: 173px;
    margin-bottom: 12px;
    padding: 16px;
    display: flex;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #ebedf0;
    cursor: pointer;
    .cover {
      flex-shrink: 0;
      width: 211px;
      height: 141px;
      margin-right: 16px;
      border-radius: 4px;
    }
    .unscramble {
      position: absolute;
      top: 23px;
      left: 12px;
    }
    .content {
      width: 100%;
      overflow: hidden;
      .title-box {
        width: 100%;
        margin-bottom: 13px;
        display: flex;

        .choice {
          flex-shrink: 0;
          width: 36px;
          height: 20px;
          border-radius: 2px;
          background: #ff9919;
          font-size: 12px;
          line-height: 16px;
          padding-top: 2px;
          color: #ffffff;
          text-align: center;
          margin-right: 7px;
          white-space: nowrap;
        }
        .top {
          flex-shrink: 0;
          width: 36px;
          height: 20px;
          border-radius: 2px;
          background: #1aa7f1;
          font-size: 12px;
          line-height: 16px;
          padding-top: 2px;
          color: #ffffff;
          text-align: center;
          margin-right: 7px;
          white-space: nowrap;
        }
        .title {
          height: 20px;
          line-height: 20px;
          font-size: 18px;
          color: #444444;
          font-weight: 700;
        }
      }
      .abstract {
        // width: 100%;
        height: 66px;
        overflow: hidden;
        font-size: 14px;
        color: #666666;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        line-height: 21px;
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        line-height: 16px;
        margin-top: 26px;

        .left {
          display: flex;
          color: #999999;
          .from {
            margin-right: 16px;
          }
        }
        .right {
          display: flex;
          color: #999999;

          .color {
            color: #00c7db;
            margin-right: 4px;
            &:nth-child(2) {
              margin-left: 16px;
            }
          }
        }
      }
    }
  }
</style>
