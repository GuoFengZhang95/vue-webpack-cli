<template>
  <div class="order-detail-wrp">
    <MuPageHeader
      :show-reload="true"
      :show-back="true"
      title="订单详情"
    ></MuPageHeader>
    <MuPageHeader :show-reload="false" sub-title="订单信息"></MuPageHeader>
    <div class="order-info page-content">
      <div class="status-list-wrp">
        <div class="status-list-item">
          <img src="@/assets/images/money-status.png" alt />
          <div>款状态:</div>
          <div>
            <MuDotStatus
              v-if="orderInfo.payStatus == 1"
              text="待付款"
              dot-status="status_underway"
            ></MuDotStatus>
            <MuDotStatus
              v-if="orderInfo.payStatus == 2"
              text="已付款，待处理"
              dot-status="status_underway"
            ></MuDotStatus>
            <MuDotStatus
              v-if="orderInfo.payStatus == 3"
              text="已付款"
              dot-status="status_normal"
            ></MuDotStatus>
          </div>
        </div>
        <div class="status-list-item">
          <img src="@/assets/images/invoice-status.png" alt />
          <div>票状态:</div>
          <a-tooltip :visible="tooltipVisible">
            <template v-if="Number(orderInfo.totalPrice)">
              <template v-if="orderInfo.payStatus !== 3">
                <template slot="title">当前订单未完成支付，无法开票。</template>
              </template>
              <template v-else>
                <template
                  v-if="
                    orderInfo.goodsStatus == 1 || orderInfo.goodsStatus == 2
                  "
                  slot="title"
                >
                  该订单还未确认库存，请在发货后申请发票。
                </template>
                <template v-else slot="title">点击状态，立即开票。</template>
              </template>
            </template>
            <template v-else>
              <template slot="title">此订单付款金额为0，无法开票。</template>
            </template>
            <a-button
              v-if="orderInfo.invoiceStatus == 1"
              type="link"
              @click="applicationInvoice"
              @mouseover="tooltipVisible = true"
              @mouseout="tooltipVisible = false"
            >
              <MuDotStatus
                text="未开票"
                dot-status="status_underway"
              ></MuDotStatus>
            </a-button>
          </a-tooltip>
          <span v-if="orderInfo.invoiceStatus == 2">申请保存未提交</span>
          <a-button
            v-if="orderInfo.invoiceStatus == 3"
            type="link"
            @click="showInvoiceDetail"
          >
            <MuDotStatus
              text="已申请"
              dot-status="status_underway"
            ></MuDotStatus>
          </a-button>
          <a-button
            v-if="orderInfo.invoiceStatus == 4"
            type="link"
            @click="showInvoiceDetail"
          >
            <MuDotStatus
              text="已申请"
              dot-status="status_underway"
            ></MuDotStatus>
          </a-button>
          <a-button
            v-if="orderInfo.invoiceStatus == 5"
            type="link"
            @click="showInvoiceDetail"
          >
            <MuDotStatus
              text="已拒绝"
              dot-status="status_abnormal"
            ></MuDotStatus>
          </a-button>
          <a-button
            v-if="orderInfo.invoiceStatus == 6"
            type="link"
            @click="showInvoiceDetail"
          >
            <MuDotStatus text="已开票" dot-status="status_normal"></MuDotStatus>
          </a-button>
          <MuDotStatus
            v-if="orderInfo.invoiceStatus == 7"
            text="预存无票"
            dot-status="status_underway"
          ></MuDotStatus>
          <MuDotStatus
            v-if="orderInfo.invoiceStatus == 8"
            text="无票"
            dot-status="status_underway"
          ></MuDotStatus>
          <MuDotStatus
            v-if="orderInfo.invoiceStatus == 20"
            text="关闭"
            dot-status="status_abnormal"
          ></MuDotStatus>
        </div>
        <div class="status-list-item">
          <img src="@/assets/images/goods-status.png" alt />
          <div>货状态:</div>
          <div>
            <MuDotStatus
              v-if="orderInfo.goodsStatus == 1"
              text="待处理"
              dot-status="status_underway"
            ></MuDotStatus>
            <MuDotStatus
              v-if="orderInfo.goodsStatus == 2"
              text="待备货"
              dot-status="status_underway"
            ></MuDotStatus>
            <MuDotStatus
              v-if="orderInfo.goodsStatus == 3"
              text="待发货"
              dot-status="status_underway"
            ></MuDotStatus>
            <MuDotStatus
              v-if="orderInfo.goodsStatus == 4"
              text="待收货"
              dot-status="status_underway"
            ></MuDotStatus>
            <MuDotStatus
              v-if="orderInfo.goodsStatus == 5"
              text="已收货"
              dot-status="status_normal"
            ></MuDotStatus>
          </div>
        </div>
      </div>
      <div class="order-info-wrp">
        <div class="a-descriptions-wrp">
          <a-descriptions :column="3">
            <a-descriptions-item label="订单编号">
              {{ orderInfo.orderId }}
              <img
                style="width: 12px; height: 12px; cursor: pointer"
                src="@/assets/images/icon/copy.png"
                @click="oneClicCopy(orderInfo.orderId)"
              />
            </a-descriptions-item>
            <a-descriptions-item label="订单类型">
              <span v-if="orderInfo.orderGenre === 1">普通订单</span>
              <span v-if="orderInfo.orderGenre === 2">平台订单</span>
            </a-descriptions-item>
            <a-descriptions-item label="订单状态">
              <span v-if="orderInfo.orderStatus == 2">待付款</span>
              <span v-if="orderInfo.orderStatus == 5">待发货</span>
              <span v-if="orderInfo.orderStatus == 6">待收货</span>
              <span v-if="orderInfo.orderStatus == 9">已取消</span>
              <span v-if="orderInfo.orderStatus == 10">已完成</span>
            </a-descriptions-item>
            <a-descriptions-item label="订单总额">
              （{{ orderInfo.currencyCode }}）{{ orderInfo.totalPrice }}
            </a-descriptions-item>
            <a-descriptions-item label="运费">
              （{{ orderInfo.currencyCode }}）{{ orderInfo.postage }}
            </a-descriptions-item>
            <a-descriptions-item label="平台补贴">
              （{{ orderInfo.currencyCode }}）{{ orderInfo.discountAmount }}
            </a-descriptions-item>
            <a-descriptions-item label="原子抵扣">
              （{{ orderInfo.currencyCode }}）{{ orderInfo.scoreDiscount }}
            </a-descriptions-item>
            <a-descriptions-item label="优惠金额">
              （{{ orderInfo.currencyCode }}）{{ orderInfo.discountPrice }}
            </a-descriptions-item>
            <a-descriptions-item label="实付金额">
              <span style="color: #ff4433">
                （{{ orderInfo.currencyCode }}）{{ orderInfo.paidTotalPrice }}
              </span>
            </a-descriptions-item>
          </a-descriptions>
          <a-descriptions :column="1">
            <a-descriptions-item label="备注">
              {{ orderInfo.memo }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div class="order-operations clearfix">
          <a-button class="fr" @click="afterSale">申请售后</a-button>
          <a-button class="fr" @click="exportPdf">导出PDF</a-button>
          <a-button
            v-if="orderInfo.orderStatus === 2"
            :loading="btnLoading"
            class="fr"
            type="primary"
            @click="pay"
          >
            现在付款
          </a-button>
          <a-button
            v-if="orderInfo.orderStatus === 6"
            :loading="btnLoading"
            class="fr"
            type="primary"
            @click="confirmGoods"
          >
            确认收货
          </a-button>
          <a-button
            v-if="orderInfo.orderStatus === 10 || orderInfo.orderStatus === 5"
            :loading="loading"
            class="fr"
            type="primary"
            @click="createMoreOrders"
          >
            再来一单
          </a-button>
        </div>
      </div>
    </div>
    <MuPageHeader :show-reload="false" sub-title="收货人信息"></MuPageHeader>
    <div v-if="orderInfo.addressInfo" class="address-info page-content">
      <span>{{ orderInfo.addressInfo.receiver }}</span>
      <span>{{ orderInfo.addressInfo.phone }}</span>
      <span>{{ orderInfo.addressInfo.province }}</span>
      <span>{{ orderInfo.addressInfo.city }}</span>
      <span>{{ orderInfo.addressInfo.district }}</span>
      <span>{{ orderInfo.addressInfo.streetdetailaddr }}</span>
    </div>
    <MuPageHeader :show-reload="false" sub-title="结算信息"></MuPageHeader>
    <div class="order-settlement page-content">
      <div class="a-descriptions-wrp">
        <a-descriptions :column="1">
          <a-descriptions-item label="结算方式">
            <span v-if="orderInfo.payMode == 'PAYFIRST'">现在付款</span>
            <span v-if="orderInfo.payMode == 'INVOICEPAYFST'">票到付款</span>
            <span v-if="orderInfo.payMode == 'PAYMONTHLY'">月结</span>
          </a-descriptions-item>
          <a-descriptions-item label="付款记录"></a-descriptions-item>
        </a-descriptions>
      </div>
      <common-table
        :scroll="{ x: 1072 }"
        :columns="columnsPayment"
        :data-source="orderInfo.paymentRecord"
        :table-size="tableSize"
      ></common-table>
    </div>
    <MuPageHeader :show-reload="false" sub-title="产品清单"></MuPageHeader>
    <div class="order-product-list page-content">
      <common-table
        :scroll="{ x: 1072 }"
        :columns="columnsProductDetailList"
        :data-source="productDetailList"
        :table-size="tableSize"
      ></common-table>
    </div>
    <MuPageHeader :show-reload="false" sub-title="物流信息"></MuPageHeader>
    <div class="page-content">
      <MuExpressList :express-list="expressList"></MuExpressList>
    </div>
  </div>
</template>

<script>
  import { getOrderInfo, moreOneOrder, dealOrder } from '@/api/eos/index'
  import { getExpressInfo } from '@/api/common'
  import ApplicationDetail from '../../invoice/components/ApplicationDetail'
  import { mapGetters } from 'vuex'
  export default {
    props: {
      externalProp: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        tooltipVisible: false,
        orderId: '',
        btnLoading: false,
        productDetailList: [],
        expressList: [],
        loading: false,
        orderInfo: {},
        tableProductList: [],
        tablePaymentList: [],
        listObj: {},
        // 表头设置
        columnsPayment: [
          {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 80,
            customRender: (text, record, index) => {
              return index + 1
            },
          },
          {
            title: '付款方式',
            dataIndex: 'paymethod',
            key: 'paymethod',
          },
          {
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
            customRender: (text, record, index) => {
              return (
                <span>
                  （{record.currencyCode ? record.currencyCode : 'CNY'}）{text}
                </span>
              )
            },
          },
          {
            title: '交易时间',
            dataIndex: 'tradingTime',
            key: 'tradingTime',
          },
          {
            title: '支付申请单号',
            dataIndex: 'transactionNum',
            key: 'transactionNum',
          },
        ],
        columnsProductDetailList: [
          {
            title: '序号',
            dataIndex: 'index',
            width: 80,
            customRender: (text, record, index) => {
              return index + 1
            },
          },
          {
            title: '图片',
            dataIndex: 'coverImage',
            key: 'coverImage',
            customRender: (text, record, index) => {
              return (
                <div class='td-img'>
                  <MuImage width='28' height='28' src={text} />
                </div>
              )
            },
          },
          {
            title: '产品编码',
            dataIndex: 'itemCode',
            key: 'itemCode',
          },
          {
            title: '产品名称',
            dataIndex: 'productName',
            key: 'productName',
          },
          {
            title: '规格',
            dataIndex: 'specifications',
            key: 'specifications',
          },
          {
            title: '单价',
            dataIndex: 'univalence',
            key: 'univalence',
            customRender: (text, record, index) => {
              return (
                <span>
                  （{record.currencyCode ? record.currencyCode : 'CNY'}）{text}
                </span>
              )
            },
          },
          {
            title: '数量',
            dataIndex: 'count',
            key: 'count',
          },
          {
            title: '包装',
            dataIndex: 'packing',
            key: 'packing',
          },
          {
            title: '总价',
            dataIndex: 'total',
            key: 'total',
            customRender: (text, record, index) => {
              return (
                <span>
                  （{record.currencyCode ? record.currencyCode : 'CNY'}）{text}
                </span>
              )
            },
          },
          {
            title: '包裹',
            dataIndex: 'package',
            key: 'package',
          },
        ],
      }
    },
    computed: {
      ...mapGetters(['tableSize']),
    },
    watch: {
      'externalProp.id': {
        handler(newVal) {
          if (newVal) {
            this.init()
          }
        },
        immediate: true,
      },
    },
    methods: {
      init() {
        this.$store.dispatch('app/setDrawerLayoutLoading', { flag: true })
        this.orderId = this.externalProp.id
        // 获取订单信息
        getOrderInfo({ orderId: this.orderId })
          .then(res => {
            if (res.data[0].paymentRecord.length) {
              this.$addListId(res.data[0].paymentRecord, 'transactionNum')
            }
            this.orderInfo = res.data[0]
            // 订单产品已发货 获取物流信息
            if (res.data[0].goodsStatus == 4 || res.data[0].goodsStatus == 5) {
              getExpressInfo({
                sourceId: this.orderId,
                sourceType: 2,
              }).then(res => {
                this.expressList = res.data
                // 根据物流数据 处理生成产品明细表
                res.data.forEach((item, index) => {
                  item.inventory.forEach(d => {
                    d.package = '包裹' + (index + 1)
                    d['listId'] = d.id
                    this.productDetailList.push(d)
                  })
                })
                this.columnsProductDetailList[9].title = `包裹（${
                  this.expressList ? res.data.length : ''
                }个）`
              })
            } else {
              res.data[0].inventory.forEach(item => {
                item.package = '暂未发货'
              })
              this.$addListId(res.data[0].inventory, 'skuId')
              this.productDetailList = res.data[0].inventory
            }
          })
          .finally(() => {
            this.$store.dispatch('app/setDrawerLayoutLoading', { flag: false })
          })
      },
      // 申请开票
      applicationInvoice() {
        if (!Number(this.orderInfo.totalPrice)) return
        if (
          this.orderInfo.payStatus === 3 &&
          this.orderInfo.goodsStatus !== 1 &&
          this.orderInfo.goodsStatus !== 2
        ) {
          let orderInfo = {
            totalPrice: this.orderInfo.paidTotalPrice,
            time: this.orderInfo.createtime,
            postage: this.orderInfo.postage,
            orderId: this.orderInfo.orderId,
            listId: this.orderInfo.orderId,
            invoicePrice: this.orderInfo.paidTotalPrice,
          }
          this.tooltipVisible = false
          this.$router.push({
            name: 'EosInvoiceApplication',
            params: {
              isAll: 0,
              selectedOrderList: [orderInfo],
            },
          })
        } else {
          return false
        }
      },
      // 打开发票详情
      showInvoiceDetail() {
        this.$globalDrawer.add({
          component: ApplicationDetail,
          options: {
            name: 'ApplicationDetail',
            title: '申请详情',
            props: { id: this.orderInfo.applyId },
          },
        })
      },
      // 现在付款
      pay() {
        this.$router.push({
          name: 'EosPayment',
          params: {
            orderId: [this.orderId],
            payAll: {
              isAll: 0,
            },
          },
        })
      },
      // 再来一单
      createMoreOrders() {
        this.loading = true
        moreOneOrder({ orderId: this.orderId })
          .then(res => {
            this.loading = false
            this.$store.dispatch('shopcart/getShopcartSelectedRowKeys', [
              res.cartId,
            ])
            this.$router.push({
              name: 'EosSettlement',
              params: {
                from: 'cart',
              },
            })
          })
          .catch(err => {
            this.loading = false
          })
      },
      // 确认收货
      confirmGoods() {
        this.$confirm({
          title: '是否已收到货？',
          content: '',
          okText: '是',
          okType: 'primary',
          cancelText: '否',
          cancelType: 'danger',
          onOk: () => {
            let data = {
              action: 'confirm',
              orderId: this.orderId,
            }
            this.btnLoading = true
            dealOrder(data)
              .then(res => {
                this.orderInfo.orderStatus = 10
                this.orderInfo.goodsStatus = 5
                this.$message.success('已确认收货！')
                this.btnLoading = false
                // this.$emit('confirmGoods', this.orderId)
              })
              .catch(err => {
                this.btnLoading = false
              })
          },
          onCancel() {},
        })
      },
      // 申请售后
      afterSale() {
        this.$info({
          title: '在线售后功能暂未开通！',
          mask: false,
          content: <div>客服电话：400-677-0001</div>,
        })
      },
      // 导出pdf
      exportPdf() {
        window.open(
          `https://mall-api${process.env.ENV}.mumuxili.com/common/generate/pdf?id=${this.orderId}&pdftype=contract`
        )
      },
      // 一键复制（订单号）
      oneClicCopy(value) {
        let transfer = document.createElement('input')
        document.body.appendChild(transfer)
        transfer.value = value // 这里表示想要复制的内容
        transfer.focus()
        transfer.select()
        if (document.execCommand('copy')) {
          document.execCommand('copy')
        }
        transfer.blur()
        this.$message.success(`已复制订单编号（${value}）`)
        document.body.removeChild(transfer)
      },
    },
  }
