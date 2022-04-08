<template>
  <div id="ai">
    <!-- 先判断权益卡，在判断云蝠智能 -->
    <template v-if="authType === 1">
      <router-view
        v-if="yunfuLoginUrl"
        :src="yunfuTarget"
        :yunfu-login-url="yunfuLoginUrl"
      ></router-view>
      <AuthTips v-if="showAuthTips"></AuthTips>
    </template>
    <AdverDesc
      v-if="authType === 2"
      image="https://img.mumuxili.com/yqmm/pc/saas/images/huokezhongxin.jpg"
    ></AdverDesc>
  </div>
</template>

<script>
  import { equityAuthMix, yunfuMix } from '@/mixin'

  export default {
    name: 'AI',
    mixins: [equityAuthMix(), yunfuMix()],
  }
</script>

<style lang="less" scoped>
  /deep/.yqmmpro-adver-wrapper {
    .adver-wrapper {
      .button-wrapper {
        &.bottom {
          align-items: flex-start !important;
        }
      }
    }
  }
</style>
