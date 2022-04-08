<template>
  <div class="status-con">
    <span v-if="cellData.status == ''">-</span>
    <span v-else :class="cellData.status">{{ cellData.label }}</span>
  </div>
</template>

<script>
  export default {
    name: 'CellStatus',
    props: {
      cellData: {
        type: [Object, Array],
        default: () => {},
      },
    },
  }
</script>

<style lang="less" scoped>
  .status-con {
    display: flex;
    .success,
    .error,
    .warning,
    .defaults {
      cursor: pointer;
      position: relative;
      &::before {
        margin-right: 5px;
        transform: translateY(-50%);
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #52c41a;
      }
    }
    .warning {
      &::before {
        background-color: #ffbf00;
      }
    }
    .error {
      &::before {
        background-color: #ff4433;
      }
    }
    .defaults {
      &::before {
        background-color: #52c41a;
      }
    }
  }
</style>
