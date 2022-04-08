<template>
  <div class="invoce-appliaction-detail-wrp">
    <MuPageHeader
      :show-reload="true"
      :show-back="true"
      title="申请详情"
    ></MuPageHeader>
    <MuPageHeader :show-reload="false" sub-title="发票申请记录"></MuPageHeader>
    <div class="page-content">
      <div class="a-descriptions-wrp">
        <a-descriptions :column="3">
          <a-descriptions-item label="发票编码">
            {{ applyInfo.applyNum }}
          </a-descriptions-item>
          <a-descriptions-item label="发票类型">
            {{ applyInfo.invoiceType }}
          </a-descriptions-item>
          <a-descriptions-item label="开票金额">
            <span style="color: #ff4433">
              {{ applyInfo.currencyCode ? applyInfo.currencyCode : '（CNY）'
              }}{{ applyInfo.totalPrice }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item label="申请时间">
            {{ applyInfo.time }}
          </a-descriptions-item>
          <a-descriptions-item label="发票状态">
            <span v-if="applyInfo.status === '待开票'">已申请</span>
            <span v-if="applyInfo.status === '已开'">已开票</span>
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions :column="1">
          <a-descriptions-item label="备注">
            {{ applyInfo.memo }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <div class="invoce-appliaction-operations clearfix">
        <a-button class="fr" @click="afterSale">申请售后</a-button>
      </div>
    </div>
    <MuPageHeader :show-reload="false" sub-title="发票信息"></MuPageHeader>
    <div class="page-content">
      <div class="a-descriptions-wrp">
        <a-descriptions :column="3">
          <a-descriptions-item label="单位名称">
            {{ applyInfo.title }}
          </a-descriptions-item>
          <a-descriptions-item label="纳税人识别号">
            {{ applyInfo.taxcode }}
          </a-descriptions-item>
          <a-descriptions-item label="注册电话">
            {{ applyInfo.regTel }}
          </a-descriptions-item>
          <a-descriptions-item label="注册地址">
            {{ applyInfo.regAddress }}
          </a-descriptions-item>
          <a-descriptions-item label="开户银行">
            {{ applyInfo.bank }}
          </a-descriptions-item>
          <a-descriptions-item label="银行账号">
            {{ applyInfo.account }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
    <MuPageHeader :show-reload="false" sub-title="收票人信息"></MuPageHeader>
    <div class="address-info page-content">
      <span>{{ addressInfo.receiver }}</span>
      <span>{{ addressInfo.phone }}</span>
      <span>{{ addressInfo.province }}</span>
      <span>{{ addressInfo.city }}</span>
      <span>{{ addressInfo.district }}</span>
      <span>{{ addressInfo.streetdetailaddr }}</span>
    </div>
    <MuPageHeader :show-reload="false" sub-title="相关订单"></MuPageHeader>
    <div class="order-product-list page-content">
      <common-table
        :scroll="{ x: 1072 }"
        :columns="columns"
        :data-source="tableList"
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
  import { getInvoiceApplyInfo } from '@/api/eos/index'
  import { getExpressInfo } from '@/api/common'
  import OrderDetail from '../../order/components/OrderDetail'
  import { mapGetters } from 'vuex'
  export default {
    name: 'EosInvoiceApplicationDetail',
    props: {
      externalProp: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        applicationId: '',
        expressList: [],
        tableProductList: [],
        tablePaymentList: [],
        addressInfo: {},
        applyInfo: {},
        tableList: [],
        // 表头设置
        columns: [
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
            title: '订单号',
            dataIndex: 'orderId',
            key: 'orderId',
            customRender: (text, record, index) => {
              return (
                <span
                  class='span-link a'
                  onClick={() => {
                    this.showOrderDetail(record.orderId)
                  }}
                >
                  {record.orderId}
                </span>
              )
            },
          },
          {
            title: '产品数量',
            dataIndex: 'count',
            key: 'count',
          },
          {
            title: '总价',
            dataIndex: 'totalprice',
            key: 'totalprice',
            customRender: (text, record, index) => {
              return (
                <span>
                  （{record.currencyCode ? record.currencyCode : 'CNY'}）{text}
                </span>
              )
            },
          },
          {
            title: '下单时间',
            dataIndex: 'time',
            key: 'time',
          },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            customRender: (text, record) => {
              let statusInfo = {
                2: {
                  className: 'status_underway',
                  value: '待付款',
                },
                5: {
                  className: 'status_underway',
                  value: '待发货',
                },
                6: {
                  className: 'status_underway',
                  value: '待收货',
                },
                9: {
                  className: 'status_abnormal',
                  value: '已取消',
                },
                10: {
                  className: 'status_normal',
                  value: '已完成',
                },
              }
              return (
                <MuDotStatus
                  text={statusInfo[text].value}
                  dot-status={statusInfo[text].className}
                ></MuDotStatus>
              )
            },
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
        this.applicationId = this.externalProp.id
        getInvoiceApplyInfo({ id: this.applicationId })
          .then(res => {
            this.$addListId(res.data.orderList, 'orderId')
            this.tableList = res.data.orderList
            this.applyInfo = res.data.applyInfo
            this.addressInfo = res.data.addressInfo
            //发票已发货 获取物流信息
            if (this.applyInfo.logistics) {
              getExpressInfo({
                sourceId: this.applicationId,
                sourceType: 3,
              }).then(res => {
                this.expressList = res.data
              })
            }
          })
          .finally(res => {
            this.$store.dispatch('app/setDrawerLayoutLoading', { flag: false })
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
      // 打开订单详情
      showOrderDetail(orderId) {
        this.$globalDrawer.show({
          component: OrderDetail,
          options: {
            name: 'OrderDetail',
            title: '订单详情',
            props: { id: orderId },
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .invoce-appliaction-detail-wrp {
    position: relative;
    .order-operations {
      margin-top: 12px;
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
<style lang="less"></style>
