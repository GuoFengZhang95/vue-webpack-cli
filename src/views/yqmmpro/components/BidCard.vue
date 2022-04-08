<template>
  <div class="bid-panel" :style="{ width: wrapWidth }" @click="toBidDetail">
    <div class="bid-panel-top">
      <div v-if="renderItem.isTop == 1" class="mask top">置顶</div>
      <div v-if="renderItem.isChoice == 1" class="mask right-choice">精选</div>
      <div
        v-if="highLight"
        class="title show-line_1"
        v-html="highLightObj.lightTitle"
      ></div>
      <div v-else class="title show-line_1">{{ renderItem.title }}</div>
    </div>
    <div class="bid-panel-content">
      <div class="mask-wrap">
        <div v-if="renderItem.bidProduct" class="mask product show-line_1">
          {{ renderItem.bidProduct | replaceSemiWithExcl }}
        </div>
        <div v-if="bidBudget" class="mask price">{{ bidBudget }}万元</div>
      </div>
      <div
        v-if="highLight"
        class="article-content show-line_2"
        v-html="highLightObj.lightContent"
      ></div>
    </div>
    <div class="bid-panel-footer">
      <div class="left">
        <div v-if="renderItem.bidTypeName" class="bid-type">
          {{ renderItem.bidTypeName }}
        </div>
        <template
          v-if="
            renderItem.bidCityName ||
            renderItem.bidCity ||
            renderItem.bidProvinceName
          "
        >
          <div class="city show-line_1">
            {{
              renderItem.bidCityName ||
              renderItem.bidCity ||
              renderItem.bidProvinceName
            }}
          </div>
          <!-- 因为城市超过4个字符省略所以分割线单独写 overflow:hidden会使伪元素消失 -->
          <div v-if="renderItem.bidCompany" class="split-line">|</div>
        </template>
        <template v-if="renderItem.bidCompany">
          <div
            v-if="highLight"
            class="company show-line_1"
            v-html="highLightObj.lightBidCompany"
          ></div>
          <div
            v-else
            class="company show-line_1"
            :class="size === 'small' ? 'short-company' : ''"
          >
            {{ renderItem.bidCompany }}
          </div>
        </template>
      </div>
      <div class="right">
        {{ highLightObj.publishTime || highLightObj.createtime }}
      </div>
    </div>

    <!-- 是否未读 -->
    <div v-if="isRead == 0 && dealRead" class="icon-no-read"></div>
  </div>
</template>

