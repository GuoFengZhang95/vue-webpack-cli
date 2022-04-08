<template>
  <div id="page-sass-invoice-list" class="list-page-wrp">
    <div class="list-page-top-wrp">
      <MuTopOperations
        :show-reload="false"
        :has-bottom-border="true"
        @parentReload="parentReload"
      >
        <template #operations>
          <div v-if="!selectedRowKeys.length" class="nav-wrp">
            <div
              :class="tabIndex == 3 ? 'nav-item selected' : 'nav-item'"
              @click="changeTabs(3)"
            >
              申请记录
            </div>
            <div
              :class="tabIndex == 1 ? 'nav-item selected' : 'nav-item'"
              @click="changeTabs(1)"
            >
              可开票订单
            </div>
          </div>
          <div v-if="selectedRowKeys.length" class="bulk-application ml24">
            <div class="left area">
              <div v-if="!isAll">
                <span>当前已选</span>
                <span style="color: #00c7db">{{ selectedRowKeys.length }}</span>
                <span>条订单</span>
              </div>
              <div v-else>
                <span>选择全部</span>
                <span style="color: #00c7db">{{ totalCount }}</span>
                <span>条订单</span>
              </div>
              <a-divider type="vertical"></a-divider>
              <div class="btn-operation" @click="bulkApply">
                <a-icon type="select" color="white"></a-icon>
                <span style="cursor: pointer">批量申请</span>
              </div>
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
      <!-- 申请记录 -->
      <common-table
        v-if="listType == 3"
        key="1"
        :loading="loading"
        :scroll="{ y: tableHeight, x: tableWidth }"
        :columns="invoicdColumns"
        :data-source="invoicdTableList"
        :table-size="tableSize"
        @confirmFiltering="confirmFiltering"
        @confirmSorting="confirmSorting"
      ></common-table>
      <!-- 可开票订单 -->
      <common-table
        v-if="listType == 1"
        key="2"
        :loading="loading"
        :scroll="{ y: tableHeight, x: tableWidth }"
        :columns="invoicingColumns"
        :row-selection="rowSelection"
        :data-source="invoicingTableList"
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
    <a-drawer
      width="1284"
      placement="right"
      :closable="false"
      :mask="false"
      :visible="drawerVisible"
      destroy-on-close
      @close="onClose"
    >
      <order-detail v-if="listType == 1" :order-id="orderId"></order-detail>
      <application-detail
        v-if="listType == 3"
        :id="applicationId"
      ></application-detail>
    </a-drawer>
  </div>
</template>

