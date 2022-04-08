<template>
  <div class="yqmmpro-projectt-major">
    <YqmmproPageSearch
      ref="YqmmproPageSearch"
      :options="selectOptions"
      placeholder="请输入"
      :value.sync="pageRequestParams.keyword"
      :search-type="searchType"
      @confirm="onSearchConfrim"
    >
      <template #right>
        <FoldController
          :result-num="resultNum"
          :is-expanded.sync="isExpanded"
        ></FoldController>
      </template>
    </YqmmproPageSearch>
    <ScreenPanel
      :layout="spLayout"
      :result-num="resultNum"
      :is-expanded="isExpanded"
      @reset="handleSPReset"
    >
      <template #companyType>
        <OnceFilter
          ref="companyType"
          :list="companyTypeDict"
          @change="handleSPChange($event, 'companyType')"
        ></OnceFilter>
      </template>
      <template #city>
        <DoubleFilter
          ref="city"
          :list="cityDict"
          @change="handleSPChange($event, 'city')"
        ></DoubleFilter>
      </template>
      <template #publishTime>
        <DateRange
          ref="customPublishTime"
          label="自定义"
          @change="handleSPChange($event, 'publishTime')"
        >
          <template #left>
            <OnceFilter
              ref="defaultPublishTime"
              :list="defaultPublishTime"
              :multiple="false"
              @change="handleDefaultTimeChange($event, 'publishTime')"
            ></OnceFilter>
          </template>
        </DateRange>
      </template>
      <template #result>
        <ResultItem
          label="单位类型"
          :value="screenResults.companyType"
          @delete="handleSPReset('companyType')"
        ></ResultItem>
        <ResultItem
          label="城市"
          :value="screenResults.city"
          @delete="handleSPReset('city')"
        ></ResultItem>
        <ResultItem
          label="发布时间"
          :value="screenResults.publishTime"
          @delete="handleSPReset('publishTime')"
        ></ResultItem>
      </template>
      >
    </ScreenPanel>
    <MuDivid></MuDivid>
    <div class="news-list-wrap">
      <result-switch
        :is-search="isSearchStatus"
        :total="totalCount"
        :is-time-relate-show="true"
        :selected-sort="pageRequestParams.sort"
        :selected-display="0"
        :columns="columns"
        @setTableHeader="setTableHeader"
        @dragTableHeaderOver="dragTableHeaderOver"
        @handleSortChange="handleSortChange"
        @handleDisplayChange="e => (selectedDisplay = e)"
      ></result-switch>
      <!-- 卡片 -->
      <template v-if="selectedDisplay == 0">
        <template v-if="loadingStatus === 3">
          <div class="news-list">
            <NewsCard
              v-for="item in newsList"
              :key="item.tokenEncodeId"
              :item="item"
              :high-light="true"
            ></NewsCard>
          </div>
          <MuPagination
            :page="commonRequestParams.pno"
            :page-size="commonRequestParams.perpage"
            :total="totalCount"
            @pageChange="handlePageNumChange"
            @pageSizeChange="handlePageSizeChange"
          ></MuPagination>
        </template>
        <DefaultArea :loading-status="loadingStatus"></DefaultArea>
      </template>
      <!-- 列表 -->
      <MuTable
        v-else
        ref="mumuTable"
        :has-index="true"
        :is-loading="mixinLoding"
        :page="commonRequestParams.pno"
        :page-size="commonRequestParams.perpage"
        :total="totalCount"
        :columns="columns"
        :data-source="dataSource"
        :resize-height-offset="tableOffset + 10 + 56"
        @pageChange="handlePageNumChange"
        @pageSizeChange="handlePageSizeChange"
        @reloadTable="reloadTable"
        @handleRowClick="handleRowClick"
      ></MuTable>
    </div>
  </div>
</template>

