<template>
  <div
    ref="yqmmproMiningDynamic"
    class="yqmmpro-mining-dynamic"
    @scroll="onScroll"
  >
    {{ $options.scrollTop }}
    <div ref="scrollContent" class="scroll-content">
      <MuPageHeader title="动态监控" :show-reload="false">
        <div class="setting">
          <!-- <span class="label">只看重要</span>
          <a-switch v-model="checked" @change="onChange" /> -->
          <a-button type="primary" @click="screenVisible = true">
            <i class="mmxlicon mi-filter"></i>
            <span>设置筛选</span>
          </a-button>
        </div>
      </MuPageHeader>
      <DynamicCard :dynamic-list="dynamicList"></DynamicCard>
      <!-- 缺省图 -->
      <DefaultArea
        :loading-status="loadingStatus"
        :default-img="require('@/assets/images/common/list-default.svg')"
      >
        <template #desc>
          <div class="defaultarea-slot-desc">
            更多动态请到
            <a-dropdown
              placement="topCenter"
              :trigger="['click']"
              overlay-class-name="dashboard-dropdown-menu"
            >
              <span class="mini-btn">小程序</span>
              <a-menu slot="overlay">
                <a-menu-item>
                  <img src="@/assets/images/common/dynamic-qrcode.png" alt="" />
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            关注更多企业或科研客户~
          </div>
        </template>
      </DefaultArea>
    </div>
    <DynamicScreen
      :visible.sync="screenVisible"
      :only-view="onlyView"
      :important-view="importantView"
      @confirm="handleConfirm"
    ></DynamicScreen>
  </div>
</template>

