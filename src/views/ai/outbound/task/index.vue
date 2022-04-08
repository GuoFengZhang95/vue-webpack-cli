<template>
  <div class="AI-outbound-task">
    <!-- 获客中心-AI外呼-外呼任务 -->
    <ai-frame src="https://robot.17m17.com/#/workbench/outbound"></ai-frame>
  </div>
</template>

<script>
  import AiFrame from '@/views/ai/components/AiFrame'
  export default {
    name: 'AIOutboundTask',
    components: {
      AiFrame,
    },
    mixins: [],
    created() {},
  }
</script>

<style lang="less" scoped></style>
