<template>
  <div v-if="power" class="purchase">
    <template v-if="power != 2">
      <MuTab
        :tab-list="tabList"
        :active-key="activeKey"
        @handleTabChange="handleTabChange"
      ></MuTab>
      <template v-if="tabList.length === 2">
        <purchase-table v-show="activeKey === 0" keys="mine"></purchase-table>
        <purchase-table
          v-show="activeKey === 1 && power === 1"
          keys="all"
        ></purchase-table>
      </template>
      <template v-else>
        <purchase-table keys="mine"></purchase-table>
      </template>
    </template>
    <template v-else>
      <auth-tips></auth-tips>
    </template>
  </div>
</template>

<script>
  import PurchaseTable from './components/PurchaseTable'
  import { getCountryList } from '@/api/dictionary'
  import { yqmmBusinessMix } from '@/mixin/index'
  export default {
    name: 'Purchase',
    components: {
      PurchaseTable,
    },
    mixins: [yqmmBusinessMix({ moduleId: 2 })],
    data() {
      return {}
    },
    mounted() {
      getCountryList({}).then(res => {
        localStorage.setItem('tablebCity', JSON.stringify(res.data))
      })
    },
  }
</script>

<style lang="less" scoped>
  .purchase {
    .mumu-tabs {
      height: 57px;
    }
  }
</style>
