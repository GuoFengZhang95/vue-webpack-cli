<template>
  <div class="yqmmpro-customer-company">
    <!-- 情报中心-客户信息库-company -->
    <ai-frame
      v-if="yunfuTarget || yunfuLoginUrl"
      :src="yunfuTarget"
      :yunfu-login-url="yunfuLoginUrl"
    ></ai-frame>
    <AuthTips v-if="showAuthTips"></AuthTips>
  </div>
</template>

<script>
  import { yunfuMix } from '@/mixin'
  export default {
    name: 'YqmmproCustomercompany',
    mixins: [yunfuMix({ target: 'https://robot.17m17.com/#/clue/clue-b' })],
  }
</script>

<style lang="less" scoped></style>
