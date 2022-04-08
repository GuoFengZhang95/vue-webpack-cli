<template>
  <div id="yqmmpro">
    <router-view v-if="authType === 1"></router-view>
    <AdverDesc
      v-if="authType === 2"
      image="https://img.mumuxili.com/yqmm/pc/saas/images/qingbaozhongxin.jpg"
    ></AdverDesc>
  </div>
</template>

<script>
  import { equityAuthMix } from '@/mixin'
  export default {
    name: 'Yqmmpro',
    mixins: [equityAuthMix()],
    mounted() {
      this.getDicts()
    },
    methods: {
      getDicts() {
        this.$store.dispatch('dictionary/getTargetDicts', [
          'getCompanyType',
          'getCity',
          'getBidType',
          'getTitle',
          'getAdminiPost',
        ])
      },
    },
  }
</script>

<style lang="less" scoped>
  #yqmmpro {
    .content {
      padding: 16px;
    }
  }
</style>
