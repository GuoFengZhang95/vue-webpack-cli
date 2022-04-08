<template>
  <div>
    <MuTable
      ref="mumuTable"
      :key="keys"
      :is-loading="isLoading"
      :total="total"
      :page="page"
      :page-size="pageSize"
      :columns="columns"
      :data-source="dataSource"
      :setting-act-flag="false"
      :resize-height-offset="210"
      @filterFlag="filterFlag"
      @handleRowClick="handleRowClick"
      @pageChange="pageChange"
      @pageSizeChange="pageSizeChange"
      @dragTableHeaderOver="dragTableHeaderOver"
      @setTableHeader="setTableHeader"
      @handleFilter="handleFilter"
      @reloadTable="reloadTable"
    >
      <template slot="action">
        <div class="left">
          <MuSearchGroup
            :ref="keys"
            :select-visible="false"
            :has-filter="hasFilter"
            placeholder="项目名称"
            :options-list="searchOptionsList"
            @resetFilter="resetFilter"
            @search="handleSearch"
            @selectChange="handleSelectChange"
          ></MuSearchGroup>
        </div>
      </template>
    </MuTable>
  </div>
</template>

<script>
  import PurchaseDetail from '@/views/yqmmpro/components/PurchaseDetail.vue'
  import { tableMix } from '@/mixin/index'
  import { getUnLockList } from '@/api/yqmmPro/public'
  import { mapGetters } from 'vuex'

  let commonColumns = [
    {
      dataIndex: 'title',
      title: '项目名称',
      width: 250,
      type: 'action',
    },
    {
      dataIndex: 'bidCityName',
      title: '所属城市',
      filter: ['extendTree'],
      filterKey: 'bidCityId',
      checkOpts: [],
    },
    {
      dataIndex: 'bidCompany',
      title: '采购单位',
      filter: ['headSearch'],
      filterKey: 'bidCompany',
      checkOpts: [],
    },
    {
      dataIndex: 'purchaseItemStr',
      title: '采购品目',
      filter: ['headSearch'],
      filterKey: 'purchaseItemStr',
      checkOpts: [],
    },
    {
      dataIndex: 'bidProduct',
      title: '采购产品',
      filter: ['headSearch'],
      filterKey: 'bidProduct',
      checkOpts: [],
    },
    {
      dataIndex: 'bidPurchaseDate',
      title: '预计采购时间',
      filter: ['sort', 'singleMonth'],
      filterKey: 'bidPurchaseDate',
      checkOpts: [],
    },
    {
      dataIndex: 'bidPurchaseBudget',
      title: '预算（万元）',
    },
    {
      dataIndex: 'publishTime',
      title: '发布时间',
      filter: ['sort', 'month'],
      filterKey: 'publishTime',
      checkOpts: [],
    },
    {
      dataIndex: 'unLockTime',
      title: '解锁时间',
      filter: ['sort', 'date'],
      filterKey: 'unLockTime',
      checkOpts: [],
    },
  ]
  let flexColumns = {
    dataIndex: 'unLockUserName',
    title: '解锁人',
    filter: ['headSearch'],
    filterKey: 'unLockUserName',
    checkOpts: [],
  }
  export default {
    name: 'PurchaseTable',
    mixins: [tableMix],
    props: {
      keys: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        isLoading: false,
        hasFilter: false,
        searchOptionsList: [
          {
            value: 0,
            label: '综合搜索',
          },
          {
            value: 1,
            label: '项目名称',
          },
        ],
        queryData: {
          module: 1,
          subModule: this.keys === 'mine' ? 1 : 2,
          searchType: 1,
          searchKey: '',
          affiliatedCompany: 30178,
          pageNum: 1,
          pageSize: 20,
        },
        dataSource: [],
      }
    },
    computed: {
      ...mapGetters(['baseUserInfo']),
    },
    watch: {
      keys: {
        immediate: true,
        handler(val) {
          let mineColumns = this.$lodash.cloneDeep(commonColumns)
          let allColumns = this.$lodash.cloneDeep(commonColumns)
          allColumns.splice(-1, 0, flexColumns)
          this.columns = val === 'mine' ? mineColumns : allColumns
        },
      },
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.defaultTableInit()
        this.initFilter()
      },
      //表头筛选数据
      initFilter() {
        this.columns.forEach(item => {
          if (item.dataIndex == 'bidCityName') {
            item.checkOpts = JSON.parse(localStorage.getItem('tablebCity'))
          }
        })
      },
      //表格公用方法
      async defaultTableInit() {
        if (
          (await this.$parent.checkListPower(2)) === 3 &&
          this.$parent.tabList.length === 2
        )
          return

        this.queryData.affiliatedCompany = this.baseUserInfo.companyId
        this.isLoading = true
        const {
          bidCityId,
          bidCompany,
          purchaseItemStr,
          bidProduct,
          bidPurchaseDate,
          publishTime,
          unLockTime,
          unLockUserName,
          bidPurchaseDateSortData,
          publishTimeSortData,
          unLockTimeSortData,
        } = this.filterObj
        if (bidPurchaseDateSortData) {
          if (bidPurchaseDateSortData.value === 'ascend') {
            //升序
            this.queryData.sort = 2
          } else {
            //降序
            this.queryData.sort = 1
          }
        } else if (publishTimeSortData) {
          if (publishTimeSortData.value === 'ascend') {
            //升序
            this.queryData.sort = 6
          } else {
            //降序
            this.queryData.sort = 5
          }
        } else if (unLockTimeSortData) {
          if (unLockTimeSortData.value === 'ascend') {
            //升序
            this.queryData.sort = 4
          } else {
            //降序
            this.queryData.sort = 3
          }
        } else {
          this.queryData.sort = 3
        }
        Object.assign(this.queryData, {
          bidCityId: bidCityId && bidCityId.value.join(','),
          bidCompany: bidCompany && bidCompany.value.searchKey,
          purchaseItemStr: purchaseItemStr && purchaseItemStr.value.searchKey,
          bidProduct: bidProduct && bidProduct.value.searchKey,
          unLockUserName: unLockUserName && unLockUserName.value.searchKey,
          minPurchaseDate: bidPurchaseDate && bidPurchaseDate.value[0],
          maxPurchaseDate: bidPurchaseDate && bidPurchaseDate.value[1],
          minPublishTime: publishTime && publishTime.value[0],
          maxPublishTime: publishTime && publishTime.value[1],
          minUnLockTime: unLockTime && unLockTime.value[0],
          maxUnLockTime: unLockTime && unLockTime.value[1],
          pageNum: this.page,
          pageSize: this.pageSize,
        })
        getUnLockList(this.queryData).then(res => {
          this.isLoading = false
          this.dataSource = res.data.list.map(item => {
            item.title = {
              value: 'detail',
              label: item.title,
            }
            return item
          })
          this.total = res.data.total
        })
      },
      //表格搜索
      handleSearch(e) {
        this.page = 1
        this.queryData.searchKey = e
        this.defaultTableInit()
      },
      //搜索类型选择
      handleSelectChange(e) {
        this.queryData.searchType = e
      },
      //计算是否存在筛选条件
      filetrFlag(flag) {
        this.hasFilter = flag
      },
      // 表格操作
      handleRowClick(clickType, rowData, record) {
        if (rowData.label) {
          this.$globalDrawer.show({
            component: PurchaseDetail,
            options: {
              name: 'PurchaseDetail',
              title: '采购意向详情',
              props: { id: record.tokenEncodeId },
            },
          })
        }
      },
    },
  }
</script>
<style></style>
