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
            placeholder="标题"
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
  import NewsDetail from '@/views/yqmmpro/components/NewsDetail'
  import { tableMix } from '@/mixin/index'
  import { getUnLockList } from '@/api/yqmmPro/public'
  import { mapGetters } from 'vuex'

  let commonColumns = [
    {
      dataIndex: 'title',
      title: '标题',
      width: 250,
      type: 'action',
    },
    {
      dataIndex: 'cata',
      title: '文章分类',
      filter: ['search'],
      filterKey: 'cata',
      checkOpts: [],
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
    name: 'MajorTable',
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
            label: '标题',
          },
        ],
        queryData: {
          module: 4,
          subModule: this.keys === 'mine' ? 1 : 2,
          searchType: 1,
          searchKey: '',
          affiliatedCompany: 30178,
          pageNum: 1,
          pageSize: 20,
        },
        dataSource: [],
        columns: [],
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
      //初始化数据
      init() {
        this.defaultTableInit()
      },
      //表格公用方法
      async defaultTableInit() {
        if (
          (await this.$parent.checkListPower(4)) === 3 &&
          this.$parent.tabList.length === 2
        )
          return

        this.queryData.affiliatedCompany = this.baseUserInfo.companyId
        this.isLoading = true
        const {
          cata,
          publishTime,
          unLockTime,
          unLockUserName,
          unLockTimeSortData,
          publishTimeSortData,
        } = this.filterObj
        if (publishTimeSortData) {
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
          cataId: cata && cata.value.join(','),
          unLockUserName: unLockUserName && unLockUserName.value.searchKey,
          minPublishTime: publishTime && publishTime.value[0],
          maxPublishTime: publishTime && publishTime.value[1],
          minUnLockTime: unLockTime && unLockTime.value[0],
          maxUnLockTime: unLockTime && unLockTime.value[1],
          pageNum: this.page,
          pageSize: this.pageSize,
        })
        getUnLockList(this.queryData).then(res => {
          this.isLoading = false
          this.total = res.data.total
          this.dataSource = res.data.list.map(item => {
            item.title = {
              value: 'detail',
              label: item.title,
            }
            return item
          })
          this.columns.forEach(item => {
            if (item.dataIndex == 'cata') {
              item.checkOpts = res.data.searchList.cataId.map(item => {
                return {
                  value: item.id,
                  label: item.name,
                }
              })
            }
          })
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
      //表格点击事件
      // 表格操作
      handleRowClick(clickType, rowData, record) {
        if (rowData.label) {
          this.$globalDrawer.show({
            component: NewsDetail,
            options: {
              name: 'NewsDetail',
              title: '重大商情详情',
              props: { id: record.tokenEncodeId },
            },
          })
        }
        // let yqmmUrl = process.env.App_Web_Base_Url
        // rowData.label &&
        //   window.open(
        //     record.cata == '商情解读'
        //       ? `${yqmmUrl}/business/analysis/${record.tokenEncodeId}`
        //       : `${yqmmUrl}/business/${record.tokenEncodeId}`
        //   )
      },
    },
  }
</script>
<style></style>
