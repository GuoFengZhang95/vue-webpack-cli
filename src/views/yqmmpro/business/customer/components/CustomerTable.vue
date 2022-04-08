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
      :setting-act-flag="true"
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
            :has-filter="hasFilter"
            :placeholder="
              queryData.searchType ? '请输入搜索内容' : '姓名、学校、研究方向'
            "
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
  import { tableMix } from '@/mixin/index'
  const ResearcherDetail = () =>
    import('@/views/yqmmpro/components/ResearcherDetail.vue')
  import { getUnLockList } from '@/api/yqmmPro'
  import { getCollegeData } from '@/api/dictionary'
  import { mapGetters } from 'vuex'

  let commonColumns = [
    {
      dataIndex: 'title',
      title: '姓名',
      width: 170,
      type: 'action',
    },
    {
      dataIndex: 'companyName',
      title: '学校',
      filter: ['search'],
      filterKey: 'companyName',
      checkOpts: JSON.parse(localStorage.getItem('schoolData')),
    },
    {
      dataIndex: 'depart',
      title: '学院',
      filter: ['search'],
      filterKey: 'depart',
      checkOpts: [],
    },
    {
      dataIndex: 'mobile',
      title: '手机',
      default: true,
    },
    {
      dataIndex: 'mobile2',
      title: '手机2',
      extend: true,
    },
    {
      dataIndex: 'mobile3',
      title: '手机3',
      extend: true,
    },
    {
      dataIndex: 'telphone',
      title: '座机',
      default: true,
    },
    {
      dataIndex: 'email',
      title: '邮箱',
      default: true,
    },
    {
      dataIndex: 'email2',
      title: '邮箱2',
      extend: true,
    },
    {
      dataIndex: 'email3',
      title: '邮箱3',
      extend: true,
    },
    {
      dataIndex: 'atpsName',
      title: '行政职务',
      filter: ['extendTree'],
      filterKey: 'atpsName',
      checkOpts: JSON.parse(localStorage.getItem('aptsData')),
    },
    {
      dataIndex: 'professionalLevelName',
      title: '职称级别',
      filter: ['extendTree'],
      filterKey: 'professionalLevelName',
      checkOpts: JSON.parse(localStorage.getItem('titleData')),
    },
    {
      dataIndex: 'researchDirection',
      title: '研究方向',
    },
    {
      dataIndex: 'bidCityName',
      title: '城市',
      filter: ['extendTree'],
      filterKey: 'bidCityName',
      checkOpts: JSON.parse(localStorage.getItem('tableCity')),
    },
    {
      dataIndex: 'tutorLevelName',
      title: '导师级别',
      filter: ['search'],
      filterKey: 'tutorLevelName',
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
    columns: [],
  }
  export default {
    name: 'CustomerTable',
    components: {},
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
            label: '姓名',
          },
          {
            value: 2,
            label: '学校',
          },
          {
            value: 3,
            label: '研究方向',
          },
        ],
        queryData: {
          module: 6,
          subModule: this.keys === 'mine' ? 1 : 2,
          searchType: 0,
          searchKey: '',
          affiliatedCompany: 30178,
          pageNum: 1,
          pageSize: 20,
        },
        columns: [],
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
          allColumns.splice(mineColumns.length, 0, flexColumns)
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
      },
      //加载学校学院筛选项
      loadShoolData(id) {
        getCollegeData({
          page: 1,
          pageSize: 999999,
          schoolId: id || '',
        }).then(res => {
          this.columns.forEach(item => {
            if (item.dataIndex == 'depart') {
              item.checkOpts = res.data.map(item => {
                return {
                  value: item.id,
                  label: item.name,
                }
              })
            }
          })
        })
      },
      //表格公用方法
      async defaultTableInit() {
        if (
          (await this.$parent.checkListPower(1)) === 3 &&
          this.$parent.tabList.length === 2
        )
          return

        this.queryData.affiliatedCompany = this.baseUserInfo.companyId
        this.isLoading = true
        const {
          companyName,
          depart,
          atpsName,
          professionalLevelName,
          bidCityName,
          tutorLevelName,
          unLockTime,
          unLockUserName,
          unLockTimeSortData,
        } = this.filterObj
        if (unLockTimeSortData) {
          if (unLockTimeSortData.value === 'ascend') {
            //升序
            this.queryData.sort = 4
          } else {
            //降序
            this.queryData.sort = 3
          }
        } else {
          //降序
          this.queryData.sort = 3
        }
        Object.assign(this.queryData, {
          companyId: companyName && companyName.value.join(','),
          depart: depart && depart.value.join(','),
          atps: atpsName && atpsName.value.join(','),
          professionalLevel:
            professionalLevelName && professionalLevelName.value.join(','),
          bidCityId: bidCityName && bidCityName.value.join(','),
          tutorLevel: tutorLevelName && tutorLevelName.value.join(','),
          unLockUserName: unLockUserName && unLockUserName.value.searchKey,
          minUnLockTime: unLockTime && unLockTime.value[0],
          maxUnLockTime: unLockTime && unLockTime.value[1],
          pageNum: this.page,
          pageSize: this.pageSize,
        })
        this.loadShoolData(this.queryData.companyId)
        getUnLockList(this.queryData).then(res => {
          this.isLoading = false
          this.total = res.data.total
          this.dataSource = res.data.list.map(item => {
            item.title = {
              key: 'title',
              label: item.title,
            }
            return item
          })
          this.columns.forEach(item => {
            if (item.dataIndex == 'tutorLevelName') {
              item.checkOpts = res.data.searchList.tutorLevel.map(item => {
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
      //计算是否存在筛选条件
      // filterFlag(flag) {
      //   this.hasFilter = flag
      // },
      //表格点击事件
      async handleRowClick(clickType, rowData, record) {
        if (clickType === 'action') {
          if (rowData.key === 'title') {
            this.$globalDrawer.show({
              component: ResearcherDetail,
              options: {
                name: 'ResearcherDetail',
                title: '科研客户详情',
                props: { id: record.articleId },
              },
            })
          }
        }
      },
    },
  }
</script>
<style lang="scss"></style>