<script>
  import { loadingMix } from '@/mixin'
  import { getBusinessRemind } from '@/api/common'
  // import { getUserConfigInfo, updateUserConfigInfo } from '@/api/dashboard'
  const DynamicCard = () => import('./components/DynamicCard.vue')
  const DynamicScreen = () => import('./components/DynamicScreen.vue')
  export default {
    name: 'YqmmproMiningDynamic',
    components: {
      DynamicCard,
      DynamicScreen,
    },
    mixins: [loadingMix({ customListName: 'dynamicList' })],
    data() {
      return {
        /**筛选弹框 */
        screenVisible: false,
        /** 是否开启只看重要 */
        // checked: false,
        dynamicList: [],
        pageNum: 1,
        scrollContentHeight: 0,
        wrapperHeight: 0,
        onlyView: [
          {
            id: 1,
            name: '采购意向',
          },
          {
            id: 2,
            name: '重大商情',
          },
          {
            id: 3,
            name: '招投标',
          },
          {
            id: 4,
            name: '新立项',
          },
          {
            id: 5,
            name: '新获批',
          },
          {
            id: 6,
            name: '新学院',
          },
          {
            id: 7,
            name: '新中心',
          },
          {
            id: 8,
            name: '新校区',
          },
          {
            id: 9,
            name: '新校长',
          },
          {
            id: 10,
            name: '新名单',
          },
          {
            id: 11,
            name: '新基地',
          },
          {
            id: 12,
            name: '新研究院',
          },
          {
            id: 13,
            name: '新研发中心',
          },
          {
            id: 14,
            name: '即将结项项目课题',
          },
        ],
        importantView: [
          {
            id: 1,
            name: '普通提示',
          },
          {
            id: 2,
            name: '重要提示',
          },
          {
            id: 3,
            name: '紧急通知',
          },
        ],
      }
    },
    scrollOptions: {
      scrollTop: 0,
      /**触底阈值 */
      reachBottomDistance: 120,
      /** 是否属于触底范围 */
      isReachBottom: false,
      /**是否触底过 */
      hasReachBottom: false,
    },
    watch: {
      loadingStatus: {
        handler(newVal) {
          if (newVal !== 1) {
            this.$nextTick(() => {
              this.scrollContentHeight =
                this.$refs['scrollContent'].getBoundingClientRect().height
            })
          }
        },
        immediate: true,
      },
    },

    async mounted() {
      this.wrapperHeight =
        this.$refs['yqmmproMiningDynamic'].getBoundingClientRect().height
      // await this.getUserConfigInfo()
      this.getDynamicList({ init: true })
    },
    methods: {
      /** 滚动 */
      onScroll(e) {
        let scrollTop = e.srcElement.scrollTop
        this.$options.scrollOptions.scrollTop = scrollTop
        let currentBottomDistance =
          this.scrollContentHeight -
          this.wrapperHeight -
          this.$options.scrollOptions.scrollTop
        // 距离滚动到底部的距离
        this.$options.scrollOptions.isReachBottom =
          currentBottomDistance <=
          this.$options.scrollOptions.reachBottomDistance
        if (!this.$options.scrollOptions.isReachBottom) {
          this.$options.scrollOptions.hasReachBottom = false
        }
        if (
          this.$options.scrollOptions.isReachBottom &&
          !this.$options.scrollOptions.hasReachBottom
        ) {
          this.$options.scrollOptions.hasReachBottom = true
          this.onReachBottom()
        }
      },
      /**加载下一页 */
      onReachBottom() {
        this.getDynamicList()
      },
      /**获取配置信息 */
      // async getUserConfigInfo() {
      //   let res = await getUserConfigInfo()
      //   if (res.code === '0') {
      //     this.checked = res.data.businessRemindLevel == 1 ? true : false
      //   } else {
      //     this.checked = false
      //   }
      // },
      /**切换配置 */
      // async onChange(checked) {
      //   this.checked = checked
      //   this.pageNum = 1
      //   let updateRes = await updateUserConfigInfo({ type: 1, targetStatus: this.checked ? 1 : 0 })
      //   if (updateRes.code === '0') {
      //     this.getDynamicList({ init: true })
      //     // 切换后数据返回顶部
      //     let dynamicWrap = document.getElementsByClassName('yqmmpro-mining-dynamic')
      //     dynamicWrap[0].scrollTop = 0
      //     this.dynamicWrapTop = 0
      //   }
      // },
      async getDynamicList(opt) {
        this.toggleMixinLoading(true)
        if (opt?.init) {
          this.dynamicList = []
        } else {
          this.pageNum++
        }
        let res = await getBusinessRemind({
          pageNum: this.pageNum,
          pageSize: 15,
          isImportant: this.checked ? 1 : 0,
        })
        if (res.code === '0') {
          let dataList =
            res.data && res.data.list && res.data.list.length
              ? res.data.list.map(item => {
                  item.tag = item.tag == '项目到期' ? '项目即将结束' : item.tag
                  item.relationCompanyStr =
                    item.formatRelationCompany &&
                    Object.keys(item.formatRelationCompany).join('、')
                  item.relationContactStr =
                    item.formatRelationCustomer &&
                    Object.keys(item.formatRelationCustomer).join('、')
                  if (item.startTime) {
                    item.time = `${item.startTime
                      .slice(0, 7)
                      .replaceAll('-', '.')}${
                      item.endTime
                        ? '-' + item.endTime.slice(0, 7).replaceAll('-', '.')
                        : '-至今'
                    }`
                  }
                  if (item.formatDateTime.length > 5) {
                    const arr = item.formatDateTime.split('-')
                    item.formatDateTime = arr[0]
                    item.date = `${arr[1]}-${arr[2]}`
                  }
                  if (item.formatDateTime.includes(':')) {
                    item.dateType = 'day'
                  } else if (item.formatDateTime.includes('-')) {
                    item.dateType = 'month'
                  }
                  return item
                })
              : []
          let item = JSON.parse(JSON.stringify(dataList))

          this.dynamicList = [...this.dynamicList, ...item]
          if (opt?.init) {
            this.dynamicList = item
          } else {
            this.dynamicList.push(...item)
          }
        }
        this.toggleMixinLoading(false)
      },
      /**执行筛选 */
      handleConfirm(e) {
        console.log(e)
      },
    },
  }
</script>

<style lang="less" scoped>
  .yqmmpro-mining-dynamic {
    height: calc(100vh - 118px);
    background-color: white;
    overflow: hidden;
    overflow-y: scroll;
    border-radius: 4px 4px 0 0;

    .scroll-content {
    }

    .setting {
      // display: flex;
      // align-items: center;
      // justify-content: flex-start;
      .mmxlicon.mi-filter {
        margin-right: 4px;
      }
    }

    .defaultarea-slot-desc {
      .mini-btn {
        color: #00c7db;
        cursor: pointer;
      }
    }
  }
</style>
<style lang="less">
  .dashboard-dropdown-menu {
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
