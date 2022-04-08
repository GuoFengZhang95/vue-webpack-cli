<template>
  <div class="bottom-operatons-wrp">
    <div class="menu-icon-wrp center-flex">
      <a-popover title="表格间距" trigger="hover" placement="topLeft">
        <template slot="content">
          <div class="bottom-operations-popover">
            <p
              :class="tableSize === 'small' ? 'selected' : ''"
              @click="setTableTrHeight('small')"
            >
              <img src="@/assets/images/icon/line-compact.png" />
              紧凑
            </p>
            <p
              :class="tableSize === 'middle' ? 'selected' : ''"
              @click="setTableTrHeight('middle')"
            >
              <img src="@/assets/images/icon/line-comfortable.png" />
              舒适
            </p>
            <p
              :class="tableSize === 'default' ? 'selected' : ''"
              @click="setTableTrHeight('default')"
            >
              <img src="@/assets/images/icon/line-easy.png" />
              宽松
            </p>
          </div>
        </template>
        <span class="menu-icon center-flex">
          <a-icon type="menu"></a-icon>
        </span>
      </a-popover>
    </div>
    <a-pagination
      v-if="totalCount"
      :current="current"
      size="default"
      :total="totalCount"
      :show-size-changer="showSizeChanger"
      :show-quick-jumper="showQuickJumper"
      :page-size-options="['20', '30', '50']"
      :default-page-size="pageSize"
      :show-total="totalCount => `共 ${totalCount}条`"
      @change="change"
      @showSizeChange="showSizeChange"
    ></a-pagination>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'MuBottomOperations',
    props: {
      totalCount: {
        type: Number,
        default: 0,
      },
      current: {
        type: Number,
        default: 1,
      },
      showSizeChanger: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        defaultPageSize: this.pageSize,
      }
    },
    computed: {
      ...mapGetters(['pageSize', 'tableSize']),
      showQuickJumper() {
        return this.pageSize < this.totalCount
      },
    },
    methods: {
      // 设置表格行高度
      setTableTrHeight(type) {
        this.$store.dispatch('app/setTableSize', type)
      },
      // 页码改变
      change(page, pageSize) {
        this.$emit('tablePageChange', page, pageSize)
      },
      // pageSize 变化
      showSizeChange(current, size) {
        // this.$store.dispatch("app/setPageSize", size)
        this.$emit('tablePageSizeChange', current, size)
      },
    },
  }
</script>

<style lang="less" scoped>
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
      .menu-icon {
        width: 30px;
        height: 30px;
        border: 1px solid #ebebeb;
      }
    }
    ul.ant-pagination {
      margin-right: 16px;
    }
  }
</style>
<style lang="less">
  .bottom-operations-popover {
    p {
      cursor: pointer;
      &:hover,
      &.selected {
        color: #00c7db;
      }
      > img {
        margin: 0 10px 0 0;
      }
    }
  }
</style>
