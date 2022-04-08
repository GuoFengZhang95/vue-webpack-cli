<template>
  <div class="img-con">
    <img
      v-if="cellData && cellData.hasOwnProperty('src') && cellData.src"
      :src="cellData.src || ''"
    />
    <img v-else :src="record.img.src || ''" />
  </div>
</template>

<script>
  export default {
    name: 'CellImg',
    props: {
      cellData: {
        type: [Object, Array, String],
        default: () => {},
      },
      record: {
        type: Object,
        default: () => {},
      },
    },
  }
</script>

<style lang="less" scoped>
  .img-con {
    display: inline-block;
    width: 40px;
    height: 40px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
