<template>
  <div
    class="purchase-panel"
    :style="{ width: wrapWidth }"
    @click="toPurchaseDetail"
  >
    <div class="purchase-panel-top">
      <div class="left show-line_1">
        <div v-if="renderItem.isTop === 1" class="mark top">置顶</div>
        <div v-if="renderItem.isChoice === 1" class="mark right-choice">
          精选
        </div>
        <div
          v-if="highLight"
          class="title show-line_1"
          v-html="highLightObj.lightTitle"
        ></div>
        <div
          v-else
          class="title show-line_1"
          :class="size === 'small' ? 'small-title' : ''"
        >
          {{ renderItem.bidName }}
        </div>
      </div>
      <div class="right">
        <div v-if="renderItem.bidPurchaseBudget" class="mark price">
          {{ renderItem.bidPurchaseBudget }}万元
        </div>
        <div v-if="renderItem.bidPurchaseDate" class="mark date">
          {{ renderItem.bidPurchaseDate }}
        </div>
      </div>
    </div>
    <div class="purchase-panel-content">
      <template v-if="renderItem.purchaseItemStr || renderItem.description">
        <div
          v-if="highLight"
          class="purchase-items show-line_1"
          v-html="
            highLightObj.lightPurchaseItem || highLightObj.lightDescription
          "
        ></div>
        <div v-else class="purchase-items show-line_1">
          采购品目：{{
            (renderItem.purchaseItemStr || renderItem.description)
              | replaceSemiWithExcl
          }}
        </div>
      </template>
      <template v-if="renderItem.bidProduct">
        <div
          v-if="highLight"
          class="purchase-product show-line_1"
          v-html="highLightObj.lightBidProduct"
        ></div>
        <div v-else class="purchase-product show-line_1">
          采购产品：{{ renderItem.bidProduct | replaceSemiWithExcl }}
        </div>
      </template>
    </div>
    <div class="purchase-panel-footer">
      <div class="left">
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
        </template>
        <!-- 因为城市超过4个字符省略所以分割线单独写 overflow:hidden会使伪元素消失 -->
        <template
          v-if="
            (renderItem.bidCityName ||
              renderItem.bidCity ||
              renderItem.bidProvinceName) &&
            renderItem.bidCompany
          "
        >
          <div class="split-line">|</div>
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

    <div v-if="isRead == 0 && dealRead" class="icon-no-read"></div>
  </div>
</template>

<script>
  import PurchaseDetail from '@/views/yqmmpro/components/PurchaseDetail.vue'
  export default {
    name: 'PurchaseCard',
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
      renderItem: {
        type: Object,
        default: () => ({}),
      },
      /**默认大卡片，如用小卡片需传'small'（因为标题省略长度不同） */
      size: {
        type: String,
        default: 'large',
      },
      /**是否需要高亮 */
      highLight: {
        type: Boolean,
        default: false,
      },
      /**卡片大小，默认同父元素大小，如需要小卡片需要传值 */
      wrapWidth: {
        type: String,
        default: 'auto',
      },
      /**是否需要处理已读未读 */
      dealRead: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        isRead: 1,
        highLightObj: {}, // 需要高亮的对象
      }
    },
    watch: {
      renderItem: {
        handler(newVal) {
          // 高亮显示
          // 深拷贝
          this.highLightObj = JSON.parse(JSON.stringify(newVal))
          if (this.highLight) {
            // 项目名称
            this.highLightObj.lightTitle = this.highLightText(newVal.bidName)
            // 采购品目
            this.highLightObj.lightDescription = newVal.description
              ? '采购品目：' + this.highLightText(newVal.description)
              : ''
            this.highLightObj.lightDescription =
              this.highLightObj.lightDescription.replace(/,/g, '、')

            if (newVal.purchaseItemStr || newVal.purchaseItemStrSearch) {
              this.highLightObj.lightPurchaseItem = newVal.purchaseItemStrSearch
                ? '采购品目：' +
                  this.highLightText(newVal.purchaseItemStrSearch)
                : '采购品目：' + this.highLightText(newVal.purchaseItemStr)

              this.highLightObj.lightPurchaseItem =
                this.highLightObj.lightPurchaseItem.replace(/,/g, '、')
            }
            // 采购产品
            if (newVal.bidProduct || newVal.bidProductSearch) {
              this.highLightObj.lightBidProduct = newVal.bidProductSearch
                ? '采购产品：' + this.highLightText(newVal.bidProductSearch)
                : '采购产品：' + this.highLightText(newVal.bidProduct)
              // 多个产品用感叹号隔开
              this.highLightObj.lightBidProduct =
                this.highLightObj.lightBidProduct.replace(/;/g, '、')
            }
            // 采购单位
            if (newVal.bidCompany || newVal.bidCompanySearch) {
              this.highLightObj.lightBidCompany = newVal.bidCompanySearch
                ? this.highLightText(newVal.bidCompanySearch)
                : this.highLightText(newVal.bidCompany)
            }
          }
          this.isRead = this.renderItem.isRead
          this.highLightObj.publishTime =
            (newVal.publishTime ? newVal.publishTime.split(' ')[0] : '') ||
            (newVal.createtime ? newVal.createtime.split(' ')[0] : '')
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
      // 去采购意向详情页
      async toPurchaseDetail() {
        this.isRead = 1
        const id =
          this.renderItem.tokenEncodeId ||
          this.renderItem.contentId ||
          this.renderItem.articleId ||
          this.renderItem.objectId
        this.$globalDrawer.show({
          component: PurchaseDetail,
          options: {
            name: 'PurchaseDetail',
            title: '采购意向详情',
            props: { id: id },
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .purchase-panel {
    position: relative;
    padding: 16px;
    background: #ffffff;
    border-radius: 4px;
    margin-bottom: 12px;
    border: 1px solid #ececec;
    cursor: pointer;
    .purchase-panel-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      height: 24px;
      .mark {
        padding: 0 6px;
        height: 20px;
        line-height: 20px;
        background: #ff9919;
        font-size: 12px;
        color: #ffffff;
        border-radius: 2px;
        min-width: max-content;
        white-space: nowrap;
      }
      .left {
        display: flex;
        align-items: center;
        flex: auto;
        padding-right: 24px;
        .top {
          margin-right: 8px;
          background: #1aa7f1;
        }
        .right-choice {
          margin-right: 8px;
        }
        .title {
          color: #444444;
          // max-width: 632px;
          line-height: 20px;
          font-weight: 700;
        }
        .small-title {
          max-width: 347px;
        }
      }
      .right {
        display: flex;
        min-width: max-content;
        white-space: nowrap;
        .price,
        .date {
          height: 24px;
          line-height: 24px;
        }
        .price {
          background: rgba(255, 153, 25, 0.15);
          color: #ff9919;
        }
        .date {
          background: rgba(27, 168, 241, 0.15);
          color: #1ba8f1;
          margin-left: 10px;
        }
      }
    }
    .purchase-panel-content {
      position: relative;
      color: #666666;
      font-size: 13px;
      line-height: 21px;
      margin-bottom: 22px;
      height: 42px;
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
    .purchase-panel-footer {
      display: flex;
      justify-content: space-between;
      color: #999999;
      font-size: 12px;
      line-height: 14px;
      .left {
        display: flex;
        align-items: center;
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
    // 未读小红点
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
