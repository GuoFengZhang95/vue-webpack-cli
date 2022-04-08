<template>
  <div class="product-list_table">
    <common-table
      :loading="loading"
      :scroll="{ y: tableHeight }"
      :columns="columns"
      :data-source="list"
      :table-size="tableSize"
      :row-key="'productId'"
      :pagination="false"
      :expand-icon-column-index="columns.length - 1"
      :expanded-row-keys="expandedRowKeys"
      @expandedListChange="childrenTableExpand"
      @confirmFiltering="confirmFiltering"
      @confirmSorting="confirmSorting"
    >
      <template slot="expandedRowRender" slot-scope="record, index">
        <common-table
          :scroll="{}"
          class="expand-table"
          :columns="subColumnsRender(record, index)"
          :data-source="record.child"
          :table-size="tableSize"
          @confirmFiltering="e => subConfirmFiltering(e, record, index)"
          @confirmSorting="e => subConfirmSorting(e, record, index)"
        ></common-table>
      </template>
    </common-table>
  </div>
</template>

<script>
  import ProductDetail from './ProductDetail'
  import { getBrandListScreen, getSupplierListByLetter } from '@/api/eos/index'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ProductList',
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      list: {
        type: Array,
        default: () => {
          return []
        },
      },
      tableSize: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        expandedRowKeys: [],
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
            dataIndex: 'cover',
            key: 'cover',
            width: 80,
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
            dataIndex: 'code',
            key: 'code',
            // width: 168,
          },
          {
            title: '产品名称',
            dataIndex: 'name',
            key: 'name',
            // width: 266,
            customRender: (text, record, index) => {
              return (
                <span
                  class='span-link a'
                  onClick={() => this.goProductDetail(record.productId)}
                >
                  {text}
                </span>
              )
            },
          },
          {
            title: '产品分类',
            dataIndex: 'category',
            key: 'category',
            // width: 168,
            hasPopover: true,
            filterOperation: true,
            filterInfo: {
              type: 'tree',
            },
          },
          {
            title: '品牌',
            dataIndex: 'brand',
            key: 'brand',
            // width: 250,
            hasPopover: true,
            filterOperation: true,
            filterInfo: {
              type: 'default',
              options: [], // brandListTem
            },
          },
          // {
          //   title: "供应商",
          //   dataIndex: "supplierName",
          //   key: "supplierName",
          //   // width: 213,
          //   hasPopover: true,
          //   filterOperation: true,
          //   filterInfo: {
          //     type: "default",
          //     options: [],
          //   },
          // },
          {
            title: '库存',
            dataIndex: 'productStock',
            key: 'productStock',
            // width: 211,
          },
          {
            title: (
              <div>
                <span>参考价</span>
                <a-tooltip>
                  <template slot='title'>具体价格请查看规格列表</template>
                  <a-icon
                    type='question-circle'
                    theme='filled'
                    style={{ color: '#00c7db', marginLeft: '7px' }}
                  />
                </a-tooltip>
              </div>
            ),
            dataIndex: 'price',
            key: 'price',
            customRender: (text, record, index) => {
              return (
                <span>
                  （{record.currencyCode}）{text}
                </span>
              )
            },
            // width: 213,
            hasPopover: false,
            sortOperation: false,
            filterOperation: false,
            filterInfo: {
              type: 'range',
            },
          },
          {
            title: '操作',
            dataIndex: 'operations',
            // width: 247,
            customRender: (text, record, index) => {
              return (
                <div
                  style={{ cursor: 'pointer' }}
                  class={{ expand: record.expand, checklist: true }}
                  onClick={() => this.expand(record, index)}
                >
                  <a-button type='link'>查看规格列表</a-button>
                  <a-icon
                    type='down'
                    style={{ color: '#00c7db' }}
                    rotate={record.expand ? 180 : 0}
                  />
                </div>
              )
            },
          },
        ],
        brandListTem: [],
        supplierListTem: [],
      }
    },
    computed: {
      ...mapGetters(['tableHeight', 'tableWidth']),
    },
    watch: {
      //
      brandListTem: {
        handler(val, oldVal) {
          let index = this.columns.findIndex(item => {
            return item.dataIndex === 'brand'
          })
          this.$set(this.columns[index], 'filterInfo', {
            type: 'default',
            options: val,
          })
        },
        deep: true, //true 深度监听
      },
      //
      supplierListTem: {
        handler(val, oldVal) {
          this.$set(this.columns[5], 'filterInfo', {
            type: 'default',
            options: val,
          })
        },
        deep: true, //true 深度监听
      },
    },
    created() {
      this._getBrandListScreen()
      // this.getSupplierListByLetter()
    },
    methods: {
      subColumnsRender(columns, index) {
        const img = require('../../../../assets/images/shopcart.png')
        return [
          {
            title: 'SKU编码',
            dataIndex: 'skuCode',
            key: 'skuCode',
          },
          {
            title: '产品货号',
            dataIndex: 'supplierModel',
            key: 'supplierModel',
          },
          {
            title: '下单组合',
            dataIndex: 'specifications',
            key: 'specifications',
          },
          {
            title: '平台价',
            dataIndex: 'platPrice',
            key: 'platPrice',
            customRender: (text, record, index) => {
              return (
                <span style={{ 'text-decoration': 'line-through' }}>
                  （{record.currencyCode}）{text}
                </span>
              )
            },
          },
          {
            title: '分销价',
            dataIndex: 'distributionPrice',
            key: 'distributionPrice',
            customRender: (text, record, index) => {
              return (
                <span>
                  （{record.currencyCode}）{text}
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
            title: '库存',
            dataIndex: 'mumustock',
            key: 'mumustock',
            hasPopover: true,
            sortOperation: true,
            filterOperation: true,
            filterInfo: {
              type: 'range',
            },
          },
          {
            title: '货期',
            dataIndex: 'deliveryPeriod',
            key: 'deliveryPeriod',
          },
          {
            title: (
              <div
                class={'add-cart'}
                onClick={() => {
                  this.addShopcart(columns, index)
                }}
              >
                <span>加入购物车</span>
                <img src={img} />
              </div>
            ),
            dataIndex: 'operations',
            customRender: (text, record, index) => {
              return (
                <MuInputNumber
                  onNumberChange={e => {
                    this.skuCountChange(e, record, index)
                  }}
                  min={0}
                  max={record.mumustock}
                  default-value={record.selectNum}
                  ref={`${record.productId}_${index}`}
                ></MuInputNumber>
              )
            },
          },
        ]
      },
      goProductDetail(productId) {
        this.$globalDrawer.show({
          component: ProductDetail,
          options: {
            name: 'ProductDetail',
            title: '产品详情',
            props: { id: productId },
          },
        })
      },
      // 暂时表格自带的次级表格展开事件 2020年9月18日 08:53:46 zevan
      childrenTableExpand(list, id) {
        this.expandedRowKeys = list
        let item = {},
          index = null
        this.list.map((i, num) => {
          if (i.productId === id) {
            item = i
            index = num
          }
        })
        this.expand(item, index)
      },
      expand(item, index) {
        let ret1 = this.expandedRowKeys.findIndex((value, index, arr) => {
          return value === item.productId
        })
        if (!item.expand) {
          this.expandedRowKeys.push(item.productId)
        } else {
          this.expandedRowKeys.splice(ret1, 1)
        }
        item.expand = !item.expand
        let data = { index, ...item }
        this.$emit('expand', data)
      },
      expandedRowKeysReset() {
        this.expandedRowKeys = []
      },
      skuCountChange(e, record, i) {
        let parentIndex = this.list.findIndex(item => {
          return item.productId == record.productId
        })
        this.$emit('skuCountChange', parentIndex, i, e)
        // this.list[parentIndex].child[i].selectNum = e
      },
      // 添加购物车
      addShopcart(item, index) {
        // console.log('item', item)
        let data = { ...item, index }
        this.$emit('addShopcart', data)
      },
      // 根据字母排序获取品牌列表
      _getBrandListScreen() {
        getBrandListScreen().then(res => {
          let list = this.flaten(res.data)
          this.brandListTem = list
        })
      },
      // 根据字母排序获取供应商列表
      getSupplierListByLetter() {
        getSupplierListByLetter().then(res => {
          let list = this.flaten(res.data)
          this.supplierListTem = list
        })
      },
      // 把对象展开成数组
      flaten(obj) {
        let list = []
        for (let i in obj) {
          obj[i].map(item => {
            item.value = item.id
          })
          list = list.concat(obj[i])
        }
        return list
      },
      //
      confirmFiltering(data) {
        this.$emit('filterChange', data)
      },
      //
      confirmSorting(data) {
        let value = data.value === '' ? '' : `${data.name}-${data.value}`
        this.$emit('sortChange', value)
      },
      //
      subConfirmFiltering(data, record, index) {
        this.$emit('subConfirmFiltering', data, record, index)
      },
      //
      subConfirmSorting(data, record, index) {
        this.$emit('subConfirmSorting', data, record, index)
      },
    },
  }
</script>

<style lang="less" scoped>
  .product-list_table {
    width: 100%;
    .add-cart {
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        margin-left: 5px;
      }
    }
    .expand-table {
      padding-left: 60px;
    }
    .checklist {
      margin-left: 12px;
    }
  }
</style>

<style lang="less">
  .product-list_table {
    .common-table {
      .ant-table-row {
        td {
          .checklist {
            position: absolute;
            left: 0;
            transform: translateY(-50%);
          }
          .expandIcon {
            left: 84px;
          }
        }
      }
    }
  }
</style>
