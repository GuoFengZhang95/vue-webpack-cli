<template>
  <div class="ai-frame">
    <iframe
      v-if="yunfuLoginUrl"
      :src="yunfuLoginUrl"
      frameborder="0"
      style="width: 0; height: 0"
    ></iframe>
    <iframe :src="src" class="main-iframe"></iframe>
  </div>
</template>

<script>
  export default {
    name: 'AiFrame',
    props: {
      src: {
        type: String,
        default: '',
      },
      yunfuLoginUrl: {
        type: String,
        default: '',
      },
    },
  }
</script>

<style lang="less" scoped>
  .ai-frame {
    .main-iframe {
      width: calc(100vw - 208px);
      height: calc(100vh - 118px);
    }
  }
</style>
