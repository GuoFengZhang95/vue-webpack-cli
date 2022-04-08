<template>
  <div class="purchase-subscription">
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
      <template #subscription>
        <OnceFilter
          ref="subscription"
          :list="subscriptionTypeList"
          @change="handleSPChange($event, 'subscription')"
        ></OnceFilter>
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
          label="订阅项"
          :value="screenResults.subscription"
          @delete="handleSPReset('subscription')"
        ></ResultItem>
      </template>
      >
    </ScreenPanel>
    <MuDivid></MuDivid>
    <div class="search-result">
      <result-switch
        :is-search="isSearchStatus"
        :total="total"
        :is-display-switch-show="false"
        :selected-display="0"
        :columns="columns"
        @setTableHeader="setTableHeader"
        @dragTableHeaderOver="dragTableHeaderOver"
        @handleDisplayChange="e => (selectedDisplay = e)"
      ></result-switch>
      <!-- 采购意向搜索结果展示 -->
      <!-- 卡片 -->
      <template v-if="selectedDisplay == 0">
        <template v-if="loadingStatus === 3">
          <div class="purchase-list">
            <PurchaseCard
              v-for="item in purchaseList"
              :key="item.itemId"
              :render-item="item"
              :deal-read="true"
              :high-light="true"
            ></PurchaseCard>
          </div>
          <MuPagination
            :page="commonRequestParams.pageNum"
            :page-size="commonRequestParams.pageSize"
            :total="total"
            @pageChange="handlePageNumChange"
            @pageSizeChange="handlePageSizeChange"
          ></MuPagination>
        </template>
        <DefaultArea
          :loading-status="loadingStatus"
          :default-img="require('@/assets/images/common/list-default.svg')"
        >
          <template #desc>
            <div class="defaultarea-slot-desc">
              更多订阅内容请到
              <a-dropdown
                placement="topCenter"
                :trigger="['click']"
                overlay-class-name="purchase-dropdown-menu"
              >
                <span class="mini-btn">小程序</span>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <img
                      src="@/assets/images/common/subscription-purchase-qrcode.png"
                      alt=""
                    />
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
              添加更多关键词~
            </div>
          </template>
        </DefaultArea>
      </template>
      <!-- 列表 -->
      <MuTable
        v-else
        ref="mumuTable"
        :has-index="true"
        :page="commonRequestParams.pageNum"
        :page-size="commonRequestParams.pageSize"
        :total="total"
        :columns="columns"
        :data-source="dataSource"
        :resize-height-offset="210"
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
  import { mapGetters } from 'vuex'
  import { replaceEmTag } from '@/utils/index'
  import { getPurchaseSubscriptionList } from '@/api/yqmmPro/subscription'
  const PurchaseDetail = () => import('../../../components/PurchaseDetail.vue')
  const PurchaseCard = () => import('../../../components/PurchaseCard.vue')
  const ResultSwitch = () => import('../../../components/ResultSwitch.vue')
  const ScreenPanel = () => import('../../../components/ScreenPanel/index.vue')
  const DoubleFilter = () =>
    import('../../../components/ScreenPanel/DoubleFilter.vue')
  const OnceFilter = () =>
    import('../../../components/ScreenPanel/OnceFilter.vue')
  const ResultItem = () =>
    import('../../../components/ScreenPanel/ResultItem.vue')
  export default {
    name: 'PurchaseSubscription',
    components: {
      PurchaseCard,
      ResultSwitch,
      ScreenPanel,
      DoubleFilter,
      OnceFilter,
      ResultItem,
    },
    mixins: [tableMix, loadingMix()],
    props: {
      isExpanded: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        total: 0,
        /** 展示方式 卡片-0 列表-1 */
        selectedDisplay: 0,
        purchaseList: [],
        /**已选条件 */
        screenResults: {
          companyType: '',
          city: '',
          subscription: '',
        },
        /**表格公共入参 */
        commonRequestParams: {
          /**页码 */
          pageNum: 1,
          /**每页数 */
          pageSize: 20,
        },
        /**页面特有的列表入参 */
        pageRequestParams: {
          cityId: '',
          companyTypeIds: '',
          subscriptionId: '',
        },
        /**订阅项 */
        subscriptionTypeList: [],
        columns: [
          {
            dataIndex: 'title',
            title: '项目名称',
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
      ...mapGetters(['companyTypeDict', 'cityDict']),
      // 筛选面板数据
      spLayout() {
        let spLayout = [
          [{ label: '单位类型', field: 'companyType' }],
          [{ label: '城市', field: 'city' }],
        ]
        if (this.subscriptionTypeList.length) {
          spLayout.push([{ label: '订阅项', field: 'subscription' }])
        }
        return spLayout
      },
      /**已选筛选数量 */
      resultNum() {
        const num = Object.values(this.screenResults).filter(item => item).length
        this.$emit('update:resultNum', num)
        return num
      },
      unionRequestParams() {
        return Object.assign({}, this.commonRequestParams, this.pageRequestParams)
      },
      /**是否处于筛选状态 */
      isSearchStatus() {
        return !!(
          this.pageRequestParams.cityId ||
          this.pageRequestParams.companyTypeIds ||
          this.pageRequestParams.subscriptionId
        )
      },
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.handleQuery({ init: true })
      },
      async handleQuery(opt) {
        this.toggleMixinLoading(true)
        let res = await getPurchaseSubscriptionList(this.unionRequestParams)
        if (res.code === '0') {
          this.purchaseList = this.$lodash.cloneDeep(res.data.list)
          this.dataSource = this.$lodash.cloneDeep(res.data.list)
          this.dataSource.map(item => {
            item.title = {
              key: 'title',
              label: replaceEmTag(item.title),
            }
            item.bidCityName = item.bidCityName || item.bidProvinceName || ''
            let index = this.companyTypeDict.findIndex(
              e => e.id == item.companyType
            )
            item.companyType =
              index !== -1 ? this.companyTypeDict[index].name : ''
            return item
          })
          this.total = res.data.totalCount
          if (opt?.init) {
            if (res.data?.searchList?.purchaseSubscriptionItem?.length) {
              this.subscriptionTypeList =
                res.data?.searchList?.purchaseSubscriptionItem.slice(0, 60)
            }
          }
        }
        this.toggleMixinLoading(false)
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
          case 'subscription':
            this.pageRequestParams.subscriptionId = selectedKeys.join(',')
            this.screenResults[type] = selectedItems
              .map(item => item.name)
              .join(',')
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
            cityId: '',
            companyTypeIds: '',
            subscriptionId: '',
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
            case 'subscription':
              this.pageRequestParams.subscriptionId = ''
              break
            default:
              break
          }
        }
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
  .purchase-subscription {
    position: relative;
    background: #ebebeb;

    .search-result {
      padding: 0 24px;
      background-color: #fff;
      border-radius: 4px;

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

      .defaultarea-slot-desc {
        .mini-btn {
          color: #00c7db;
          cursor: pointer;
        }
      }
    }
  }
</style>

<style lang="less">
  .purchase-dropdown-menu {
    .ant-dropdown-menu {
      padding: 0;
      .ant-dropdown-menu-item {
        padding: 15px;
        img {
          width: 150px;
          height: 150px;
        }
      }
    }
  }
</style>