</script>

<style lang="less" scoped>
  .order-detail-wrp {
    position: relative;
    .order-info {
      .status-list-wrp {
        display: flex;
        align-items: center;
        justify-content: center;
        .status-list-item {
          display: flex;
          align-items: center;
          height: 40px;
          img {
            width: 40px;
            height: 40px;
            margin-right: 16px;
          }
          & > div {
            margin-right: 5px;
            height: 22px;
            font-size: 16px;
            line-height: 24px;
            font-weight: 400;
            text-align: left;
            color: #999999;
          }
          .status-wrp {
            display: flex;
            align-items: center;
            .status-dot {
              margin-right: 6px;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              // 未支付 已支付，待处理
              &.status_1,
              &.status_2 {
                background: #fad337;
              }
              // 已支付
              &.status_3 {
                background: #52c41a;
              }
            }
          }
        }
        .status-list-item:nth-child(2) {
          margin: 0 100px;
        }
      }
      .order-info-wrp {
        margin-top: 45px;
        width: 100%;
        margin-left: 12px;
        .order-operations {
          margin-top: 12px;
          .ant-btn {
            margin-left: 24px;
          }
        }
      }
    }
    .address-info {
      display: flex;
      margin-top: 13px;
      font-size: 12px;
      font-weight: 400;
      text-align: left;
      color: #999999;
      line-height: 22px;
      span {
        margin-right: 20px;
        font-size: 13px;
        font-weight: 400;
        text-align: left;
        color: #666666;
        line-height: 22px;
      }
    }
  }
</style>
<style lang="less">
  .order-detail-wrp {
    .status-wrp {
      > span {
        font-size: 16px;
      }
    }
  }
</style>
