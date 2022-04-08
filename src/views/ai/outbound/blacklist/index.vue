<template>
  <div class="AI-outbound-blacklist">
    <!-- 获客中心-AI外呼-黑名单 -->
    <ai-frame src="https://robot.17m17.com/#/workbench/blacklist"></ai-frame>
  </div>
</template>

<script>
  import AiFrame from '@/views/ai/components/AiFrame'
  export default {
    name: 'AIOutboundBlacklist',
    components: {
      AiFrame,
    },
    mixins: [],
    created() {},
  }
</script>

<style lang="less" scoped></style>
