<template>
  <div id="page-sass-dashboard-list" class="list-page-wrp">
    <div class="list-page-top-wrp">
      <div class="header-wrp">
        <div v-if="eosUserInfo" class="user-info-wrp">
          <mu-image
            v-if="eosUserInfo.info.userAvatar"
            class="avatar"
            width="98"
            height="98"
            :src="eosUserInfo.info.userAvatar"
          ></mu-image>
          <img
            v-else
            style="width: 98px; height: 98px"
            src="@/assets/images/pic/default-avatar.png"
          />
          <div class="info">
            <div class="name show-line_1">
              亲爱的，{{ eosUserInfo.info.realName }}
            </div>
            <div class="mobile">
              {{ eosUserInfo.info.mobile | AsteriskMobliephone }}
            </div>
            <div class="mark">
              <div class="mark-item user-type">分销商</div>
            </div>
          </div>
        </div>
      </div>
      <div class="remain-wrp order">
        <div class="remain-content">
          <div class="remain-item" @click="goOrderList('Not_Paid')">
            <div class="remain-item_outer center-flex">
              <div class="remain-item_inner">
                <div class="left center-flex">
                  <img src="@/assets/images/money-status.png" alt />
                </div>
                <div class="right">
                  <div class="num">{{ dashStatus.notPaidNum }}</div>
                  <div class="status">待付款</div>
                </div>
              </div>
            </div>
          </div>
          <div class="remain-item" @click="goOrderList('Not_Send')">
            <div class="remain-item_outer center-flex">
              <div class="remain-item_inner">
                <div class="left center-flex">
                  <img src="@/assets/images/daifahuo.png" alt />
                </div>
                <div class="right">
                  <div class="num">{{ dashStatus.notSendNum }}</div>
                  <div class="status">待发货</div>
                </div>
              </div>
            </div>
          </div>
          <div class="remain-item" @click="goOrderList('Send')">
            <div class="remain-item_outer center-flex">
              <div class="remain-item_inner">
                <div class="left center-flex">
                  <img src="@/assets/images/daishouhuo.png" alt />
                </div>
                <div class="right">
                  <div class="num">{{ dashStatus.sendNum }}</div>
                  <div class="status">待收货</div>
                </div>
              </div>
            </div>
          </div>
          <div class="remain-item" @click="goOrderList('')">
            <div class="remain-item_outer center-flex">
              <div class="remain-item_inner check-all">
                <div class="left center-flex">
                  <img
                    src="@/assets/images/icon/arrow-left-hascircle.png"
                    alt
                  />
                </div>
                <div class="right fl">全部订单</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showEmpty" class="empty-wrp">
        <span>最近没有需要确认收货的订单哟</span>
        <span>快去挑选产品吧~</span>
        <a-button type="primary" @click="goProductList">产品列表</a-button>
      </div>
    </div>
    <div v-show="showTable" class="list-page-table-wrp">
      <common-table
        :scroll="{ y: tableHeight, x: tableWidth }"
        :columns="columns"
        :data-source="tableList"
        :table-size="tableSize"
        @confirmFiltering="confirmFiltering"
        @confirmSorting="confirmSorting"
      ></common-table>
    </div>
    <div class="list-page-bottom-operations">
      <MuBottomOperations
        v-show="showTable"
        :total-count="totalCount"
        :current="pno"
        @tablePageChange="tablePageChange"
        @tablePageSizeChange="tablePageSizeChange"
      ></MuBottomOperations>
    </div>
  </div>
</template>

