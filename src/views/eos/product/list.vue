<template>
  <div id="page-sass-product-list" class="list-page-wrp">
    <div class="list-page-top-wrp">
      <MuTopOperations :show-reload="false" @parentReload="parentReload">
        <template #operations>
          <div class="input-wrp ml24">
            <MuSearch
              class="screen-input"
              @globalSearch="globalSearch"
            ></MuSearch>
          </div>
          <div class="btn-operation btn-shopcart" @click="goShopcart">
            <a-badge :count="shopcartCount" show-zero :offset="[10, 0]">
              <a-icon type="shopping-cart" color="white"></a-icon>
              <span>查看购物车</span>
            </a-badge>
          </div>
        </template>
      </MuTopOperations>
      <div class="tips">
        <img src="@/assets/images/info-tips.png" alt="pic" />
        <span>
          库存仅供参考，请提前联系客服（客服电话：4006770001）或销售确认！以下售价非最终采购价，在购物车结算时，展示补贴后的优惠金额。
        </span>
      </div>
    </div>
    <div class="list-page-table-wrp">
      <product-table
        ref="product-table"
        :loading="loading"
        :list="tableList"
        :table-size="tableSize"
        @expand="expand"
        @addShopcart="addShopcart"
        @skuCountChange="skuCountChange"
        @sortChange="sortChange"
        @filterChange="filterChange"
        @subConfirmFiltering="subConfirmFiltering"
        @subConfirmSorting="subConfirmSorting"
      ></product-table>
    </div>
    <div class="list-page-bottom-operationos">
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
  import {
    getProductList,
    getSkuList,
    addShopcart,
    getShopcartList,
  } from '@/api/eos/index'
  import ProductTable from './components/ProductTable'
  import { mapGetters } from 'vuex'
  export default {
    name: 'EosProductList',
    components: {
      ProductTable,
    },
    inject: ['reload'],
    data() {
      return {
        loading: false,
        pno: 1,
        perpage: '',
        sort: null,
        startPrice: '',
        endPrice: ' ',
        brandIds: null, // 品牌,筛选值
        supplierIds: null, // 供应商,筛选值
        categoryId: '', //产品分类id
        tableList: [], // 表格数据
        subTableSort: {
          sort: null,
          sortField: null,
        },
        subTableFilter: {
          price: null,
          stock: null,
        },
        // 购物车列表
        shopcartList: [],
        totalCount: 0,
        keyword: '',
      }
    },
    computed: {
      ...mapGetters(['tableSize', 'pageSize']),
      shopcartCount() {
        return this.$store.state.shopcart.shopcartCount
      },
    },
    mounted() {
      this.$getLPTableSize()
      if (this.$route.query.brandId) {
        this.brandIds = this.$route.query.brandId
      }
      this.perpage = this.pageSize
      this._getProductList()
    },
    methods: {
      parentReload() {
        this.reload()
        this.$router.replace({
          name: 'EosProductList',
        })
      },
      // 全局搜索
      globalSearch(value) {
        this.keyword = value
        this.pno = 1
        this._getProductList()
      },
      _getProductList() {
        let data = {
          pno: this.pno,
          perpage: this.perpage,
          keyword: this.keyword,
          sort: this.sort,
          startPrice: this.startPrice,
          endPrice: this.endPrice,
          brandIds: this.brandIds,
          supplierIds: this.supplierIds,
          categoryId: this.categoryId,
        }
        this.loading = true
        getProductList(data)
          .then(res => {
            // 重置表格的二级表格展开状态
            this.$refs['product-table'].expandedRowKeysReset()
            res.data.list.forEach(item => {
              item.expand = false
            })
            this.tableList = res.data.list
            this.totalCount = res.totalCount
            this.loading = false
          })
          .catch(err => {
            this.loading = false
          })
      },
      tablePageChange(page, pageSize) {
        this.pno = page
        this.perpage = pageSize
        this._getProductList()
      },
      tablePageSizeChange(page, pageSize) {
        this.pno = page
        this.perpage = pageSize
        this._getProductList()
      },
      // 展开二级列表
      expand(e) {
        if (e.child) {
          this.$set(this.tableList[e.index], 'expand', e.expand)
        } else {
          this.getSkuList(e)
        }
      },
      getSkuList(e) {
        const { sort, sortField } = this.subTableSort,
          { price, stock } = this.subTableFilter
        getSkuList({
          productId: e.productId,
          sort,
          sortField,
          price,
          stock,
        }).then(res => {
          this.$addListId(res.data, 'skuId')
          res.data.forEach(item => {
            item.selectNum = 0
          })
          this.$set(this.tableList[e.index], 'child', res.data)
        })
      },
      //
      subConfirmFiltering(data, e, index) {
        let obj = {},
          value = null
        if (data.value[1] === '') {
          value = data.value[0]
        } else {
          value = data.value.join(',')
        }

        if (data.name === 'distributionPrice') {
          obj = { price: value, stock: null }
          this.subTableFilter = { ...this.subTableFilter, ...obj }
        } else if (data.name === 'mumustock') {
          obj = { stock: value, price: null }
          this.subTableFilter = { ...this.subTableFilter, ...obj }
        }

        e.index = index
        this.getSkuList(e)
      },
      subConfirmSorting(data, e, index) {
        this.subTableSort = {
          sort: data.value,
          sortField:
            data.name === 'distributionPrice'
              ? 'distribution_price'
              : data.name,
        }
        e.index = index
        this.getSkuList(e)
      },
      // 添加购物车
      addShopcart(item) {
        let skuList = this.tableList[item.index].child
        let data = {
          productName: item.name,
          productId: item.productId,
          from: 'PCClient',
        }
        skuList.forEach(item => {
          if (Number(item.selectNum)) {
            let temp = {
              skuId: item.skuId,
            }
            temp.currentPrice = item.distributionPrice
            temp.count = item.selectNum
            if (data.skuList) {
              data.skuList.push(temp)
            } else {
              data.skuList = [temp]
            }
          }
        })
        if (data.skuList) {
          data.skuList = JSON.stringify(data.skuList)
          addShopcart(data).then(res => {
            // 重新获取购物车列表
            getShopcartList().then(res => {
              this.$message.success('已加入购物车！')
              // 清空选择状态
              this.tableList[item.index].child.forEach(item => {
                item.selectNum = 0
              })
              this.$store.dispatch('shopcart/getShopcartCount', res.data.length)
            })
          })
        } else {
          this.$message.error('请至少选择一件商品！')
        }
      },
      skuCountChange(parentIndex, i, e) {
        this.tableList[parentIndex].child[i].selectNum = e
      },
      // 前往购物车
      goShopcart() {
        this.$router.push({ name: 'EosShopcartList' })
      },
      //
      sortChange(e) {
        // console.log(e)
        this.sort = e
        this._getProductList()
      },
      //
      filterChange(data) {
        const { name, value } = data
        // console.log(name, value)
        switch (name) {
          case 'price':
            this.startPrice = parseFloat(value[0])
            this.endPrice = parseFloat(value[1])
            break
          case 'supplierName':
            this.supplierIds = data.value
            break
          case 'brand':
            this.brandIds = data.value
            break
          case 'category':
            this.categoryId = data.value
            break
        }
        this._getProductList()
        // if (name === 'price') {
        //   this.startPrice = parseFloat(value[0])
        //   this.endPrice = parseFloat(value[1])
        //   this.globalSearch()
        // } else {
        //   if (name === "supplierName") this.supplierIds = data.value
        //   if (name === "brand") this.brandIds = data.value
        //   this.globalSearch()
        // }
      },
    },
  }
</script>

<style lang="less" scoped>
  .screen-input {
    width: 300px;
    height: 32px;
    background: #ffffff;
    border-radius: 4px 0px 0px 4px;
    // border-color: transparent;
  }
  .shopcart-right {
    width: 70px;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #666666;
    line-height: 24px;
    margin-left: 5px;
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
  .btn-shopcart {
    width: 115px;
    margin-right: 24px;
  }
</style>
