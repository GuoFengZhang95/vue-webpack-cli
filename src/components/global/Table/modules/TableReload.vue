<template>
  <a-button icon="redo" type="link" class="default-act" @click="reloadTable">
    刷新
  </a-button>
</template>

<script>
  export default {
    name: 'TableReload',
    methods: {
      reloadTable() {
        this.$emit('reloadTable')
      },
    },
  }
</script>

<style lang="scss" scoped></style>
