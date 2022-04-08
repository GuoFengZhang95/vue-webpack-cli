<template>
  <div ref="timeFilter" class="time-filter">
    <a-range-picker
      :open="open"
      show-time
      format="YYYY-MM-DD"
      :value="timeValue"
      :get-calendar-container="getCalendarContainer"
      @change="onChange"
      @openChange="openChange"
    ></a-range-picker>
  </div>
</template>
<script>
  import moment from 'moment'
  export default {
    name: 'RangeFilter',
    props: [],
    data() {
      return {
        open: false,
        timeValue: [],
        dateFormat: 'YYYY-MM-DD',
      }
    },
    methods: {
      moment,
      // 手动控制日期组件的显示隐藏，为了实现日期组件所在弹框隐藏时同时关闭日期组件
      openChange() {
        this.open = !this.open
      },
      onChange(dates, dateStrings) {
        // console.log('From: ', dates[0], ', to: ', dates[1]);
        // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
        this.timeValue = dates
        this.$emit('filterChange', [dateStrings[0], dateStrings[1]])
      },
      getCalendarContainer(trigger) {
        return this.$refs.timeFilter
      },
      reset() {
        this.timeValue = []
      },
    },
  }
</script>
<style lang="less">
  .time-filter {
    margin-bottom: 72px;
    .ant-calendar-picker-container {
      left: 0 !important;
      top: -20px !important;
      .ant-calendar-range {
        width: 100%;
      }
    }
  }
</style>
