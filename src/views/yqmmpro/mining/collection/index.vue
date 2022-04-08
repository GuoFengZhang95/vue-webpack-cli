<template>
  <div class="yqmmpro-mining-collection">
    <MuTab
      :tab-list="tabList"
      :active-key="activeKey"
      @handleTabChange="handleTabChange"
    ></MuTab>
    <div class="collection-container">
      <template v-if="loadingStatus === 3">
        <!-- 采购意向 -->
        <template v-if="activeKey == 11">
          <div class="purchase-list">
            <PurchaseCard
              v-for="item in dataSource"
              :key="item.itemId"
              :render-item="item"
            ></PurchaseCard>
          </div>
        </template>
        <!-- 重大商情 -->
        <template v-if="activeKey == 1">
          <div class="news-list">
            <NewsCard
              v-for="item in dataSource"
              :key="item.objectId"
              :item="item"
            ></NewsCard>
          </div>
        </template>
        <!-- 基金课题 -->
        <template v-if="activeKey == 13">
          <div class="fund-list">
            <FundCard
              v-for="item in dataSource"
              :key="item.objectId"
              :info="item"
            ></FundCard>
          </div>
        </template>
        <!-- 科研客户 -->
        <template v-if="activeKey == 12">
          <div class="researcher-list">
            <ResearcherCard
              v-for="item in dataSource"
              :key="item.objectId"
              :item="item"
            ></ResearcherCard>
          </div>
        </template>
        <!-- 招投标 -->
        <template v-if="activeKey == 10">
          <div class="bid-list">
            <BidCard
              v-for="item in dataSource"
              :key="item.objectId"
              :render-item="item"
            ></BidCard>
          </div>
        </template>
        <MuPagination
          :page="pageNum"
          :page-size="pageSize"
          :total="total"
          @pageChange="handlePageNumChange"
          @pageSizeChange="handlePageSizeChange"
        ></MuPagination>
      </template>
    </div>
    <DefaultArea
      :loading-status="loadingStatus"
      desc="暂无收藏"
      :links="links"
      @handleLinksClick="handleLinksClick"
    ></DefaultArea>
  </div>
</template>

<script>
  import { loadingMix } from '@/mixin'
  import { getMyCollection } from '@/api/yqmmPro/collection'
  const PurchaseCard = () => import('../../components/PurchaseCard.vue')
  const NewsCard = () => import('../../components/NewsCard.vue')
  const FundCard = () => import('../../components/FundCard.vue')
  const ResearcherCard = () => import('../../components/ResearcherCard.vue')
  const BidCard = () => import('../../components/BidCard.vue')
  export default {
    name: 'YqmmproMiningCollection',
    components: {
      BidCard,
      NewsCard,
      PurchaseCard,
      FundCard,
      ResearcherCard,
    },
    mixins: [loadingMix()],
    data() {
      return {
        tabList: [
          {
            value: 11,
            label: '采购意向',
            path: '',
          },
          {
            value: 1,
            label: '重大商情',
          },
          {
            value: 13,
            label: '基金课题',
          },
          {
            value: 12,
            label: '科研客户',
          },
          {
            value: 10,
            label: '招投标',
          },
        ],
        links: [
          {
            label: '采购意向',
            name: 'YqmmproProjectPurchase',
          },
          {
            label: '重大商情',
            name: 'YqmmproProjectMajor',
          },
          {
            label: '基金课题',
            name: 'YqmmproProjectFund',
          },
          {
            label: '科研客户',
            name: 'YqmmproCustomerResearcher',
          },
          {
            label: '招投标',
            name: 'YqmmproProjectBid',
          },
        ],
        activeKey: 11,
        dataSource: [],
        pageNum: 1,
        pageSize: 20,
        total: 0,
      }
    },
    mounted() {
      this.activeKey = this.tabList[0].value
      this.getMyCollection()
    },
    methods: {
      async getMyCollection() {
        this.toggleMixinLoading(true)
        let params = {
          pno: this.pageNum,
          perpage: this.pageSize,
          moduleType: this.activeKey,
        }
        let res = await getMyCollection(params)
        if (res.success) {
          this.total = res.totalCount
          this.dataSource = this.filterData(this.activeKey, res.data)
        } else {
          this.total = 0
          this.dataSource = []
        }
        this.toggleMixinLoading(false)
      },
      handleTabChange(e) {
        this.activeKey = e.value
        this.pageNum = 1
        this.pageSize = 20
        this.dataSource = []
        this.$nextTick(() => {
          this.getMyCollection()
        })
      },
      handlePageNumChange(page, pageSize) {
        this.pageNum = page
        this.getMyCollection()
      },
      handlePageSizeChange(page, pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.getMyCollection()
      },
      /**处理特殊格式 */
      filterData(activeKey, source) {
        if (activeKey === 12) {
          // 科研客户数据格式需要单独转换
          source = source.map(item => {
            return {
              atp: item.customerAtp,
              city: item.cityName,
              customerId: item.customerId,
              school: item.schoolName,
              depart: item.collegeName,
              headerImageUrl: item.customerHeadUrl,
              isConceal: 2,
              name: item.customerName,
              researchDirections: item?.customerReaches.split(';') ?? [],
              sex: item.sex,
              title: item.customerTitle,
            }
          })
        }
        return source
      },
      handleLinksClick({ name }) {
        this.$router.push({
          name,
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .yqmmpro-mining-collection {
    border-radius: 4px 4px 0 0;
    overflow: hidden;
    background-color: #ffffff;

    .collection-container {
      padding: 0 24px;

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

      .news-list {
        .container {
          &:nth-last-child(1) {
            margin-bottom: 0;
          }
        }
      }

      .researcher-list {
        display: flex;
        flex-wrap: wrap;

        /deep/.card-researcher-wrp {
          width: calc(33.33% - 11px) !important;
          margin-right: 16px;
          margin-bottom: 16px;

          &:nth-child(3n) {
            margin-right: 0;
          }

          &:last-child,
          &:nth-last-child(2),
          &:nth-last-child(3) {
            margin-bottom: 0;
          }
        }
      }

      .bid-list {
        .bid-panel {
          margin-bottom: 16px;
          &:nth-last-child(1) {
            margin-bottom: 0;
          }
        }
      }
    }
  }
</style>