<script>
  import BidDetail from './BidDetail/index.vue'
  export default {
    name: 'BidCard',
    filters: {
      replaceSemiWithExcl(str) {
        if (str) {
          return str.replace(/;/g, '、')
        } else {
          return str
        }
      },
    },
    props: {
      /**外部传入的卡片信息 */
      renderItem: {
        type: Object,
        default: () => {},
      },
      /**默认大卡片，如用小卡片需传'small'（因为标题省略长度不同） */
      size: {
        type: String,
        default: 'large',
      },
      /**卡片大小，默认同父元素大小，如需要小卡片需要传值 */
      wrapWidth: {
        type: String,
        default: 'auto',
      },
      /**否需要高亮 */
      highLight: {
        type: Boolean,
        default: false,
      },
      /**是否需要处理已读未读 */
      dealRead: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        /**高亮对象 */
        highLightObj: {},
        bidBudget: '',
        isRead: 1,
      }
    },
    watch: {
      renderItem: {
        handler(newVal) {
          // 深拷贝
          this.highLightObj = JSON.parse(JSON.stringify(newVal))
          // 处理高亮数据
          if (this.highLight) {
            // 标题
            this.highLightObj.lightTitle = this.highLightText(newVal.title)
            // 正文
            if (newVal.content && newVal.content.includes('<em>')) {
              this.highLightObj.lightContent =
                '...' + this.highLightText(newVal.content) + '...'
            }
            // 采购单位
            this.highLightObj.lightBidCompany = this.highLightText(
              newVal.bidCompany
            )
            // 接口多传了，前端兼容
            if (newVal.bidProduct && newVal.bidProduct.includes('<em>')) {
              newVal.bidProduct = newVal.bidProduct
                .replaceAll('<em>', '')
                .replaceAll('</em>', '')
            }
          }
          this.isRead = this.renderItem.isRead
          this.highLightObj.publishTime =
            (newVal.publishTime ? newVal.publishTime.split(' ')[0] : '') ||
            (newVal.createtime ? newVal.createtime.split(' ')[0] : '')
        },
        immediate: true,
      },
      'renderItem.bidTypeId': {
        handler(val) {
          // 招标公告
          const arr1 = [801, 802, 803, 804, 805, 806, 807, 808, 809]
          // 招标结果及招标信用
          const arr2 = [810, 811, 812, 813, 814, 815, 816, 817]
          if (arr2.indexOf(val) !== -1) {
            this.bidBudget = this.renderItem.winBidMoneySum
          } else if (arr1.indexOf(val) !== -1) {
            this.bidBudget = this.renderItem.bidPurchaseBudget
          }
        },
        immediate: true,
      },
    },
    methods: {
      // 替换标签添加高亮
      highLightText(str) {
        if (!str) return ''
        return str
          .replaceAll('<em>', '<span style="color: #00C7DB">')
          .replaceAll('</em>', '</span>')
      },
      // 去标讯详情
      async toBidDetail() {
        this.isRead = 1
        const id =
          this.renderItem.tokenEncodeId ||
          this.renderItem.contentId ||
          this.renderItem.articleId ||
          this.renderItem.objectId
        // todo 是否登录
        this.$globalDrawer.show({
          component: BidDetail,
          options: { name: 'BidDetail', title: '标讯详情', props: { id: id } },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .bid-panel {
    position: relative;
    padding: 12px 16px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #ebebeb;
    cursor: pointer;

    .mask {
      padding: 0 6px;
      height: 24px;
      line-height: 24px;
      font-size: 12px;
      border-radius: 2px;
    }

    .bid-panel-top {
      display: flex;
      align-items: center;
      margin-bottom: 14px;

      .right-choice {
        margin-right: 8px;
        height: 20px;
        line-height: 20px;
        background: #ff9919;
        color: #ffffff;
      }

      .top {
        margin-right: 8px;
        background: #1aa7f1;
        height: 20px;
        line-height: 20px;
        color: #fff;
      }

      .title {
        line-height: 20px;
        color: #444444;
        font-weight: 700;
        flex: 1;
      }
    }

    .bid-panel-content {
      position: relative;
      margin-bottom: 22px;

      .mask-wrap {
        display: flex;
        margin-bottom: 12px;
        height: 24px;
        .product {
          max-width: 202px;
          background: rgba(0, 199, 219, 0.15);
          color: #00c7db;
          margin-right: 10px;
        }
        .price {
          background: rgba(255, 153, 25, 0.15);
          color: #ff9919;
        }
      }

      .article-content {
        color: #666666;
        font-size: 13px;
        line-height: 21px;
      }

      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -12px;
        width: 100%;
        height: 1px;
        background: rgba(233, 233, 233, 0.5);
      }
    }

    .bid-panel-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #999999;
      font-size: 12px;

      .left {
        display: flex;
        align-items: center;

        .bid-type {
          padding: 2px 6px;
          border: 1px solid #00c7db;
          border-radius: 2px;
          font-size: 12px;
          color: #00c7db;
          margin-right: 8px;
        }

        .city {
          position: relative;
          margin-right: 10px;
          max-width: 58px;
        }

        .split-line {
          margin-right: 10px;
          color: rgba(233, 233, 233, 0.5);
        }

        .company {
          max-width: 252px;
        }

        .short-company {
          max-width: 180px;
        }
      }
    }

    .icon-no-read {
      position: absolute;
      top: 5px;
      right: 5px;
      width: 10px;
      height: 10px;
      background-color: red;
      border-radius: 50%;
    }
  }
</style>
