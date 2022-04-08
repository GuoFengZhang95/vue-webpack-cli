<template>
  <div id="page-sass-order-list" class="list-page-wrp">
    <div class="list-page-top-wrp">
      <MuTopOperations @parentReload="parentReload">
        <template #operations>
          <div class="input-wrp ml24">
            <MuSearch @globalSearch="globalSearch"></MuSearch>
          </div>
        </template>
      </MuTopOperations>
    </div>
    <div class="list-page-table-wrp">
      <common-table
        :loading="loading"
        :scroll="{ y: tableHeight, x: tableWidth }"
        :columns="columns"
        :data-source="tableList"
        :table-size="tableSize"
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
  import { getBrandList } from '@/api/eos/index'
  import { mapGetters } from 'vuex'
  export default {
    name: 'EosBrandList',
    inject: ['reload'],
    data() {
      return {
        loading: false,
        // 列表入参
        pno: 1, //当前页
        perpage: this.pageSize, //每页数量
        keyword: '', //模糊搜素
        sort: null, // 排序
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
            title: 'logo',
            dataIndex: 'logo',
            key: 'logo',
            // width: 267,
            customRender: (text, record, index) => {
              if (record.logo !== '-') {
                return (
                  <div class='td-img'>
                    <MuImage width='28' height='28' src={text} mode='contain' />
                  </div>
                )
              } else {
                return <div class='defalut-logo'>{record.firstLetter}</div>
              }
            },
          },
          {
            title: '品牌名称',
            dataIndex: 'brand_name',
            key: 'brand_name',
            customRender: (text, record, index) => {
              return (
                <a-tooltip
                  placement='topLeft'
                  title={record.description}
                  arrow-point-at-center
                >
                  <div style={{ cursor: 'pointer' }}>{text}</div>
                </a-tooltip>
              )
            },
          },
          // {
          //   title: "产品数量",
          //   dataIndex: "num",
          //   key: "num",
          //   hasPopover: true,
          //   sortOperation: true,
          //   filterOperation: false,
          // },
          {
            title: '操作',
            dataIndex: 'operations',
            key: 'operations',
            // width: 346,
            customRender: (text, record, index) => {
              return (
                <div>
                  <a-button
                    type='link'
                    onClick={() => this.goProductList(record.id)}
                  >
                    查看相关产品
                  </a-button>
                </div>
              )
            },
          },
        ],
        tableList: [],
        totalCount: 0,
      }
    },
    computed: {
      ...mapGetters(['tableSize', 'tableHeight', 'tableWidth', 'pageSize']),
    },
    mounted() {
      this.$getLPTableSize()
      this.perpage = this.pageSize
      this._getBrandList()
    },
    methods: {
      // 刷新
      parentReload() {
        this.reload()
      },
      // 全局搜索
      globalSearch(value) {
        this.keyword = value
        this.pno = 1
        this._getBrandList()
      },
      // 获取品牌列表
      _getBrandList() {
        let data = {
          pno: this.pno,
          perpage: this.perpage,
          keyword: this.keyword,
          sort: this.sort,
        }
        this.loading = true
        getBrandList(data)
          .then(res => {
            res.data.forEach(item => {
              item.firstLetter = item.brand_name.substr(0, 1)
            })
            this.$addListId(res.data, 'id')
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
        this.pno = page
        this.perpage = pageSize ? pageSize : this.pageSize
        this._getBrandList()
      },
      // pageSize变化
      tablePageSizeChange(page, pageSize) {
        this.pno = page
        this.perpage = pageSize
        this._getBrandList()
      },

      goProductList(brandId) {
        this.$router.push({
          name: 'EosProductList',
          query: {
            brandId,
          },
        })
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
      .area.left {
        & > div {
          display: flex;
          align-items: center;
        }
      }
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
