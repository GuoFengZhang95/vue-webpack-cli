<template>
  <div v-if="power" class="order">
    <template v-if="power != 2">
      <div>
        <MuTab
          class="service-tab"
          :tab-list="tabList"
          :active-key="activeKey"
          @handleTabChange="handleTabChange"
        ></MuTab>
        <template v-if="tabList.length === 2">
          <OrderTable v-show="activeKey === 0" keys="mine"></OrderTable>
          <OrderTable
            v-show="activeKey === 1 && power === 1"
            keys="all"
          ></OrderTable>
        </template>
        <template v-else>
          <OrderTable keys="mine"></OrderTable>
        </template>
      </div>
    </template>
    <template v-else>
      <auth-tips></auth-tips>
    </template>
  </div>
</template>

<script>
  import OrderTable from './components/OrderTable'
  import { getCountryList } from '@/api/dictionary'
  import { yqmmBusinessMix } from '@/mixin/index'
  export default {
    name: 'OrderList',
    components: {
      OrderTable,
    },
    mixins: [yqmmBusinessMix({ moduleId: 5 })],
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
  .order {
    .mumu-tabs {
      height: 57px;
    }
  }
</style>
