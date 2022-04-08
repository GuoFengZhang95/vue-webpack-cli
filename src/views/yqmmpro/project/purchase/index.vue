<template>
  <div class="yqmmpro-project-purchase">
    <YqmmproPageSearch
      ref="YqmmproPageSearch"
      :options="selectOptions"
      placeholder="请输入"
      :value.sync="pageRequestParams.searchKey"
      :range.sync="pageRequestParams.searchType"
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
      <template #purchaseTime>
        <DateRange
          ref="purchaseTime"
          @change="handleSPChange($event, 'purchaseTime')"
        ></DateRange>
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
          label="预计采购时间"
          :value="screenResults.purchaseTime"
          @delete="handleSPReset('purchaseTime')"
        ></ResultItem>
      </template>
      >
    </ScreenPanel>
    <MuDivid></MuDivid>
    <div class="purchase-list-wrap">
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
          <div class="purchase-list">
            <PurchaseCard
              v-for="item in purchaseList"
              :key="item.tokenEncodeId"
              :render-item="item"
              :high-light="true"
            ></PurchaseCard>
          </div>
          <MuPagination
            :page="commonRequestParams.pageNum"
            :page-size="commonRequestParams.pageSize"
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
        :page="commonRequestParams.pageNum"
        :page-size="commonRequestParams.pageSize"
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
  import { addYqmmSearchLog, getPurchaseList } from '@/api/yqmmPro/index'
  const PurchaseCard = () => import('../../components/PurchaseCard.vue')
  const PurchaseDetail = () => import('../../components/PurchaseDetail.vue')
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
    name: 'YqmmproProjectPurchase',
    components: {
      PurchaseCard,
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
        searchType: 7,
        /**已选条件 */
        screenResults: {
          companyType: '',
          city: '',
          purchaseTime: '',
        },
        /**搜索框下拉数据 */
        selectOptions: [
          {
            label: '综合搜索',
            value: '1',
          },
          {
            label: '标题搜索',
            value: '2',
          },
          {
            label: '采购单位',
            value: '3',
          },
        ],
        /**卡片数据 */
        purchaseList: [],
        /**表格数据 */
        dataSource: [],
        /**表格公共入参 */
        commonRequestParams: {
          /**页码 */
          pageNum: 1,
          /**每页数 */
          pageSize: 20,
        },
        /**页面特有的列表入参 */
        pageRequestParams: {
          /**搜索条件 */
          searchKey: '',
          /**搜索范围 */
          searchType: '',
          /**单位类型id */
          companyTypeIds: '',
          /**是否高亮 */
          isHighlight: 1,
          /**是否需要置顶 */
          isNeedTop: 1,
          /**0-相关度 1-发布时间倒叙 */
          sort: '1',
          /**城市id */
          cityId: '',
          /**最小采购预算*/
          minPurchaseBudget: 0,
          /**最大采购预算*/
          maxPurchaseBudget: 0,
          /**最小采购日期 */
          minPurchaseDate: '',
          /**最大采购日期 */
          maxPurchaseDate: '',
          /**采购品目id */
          purchaseItemIds: '',
        },
        /**总量 */
        totalCount: 0,
        /** 展示方式 卡片-0 列表-1 */
        selectedDisplay: 0,
        columns: [
          {
            dataIndex: 'title',
            title: '项目名称',
            default: true,
            width: 250,
            type: 'action',
          },
          {
            dataIndex: 'bidCityName',
            title: '所属城市',
          },
          {
            dataIndex: 'bidCompany',
            title: '采购单位',
          },
          {
            dataIndex: 'companyType',
            title: '单位类型',
          },

          {
            dataIndex: 'purchaseItemStr',
            title: '采购品目',
          },
          {
            dataIndex: 'bidProduct',
            title: '采购产品',
          },

          {
            dataIndex: 'bidPurchaseDate',
            title: '预计采购时间',
          },
          {
            dataIndex: 'bidPurchaseBudget',
            title: '预算（万元）',
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
          [{ label: '预计采购时间', field: 'purchaseTime' }],
        ]
        return spLayout
      },
      /**已选筛选数量 */
      resultNum() {
        return Object.values(this.screenResults).filter(item => item).length
      },
      unionRequestParams() {
        this.pageRequestParams.isNeedTop = this.pageRequestParams.searchKey
          ? 0
          : 1
        return Object.assign(
          {},
          this.commonRequestParams,
          this.pageRequestParams
        )
      },
      /**是否处于筛选状态 */
      isSearchStatus() {
        return !!(
          this.pageRequestParams.searchKey ||
          this.pageRequestParams.companyTypeIds ||
          this.pageRequestParams.cityId ||
          this.pageRequestParams.minPurchaseDate ||
          this.pageRequestParams.maxPurchaseDate
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
        const res = await getPurchaseList(this.unionRequestParams)
        if (res.code === '0') {
          if (this.unionRequestParams.searchKey) {
            const logRes = await addYqmmSearchLog({
              isHotSearch: res?.data?.list?.length ? true : false,
              searchClient: 1,
              searchKey: this.unionRequestParams.searchKey,
              searchPlatform: 8,
              searchType: 7,
            })
            if (logRes.code === '0') {
              this.$refs['YqmmproPageSearch'].updateSearchLog(this.searchType)
            }
          }
          if (res.data && res.data.list) {
            this.purchaseList = this.$lodash.cloneDeep(res.data.list)
            this.dataSource = res.data.list
            this.dataSource.map(item => {
              item.title = {
                key: 'title',
                label: replaceEmTag(item.bidName),
              }
              item.purchaseItemStr = item.purchaseItemStr
                ? item.purchaseItemStr.replaceAll('、', '，')
                : ''
              item.bidProduct = item.bidProduct
                ? item.bidProduct.replaceAll(';', '，')
                : ''
              item.bidCityName = item.bidCityName || item.bidProvinceName || ''
              let index = this.companyTypeDict.findIndex(
                e => e.id == item.companyType
              )
              item.companyType =
                index !== -1 ? this.companyTypeDict[index].name : ''
              return item
            })
            this.totalCount =
              res.data && res.data.totalCount ? res.data.totalCount : 0
          }
        }
        this.toggleMixinLoading(false)
      },
      /**执行顶部搜索*/
      onSearchConfrim() {
        this.commonRequestParams.pageNum = 1
        this.commonRequestParams.pageSize = 20
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
            this.pageRequestParams.companyTypeIds = selectedKeys.join(',')
            this.screenResults[type] = selectedItems
              .map(item => item.name)
              .join(',')
            break
          case 'city':
            this.pageRequestParams.cityId = selectedKeys.join(',')
            this.screenResults[type] = selectedItems
              .map(item => {
                if (item.check) {
                  return item.name
                } else {
                  return item.children.map(d => d.name).join(',')
                }
              })
              .join(',')
            break
          case 'purchaseTime':
            this.pageRequestParams.minPurchaseDate = selectedKeys[0]
            this.pageRequestParams.maxPurchaseDate = selectedKeys[1]
            this.screenResults[type] = selectedKeys.join(' 至 ')
            break
          default:
            break
        }
        this.commonRequestParams.pageNum = 1
        this.handleQuery()
      },
      /** 重置筛选面板 */
      handleSPReset(type) {
        this.commonRequestParams.pageNum = 1
        this.commonRequestParams.pageSize = 20
        if (!type) {
          // 重置所有
          for (let attr in this.screenResults) {
            this.$refs[attr].reset()
            this.screenResults[attr] = ''
          }
          this.pageRequestParams = Object.assign(this.pageRequestParams, {
            /**城市id */
            cityId: '',
            /**单位类型id */
            companyTypeIds: '',
            /**最小采购日期 */
            minPurchaseDate: '',
            /**最大采购日期 */
            maxPurchaseDate: '',
          })
        } else {
          this.$refs[type].reset()
          this.screenResults[type] = ''
          //重置某一项
          switch (type) {
            case 'companyType':
              this.pageRequestParams.companyTypeIds = ''
              break
            case 'city':
              this.pageRequestParams.cityId = ''
              break
            case 'purchaseTime':
              this.pageRequestParams.minPurchaseDate = ''
              this.pageRequestParams.maxPurchaseDate = ''

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
        this.commonRequestParams.pageNum = 1
        this.handleQuery()
      },
      /**页码变更 */
      handlePageNumChange(page, pageSize) {
        this.commonRequestParams.pageNum = page
        this.handleQuery()
      },
      /**每页数变更 */
      handlePageSizeChange(page, pageSize) {
        this.commonRequestParams.pageNum = 1
        this.commonRequestParams.pageSize = pageSize
        this.handleQuery()
      },
      // 表格操作
      handleRowClick(clickType, rowData, record) {
        if (clickType === 'action') {
          if (rowData.key === 'title') {
            this.$globalDrawer.show({
              component: PurchaseDetail,
              options: {
                name: 'PurchaseDetail',
                title: '采购意向详情',
                props: { id: record.tokenEncodeId },
              },
            })
          }
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .purchase-list-wrap {
    padding: 0 24px;
    background-color: #fff;
    border-radius: 4px 4px 0 0;

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

    .purchase-list {
      display: flex;
      flex-wrap: wrap;

      /deep/.purchase-panel {
        width: calc(50% - 8px) !important;
        &:nth-child(odd) {
          margin-right: 16px;
        }
        &:last-child,
        &:nth-last-child(2) {
          margin-bottom: 0;
        }
      }
    }
  }
</style>
