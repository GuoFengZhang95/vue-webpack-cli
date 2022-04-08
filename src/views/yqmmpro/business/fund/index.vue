<template>
  <div v-if="power" class="yqmmpro-business-fund">
    <template v-if="power !== 2">
      <MuTab
        class="service-tab"
        :tab-list="tabList"
        :active-key="activeKey"
        @handleTabChange="handleTabChange"
      ></MuTab>
      <template v-if="tabList.length === 2">
        <FundTable v-show="activeKey === 0" keys="mine"></FundTable>
        <FundTable
          v-show="activeKey === 1 && power === 1"
          keys="all"
        ></FundTable>
      </template>
      <template v-else>
        <FundTable keys="mine"></FundTable>
      </template>
    </template>
    <template v-else>
      <auth-tips></auth-tips>
    </template>
  </div>
</template>

<script>
  import { yqmmBusinessMix } from '@/mixin/index'
  import FundTable from './components/FundTable'

  export default {
    name: 'YqmmproBusinessFund',
    components: {
      FundTable,
    },
    mixins: [yqmmBusinessMix({ moduleId: 3 })],
  }
</script>

<style lang="less" scoped>
  .yqmmpro-business-fund {
    .mumu-tabs {
      height: 57px;
    }
  }
</style>
