<template>
  <div class="pagition-act">
    <span v-if="isShowTotal">共{{ totalCount }}条</span>
    <a-pagination
      show-size-changer
      show-quick-jumper
      :current="page"
      :total="renderTotal"
      :page-size="pageSize"
      :page-size-options="pageSizeOptions"
      @change="pageChange"
      @showSizeChange="pageSizeChange"
    ></a-pagination>
  </div>
</template>

<script>
  export default {
    name: 'MuPagination',
    props: {
      page: {
        //当前页
        type: Number,
        default: () => 1,
      },
      pageSize: {
        //单页展示数据数
        type: Number,
        default: 20,
      },
      pageSizeOptions: {
        //每页条数配置
        type: Array,
        default: () => ['20', '30', '50'],
      },
      total: {
        // 数据总数
        type: Number,
        default: 0,
      },
      isShowTotal: {
        // 是否展示总共多少条
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        renderTotal: 0,
      }
    },
    computed: {
      totalCount() {
        return this.total < this.renderTotal ? this.total : this.renderTotal
      },
    },
    watch: {
      total: {
        handler() {
          this.handleTotal()
        },
        immediate: true,
      },
      pageSize: {
        handler() {
          this.handleTotal()
        },
        immediate: true,
      },
    },
    methods: {
      // 当前页数变更
      pageChange(page, pageSize) {
        this.$emit('pageChange', page, pageSize)
      },
      // 每页条数变更
      pageSizeChange(page, pageSize) {
        this.$emit('pageSizeChange', page, pageSize)
      },
      // 处理total数据超5000的情况
      handleTotal() {
        if (this.total != undefined && this.pageSize != undefined) {
          let all = this.total > 5000 ? 5000 : this.total
          let count1 = Math.ceil(all / this.pageSize)
          let count2 = Math.floor(all / this.pageSize)
          this.renderTotal =
            this.pageSize * count1 > 5000
              ? this.pageSize * count2
              : this.pageSize * count1 > this.total
              ? this.total
              : this.pageSize * count1
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .pagition-act {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 14px;
    padding: 10px 0;
    > span {
      font-size: 14px;
      margin-right: 8px;
    }
    /deep/ .ant-pagination-item-active a {
      color: white;
      background: #00c7db;
    }
  }
</style>
