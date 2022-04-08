<template>
  <div id="page-sass-order-list" class="list-page-wrp">
    <div class="list-page-top-wrp">
      <MuTopOperations :show-reload="false" @parentReload="parentReload">
        <template #operations>
          <div v-if="!selectedRowKeys.length" class="input-wrp ml24">
            <MuSearch @globalSearch="globalSearch"></MuSearch>
          </div>
          <div v-if="selectedRowKeys.length" class="bulk-payment ml24">
            <div class="left area">
              <div v-if="!isAll">
                <span>当前选择</span>
                <a-button type="link">{{ selectedRowKeys.length }}</a-button>
                <span>条订单</span>
              </div>
              <div v-else>
                <span>选择全部</span>
                <a-button type="link">{{ totalCount }}</a-button>
                <span>条订单</span>
              </div>
              <a-divider type="vertical"></a-divider>
              <div class="btn-operation" @click="bulkPayment">
                <a-icon type="pay-circle" color="white"></a-icon>
                <span>批量支付</span>
              </div>
              <!-- <a-divider type="vertical" />
              <div @click="bulkCancelOrder" class="btn-operation">
                <a-icon type="close-circle" color="white" />
                <span>批量取消</span>
              </div>-->
            </div>
            <div class="right area">
              <div
                v-if="selectedRowKeys.length"
                class="icon-close-wrp mr24"
                style="cursor: pointer"
                @click="reset"
              >
                <a-icon type="close" style="mr24"></a-icon>
              </div>
            </div>
          </div>
        </template>
      </MuTopOperations>
    </div>
    <div class="list-page-table-wrp">
      <common-table
        :loading="loading"
        :scroll="{ y: tableHeight, x: tableWidth }"
        :columns="columns"
        :row-selection="rowSelection"
        :data-source="tableList"
        :table-size="tableSize"
        @confirmFiltering="confirmFiltering"
        @confirmSorting="confirmSorting"
      ></common-table>
    </div>
    <div class="list-page-bottom-operations">
      <MuBottomOperations
        :total-count="totalCount"
        :current="pno"
        @tablePageChange="tablePageChange"
        @tablePageSizeChange="tablePageSizeChange"
      ></MuBottomOperations>
    </div>
  </div>
</template>

