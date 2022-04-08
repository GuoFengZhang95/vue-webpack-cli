<template>
  <div id="page-sass-shopcart" class="list-page-wrp">
    <div class="list-page-top-wrp">
      <MuTopOperations :show-reload="false" @parentReload="parentReload">
        <template #operations>
          <div class="input-wrp ml24">
            <MuSearch
              class="search-cart"
              @globalSearch="globalSearch"
            ></MuSearch>
          </div>
          <div class="btn-operation" @click="goProductList">
            <a-badge :count="shopcartCount" show-zero :offset="[10, 0]">
              <a-icon type="shopping-cart" color="white"></a-icon>
              <span>继续添加</span>
            </a-badge>
          </div>
        </template>
      </MuTopOperations>
    </div>
    <div class="list-page-table-wrp">
      <common-table
        :scroll="{ y: tableHeight - 105, x: tableWidth }"
        :columns="columns"
        :row-selection="rowSelection"
        :data-source="tableList"
        :table-size="tableSize"
        :loading="loading"
        @tableRowClick="tableRowClick"
      ></common-table>
      <div class="operations-wrp">
        <div class="settlement-info">
          <div class="cart-info">
            <div class="left">
              <a-checkbox
                class="checkbox"
                :checked="selectedAll"
                @change="selectAllChange"
              >
                全选
              </a-checkbox>
              <div style="cursor: pointer" @click="deleteCartList">删除</div>
            </div>
            <div class="right">
              <div>
                共
                <span class="span-num">{{ tableList.length }}</span>
                件，已选
                <span class="span-num">{{ selectedRows.length }}</span>
                件产品
                <span class="span-shutiao">|</span>
              </div>
              <div>总价（不含运费）：</div>
              <div class="total-num">（CNY）{{ total }}</div>
            </div>
          </div>
          <a-button type="primary" @click="goCreateOrder">去结算</a-button>
        </div>
        <div class="tips">
          <img src="@/assets/images/info-tips.png" alt="pic" />
          <span>库存仅供参考，请提前联系客服或销售确认</span>
        </div>
      </div>
    </div>
    <div class="list-page-bottom-operations">
      <MuBottomOperations></MuBottomOperations>
    </div>
  </div>
</template>