<script>
  import { tableMix, loadingMix } from '@/mixin/index'
  import { replaceEmTag } from '@/utils/index'
  import { mapGetters } from 'vuex'
  import { getNewsList, addYqmmSearchLog } from '@/api/yqmmPro/index'
  const NewsCard = () => import('../../components/NewsCard.vue')
  const NewsDetail = () => import('../../components/NewsDetail.vue')
  const YqmmproPageSearch = () => import('../../components/PageSearch.vue')
  const ResultSwitch = () => import('../../components/ResultSwitch.vue')
  const ScreenPanel = () => import('../../components/ScreenPanel/index.vue')
  const DoubleFilter = () =>
    import('../../components/ScreenPanel/DoubleFilter.vue')
  const OnceFilter = () => import('../../components/ScreenPanel/OnceFilter.vue')
  const DateRange = () => import('../../components/ScreenPanel/DateRange.vue')
  const ResultItem = () => import('../../components/ScreenPanel/ResultItem.vue')
  const FoldController = () =>
    import('../../components/ScreenPanel/FoldController.vue')
  export default {
    name: 'YqmmproProjectMajor',
    components: {
      NewsCard,
      YqmmproPageSearch,
      ResultSwitch,
      ScreenPanel,
      DoubleFilter,
      OnceFilter,
      DateRange,
      ResultItem,
      FoldController,
    },
    mixins: [tableMix, loadingMix()],
    data() {
      return {
        isExpanded: true,
        searchType: 6,
        /**已选条件 */
        screenResults: {
          companyType: '',
          city: '',
          publishTime: '',
        },
        /**搜索框下拉数据 */
        selectOptions: [],
        /**卡片数据 */
        newsList: [],
        /**表格公共入参 */
        commonRequestParams: {
          /**页码 */
          pno: 1,
          /**每页数 */
          perpage: 20,
        },
        /**页面特有的列表入参 */
        pageRequestParams: {
          /**搜索条件 */
          keyword: '',
          /**是否高亮 */
          isHighlight: 1,
          /**是否需要置顶 */
          isNeedTop: 1,
          /**是否热点 */
          isHot: 0,
          /**0-相关度 1-发布时间倒叙 */
          sort: '1',
          /**栏目分类*/
          categoryId: '821,822',
          /**城市id */
          relatedCity: '',
          /**单位类型id */
          relatedCompanyType: '',
          /**发布结束时间*/
          startTime: '',
          /**发布开始时间*/
          endTime: '',
        },
        /**总量 */
        totalCount: 0,
        /** 展示方式 卡片-0 列表-1 */
        selectedDisplay: 0,
        columns: [
          {
            dataIndex: 'title',
            title: '标题',
            width: 250,
            default: true,
            type: 'action',
          },
          {
            dataIndex: 'cata',
            title: '文章分类',
          },
          {
            dataIndex: 'cityName',
            title: '城市',
          },
          {
            dataIndex: 'companyName',
            title: '相关单位',
          },
          {
            dataIndex: 'companyType',
            title: '单位类型',
          },
          {
            dataIndex: 'publishTime',
            title: '发布时间',
          },
        ],
      }
    },
    computed: {
      ...mapGetters(['companyTypeDict', 'cityDict', 'tableOffset']),
      // 筛选面板数据
      spLayout() {
        let spLayout = [
          [{ label: '单位类型', field: 'companyType' }],
          [{ label: '城市', field: 'city' }],
          [{ label: '发布时间', field: 'publishTime' }],
        ]
        return spLayout
      },
      /**已选筛选数量 */
      resultNum() {
        return Object.values(this.screenResults).filter(item => item).length
      },
      unionRequestParams() {
        this.pageRequestParams.isNeedTop = this.pageRequestParams.keyword
          ? 0
          : 1
        return Object.assign(
          {},
          this.commonRequestParams,
          this.pageRequestParams
        )
      },
      currentDate() {
        return this.filterPrevDate(0)
      },
      defaultPublishTime() {
        return [
          { id: `${this.filterPrevDate(3)}`, name: '近3天' },
          { id: this.filterPrevDate(7), name: '近7天' },
          { id: this.filterPrevDate(30), name: '近1个月' },
          { id: this.filterPrevDate(90), name: '近3个月' },
          { id: this.filterPrevDate(365), name: '近1年' },
        ]
      },
      /**是否处于筛选状态 */
      isSearchStatus() {
        return !!(
          this.pageRequestParams.keyword ||
          this.pageRequestParams.relatedCity ||
          this.pageRequestParams.relatedCompanyType ||
          this.pageRequestParams.startTime ||
          this.pageRequestParams.endTime
        )
      },
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.handleQuery()
      },
      async handleQuery() {
        this.toggleMixinLoading(true)
        const res = await getNewsList(this.unionRequestParams)
        if (res.success) {
          if (this.unionRequestParams.keyword) {
            const logRes = await addYqmmSearchLog({
              isHotSearch: res?.data?.list?.length ? true : false,
              searchClient: 1,
              searchKey: this.unionRequestParams.keyword,
              searchPlatform: 8,
              searchType: 6,
            })
            if (logRes.code === '0') {
              this.$refs['YqmmproPageSearch'].updateSearchLog(this.searchType)
            }
          }
          if (res.data) {
            this.newsList = this.$lodash.cloneDeep(res.data)
            this.dataSource = res.data
            this.dataSource.map(item => {
              item.title = {
                key: 'title',
                label: replaceEmTag(item.title),
              }
              item.lastCataId.forEach(e => {
                item.cata =
                  e == 822
                    ? '商情解读'
                    : e == 821
                    ? '重大商情'
                    : e == 784
                    ? '行业动态'
                    : ''
                if (item.cata) {
                  return
                }
              })
              return item
            })
          }
          this.totalCount = res.totalCount ? res.totalCount : 0
        }
        this.toggleMixinLoading(false)
      },
      /**执行顶部搜索*/
      onSearchConfrim() {
        this.commonRequestParams.pno = 1
        this.commonRequestParams.perpage = 20
        this.handleQuery()
      },
      /**
       * @description 更新筛选组件值
       * @param {object} e
       * @param {array} e.selectedItems
       * @param {array} e.selectedKeys
       * @param {boolean} e.isReset
       */
      handleSPChange(e, type) {
        // console.log(e, type)
        const { selectedKeys, selectedItems, isReset } = e
        if (isReset) return
        switch (type) {
          case 'companyType':
            this.pageRequestParams.relatedCompanyType = selectedKeys.join(',')
            this.screenResults[type] = selectedItems
              .map(item => item.name)
              .join(',')
            break
          case 'city':
            {
              // 这里特殊处理，需要把父级id也转到后端
              const parentKeys = selectedItems.map(item => item.id)
              this.pageRequestParams.relatedCity = [
                ...parentKeys,
                ...selectedKeys,
              ].join(',')
              this.screenResults[type] = selectedItems
                .map(item => {
                  if (item.check) {
                    return item.name
                  } else {
                    return item.children.map(d => d.name).join(',')
                  }
                })
                .join(',')
            }
            break
          case 'publishTime':
            this.pageRequestParams.startTime = selectedKeys[0]
            this.pageRequestParams.endTime = selectedKeys[1]
            this.screenResults[type] = selectedKeys.join(' 至 ')
            this.$refs['defaultPublishTime'].reset()
            break
          default:
            break
        }
        this.commonRequestParams.pno = 1
        this.handleQuery()
      },
      /**默认时间变化 */
      handleDefaultTimeChange(e, type) {
        const { selectedKeys, isReset } = e
        if (isReset) return
        switch (type) {
          case 'publishTime':
            if (!selectedKeys[0]) {
              this.pageRequestParams.startTime = ''
              this.pageRequestParams.endTime = ''
              this.screenResults[type] = ''
            } else {
              this.pageRequestParams.startTime = selectedKeys[0]
              this.pageRequestParams.endTime = this.currentDate
              this.screenResults[
                type
              ] = `${selectedKeys[0]} 至 ${this.currentDate}`
            }
            this.$refs['customPublishTime'].reset()
            break
          default:
            break
        }
        this.commonRequestParams.pno = 1
        this.handleQuery()
      },
      /** 重置筛选面板 */
      handleSPReset(type) {
        this.commonRequestParams.pno = 1
        this.commonRequestParams.perpage = 20
        if (!type) {
          // 重置所有
          for (let attr in this.screenResults) {
            if (attr === 'publishTime') {
              this.$refs['defaultPublishTime'].reset()
              this.$refs['customPublishTime'].reset()
            } else {
              this.$refs[attr].reset()
            }
            this.screenResults[attr] = ''
          }
          this.pageRequestParams = Object.assign(this.pageRequestParams, {
            /**城市id */
            relatedCity: '',
            /**单位类型id */
            relatedCompanyType: '',
            /**发布结束时间*/
            startTime: '',
            /**发布开始时间*/
            endTime: '',
          })
        } else {
          this.screenResults[type] = ''
          //重置某一项
          switch (type) {
            case 'companyType':
              this.pageRequestParams.relatedCompanyType = ''
              this.$refs[type].reset()
              break
            case 'city':
              this.pageRequestParams.relatedCity = ''
              this.$refs[type].reset()
              break
            case 'publishTime':
              this.pageRequestParams.startTime = ''
              this.pageRequestParams.endTime = ''
              this.$refs['defaultPublishTime'].reset()
              this.$refs['customPublishTime'].reset()
              break
            default:
              break
          }
        }
        this.handleQuery()
      },
      /**时间相关性排序 */
      handleSortChange(key) {
        this.pageRequestParams.sort = key
        this.commonRequestParams.pno = 1
        this.handleQuery()
      },
      /**页码变更 */
      handlePageNumChange(page) {
        this.commonRequestParams.pno = page
        this.handleQuery()
      },
      /**每页数变更 */
      handlePageSizeChange(page, pageSize) {
        this.commonRequestParams.pno = 1
        this.commonRequestParams.perpage = pageSize
        this.handleQuery()
      },
      // 表格操作
      handleRowClick(clickType, rowData, record) {
        if (clickType === 'action') {
          if (rowData.key === 'title') {
            this.$globalDrawer.show({
              component: NewsDetail,
              options: {
                name: 'NewsDetail',
                title: '重大商情详情',
                props: { id: record.articleId },
              },
            })
          }
        }
      },
      /**
       * @description 获取当前日期指定天数前的日期字符串
       * @param {string} days
       * @return {string} date
       */
      filterPrevDate(days) {
        const date = new Date()
        const currentTime = date.getTime()
        const diffTime = Number(days) * 24 * 60 * 60 * 1000
        const targeTime = currentTime - diffTime
        const targetDate = new Date(targeTime).toLocaleDateString()
        return targetDate.split('/').join('-')
      },
    },
  }
</script>

<style lang="less" scoped>
  .news-list-wrap {
    padding: 0 24px;
    background-color: #fff;
    border-radius: 4px 4px 0 0;

    .news-list {
      .container {
        &:nth-last-child(1) {
          margin-bottom: 0;
        }
      }
    }
  }

  /deep/.pagition-act {
    > span {
      display: none;
    }
  }
  /deep/ .mumuxili-table {
    .action {
      display: none;
    }
  }
</style>