<script>
  import { getOrderList, dealOrder, getAddressList } from '@/api/eos/index'
  import OrderDetail from './components/OrderDetail'
  import { mapGetters } from 'vuex'
  export default {
    name: 'EosOrderList',
    inject: ['reload'],
    data() {
      return {
        loading: false,
        // 列表入参
        pno: 1, //当前页
        perpage: this.pageSize, //每页数量
        keyword: '', //模糊搜素
        orderId: '', //模糊搜素
        sort: null, // 排序
        price: null, // 价格区间筛选
        startTime: null, // 开始时间
        endTime: null, // 结束时间
        status: null,
        receiver: '',
        totalCount: 0,
        drawerStyle: {
          width: 400,
        },
        // 表头设置
        columns: [
          {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 50,
            customRender: (text, record, index) => {
              return index + 1
            },
          },
          {
            title: '订单编码',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 150,
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
            width: 50,
          },
          {
            title: '总价（元）',
            dataIndex: 'total',
            key: 'total',
            width: 150,
            customRender: (text, record, index) => {
              return (
                <span>
                  （{record.currencyCode ? record.currencyCode : 'CNY'}）{text}
                </span>
              )
            },
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
            width: 150,
            hasPopover: true,
            sortOperation: true,
            filterOperation: true,
            filterInfo: {
              type: 'time',
            },
          },
          {
            title: '收货人姓名',
            dataIndex: 'receiver',
            key: 'receiver',
            width: 115,
            hasPopover: true,
            sortOperation: false,
            filterOperation: true,
            filterInfo: {
              type: 'default-ajax',
              ajax: getAddressList,
              ajaxData: {
                source: 'filter',
              },
            },
          },
          {
            title: '收货人联系方式',
            dataIndex: 'phone',
            key: 'phone',
            width: 140,
          },
          {
            title: '订单状态',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            width: 105,
            hasPopover: true,
            filterOperation: true,
            filterInfo: {
              type: 'default',
              // Not_Paid 待支付，Send 待收货，Not_Send 待发货，Not_Comment 待评价，Cancel 已取消
              options: [
                { name: '待付款', value: 'Not_Paid' },
                { name: '待收货', value: 'Send' },
                { name: '待发货', value: 'Not_Send' },
                { name: '已完成', value: 'Not_Comment' },
                { name: '已取消', value: 'Cancel' },
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
                  value: '已关闭',
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
            width: 200,
            customRender: (text, record, index) => {
              // <a-button type='link' onClick={() => this.showOrderDetail(record.orderId)}>查看订单详情</a-button>
              // <a-divider type="vertical" />
              return (
                <div>
                  {record.orderStatus == 2 ? (
                    <span>
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
        isAll: false, //是否全选
        selectedRowKeys: [], // 选中项的id集合
        selectedRows: [], //记录当前周期所选择过的数据行
        // 表格数据
        tableList: [],
        // 购物车列表
        shopcartList: [],
        drawerVisible: false,
        listObj: {},
      }
    },
    computed: {
      ...mapGetters(['tableSize', 'tableHeight', 'tableWidth', 'pageSize']),
      shopcartCount() {
        return this.shopcartList.length
      },
      rowSelection() {
        const selectedRowKeys = this.selectedRowKeys
        return {
          columnWidth: 60,
          selectedRowKeys,
          onChange: this.onSelectChange,
          onSelectAll: this.onSelectAll,
          hideDefaultSelections: true,
          getCheckboxProps: record => ({
            // props: {
            //   disabled: record.orderStatus !== 2,
            // },
          }),
          selections: [
            {
              key: 'all-data',
              text: `全部${this.totalCount}条`,
              onSelect: changableRowKeys => {
                // 设置全选标志
                this.isAll = true
                // 设置当前页选中状态
                this.selectedRowKeys = changableRowKeys
              },
            },
            {
              key: 'current-data',
              text: `当前页${this.tableList.length}条`,
              onSelect: changableRowKeys => {
                // 取消全选标志
                this.isAll = false
                // 设置当前页选中状态
                this.selectedRowKeys = changableRowKeys
                // 订单列表需要检验已选项状态,所以存储selectedRows
                this.selectedRows = this.tableList
              },
            },
          ],
        }
      },
    },
    mounted() {
      this.$getLPTableSize()
      this.status = this.$route.query.orderStatus
      this.perpage = this.pageSize
      this._getOrderList()
    },
    methods: {
      // 刷新
      parentReload() {
        this.reload()
        this.$router.replace({
          name: 'EosOrderList',
        })
      },
      // 全局搜索
      globalSearch(value) {
        this.keyword = value
        this.pno = 1
        this._getOrderList()
      },
      // 获取订单列表
      _getOrderList() {
        let data = {
          pno: this.pno,
          perpage: this.perpage,
          keyword: this.keyword,
          sort: this.sort,
          price: this.price,
          starttime: this.startTime,
          endtime: this.endTime,
          status: this.status,
          receiver: this.receiver,
        }
        this.loading = true
        getOrderList(data)
          .then(res => {
            this.$addListId(res.data, 'orderId')
            this.tableList = res.data
            this.totalCount = res.totalCount
            this.loading = false
          })
          .catch(err => {
            this.loading = false
          })
      },
      // page变化
      tablePageChange(page, pageSize) {
        this.reset()
        // if (this.isAll) {
        //   this.reset()
        // }
        this.pno = page
        this.perpage = pageSize ? pageSize : this.pageSize
        this._getOrderList()
      },
      // pageSize变化
      tablePageSizeChange(page, pageSize) {
        this.reset()
        // if (this.isAll) {
        //   this.reset()
        // }
        this.pno = page
        this.perpage = pageSize
        this._getOrderList()
      },
      // 表格复选框有变化
      onSelectChange(selectedRowKeys, selectedRows) {
        this.isAll = false
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
        // 去重
        // this.selectedRows = this.selectedRows.concat(selectedRows)
        // this.selectedRows = this.unique(this.selectedRows)
        // selectedRowKeys 所有已选中的 ids 会跨页记录
      },
      // 重置表格复选宽状态
      reset() {
        this.isAll = false
        this.selectedRowKeys = []
        // 订单列表需要检验已选项状态,所以存储selectedRows
        this.selectedRows = this.tableList
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
      // 关闭订单详情
      onClose() {
        this.drawerVisible = false
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
              this.tableList[index].orderStatus = 9
              this.$message.success('订单已取消')
              this.isAll = false
              this.selectedRowKeys = []
            })
          },
          onCancel() {},
        })
      },
      // 批量取消
      bulkCancelOrder() {
        if (this.isAll) {
          // 进行提示不要进行批量操作
          this.$confirm({
            title: '当前列表跨页全选可能包含无效的操作，是否继续？',
            content: '',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
              dealOrder({ isAll: 1, action: 'cancel' }).then(res => {
                this._getOrderList()
                this.$message.success('全部待付款订单已取消！')
                this.isAll = false
                this.selectedRowKeys = []
              })
            },
          })
        } else {
          // 前端判断用户当前所选能否进行批量取消
          let canCancel = true
          for (let i = 0; i < this.selectedRowKeys.length; i++) {
            let orderId = this.selectedRowKeys[i]
            let index
            for (let j = 0; j < this.selectedRows.length; j++) {
              if (orderId == this.selectedRows[j].orderId) {
                index = j
                break
              }
            }
            if (this.selectedRows[index].orderStatus !== 2) {
              canCancel = false
              break
            }
          }
          if (canCancel) {
            this.$confirm({
              title: '确定取消所选订单吗？',
              content: '',
              okText: '是',
              okType: 'danger',
              cancelText: '否',
              onOk: () => {
                let data = {
                  action: 'cancel',
                  orderId: this.selectedRowKeys.join(','),
                }
                dealOrder(data).then(res => {
                  this._getOrderList()
                  this.$message.success('所选待付款订单已取消！')
                  this.isAll = false
                  this.selectedRowKeys = []
                })
              },
            })
          } else {
            this.$confirm({
              title: '所选订单中包含已支付状态订单，请去除后再次执行批量取消！',
              content: '',
              okText: '是',
              okType: 'danger',
              cancelText: '否',
              cancelButtonProps: {
                props: {
                  disabled: true,
                },
              },
            })
          }
        }
      },
      // 批量支付
      bulkPayment() {
        if (this.isAll) {
          // 进行提示不要进行批量操作
          this.$confirm({
            title: '当前列表跨页全选可能包含无效的操作，是否继续？',
            content: '',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
              this.$router.push({
                name: 'EosPayment',
                params: {
                  orderId: this.selectedRowKeys,
                  payAll: {
                    isAll: 1,
                    price: this.price,
                    starttime: this.startTime,
                    endtime: this.endTime,
                    status: 'Not_Paid',
                  },
                },
              })
            },
          })
        } else {
          // 前端判断用户当前所选能否进行批量支付
          let canPay = true
          for (let i = 0; i < this.selectedRowKeys.length; i++) {
            let orderId = this.selectedRowKeys[i]
            let index
            for (let j = 0; j < this.selectedRows.length; j++) {
              if (orderId == this.selectedRows[j].orderId) {
                index = j
                break
              }
            }
            if (this.selectedRows[index].orderStatus !== 2) {
              canPay = false
              break
            }
          }
          if (canPay) {
            this.$router.push({
              name: 'EosPayment',
              params: {
                orderId: this.selectedRowKeys,
                payAll: {
                  isAll: 0,
                  price: this.price,
                  starttime: this.startTime,
                  endtime: this.endTime,
                  status: this.status,
                },
              },
            })
          } else {
            this.$confirm({
              title:
                '所选订单中包含非待付款状态订单，请去除后再次执行批量付款！',
              content: '',
              okText: '是',
              okType: 'danger',
              cancelText: '否',
              cancelButtonProps: {
                props: {
                  disabled: true,
                },
              },
            })
          }
        }
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
              this.tableList[index].orderStatus = 10
              this.$message.success('已确认收货！')
            })
          },
          onCancel() {},
        })
      },
      // 数组去重
      unique(arr) {
        let newArr = []
        for (let i = 0; i < arr.length; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            if (arr[i].orderId == arr[j].orderId) {
              ++i
            }
          }
          newArr.push(arr[i])
        }
        return newArr
      },
      // 筛选
      confirmFiltering(e) {
        const { name, value } = e
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
          this.status = e.value
          if (!this.status) {
            this.$router.push({ query: { orderStatus: '' } })
          }
        } else if (name === 'receiver') {
          this.receiver = e.value
        }
        this._getOrderList()
      },
      // 排序
      confirmSorting(e) {
        const { name, value } = e
        if (name === 'total') {
          this.sort = value === '' ? '' : `price-${e.value}`
        } else if (name === 'createTime') {
          this.sort = value === '' ? '' : `time-${e.value}`
        }
        this._getOrderList()
      },
    },
  }
</script>

<style lang="less" scoped>
  #page-sass-order-list {
    .bulk-payment {
      width: 100%;
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      .area {
        display: flex;
        align-items: center;
      }
      // .area.left {
      //   & > div {
      //     display: flex;
      //     align-items: center;
      //   }
      // }
    }
    // 表格内状态样式
    .status-wrp {
      display: flex;
      align-items: center;
      .status-dot {
        margin-right: 6px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        // 待付款 待发货 待收货
        &.status_2,
        &.status_5,
        &.status_6 {
          background: #fad337;
        }
        // 已取消
        &.status_9 {
          background: #ff4433;
        }
        // 已完成
        &.status_10 {
          background: #52c41a;
        }
      }
    }
  }
</style>
<style lang="less"></style>
