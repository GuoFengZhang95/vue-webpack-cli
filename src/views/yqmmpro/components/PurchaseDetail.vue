<template>
  <div :class="isDetailShow ? 'detail-bid' : 'detail-bid special'">
    <!-- 缺省图 -->
    <div v-if="!isDetailShow" class="default-container">
      <div class="detail-default">
        <img src="@/assets/images/common/detail-default.svg" alt="default" />
        <span>该采购意向已被删除或下架</span>
      </div>
    </div>
    <!-- 标讯/采购意向详情 -->
    <div v-else class="main-container">
      <MuPageHeader title="采购意向详情" :show-reload="false">
        <div class="detail-title-buttons-wrp">
          <a-button @click="copyShareLink">分享链接</a-button>
          <template v-if="!isUnlock">
            <a-button :type="likeButtonStatus.type" @click="like">
              {{ likeButtonStatus.text }}
            </a-button>
            <a-button :type="collectButtonStatus.type" @click="collect">
              {{ collectButtonStatus.text }}
            </a-button>
          </template>
        </div>
      </MuPageHeader>
      <div class="detail-title">
        <div class="common-title">
          <div class="title">{{ detailInfo.titleDetail.title }}</div>
          <div class="detail">
            <div class="detail-left show-line_1">
              <div v-if="detailInfo.titleDetail.origin" class="news">
                {{ detailInfo.titleDetail.origin }}
              </div>
              <div v-if="detailInfo.titleDetail.city" class="city">
                {{ detailInfo.titleDetail.city }}
              </div>
              <div v-if="detailInfo.titleDetail.unit" class="unit show-line_1">
                {{ detailInfo.titleDetail.unit }}
              </div>
              <div class="publish-time">{{ detailInfo.titleDetail.time }}</div>
            </div>
            <div class="detail-right">
              <div class="like">{{ detailInfo.titleDetail.like }}点赞</div>
              <div class="collect">
                {{ detailInfo.titleDetail.collect }}收藏
              </div>
            </div>
          </div>
        </div>
      </div>
      <Blur
        v-if="isUnlock"
        module="purchase"
        src="https://img.mumuxili.com/yqmm/pc/saas/images/blur/purchase.png"
        :qrcode="'data:image/png;base64,' + qrCode"
      ></Blur>
      <div v-else class="detail-container">
        <div class="detail-content">
          <!-- 基本信息 -->
          <div v-if="isBaseInfoShow" class="base-info">
            <div class="base-title">基本信息</div>
            <div class="info-content">
              <div
                v-if="detailInfo.baseInfo && detailInfo.baseInfo !== {}"
                class="info-item purchase"
              >
                <div v-if="detailInfo.baseInfo.bidPurchaseDate">
                  预计采购时间：
                  <span>{{ detailInfo.baseInfo.bidPurchaseDate }}</span>
                </div>
                <div v-if="detailInfo.baseInfo.bidPurchaseBudget">
                  项目预算：
                  <span>{{ detailInfo.baseInfo.bidPurchaseBudget }}万元</span>
                </div>
                <div v-if="detailInfo.baseInfo.purchaseItemStr" class="w-100">
                  <div>采购品目：</div>
                  <span>{{ detailInfo.baseInfo.purchaseItemStr }}</span>
                </div>
                <div v-if="detailInfo.baseInfo.bidProduct" class="w-100">
                  <div>采购产品：</div>
                  <span>{{ detailInfo.baseInfo.bidProduct }}</span>
                </div>
              </div>
            </div>
            <DownloadFilePanel
              :files="fileList"
              :custom-fields="{ fileName: 'name' }"
            ></DownloadFilePanel>
          </div>
          <!-- 项目概况 -->
          <div class="base-facts">
            <div class="base-title">项目概况</div>
            <div class="facts-content">
              <MuClamp :content="detailInfo.facts"></MuClamp>
            </div>
          </div>
        </div>
        <div class="tab-wrp">
          <!-- <MuDivid></MuDivid> -->
          <BidPurchaseDetailTab
            v-if="isTabShow"
            :id="id"
            :page-type="1"
          ></BidPurchaseDetailTab>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getPurchaseDetail,
    getBidLikeCollectInfo,
    like,
    collect,
    getYqmmQrCode,
  } from '@/api/yqmmPro'
  import { FormateNum } from '@/utils'
  const BidPurchaseDetailTab = () => import('./BidDetail/Tab')
  const Blur = () => import('./Blur.vue')
  const DownloadFilePanel = () =>
    import('@/components/local/DownloadFilePanel/index.vue')
  export default {
    name: 'PurchaseDetail',
    components: {
      BidPurchaseDetailTab,
      Blur,
      DownloadFilePanel,
    },
    props: {
      id: {
        type: [String, Number],
        default: '',
      },
    },
    data() {
      return {
        isUnlock: false,
        isTabShow: false,
        isDetailShow: true,
        isBaseInfoShow: false,
        detailInfo: {
          titleDetail: {},
          tabDetail: {
            topic: '相关商机',
            list: [],
          },
          baseInfo: {},
          facts: '',
          operateDetail: {
            originAddress: '', //新闻源地址
            isLike: 0,
            isCollect: 0,
            isShowOrigin: 0,
          },
        },
        qrCode: '',
        counts: {
          browse: 0,
          like: 0,
          collect: 0,
        },
        fileList: [
          {
            name: '这个一个pdf',
            fileExt: 'pdf',
            fileSize: 1000,
            fileTime: '2022-1-22',
          },
          {
            name: '这个一个docx',
            fileExt: 'docx',
            fileSize: 10000,
            fileTime: '2022-3-22',
          },
          {
            name: '这个一个xlsx',
            fileExt: 'xls',
            fileSize: 10000000,
            fileTime: '2022-5-22',
          },
        ],
      }
    },
    computed: {
      likeButtonStatus() {
        let status = { text: '点赞', type: 'default' }
        if (this.detailInfo.operateDetail.isLike) {
          status.text = '已点赞'
          status.type = 'primary'
        } else {
          status.text = '点赞'
          status.type = 'default'
        }
        return status
      },
      collectButtonStatus() {
        let status = { text: '收藏', type: 'default' }
        if (this.detailInfo.operateDetail.isCollect) {
          status.text = '已收藏'
          status.type = 'primary'
        } else {
          status.text = '收藏'
          status.type = 'default'
        }
        return status
      },
    },
    watch: {
      id: {
        handler: async function (newVal, oldVal) {
          if (!newVal) return
          this.$store.dispatch('app/setDrawerLayoutLoading', { flag: true })
          await this.getDetail(newVal)
          this.$store.dispatch('app/setDrawerLayoutLoading', { flag: false })
        },
        immediate: true,
      },
    },
    methods: {
      copyShareLink() {
        const text = `${window.location.origin}/yqmmpro/detail/purchase/${this.id}#${this.detailInfo.titleDetail.title}`
        if (window.navigator.clipboard) {
          navigator.clipboard.writeText(text)
        } else if (window.clipboardData) {
          window.clipboardData.setData('Text', text)
        }
        this.$message.success('已复制页面链接')
      },
      // 获取文章详情
      async getDetail(id) {
        const res = await getPurchaseDetail({ tokenEncodeId: id })
        if (res.code === '0') {
          this.isDetailShow = true
          let val = res.data.xcxInfoResult
          if (val && JSON.stringify(val) !== '{}') {
            let titleDetail = {
              title: val.bidName,
              city: val.bidCityName
                ? val.bidCityName
                : val.bidProvinceName
                ? val.bidProvinceName
                : '',
              unit: val.bidCompany,
              time: val.publishTime,
              browse: val.viewCount ? FormateNum(val.viewCount) : 0,
              like: val.praiseNums ? FormateNum(val.praiseNums) : 0,
              collect: val.collectCount ? FormateNum(val.collectCount) : 0,
              bidTypeName: val.bidTypeName,
            }
            this.detailInfo.titleDetail = titleDetail
            this.counts = {
              browse: val.viewCount ? val.viewCount : 0,
              like: val.praiseNums ? val.praiseNums : 0,
              collect: val.collectCount ? val.collectCount : 0,
            }
          }
          if (res.data.unlock === 1 || res.data.unlock === -1) {
            this.isUnlock = false
            if (res.data.unlock === 1) {
              this.$message.info('采购意向查看额度-1')
            }

            this.isTabShow = true
            this.detailInfo.facts = res.data.xcxInfoResult.content
              ? res.data.xcxInfoResult.content
              : ''
            if (res.data.xcxInfoResult) {
              let e = res.data.xcxInfoResult
              this.handleBaseInfo(e)
              this.detailInfo.operateDetail.originAddress = e.originAddress
              this.detailInfo.operateDetail.isShowOrigin = e.isShowOrigin
            }
            let res2 = await getBidLikeCollectInfo({ tokenEncodeId: this.id })
            if (res2.code === '0') {
              this.detailInfo.operateDetail.isCollect = res2.data.isCollect
              this.detailInfo.operateDetail.isLike = res2.data.isLike
            }
          } else {
            this.isUnlock = true
            //无法解锁 获取小程序二维码
            await this.handleQRCode()
          }
        } else {
          this.isDetailShow = false
        }
      },
      // 获取小程序码回调
      async handleQRCode() {
        let params = {
          page: 'pages/content/purchase/detail/detail',
          scene: `id=${this.id}&platform=saas`,
        }
        let { code, data } = await getYqmmQrCode(params)
        if (code === '0') {
          this.qrCode = data
        }
      },
      // 处理采购意向简介信息
      handleBaseInfo(e) {
        Object.assign(this.detailInfo.baseInfo, {
          bidPurchaseDate: e.bidPurchaseDate ? e.bidPurchaseDate : '',
          bidPurchaseBudget: e.bidPurchaseBudget ? e.bidPurchaseBudget : '',
          purchaseItemStr: e.purchaseItemStr ? e.purchaseItemStr : '',
          bidProduct: e.bidProduct ? e.bidProduct.replaceAll(';', '、') : '',
        })

        this.$set(this.detailInfo, 'baseInfo', this.detailInfo.baseInfo)
        let item = this.detailInfo.baseInfo
        if (!item) {
          this.isBaseInfoShow = false
        } else {
          for (let key in item) {
            if (item[key]) {
              this.isBaseInfoShow = true
              break
            } else {
              this.isBaseInfoShow = false
            }
          }
        }
      },
      /**点赞 */
      async like() {
        let action = this.detailInfo.operateDetail.isLike === 1 ? 2 : 1
        let params = {
          targetId: this.id,
          module: 1,
          action,
        }
        const res = await like(params)
        if (res.success) {
          this.$set(
            this.detailInfo.operateDetail,
            'isLike',
            action === 1 ? 1 : 0
          )
          let deltaCount = action === 1 ? 1 : -1
          let count = FormateNum(this.counts.like + deltaCount)
          this.$set(this.detailInfo.titleDetail, 'like', count)
          this.counts.like += deltaCount
        }
      },
      /**收藏 */
      async collect() {
        let action = this.detailInfo.operateDetail.isCollect === 1 ? 2 : 1
        let params = {
          targetId: this.id,
          module: 1,
          action,
        }
        const res = await collect(params)
        if (res.success) {
          this.$set(
            this.detailInfo.operateDetail,
            'isCollect',
            action === 1 ? 1 : 0
          )
          let deltaCount = action === 1 ? 1 : -1
          let count = FormateNum(this.counts.collect + deltaCount)
          this.$set(this.detailInfo.titleDetail, 'collect', count)
          this.counts.collect += deltaCount
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .detail-bid {
    // display: flex;
    // justify-content: space-between;
    // width: 100%;
    // padding: 28px 0 32px;

    .main-container {
      .detail-title {
        width: 100%;
        padding: 24px 24px 0;
        background-color: #fff;

        .common-title {
          width: 100%;
          padding-bottom: 20px;
          background-color: #fff;
          border-bottom: 1px dashed #ebebeb;

          .title {
            width: 100%;
            font-size: 22px;
            font-weight: bold;
            color: #444;
            line-height: 26px;
          }

          .detail {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-top: 10px;

            .detail-left,
            .detail-right {
              display: flex;
              align-items: center;
              font-size: 14px;
              color: #999;

              > div {
                position: relative;
                height: 18px;
                line-height: 18px;
                padding-right: 32px;

                &::before {
                  position: absolute;
                  right: 17px;
                  top: 3px;
                  content: '';
                  width: 1px;
                  height: 12px;
                  background-color: rgba(233, 233, 233, 0.5);
                }

                &:last-child {
                  margin-right: 0;

                  &::before {
                    display: none;
                  }
                }
              }

              .bid-tag {
                padding: 0 6px;
                height: 20px;
                line-height: 18px;
                margin-right: 12px;
                font-size: 12px;
                border-radius: 2px;
                border: 1px solid #00c7db;
                color: #00c7db;
                white-space: nowrap;

                &::before {
                  display: none;
                }
              }
            }

            .detail-right {
              width: fit-content;
              margin-left: 16px;

              > div {
                white-space: nowrap;
              }
            }
          }
        }
      }

      .detail-container {
        width: 100%;

        .detail-content {
          padding: 20px 24px 0;
          margin-bottom: 28px;
          background-color: #fff;

          .base-title {
            position: relative;
            padding-left: 12px;
            margin-bottom: 8px;
            height: 24px;
            line-height: 24px;
            font-size: 16px;
            color: #444;
            font-weight: 400;

            &::before {
              content: '';
              position: absolute;
              left: 0px;
              top: 50%;
              transform: translateY(-50%);
              width: 4px;
              height: 20px;
              background: #00c7db;
            }
          }

          .info-content {
            width: 100%;
            padding: 16px 16px 4px;
            background: #f9f9f9;
            margin-bottom: 32px;
            border-radius: 4px;
            .info-item {
              display: flex;
              justify-content: space-between;
              flex-wrap: wrap;
              width: 100%;
              > div {
                width: fit-content;
                min-width: 404px;
                line-height: 16px;
                font-size: 14px;
                color: #999;
                line-height: 22px;
                margin-bottom: 12px;
                > span {
                  color: #444;
                }
                &.w-100 {
                  display: flex;
                  width: 100%;
                  flex-shrink: 0;
                  > div {
                    width: 70px;
                    white-space: nowrap;
                  }
                  > span {
                    // width: 739px;
                    white-space: pre-wrap;
                    word-break: normal;
                    word-wrap: break-word;
                  }
                }
              }
            }
          }

          /deep/.facts-content {
            margin-bottom: 24px;
            font-size: 16px;
            color: #666;
            // line-height: 32px;
            p,
            span {
              font-size: 16px;
              color: #666;
            }
            h1 {
              position: relative;
              padding-left: 15px;
              margin-bottom: 20px;
              font-size: 18px;
              font-weight: bold;
              color: #444;
              line-height: 21px;
              &::before {
                position: absolute;
                top: 2px;
                left: 0;
                content: '';
                width: 9px;
                height: 17px;
                background-image: url('~@/assets/images/common/line-2.svg');
              }
            }
            h2 {
              position: relative;
              padding-left: 9px;
              margin-bottom: 6px;
              font-size: 16px;
              font-weight: bold;
              color: #444;
              line-height: 21px;
              &::before {
                position: absolute;
                top: 2px;
                left: 0;
                content: '';
                width: 3px;
                height: 17px;
                background-image: url('~@/assets/images/common/line-1.svg');
              }
            }
            h3 {
              margin: 20px 0 6px;
              font-size: 16px;
              font-weight: bold;
              color: #444;
              line-height: 21px;
            }
            p {
              margin: 0;
              padding: 0;
              line-height: 32px;
              margin: 10px;
            }
            table {
              margin-top: 16px;
              tr {
                border-top: 1px solid #d9d9d9;
                border-bottom: none;
                &:last-child {
                  border-bottom: 1px solid #d9d9d9;
                }
                td {
                  border-left: 1px solid #d9d9d9;
                  border-right: none;
                  &:last-child {
                    border-right: 1px solid #d9d9d9;
                  }
                }
              }
              thead {
                tr {
                  th {
                    border-left: 1px solid #d9d9d9;
                    border-right: none;
                    &:last-child {
                      border-right: 1px solid #d9d9d9;
                    }
                  }
                }
              }
            }
            img {
              max-width: 100% !important;
              height: auto !important;
            }
          }
        }

        .tab-wrp {
          background: white;
          border-radius: 4px;
        }
      }
    }

    .default-container {
      height: 710px;
      background-color: #fff;

      .detail-default {
        position: relative;
        width: 310px;
        height: 310px;
        margin: 54px auto 0;

        > img {
          width: 310px;
          height: 310px;
        }

        > span {
          position: absolute;
          bottom: 11px;
          left: 0;
          width: 100%;
          text-align: center;
        }
      }
    }
  }

  .detail-title-buttons-wrp {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    /deep/ .ant-btn {
      margin-left: 12px;
      &.ant-btn-default {
        &:focus {
          border-color: #d9d9d9;
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
  }
</style>
