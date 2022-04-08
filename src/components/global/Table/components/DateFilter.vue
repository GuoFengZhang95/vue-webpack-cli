<template>
  <div class="table-filter">
    <!-- <h3>日期+时间筛选</h3> -->
    <p class="filetr-head">
      <img src="../icon/filter.png" alt="" class="icon-img" />
      筛选
    </p>
    <div id="pickerBox" class="picker-box">
      <a-range-picker
        :format="column.format || 'YYYY-MM-DD HH:mm:ss'"
        :get-calendar-container="triggerNode => triggerNode.parentNode"
        :show-time="{
          hideDisabledOptions: false,
          defaultValue: [
            moment('00:00:00', 'HH:mm:ss'),
            moment('23:59:59', 'HH:mm:ss'),
          ],
        }"
        :placeholder="['开始时间', '结束时间']"
        separator="-"
        class="date-filter"
        :value="dateString"
        @change="dateFilter"
      >
        <template slot="suffixIcon">
          <img src="../icon/Shape.png" alt="" />
        </template>
      </a-range-picker>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  export default {
    name: 'DateFilter',
    props: {
      column: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        dateString: [null, null],
        startValue: null,
        endValue: null,
        endOpen: false,
      }
    },
    //filtered:(this.dateString.length == 0 || !this.dateString[0]) == 解决选择日期后 点击清空再次确定查询 按钮颜色不置灰问题（未更换，公共组件问题）
    watch: {
      dateString: {
        handler(val) {
          this.$emit('beforeFilter', {
            date: {
              dataIndex: this.column.dataIndex,
              filterKey: this.column.filterKey,
              filterObj: {
                value: val,
                filtered:
                  !this.dateString.length || !this.dateString[0] ? 0 : 1,
              },
              filtered: !this.dateString.length || !this.dateString[0] ? 0 : 1,
            },
          })
        },
        deep: true,
        immediate: true,
      },
    },
    methods: {
      moment,
      getCalendarContainer() {
        return document.getElementById('pickerBox')
      },
      dateFilter(date, dateString) {
        this.dateString = dateString
      },
      disabledStartDate(startValue) {
        const endValue = this.endValue
        if (!startValue || !endValue) {
          return false
        }
        return startValue.valueOf() > endValue.valueOf()
      },
      disabledEndDate(endValue) {
        const startValue = this.startValue
        if (!endValue || !startValue) {
          return false
        }
        return startValue.valueOf() >= endValue.valueOf()
      },
      handleStartOpenChange(open) {
        if (!open) {
          this.endOpen = true
        }
      },
      handleEndOpenChange(open) {
        this.endOpen = open
      },
      // 数据重置
      reset() {
        this.dateString = []
        this.$emit('beforeFilter', {
          date: {
            dataIndex: this.column.dataIndex,
            filterKey: this.column.filterKey,
            filterObj: {
              value: [],
              filtered: this.dateString.length == 0 ? 0 : 1,
            },
            filtered: this.dateString.length == 0 ? 0 : 1,
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
  }
</style>