<script>
  import { addShopcart, deleteShopcart, getShopcartList } from '@/api/eos/index'
  import ProductDetail from '../product/components/ProductDetail'
  import { mapGetters } from 'vuex'
  export default {
    name: 'EosShopcartList',
    components: {},
    inject: ['reload'],
    data() {
      return {
        keyword: '',
        tableList: [],
        selectedRowKeys: [],
        selectedRows: [],
        loading: false,
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
            title: '图片',
            dataIndex: 'displayImage',
            key: 'displayImage',
            customRender: (text, record) => {
              return (
                <div class='td-img'>
                  <MuImage width='28' height='28' src={text} />
                </div>
              )
            },
          },
          {
            title: '产品名称',
            dataIndex: 'productName',
            key: 'productName',
            customRender: (text, record, index) => {
              return (
                <span
                  class='span-link a'
                  onClick={e => {
                    e.stopPropagation(this.goProductDetail(record))
                  }}
                >
                  {record.productName}
                </span>
              )
            },
          },
          {
            title: '下单组合',
            dataIndex: 'specifications',
            key: 'specifications',
          },
          {
            title: 'SKU编码',
            dataIndex: 'skuCode',
            key: 'skuCode',
          },
          {
            title: '单价',
            dataIndex: 'univalence',
            key: 'univalence',
            customRender: (text, record, index) => {
              return (
                <span>
                  （{record.currencyCode}）{text}
                </span>
              )
            },
          },
          {
            title: '数量',
            dataIndex: 'count',
            key: 'count',
            customRender: (text, record, index) => {
              return (
                <MuInputNumber
                  onNumberChange={e =>
                    this.skuChangeDebounce(
                      e,
                      record.univalence,
                      record.cartId,
                      index
                    )
                  }
                  ref={record.cartId}
                  min={1}
                  disabled={!record.isvalid}
                  default-value={record.count}
                ></MuInputNumber>
              )
            },
          },
          {
            title: '总价',
            dataIndex: 'total',
            customRender: (text, record, index) => {
              return (
                <a-popover placement='top'>
                  <template slot='content'>
                    <span>
                      （{record.currencyCode}）{text}
                    </span>
                  </template>
                  <span>
                    （{record.currencyCode}）{text}
                  </span>
                </a-popover>
              )
              // return <span>（{record.currencyCode}）{text}</span>
            },
          },
          {
            title: '操作',
            dataIndex: 'operations',
            key: 'operations',
            customRender: (text, record, index) => {
              return (
                <div>
                  <a-button
                    type='link'
                    onClick={() => {
                      this.deleteCartItem(record.cartId, index)
                    }}
                  >
                    删除
                  </a-button>
                </div>
              )
            },
          },
        ],
        skuChangeInfo: {
          e: null,
          univalence: null,
          cartId: null,
          index: null,
        },
      }
    },
    computed: {
      ...mapGetters(['tableSize', 'pageSize', 'tableHeight', 'tableWidth']),
      rowSelection() {
        const selectedRowKeys = this.selectedRowKeys
        return {
          selectedRowKeys,
          onChange: this.onTableChange, //表格任意行有变化
          // onSelectAll: this.onSelectAll,//全选
          getCheckboxProps: record => ({
            props: {
              disabled: !record.isvalid,
            },
          }),
        }
      },
      shopcartCount() {
        return this.$store.state.shopcart.shopcartCount
      },
      total() {
        let total = 0
        this.selectedRows.forEach(ele => {
          if (ele.isvalid) {
            total = total + ele.count * Number(ele.univalence) * 1000
          }
        })
        return (total / 1000).toFixed(2)
      },
      selectedAll() {
        let isValidArr = this.tableList.filter(item => {
          return item.isvalid == true
        })
        if (!this.selectedRowKeys.length) {
          return false
        } else {
          if (this.selectedRowKeys.length == isValidArr.length) {
            return true
          } else {
            return false
          }
        }
      },
    },
    mounted() {
      this.$getLPTableSize()
      this.skuCountChange = this.$debounce(this.skuCountChange, 500)
      this._getShopcartList()
    },
    methods: {
      parentReload() {
        this.reload()
      },
      // 全局搜索
      globalSearch(value) {
        this.keyword = value
        this._getShopcartList()
      },
      // 点击表格行（需要删除购物车的时候用）
      tableRowClick(record, index) {
        if (!record.isvalid) {
          this.$confirm({
            title: '当前产品已经失效，是否从购物车删除？',
            content: '',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
              deleteShopcart({ cartId: record.cartId }).then(res => {
                // 更新列表
                this.tableList.splice(index, 1)
                // 购物车减一
                this.$store.dispatch(
                  'shopcart/getShopcartCount',
                  this.$store.state.shopcart.shopcartCount - 1
                )
                this.$message.success('已删除！')
              })
            },
          })
        }
      },
      // 购物车增加防抖
      skuChangeDebounce(e, univalence, cartId, index) {
        this.skuChangeInfo = {
          e,
          univalence,
          cartId,
          index,
        }
        this.skuCountChange()
      },
      // 获取购物车列表
      _getShopcartList() {
        this.loading = true
        let data = {
          keyword: this.keyword,
        }
        getShopcartList(data)
          .then(res => {
            this.$addListId(res.data, 'cartId')
            this.tableList = res.data
            this.$store.dispatch('shopcart/getShopcartCount', res.data.length)
            this.selectedRowKeys = []
            this.loading = false
          })
          .catch(err => {
            this.loading = false
          })
      },
      // 跳转产品列表
      goProductList() {
        this.$router.push({
          name: 'EosProductList',
        })
      },
      // 表格任意行有变化都会触发
      onTableChange(selectedRowKeys, selectedRows) {
        this.selectedRows = selectedRows
        this.selectedRowKeys = selectedRowKeys
      },
      // 是否全选购物车
      selectAllChange(e) {
        if (e.target.checked) {
          this.selectedRowKeys = []
          this.selectedRows = []
          this.tableList.forEach((item, index) => {
            if (item.isvalid) {
              this.selectedRowKeys.push(item.cartId)
              this.selectedRows.push(this.tableList[index])
            }
          })
        } else {
          this.selectedRowKeys = []
          this.selectedRows = []
        }
      },
      // sku数量增减
      skuCountChange() {
        let { e, univalence, cartId, index } = this.skuChangeInfo
        let tempCount = this.tableList[index].count
        let data = {
          from: 'PCClient',
          cartIds: cartId,
          cartList: JSON.stringify([
            {
              cartId: cartId,
              count: e,
            },
          ]),
        }
        addShopcart(data)
          .then(res => {
            // 前端sku总价计算
            this.tableList[index].count = e
            this.tableList[index].total = (
              (e * univalence * 1000) /
              1000
            ).toFixed(2)
          })
          .catch(err => {
            this.$refs[cartId].setValue(tempCount)
            this.tableList[index].count = e
            this.tableList[index].count = tempCount
          })
      },
      // 单个删除
      deleteCartItem(cartId, index) {
        this.$confirm({
          title: '是否删除当前记录？',
          content: '',
          okText: '是',
          okType: 'danger',
          cancelText: '否',
          onOk: () => {
            deleteShopcart({ cartId }).then(res => {
              // 更新列表
              this.tableList.splice(index, 1)
              // 更新selectedRowKeys
              this.selectedRowKeys = this.selectedRowKeys.filter(item => {
                return item != cartId
              })
              // 更新selectedRows
              this.selectedRows = this.selectedRows.filter(item => {
                return item.cartId != cartId
              })
              // 购物车减一
              this.$store.dispatch(
                'shopcart/getShopcartCount',
                this.$store.state.shopcart.shopcartCount - 1
              )
              this.$message.success('已删除！')
            })
          },
          onCancel() {},
        })
      },
      // 批量删除
      deleteCartList() {
        if (this.selectedRowKeys.length) {
          this.$confirm({
            title: '是否删除所选记录？',
            content: '',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
              if (this.selectedAll) {
                deleteShopcart({ isAll: 1 }).then(res => {
                  this.$message.success('已删除所选记录！')
                  this.tableList = []
                  this.selectedRows = []
                  this.selectedRowKeys = []
                  this.$store.dispatch('shopcart/getShopcartCount', 0)
                })
              } else {
                deleteShopcart({
                  cartId: this.selectedRowKeys.join(','),
                }).then(res => {
                  this.selectedRowKeys.forEach(item => {
                    let index = this.tableList.findIndex(d => {
                      return d.cartId == item
                    })
                    this.tableList.splice(index, 1)
                  })
                  this.$store.dispatch(
                    'shopcart/getShopcartCount',
                    this.$store.state.shopcart.shopcartCount -
                      this.selectedRowKeys.length
                  )
                  this.selectedRowKeys = []
                  this.selectedRows = []
                  this.$message.success('已删除！')
                })
              }
            },
            onCancel() {},
          })
        } else {
          this.$message.warn('请至少选择一件商品')
        }
      },
      // 去提交订单
      goCreateOrder() {
        if (this.selectedRowKeys.length) {
          let hasInvalid = this.selectedRows.some(item => {
            return item.isvalid === false
          })
          if (hasInvalid) {
            this.$message.warn('当前所选列表中包含已失效的产品，请重新选择！')
          } else {
            this.$store.dispatch(
              'shopcart/getShopcartSelectedRowKeys',
              this.selectedRowKeys
            )
            this.$router.push({
              name: 'EosSettlement',
              params: {
                from: 'cart',
              },
            })
          }
        } else {
          this.$message.warn('至少选择一件商品！')
        }
      },
      goProductDetail(record) {
        this.$globalDrawer.show({
          component: ProductDetail,
          options: {
            name: 'ProductDetail',
            title: '产品详情',
            props: { id: record.productId },
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .operations-wrp {
    margin-top: 16px;

    .settlement-info {
      border-top: 1px solid #d9d9d9;
      border-bottom: 1px solid #d9d9d9;
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      .cart-info {
        padding-left: 28px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          display: flex;
          align-items: center;
        }
        .right {
          display: flex;
          align-items: center;
          margin-right: 20px;
          .span-shutiao {
            margin-right: 9px;
            margin-left: 9px;
            color: #999;
          }
          .span-num {
            font-size: 13px;
            font-weight: 400;
            text-align: left;
            color: #00c7db;
            margin-left: 5px;
            margin-right: 5px;
          }
          .total-num {
            height: 22px;
            font-size: 16px;
            font-weight: 700;
            text-align: left;
            color: #00c7db;
            line-height: 24px;
          }
        }
      }
      .ant-btn {
        width: 158px;
        height: 53px;
        line-height: 52px;
        background: #00c7db;
        font-size: 13px;
        font-weight: 400;
        color: #ffffff;
        border: none;
        border-radius: 0;
      }
    }
    .tips {
      margin-right: 12px;
      margin-top: 8px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      color: #ff4433;
      font-size: 12px;
      img {
        margin-right: 10px;
      }
    }
  }
  .search-cart {
    width: 300px;
    height: 32px;
    background: #ffffff;
    border-radius: 4px 0px 0px 4px;
  }
</style>
<style lang="less">
  .ant-badge {
    .shopcart-letf {
      margin-left: 5px;
      width: 56px;
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: #666666;
    }
  }
</style>