<script>
  import {
    getOrderList,
    dealOrder,
    getOrderListStatusNum,
  } from '@/api/eos/index'
  import OrderDetail from '../order/components/OrderDetail'
  import { mapGetters } from 'vuex'
  export default {
    name: 'EosDashboard',
    data() {
      return {
        pno: 1,
        perpage: this.pageSize,
        sort: null, // 排序
        price: null, // 价格区间筛选
        startTime: null, // 开始时间
        endTime: null, // 结束时间
        tableList: [],
        totalCount: 0,
        status: 'Not_Paid,Send',
        dashStatus: {
          notPaidNum: 0,
          notSendNum: 0,
          sendNum: 0,
        },
        showEmpty: false,
        showTable: false,
        // 表头设置
        columns: [
          {
            title: '序号',
            dataIndex: 'index',
            width: 80,
            customRender: (text, record, index) => {
              return index + 1
            },
          },
          {
            title: '订单编码',
            dataIndex: 'orderId',
            key: 'orderId',
            // width: 267,
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
            title: '数量',
            dataIndex: 'productCount',
            key: 'productCount',
            // width: 180,
          },
          {
            title: '总价（元）',
            dataIndex: 'total',
            key: 'total',
            customRender: (text, record, index) => {
              return (
                <span>
                  （{record.currencyCode ? record.currencyCode : 'CNY'}）{text}
                </span>
              )
            },
            // width: 291,
            hasPopover: true,
            sortOperation: true,
            filterOperation: true,
            filterInfo: {
              type: 'range',
            },
          },
          {
            title: '下单时间',
            dataIndex: 'createTime',
            key: 'createTime',
            // width: 263,
            hasPopover: true,
            sortOperation: true,
            filterOperation: true,
            filterInfo: {
              type: 'time',
            },
          },
          {
            title: '订单状态',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            // width: 223,
            hasPopover: true,
            filterOperation: true,
            filterInfo: {
              type: 'default',
              // Not_Paid 待支付，Send 待收货，Not_Send 待发货，Not_Comment 待评价，Cancel 已取消
              options: [
                { name: '待付款', value: 'Not_Paid' },
                { name: '待收货', value: 'Send' },
                // { name: '待发货', value: 'Not_Send' },
                // { name: '已完成', value: 'Not_Comment' },
                // { name: '已取消', value: 'Cancel' },
              ],
            },
            customRender: (text, record) => {
              let orderStatusInfo = {
                1: {
                  className: 'status_underway',
                  value: '待预付',
                },
                2: {
                  className: 'status_underway',
                  value: '待付款',
                },
                3: {
                  className: 'status_underway',
                  value: '待付保证金',
                },
                4: {
                  className: 'status_underway',
                  value: '待付尾款',
                },
                5: {
                  className: 'status_underway',
                  value: '待发货',
                },
                6: {
                  className: 'status_underway',
                  value: '待收货',
                },
                7: {
                  className: 'status_normal',
                  value: '待评价',
                },
                8: {
                  className: 'status_normal',
                  value: '待开票',
                },
                9: {
                  className: 'status_abnormal',
                  value: '已取消',
                },
                10: {
                  className: 'status_normal',
                  value: '已完成',
                },
                11: {
                  className: 'status_underway',
                  value: '备货中',
                },
                12: {
                  className: 'status_abnormal',
                  value: '订单关闭',
                },
                15: {
                  className: 'status_underway',
                  value: '待补保证金差价',
                },
                16: {
                  className: 'status_underway',
                  value: '待补差价',
                },
              }
              return (
                <MuDotStatus
                  text={orderStatusInfo[record.orderStatus].value}
                  dot-status={orderStatusInfo[record.orderStatus].className}
                ></MuDotStatus>
              )
            },
          },
          {
            title: '操作',
            dataIndex: 'operations',
            width: 300,
            customRender: (text, record, index) => {
              return (
                <div>
                  {record.orderStatus == 2 ? (
                    <span>
                      <a-button
                        type='link'
                        onClick={() => this.payOrder(record.orderId)}
                      >
                        去付款
                      </a-button>
                      <a-divider type='vertical' />
                      <a-button
                        type='link'
                        onClick={() => this.cancelOrder(record.orderId, index)}
                      >
                        取消订单
                      </a-button>
                    </span>
                  ) : null}
                  {record.orderStatus == 6 ? (
                    <span>
                      <a-button
                        type='link'
                        onClick={() => this.confirmGoods(record.orderId, index)}
                      >
                        确认收货
                      </a-button>
                    </span>
                  ) : null}
                </div>
              )
            },
          },
        ],
      }
    },
    computed: {
      ...mapGetters([
        'tableSize',
        'pageSize',
        'tableHeight',
        'tableWidth',
        'eosUserInfo',
      ]),
    },
    mounted() {
      this.perpage = this.pageSize
      this.getRemainOrderNum()
      this.getNotPaidSendOrderList()
    },
    methods: {
      // 获取订单待办数量
      getRemainOrderNum() {
        getOrderListStatusNum().then(res => {
          this.dashStatus.notPaidNum = res.data.NOT_PAID
          this.dashStatus.notSendNum = res.data.NOT_SEND
          this.dashStatus.sendNum = res.data.SEND
          this.dotStatusChange()
          this.$nextTick(() => {
            this.$getLPTableSize()
          })
        })
        // let p1 = this._getOrderList('Not_Paid')
        // let p2 = this._getOrderList('Not_Send')
        // let p3 = this._getOrderList('Send')
        // Promise.all([p1, p2, p3]).then(res => {
        //   res.forEach((item, index) => {
        //     if (index === 0) {
        //       this.dashStatus.notPaidNum = item.totalCount
        //     } else if (index === 1) {
        //       this.dashStatus.notSendNum = item.totalCount
        //     } else if (index === 2) {
        //       this.dashStatus.sendNum = item.totalCount
        //     }
        //   })
        //   this.dotStatusChange()
        //   this.$nextTick(() => {
        //     this.$getLPTableSize()
        //   })
        // })
      },
      // 获取待付款 待收货订单
      getNotPaidSendOrderList() {
        if (!this.status) {
          this.status = 'Not_Paid,Send'
        }
        this._getOrderList(this.status).then(res => {
          this.$addListId(res.data, 'orderId')
          this.tableList = res.data
          this.totalCount = res.totalCount
          this.$nextTick(() => {
            this.$getLPTableSize()
          })
        })
      },
      // 获取订单列表
      _getOrderList(status) {
        let data = {
          pno: this.pno,
          perpage: this.perpage,
          sort: this.sort,
          price: this.price,
          starttime: this.startTime,
          endtime: this.endTime,
          status: status,
        }
        return getOrderList(data)
      },
      // 打开订单详情
      showOrderDetail(orderId) {
        // this.$globalDrawer.show({ com: OrderDetail, id: orderId })
        this.$globalDrawer.show({
          component: OrderDetail,
          options: {
            name: 'OrderDetail',
            title: '订单详情',
            props: { id: orderId },
          },
        })
      },
      // 批量支付
      payOrder(orderId) {
        this.$router.push({
          name: 'EosPayment',
          params: {
            orderId: [orderId],
            payAll: {
              isAll: 0,
            },
          },
        })
      },
      // 确认收货
      confirmGoods(orderId, index) {
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
              orderId,
            }
            dealOrder(data).then(res => {
              // this.tableList[index].orderStatus = 10
              this.dashStatus.sendNum--
              this.dotStatusChange()
              this.tableList.splice(index, 1)
              this.$message.success('已确认收货！')
            })
          },
          onCancel() {},
        })
      },
      // 取消订单
      cancelOrder(orderId, index) {
        this.$confirm({
          title: '确定取消该订单吗？',
          content: '',
          okText: '是',
          okType: 'danger',
          cancelText: '否',
          onOk: () => {
            dealOrder({ orderId, isAll: 0, action: 'cancel' }).then(res => {
              this.tableList.splice(index, 1)
              this.dashStatus.notPaidNum--
              this.dotStatusChange()
              this.$message.success('订单已取消')
            })
          },
          onCancel() {},
        })
      },
      goOrderList(orderStatus) {
        this.$router.push({
          name: 'EosOrderList',
          query: {
            orderStatus,
          },
        })
      },
      goProductList() {
        this.$router.push({
          name: 'EosProductList',
        })
      },
      // page变化
      tablePageChange(page, pageSize) {
        this.pno = page
        this.perpage = pageSize ? pageSize : this.pageSize
        this.getNotPaidSendOrderList()
      },
      // pageSize变化
      tablePageSizeChange(page, pageSize) {
        this.pno = page
        this.perpage = pageSize
        this.getNotPaidSendOrderList()
      },
      // 筛选
      confirmFiltering(e) {
        const { name, value, isReset } = e
        if (name === 'total') {
          let price = null
          if (value[1] === '') {
            price = value[0]
          } else {
            price = value.join(',')
          }
          this.price = price
        } else if (name === 'createTime') {
          this.startTime = value[0]
          this.endTime = value[1]
        } else if (name === 'orderStatus') {
          this.status = isReset ? 'Not_Paid,Send' : e.value
        }
        this.pno = 1
        this.getNotPaidSendOrderList()
      },
      // 排序
      confirmSorting(e) {
        const { name, value } = e
        if (name === 'total') {
          this.sort = value === '' ? '' : `price-${e.value}`
        } else if (name === 'createTime') {
          this.sort = value === '' ? '' : `time-${e.value}`
        }
        this.pno = 1
        this.getNotPaidSendOrderList()
      },
      dotStatusChange() {
        if (this.dashStatus.notPaidNum + this.dashStatus.sendNum > 0) {
          this.showEmpty = false
          this.showTable = true
        } else {
          this.showEmpty = true
          this.showTable = false
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  #page-sass-dashboard-list {
    .header-wrp {
      // max-width: 1072px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 148px;
      background-image: url('../../../assets/images/pic/eos-dashboard-header.png');
      background-position: bottom right;
      background-repeat: no-repeat;
      background-size: contain;
      .user-info-wrp {
        margin-left: 24px;
        display: flex;
        align-items: flex-start;
        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 1px solid #00c7db;
          overflow: hidden;
        }
        .info {
          margin-left: 22px;

          .name {
            max-width: 400px;
            height: 22px;
            font-size: 16px;
            font-weight: 400;
            text-align: left;
            color: #666666;
          }
          .mobile {
            width: 81px;
            height: 18px;
            font-size: 13px;
            font-weight: 400;
            text-align: left;
            color: #999999;
          }
          .mark {
            margin-top: 20px;
            display: flex;
            align-items: center;
            .mark-item {
              margin-right: 11px;
            }
            .user-type {
              width: 60px;
              height: 24px;
              border: 1px solid #00c7db;
              border-radius: 12px;
              line-height: 22px;
              font-size: 14px;
              font-weight: 400;
              text-align: center;
              color: #00c7db;
            }
          }
        }
      }
    }
    .remain-wrp {
      padding: 16px 0;
      background: #e3e5e6;
      .remain-content {
        background: white;
        display: flex;
        align-items: stretch;
        .remain-item {
          flex: 1;
          height: 120px;
          cursor: pointer;
          &:not(:last-child) {
            .remain-item_outer {
              .left {
                background: #e5f9fc;
              }
              &::before {
                position: absolute;
                content: '';
                width: 1px;
                height: 56px;
                background: #d9d9d9;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
              }
            }
          }
          .remain-item_outer {
            position: relative;
            width: 100%;
            height: 100%;
            .remain-item_inner {
              display: flex;
              align-items: center;
              &.check-all {
                .left {
                  width: 39px;
                  height: 18px;
                  font-size: 13px;
                  font-weight: 400;
                  text-align: left;
                  color: #666666;
                }
                .right {
                  margin-left: 15px;
                }
              }
              .left {
                width: 66px;
                height: 66px;
                border-radius: 50%;
              }
              .right {
                margin-left: 40px;
                .num {
                  width: 38px;
                  height: 45px;
                  font-size: 32px;
                  font-weight: 400;
                  text-align: center;
                  color: #ff4433;
                }
                .status {
                  width: 39px;
                  height: 18px;
                  font-size: 13px;
                  font-weight: 400;
                  text-align: left;
                  color: #666666;
                }
              }
            }
          }
        }
      }
    }
    .empty-wrp {
      width: 228px;
      margin: 18px auto;
      background: url('../../../assets/images/pic/empty-status_1.png');
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      span:nth-of-type(1) {
        margin-top: 190px;
        width: 218px;
        height: 24px;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
        color: #333333;
        line-height: 18px;
      }
      span:nth-of-type(2) {
        width: 192px;
        height: 24px;
        font-size: 12px;
        font-weight: 400;
        text-align: center;
        color: #999999;
        line-height: 18px;
      }
      .ant-btn {
        margin-top: 14px;
        width: 99px;
        height: 32px;
        line-height: 32px;
        background: #00c7db;
        border-radius: 4px;
      }
    }
  }
</style>

<style lang="less"></style>
