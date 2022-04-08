<template>
  <div class="pagition plr20 mt15">
    <a-popover title="表格间距" trigger="hover" placement="topLeft">
      <template slot="content">
        <div class="pagition-config">
          <p
            :class="size === 'small' ? 'selected' : ''"
            @click="size = 'small'"
          >
            <img src="../icon/line-compact.png" />
            紧凑
          </p>
          <p
            :class="size === 'middle' ? 'selected' : ''"
            @click="size = 'middle'"
          >
            <img src="../icon/line-comfortable.png" />
            舒适
          </p>
          <p
            :class="size === 'default' ? 'selected' : ''"
            @click="size = 'default'"
          >
            <img src="../icon/line-easy.png" />
            宽松
          </p>
        </div>
      </template>
      <span class="menu-icon center-flex">
        <a-icon type="menu"></a-icon>
      </span>
    </a-popover>
    <div class="pagition-act">
      <span>共{{ total }}条</span>
      <a-pagination
        show-size-changer
        show-quick-jumper
        :current="page"
        :total="total"
        :page-size="pageSize"
        :page-size-options="pageSizeOptions"
        @change="pageChange"
        @showSizeChange="pageSizeChange"
      ></a-pagination>
    </div>
  </div>
</template>

<!-- eslint-disable -->
<script>
  export default {
    name: 'TableFooter',
    props: {
      total: {
        type: Number,
      },
      page: {
        type: Number,
      },
      pageSize: {
        type: Number,
      },
      pageSizeOptions: {
        type: Array,
      },
    },
    data() {
      return {
        size: 'middle',
      }
    },
    methods: {
      //   设置样式
      setTableSize(size) {
        this.$emit('setTableSize', size)
      },
      // 每页展示数据条数
      pageSizeChange(current, pageSize) {
        console.log(`current page: ${current} pageSize:${pageSize}`)
        this.$emit('pageSizeChange', current, pageSize)
      },
      // 页码变更
      pageChange(current, pageSize) {
        console.log(`current page: ${current} pageSize:${pageSize}`)
        this.$emit('pageChange', current, pageSize)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .pagition {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .bottom-operatons-wrp {
      height: 52px;
      box-sizing: border-box;
      background: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .menu-icon-wrp {
        margin-left: 12px;
        width: 52px;
        height: 40px;
        cursor: pointer;
      }
    }
    .menu-icon {
      width: 30px;
      height: 30px;
      border: 1px solid #ebebeb;
      text-align: center;
      line-height: 30px;
    }
    .pagition-act {
      position: relative;
      display: flex;
      align-items: center;
      font-size: 14px;
      span {
        font-size: 14px;
        margin-right: 8px;
      }
    }
  }
</style>
