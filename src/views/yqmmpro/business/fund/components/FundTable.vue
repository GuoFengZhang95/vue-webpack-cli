<template>
  <div class="bid-table">
    <div class="table-pad">
      <MuTable
        ref="mumuTable"
        :key="keys"
        :has-index="true"
        :is-loading="isLoading"
        :setting-act-flag="true"
        :page="page"
        :page-size="pageSize"
        :total="total"
        :columns="columns"
        :data-source="dataSource"
        :resize-height-offset="210"
        @pageChange="pageChange"
        @filterFlag="filterFlag"
        @pageSizeChange="pageSizeChange"
        @reloadTable="reloadTable"
        @handleFilter="handleFilter"
        @handleRowClick="handleRowClick"
      >
        <template slot="action">
          <div class="search-action">
            <MuSearchGroup
              :ref="keys"
              :placeholder="searchPlaceholder"
              :select-visible="false"
              :has-filter="hasFilter"
              @resetFilter="resetFilter"
              @search="handleInput"
            ></MuSearchGroup>
          </div>
        </template>
      </MuTable>
    </div>
  </div>
</template>

<script>
  import BidDetail from '@/views/yqmmpro/components/BidDetail/index.vue'
  import { tableMix } from '@/mixin/index'
  import { getUnLockList } from '@/api/yqmmPro/public'
  import { getCountryList } from '@/api/dictionary'
  import { mapGetters } from 'vuex'

  let commonColumns = [
    {
      dataIndex: 'name',
      title: '名称',
      width: 300,
      ellipsis: true,
      len: 20,
      type: 'action',
      default: true,
    },
    {
      dataIndex: 'pizhunhao',
      title: '批准号',
      extend: true,
    },
    {
      dataIndex: 'type',
      title: '类型',
    },
    {
      dataIndex: 'level',
      title: '级别',
    },
    {
      dataIndex: 'originCity',
      title: '来源城市',
      extend: true,
    },
    {
      dataIndex: 'subject',
      title: '学科',
      extend: true,
    },
    {
      dataIndex: 'money',
      title: '科研经费（万元）',
    },
    {
      dataIndex: 'belongCity',
      title: '依托单位所属城市',
    },
    {
      dataIndex: 'belongCompany',
      title: '依托单位',
    },
    {
      dataIndex: 'leader',
      title: '负责人 ',
    },
    {
      dataIndex: 'year',
      title: '批准年份',
      extend: true,
    },
    {
      dataIndex: 'createTime',
      title: '立项时间',
      extend: true,
    },
    {
      dataIndex: 'endTime',
      title: '结束时间',
      extend: true,
    },
    {
      dataIndex: 'unlockTime',
      title: '解锁时间',
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
    name: 'FundTable',
    mixins: [tableMix],
    props: {
      keys: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        searchPlaceholder: '标题',
        queryObj: {
          module: 2, // 0未知 1采购意向 2标讯 3需求 4重大商情 5客户分析 6客源
          subModule: 1, // 1我的 2全部
          affiliatedCompany: '',
          searchType: 1, // 只有标题搜索
          searchKey: '', // 搜索值
          bidProvinceId: '',
          bidCityId: '',
          bidCompany: '',
          bidProduct: '',
          unLockUserName: '',
          bidTypeId: '',
          minPublishTime: '',
          maxPublishTime: '',
          minUnLockTime: '',
          maxUnLockTime: '',
          sort: 3,
          pageNum: 1,
          pageSize: 20,
        },
        companyId: '',
        hasFilter: '', // 是否有筛选条件标识
        columns: [],
      }
    },
    computed: {
      ...mapGetters(['baseUserInfo']),
    },
    watch: {
      keys: {
        immediate: true,
        handler(k) {
          let mineColumns = this.$lodash.cloneDeep(commonColumns)
          let allColumns = this.$lodash.cloneDeep(commonColumns)
          allColumns.splice(-1, 0, flexColumns)
          this.columns = k === 'mine' ? mineColumns : allColumns
        },
      },
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        let { companyId } = this.baseUserInfo
        this.companyId = companyId
        this.queryObj.subModule = this.keys === 'mine' ? 1 : 2
        this.loadFilterData()
        this.defaultTableInit()
      },
      // 加载表头筛选数据
      async loadFilterData() {
        await this.setCityOpts()
      },
      async setCityOpts() {
        // 所属城市
        let { code, data } = await getCountryList()
        if (code === '0') {
          this.columns.forEach(item => {
            if (item.dataIndex === 'bidCityName') {
              item.checkOpts = data
            }
          })
        }
      },
      // 列表数据
      async defaultTableInit() {
        if (
          (await this.$parent.checkListPower(3)) === 3 &&
          this.$parent.tabList.length === 2
        )
          return

        let { filterObj } = this
        Object.assign(this.queryObj, {
          bidTypeId: this._hasVal(filterObj, 'bidType')
            ? filterObj.bidType.value.join(',')
            : '',
          bidCityId: this._hasVal(filterObj, 'bidCityName')
            ? filterObj.bidCityName.value.join(',')
            : '',
          bidCompany: this._hasVal(filterObj, 'bidCompany')
            ? filterObj.bidCompany.value.searchKey
            : '',
          bidProduct: this._hasVal(filterObj, 'bidProduct')
            ? filterObj.bidProduct.value.searchKey
            : '',
          unLockUserName: this._hasVal(filterObj, 'unLockUserName')
            ? filterObj.unLockUserName.value.searchKey
            : '',
          minPublishTime: this._hasVal(filterObj, 'publishTime')
            ? filterObj.publishTime.value[0]
            : '',
          maxPublishTime: this._hasVal(filterObj, 'publishTime')
            ? filterObj.publishTime.value[1]
            : '',
          minUnLockTime: this._hasVal(filterObj, 'unLockTime')
            ? filterObj.unLockTime.value[0]
            : '',
          maxUnLockTime: this._hasVal(filterObj, 'unLockTime')
            ? filterObj.unLockTime.value[1]
            : '',
          pageNum: this.page,
          pageSize: this.pageSize,
        })
        if (this._hasVal(filterObj, 'publishTimeSortData')) {
          let { value } = filterObj.publishTimeSortData
          Object.assign(this.queryObj, {
            sort: value === 'ascend' ? 6 : value === 'descend' ? 5 : 0,
          })
        } else if (this._hasVal(filterObj, 'unLockTimeSortData')) {
          let { value } = filterObj.unLockTimeSortData
          Object.assign(this.queryObj, {
            sort: value === 'ascend' ? 4 : value === 'descend' ? 3 : 0,
          })
        } else {
          Object.assign(this.queryObj, {
            sort: 3,
          })
        }
        await this.handleQuery()
      },
      _hasVal(obj, val) {
        return Object.prototype.hasOwnProperty.call(obj, val)
      },
      // 加载列表
      async handleQuery() {
        if (
          (await this.$parent.checkListPower(3)) === 3 &&
          this.$parent.tabList.length === 2
        )
          return

        this.isLoading = true
        this.queryObj.affiliatedCompany = this.companyId
        let { code, data } = await getUnLockList(this.queryObj)
        this.isLoading = false
        if (code === '0') {
          if (!data.list) return false
          this.total = data.total
          let { bidTypeList } = data.searchList
          data.list.forEach(item => {
            return Object.assign(item, {
              title: {
                key: 'title',
                value: 'detail',
                label: item.title,
              },
            })
          })
          this.dataSource = data.list
          // 筛选项
          this.columns.forEach(item => {
            switch (item.dataIndex) {
              case 'bidType':
                item.checkOpts = bidTypeList
                break
            }
          })
        }
      },
      // 表格操作
      handleRowClick(clickType, rowData, record) {
        if (clickType === 'action') {
          if (rowData.key === 'title' && rowData.label) {
            this.$globalDrawer.show({
              component: BidDetail,
              options: {
                name: 'BidDetail',
                title: '标讯详情',
                props: { id: record.tokenEncodeId },
              },
            })
          }
        }
      },
      // 查询条件更新，查询结果
      handleInput(e) {
        this.queryObj.searchKey = e
        this.queryObj.pageNum = this.page = 1
        this.handleQuery()
      },
      // 页面变更
      pageChange(current, pageSize, tableKey) {
        this.page = current
        this.defaultTableInit()
      },
      // 每页展示条数
      pageSizeChange(current, pageSize, tableKey) {
        this.page = 1
        this.pageSize = pageSize
        this.defaultTableInit()
      },
    },
  }
</script>

<style lang="less" scoped>
  .bid-table {
    .table-pad {
      .search-action {
        display: flex;
        .reset-search-btn {
          width: 104px;
          height: 32px;
          opacity: 1;
          border: 1px solid #00c7db;
          border-radius: 17px;
          text-align: center;
          line-height: 32px;
          margin-left: 24px;
          font-weight: 400;
          color: #00c7db;
          font-size: 14px;
          cursor: pointer;
          img {
            height: 12px;
            opacity: 0.65;
            vertical-align: -1px;
          }
        }
      }
    }
  }
</style>
