<template>
  <div class="unlock-times-statistics-wrp">
    <div class="title">解锁次数统计</div>
    <div class="times-list">
      <div v-for="(item, index) in unlockTimes" :key="index" class="times-item">
        <div class="times">{{ item.times }}</div>
        <div class="name">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getCompanyUnlockStat } from '@/api/dashboard'
  import { mapGetters } from 'vuex'
  export default {
    name: 'UnlockTimesStatistics',
    props: {},
    data() {
      return {
        unlockTimes: [
          {
            times: 0,
            title: '采购意向',
          },
          {
            times: 0,
            title: '标讯信息',
          },
          {
            times: 0,
            title: '需求信息',
          },
          {
            times: 0,
            title: '重大商情',
          },
          {
            times: 0,
            title: '科研用户',
          },
          {
            times: 0,
            title: '采购方分析',
          },
        ],
      }
    },
    computed: {
      ...mapGetters(['baseUserInfo']),
    },
    watch: {
      baseUserInfo: {
        handler(val) {
          if (val && val.authenticated === 1) {
            this.getCompanyUnlockStatistics()
          }
        },
        immediate: true,
      },
    },
    methods: {
      async getCompanyUnlockStatistics() {
        let res = await getCompanyUnlockStat()
        if (res.code === '0' && res.data) {
          this.unlockTimes[0].times = res.data.purchaseCount
            ? res.data.purchaseCount
            : 0
          this.unlockTimes[1].times = res.data.biddingCount
            ? res.data.biddingCount
            : 0
          this.unlockTimes[2].times = res.data.businessCount
            ? res.data.businessCount
            : 0
          this.unlockTimes[3].times = res.data.importantBusinessCount
            ? res.data.importantBusinessCount
            : 0
          this.unlockTimes[4].times = res.data.customerCount
            ? res.data.customerCount
            : 0
          this.unlockTimes[5].times = res.data.purchaseAnalysisCount
            ? res.data.purchaseAnalysisCount
            : 0
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .unlock-times-statistics-wrp {
    box-sizing: border-box;
    padding: 16px;
    width: 100%;
    min-width: 731px;
    height: 156px;
    margin-bottom: 10px;
    border-radius: 4px;
    background-color: #fff;

    .title {
      height: 22px;
      font-size: 18px;
      color: #333333;
      line-height: 22px;
    }

    .times-list {
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;

      .times-item {
        .times {
          width: 100%;
          height: 40px;
          font-size: 32px;
          font-weight: 500;
          color: #00c7db;
          line-height: 40px;
          word-break: break-all;
        }

        .name {
          height: 22px;
          font-size: 14px;
          color: #666666;
          line-height: 22px;
        }
      }
    }
  }
</style>
