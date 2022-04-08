<template>
  <div class="column-title">
    <a-tooltip placement="topLeft">
      <template #title>{{ column.title }}</template>
      <div class="ellipsis">{{ column.title }}</div>
    </a-tooltip>
    <a-tooltip placement="topLeft">
      <template #title>{{ column.tips || column.msg }}</template>
      <img
        v-if="column.tips || column.msg"
        src="@/assets/images/icon/info-cirlce.svg"
        class="tips"
      />
    </a-tooltip>
  </div>
</template>

<script>
  export default {
    name: 'ColumnTitle',
    props: {
      column: {
        type: Object,
        default: () => {},
      },
    },
  }
</script>

<style lang="less" scoped>
  .column-title {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    .tips {
      cursor: pointer;
      margin-left: 8px;
    }
  }
  .ellipsis {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 5px;
  }
</style>
