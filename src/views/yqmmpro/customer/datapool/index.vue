<template>
  <div class="yqmmpro-customer-datapool">
    <!-- 情报中心-客户信息库-数据公海 -->
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
    name: 'YqmmproCustomerDatapool',
    mixins: [yunfuMix({ target: 'https://robot.17m17.com/#/pool/data' })],
  }
</script>

<style lang="less" scoped></style>