<script>
  import { getInvoiceApplicationList } from '@/api/eos/index'
  import ApplicationDetail from './components/ApplicationDetail'
  import OrderDetail from '../order/components/OrderDetail'
  import { mapGetters } from 'vuex'
  export default {
    name: 'EosInvoiceList',
    components: {
      ApplicationDetail,
      OrderDetail,
    },
    inject: ['reload'],
    data() {
      return {
        loading: false,
        // 列表入参
        pno: 1,
        perpage: '',
        listType: 3, //当前列表类型
        totalCount: 0, //表格总页码
        sort: null, // 排序,time-asc,time-desc,price-desc,price-asc
        price: null, // 价格区间筛选字段：1,30
        starttime: null, // 开始时间
        endtime: null, // 结束时间
        os: null, // 状态:UnApply 1 未申请 UnSubmit 2 未提交 ForInvoice 4 待开票 Finished 6 已开
        drawerStyle: {
          width: 400,
        },
        orderId: '',
        applicationId: '',
        isAll: false, //是否全选
        selectedRows: [], //记录当前周期所选择过的数据行
        selectedRowKeys: [],
        tabIndex: 3,
        // 申请记录表头
        invoicdColumns: [
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
            title: '发票编号',
            dataIndex: 'applyNum',
            key: 'applyNum',
            customRender: (text, record, index) => {
              return (
                <span
                  class='span-link a'
                  type='link'
                  onClick={() => {
                    this.showInvoiceDetail(record.id)
                  }}
                >
                  {record.applyNum}
                </span>
              )
            },
          },
          {
            title: '申请时间',
            dataIndex: 'time',
            key: 'time',
            hasPopover: true,
            sortOperation: true,
            filterOperation: true,
            filterInfo: {
              type: 'time',
            },
          },
          {
            title: '发票金额',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            hasPopover: true,
            sortOperation: true,
            filterOperation: true,
            filterInfo: {
              type: 'range',
            },
            customRender: (text, record, index) => {
              return (
                <span>
                  （{record.currencyCode ? record.currencyCode : 'CNY'}）{text}
                </span>
              )
            },
          },
          {
            title: '票期',
            dataIndex: 'usance',
            key: 'usance',
          },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            hasPopover: true,
            filterOperation: true,
            filterInfo: {
              type: 'default',
              options: [
                // UnApply 1 未申请 UnSubmit 2 未提交 ForInvoice 4 待开票 Finished 6 已开
                { name: '已申请', value: '4' },
                { name: '已开票', value: '6' },
              ],
            },
            customRender: (text, record, index) => {
              let statusInfo = {
                4: {
                  className: 'status_underway',
                  value: '已申请',
                },
                6: {
                  className: 'status_normal',
                  value: '已开票',
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
        // 待开票订单表头
        invoicingColumns: [
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
            title: '订单编号',
            dataIndex: 'orderId',
            key: 'orderId',
            customRender: (text, record, index) => {
              return (
                <span
                  class='span-link a'
                  type='link'
                  onClick={() => {
                    this.showInvoiceDetail(record.orderId)
                  }}
                >
                  {record.orderId}
                </span>
              )
            },
          },
          {
            title: '创建时间',
            dataIndex: 'time',
            key: 'time',
            hasPopover: true,
            sortOperation: true,
            filterOperation: true,
            filterInfo: {
              type: 'time',
            },
          },
          {
            title: '订单金额',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            hasPopover: true,
            sortOperation: true,
            filterOperation: true,
            filterInfo: {
              type: 'range',
            },
            customRender: (text, record, index) => {
              return (
                <span>
                  （{record.currencyCode ? record.currencyCode : 'CNY'}）{text}
                </span>
              )
            },
          },
          {
            title: '可开票金额',
            dataIndex: 'invoicePrice',
            key: 'invoicePrice',
            // hasPopover: true,
            // sortOperation: true,
            // filterOperation: true,
            // filterInfo: {
            //   type: "range"
            // },
            customRender: (text, record, index) => {
              return <span>(CNY) {text}</span>
            },
          },
        ],
        invoicdTableList: [], // 已申请发票列表
        invoicingTableList: [], //待开票订单列表
        drawerVisible: false,
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
          selectedRowKeys,
          onChange: this.onSelectChange,
          hideDefaultSelections: true,
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
              text: `当前页${this.invoicingTableList.length}条`,
              onSelect: changableRowKeys => {
                // 取消全选标志
                this.isAll = false
                // 设置当前页选中状态
                this.selectedRowKeys = changableRowKeys
                this.selectedRows = this.invoicingTableList
              },
            },
          ],
          onSelection: this.onSelection,
        }
      },
    },
    mounted() {
      this.$getLPTableSize()
      this.perpage = this.pageSize
      this._getInvoiceApplicationList()
    },
    methods: {
      // 刷新
      parentReload() {
        this.reload()
      },
      // 获取列表
      _getInvoiceApplicationList() {
        let data = {
          pno: this.pno,
          perpage: this.perpage,
          listType: this.listType,
          sort: this.sort, // 排序,time-asc,time-desc,price-desc,price-asc
          price: this.price, // 价格区间筛选字段：1,30
          starttime: this.starttime, // 开始时间
          endtime: this.endtime, // 结束时间
          os: this.os, // 状态:UnApply 1 未申请 UnSubmit 2 未提交 ForInvoice 4 待开票 Finished 6 已开
        }
        this.loading = true
        getInvoiceApplicationList(data)
          .then(res => {
            if (this.listType === 1) {
              this.$addListId(res.data.orderList, 'orderId')
              res.data.orderList.forEach((item, index) => {
                item.invoicePrice = item.totalPrice
              })
              this.invoicingTableList = res.data.orderList
            } else if (this.listType === 3) {
              this.$addListId(res.data.applyList, 'applyNum')
              this.invoicdTableList = res.data.applyList
            }
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
        this.perpage = pageSize
        this._getInvoiceApplicationList()
      },
      // pageSize变化
      tablePageSizeChange(page, pageSize) {
        this.reset()
        // if (this.isAll) {
        //   this.reset()
        // }
        this.pno = page
        this.perpage = pageSize
        this._getInvoiceApplicationList()
      },
      // 切换表格
      changeTabs(tabIndex) {
        this.reset()
        if (tabIndex != this.tabIndex) {
          this.tabIndex = tabIndex
          this.listType = tabIndex
          this.pno = 1
          this._getInvoiceApplicationList()
        }
      },
      // 表格复选框有变化 选择开票订单
      onSelectChange(selectedRowKeys, selectedRows) {
        this.isAll = false
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
        // 这里记录所有已经点击过的行数据
        // 用作批量申请时跨页传递数据
        // 注意在跳转页面前需要使用 this.selectedRowKeys 处理后的数据
        // this.selectedRows = this.selectedRows.concat(selectedRows)
        // this.selectedRows = this.unique(this.selectedRows)
      },
      // 重置表格复选宽状态
      reset() {
        this.isAll = false
        this.selectedRowKeys = []
      },
      // 批量申请发票
      bulkApply() {
        let selectedOrderList = []
        if (!this.isAll) {
          this.selectedRowKeys.forEach(item => {
            this.selectedRows.forEach((d, i) => {
              if (item == d.orderId) {
                selectedOrderList.push(d)
              }
            })
          })
        }
        this.$router.push({
          name: 'EosInvoiceApplication',
          params: {
            isAll: this.isAll ? 1 : 0,
            selectedOrderList,
            totalCount: this.totalCount,
          },
        })
      },
      onClose() {
        this.drawerVisible = false
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
      // 查看发票详情
      showInvoiceDetail(id) {
        // this.drawerVisible = true
        if (this.listType == 1) {
          this.$globalDrawer.show({
            component: OrderDetail,
            options: { name: 'OrderDetail', title: '订单详情', props: { id } },
          })
        } else if (this.listType == 3) {
          this.$globalDrawer.show({
            component: ApplicationDetail,
            options: {
              name: 'ApplicationDetail',
              title: '申请详情',
              props: { id },
            },
          })
        }
      },
      //
      confirmFiltering(e) {
        const { name, value } = e
        if (name === 'status') {
          this.os = value
        } else if (name === 'time') {
          this.starttime = value[0]
          this.endtime = value[1]
        } else if (name === 'totalPrice' || name === 'invoicePrice') {
          let price = null
          if (value[1] === '') {
            price = value[0]
          } else {
            price = value.join(',')
          }
          this.price = price
        }
        this.pno = 1
        this._getInvoiceApplicationList()
      },
      //
      confirmSorting(e) {
        let { name, value } = e
        if (name === 'totalPrice') name = 'price'
        this.sort = value === '' ? '' : `${name}-${value}`
        this.pno = 1
        this._getInvoiceApplicationList()
      },
    },
  }
</script>

<style lang="less" scoped>
  #page-sass-invoice-list {
    .nav-wrp {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .nav-item {
        cursor: pointer;
        margin: 0 20px;
        padding: 0 4px;
        position: relative;
        height: 25px;
        font-size: 18px;
        font-weight: 400;
        text-align: left;
        color: #999999;
        &.selected {
          color: #00c7db;
          &::after {
            position: absolute;
            content: '';
            width: 100%;
            left: 0;
            bottom: -14px;
            height: 2px;
            background: #00c7db;
          }
        }
      }
    }
    .bulk-application {
      width: 100%;
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      .area {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
<style lang="less"></style>
