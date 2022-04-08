<template>
  <div class="table-filter sort-filter mb10">
    <a-row>
      <a-col :span="24" class="sort-btn" @click="beforeFilter('ascend')">
        <span :class="type == 'ascend' ? 'active' : ''">
          <span
            :class="type !== 'ascend' ? 'icon-box-up' : 'icon-box-up-active'"
            class="icon-common-item"
          ></span>
          升序A to Z
        </span>
      </a-col>
      <a-col :span="24" class="sort-btn" @click="beforeFilter('descend')">
        <span :class="type == 'descend' ? 'active' : ''">
          <span
            :class="
              type !== 'descend' ? 'icon-box-down' : 'icon-box-down-active'
            "
            class="icon-common-item"
          ></span>
          降序Z to A
        </span>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  export default {
    name: 'SortFilter',
    // props: ["dataIndex"],
    props: {
      column: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        type: '',
      }
    },
    methods: {
      beforeFilter(type) {
        this.type = this.type == type ? '' : type
        this.$emit('beforeFilter', {
          sort: {
            dataIndex: this.column.filterKey,
            type: this.type,
            filterKey: `${this.column.filterKey}SortData`, //处理不同排序在同一页面使用问题 （键名 = 表头key值 + SortData）
            filterObj: {
              shortValue: this.type == 'ascend' ? 'asc' : 'desc',
              value: this.type,
              type: this.type,
              filtered: this.type == '' ? 0 : 1,
            },
            filtered: this.type == '' ? 0 : 1,
          },
        })
      },
      // 数据重置
      reset() {
        this.type = ''
        this.$emit('beforeFilter', {
          sort: {
            dataIndex: this.column.filterKey,
            type: '',
            filterKey: `${this.column.filterKey}SortData`,
            filterObj: {
              value: '',
              type: '',
              filtered: this.type == '' ? 0 : 1,
            },
            filtered: this.type == '' ? 0 : 1,
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .sort-btn {
    cursor: pointer;
    line-height: 40px;
    height: 40px;
    border-bottom: 1px #e9e9e9 solid;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    &:hover {
      color: #0cc;
      background: #f9f9f9;
      .icon-box-up {
        background: url(../icon/icon-up-active.png);
      }
      .icon-box-down {
        background: url(../icon/icon-down-active.png);
      }
    }
    .icon-common-item {
      display: inline-block;
      height: 12px;
      width: 14px;
    }
    .icon-box-up {
      background: url(../icon/icon-up.png);
    }
    .icon-box-up-active {
      background: url(../icon/icon-up-active.png);
    }
    .icon-box-down {
      background: url(../icon/icon-down.png);
    }
    .icon-box-down-active {
      background: url(../icon/icon-down-active.png);
    }
  }

  .active {
    color: #0cc;
  }
  :first-child {
    margin-right: 5px;
  }
</style>
