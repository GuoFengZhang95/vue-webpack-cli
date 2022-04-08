<template>
  <div class="table-filter">
    <!-- <h3>日期筛选 传入参数SingleMonth</h3> -->
    <p class="filetr-head">
      <img src="../icon/filter.png" alt="" class="icon-img" />
      筛选
    </p>
    <div id="singleMonthBox" class="picker-box">
      <a-range-picker
        ref="panel-picker"
        format="YYYY-MM"
        :get-calendar-container="triggerNode => triggerNode.parentNode"
        :placeholder="['开始时间', '结束时间']"
        separator="-"
        :mode="['month', 'month']"
        class="date-filter"
        :value="dateString"
        @panelChange="dateFilter"
      >
        <template slot="suffixIcon">
          <img src="../icon/Shape.png" alt="" />
        </template>
        <template slot="renderExtraFooter">
          <button class="sure" @click="closePanel">确定</button>
        </template>
      </a-range-picker>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  export default {
    name: 'SingleMonthFilter',
    props: {
      column: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        dateString: [null, null],
        dateValue: [null, null],
      }
    },
    //filtered:(this.dateString.length == 0 || !this.dateString[0]) == 解决选择日期后 点击清空再次确定查询 按钮颜色不置灰问题（未更换，公共组件问题）
    watch: {
      dateValue: {
        immediate: true,
        deep: true,
        handler(val) {
          this.$emit('beforeFilter', {
            date: {
              dataIndex: this.column.dataIndex,
              filterKey: this.column.filterKey,
              filterObj: {
                value: val,
                filtered: !this.dateValue.length || !this.dateValue[0] ? 0 : 1,
              },
              filtered: !this.dateValue.length || !this.dateValue[0] ? 0 : 1,
            },
          })
        },
      },
    },
    mounted() {},
    methods: {
      moment,
      getCalendarContainer() {
        return document.getElementById('singleMonthBox')
      },
      dateFilter(value) {
        this.dateString = [value[0], value[1]]
        this.dateValue = [
          value[0].format('YYYY-MM'),
          value[1].format('YYYY-MM'),
        ]
      },
      closePanel(e) {
        this.$refs['panel-picker'].$refs.picker.sOpen = false
      },
      // 数据重置
      reset() {
        this.dateString = [null, null]
        this.dateValue = []
        this.$emit('beforeFilter', {
          date: {
            dataIndex: this.column.dataIndex,
            filterKey: this.column.filterKey,
            filterObj: {
              value: [],
              filtered: this.dateValue.length == 0 ? 0 : 1,
            },
            filtered: this.dateValue.length == 0 ? 0 : 1,
          },
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .table-filter {
    .filetr-head {
      font-size: 14px;
      color: #666;
    }
    .icon-img {
      vertical-align: -2px;
      margin-right: 5px;
    }
    // :first-child{
    //   margin-right: 5px;
    // }
    .picker-box {
      padding: 10px;
      background-color: #f9f9f9;
    }
    /deep/.ant-calendar-footer-extra {
      float: right;
      .sure {
        position: relative;
        display: inline-block;
        font-weight: 400;
        white-space: nowrap;
        border: 1px solid transparent;
        box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        height: 32px;
        padding: 0 15px;
        color: #fff;
        background-color: #00c7db;
        border-color: #00c7db;
        // text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
        // box-shadow: 0 2px 0 rgb(0 0 0 / 5%);
        height: 24px;
        padding: 0 7px;
        font-size: 14px;
        border-radius: 4px;
        line-height: 22px;
      }
    }
  }
</style>
