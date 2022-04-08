<template>
  <div class="table-filter">
    <!-- <h3>头部搜索框</h3> -->
    <p class="filetr-head">
      <img src="../icon/filter.png" alt="" class="icon-img" />
      筛选
    </p>
    <div class="picker-box">
      <a-input
        v-model="searchObj.searchKey"
        placeholder="请输入检索内容"
        @pressEnter="pressEnter"
      ></a-input>
    </div>
    <div v-if="isShowCheckbox" class="check-box">
      <a-checkbox :checked="isChecked" @change="handleCheckbox">空</a-checkbox>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'HeadSearch',
    props: {
      column: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        searchObj: {
          searchKey: '',
          checkStatus: 0, //复选框状态
        },
        isChecked: false,
        isShowCheckbox: false,
      }
    },
    watch: {
      column: {
        handler: function (val) {
          // console.log(val)
          if (val.isShowCheckbox) {
            this.isShowCheckbox = val.isShowCheckbox
          }
        },
        deep: true,
        immediate: true,
      },
      'searchObj.searchKey'(val, pre) {
        const filtered = !val && this.searchObj.checkStatus === 0 ? 0 : 1
        this.$emit('beforeFilter', {
          date: {
            dataIndex: this.column.dataIndex,
            filterKey: this.column.filterKey,
            filterObj: {
              value: this.searchObj,
              filtered,
            },
            filtered,
          },
        })
      },
      'searchObj.checkStatus'(val, pre) {
        const filtered = !this.searchObj.searchKey && val === 0 ? 0 : 1
        this.$emit('beforeFilter', {
          date: {
            dataIndex: this.column.dataIndex,
            filterKey: this.column.filterKey,
            filterObj: {
              value: this.searchObj,
              filtered,
            },
            filtered,
          },
        })
      },
    },
    mounted() {},
    methods: {
      pressEnter() {
        let el = document.getElementsByClassName('ant-dropdown-open') //点击确定，关闭下拉框
        el[0].click()
      },
      // 数据重置
      reset() {
        this.searchObj.searchKey = ''
        this.searchObj.checkStatus = 0
        this.isChecked = false
        this.$emit('beforeFilter', {
          date: {
            dataIndex: this.column.dataIndex,
            filterKey: this.column.filterKey,
            filterObj: {
              value: {
                searchKey: '',
                checkStatus: 0,
              },
              filtered: 0,
            },
            filtered: 0,
          },
        })
      },
      //复选框绑定
      handleCheckbox() {
        this.isChecked = !this.isChecked
        this.$set(this.searchObj, 'checkStatus', this.isChecked ? -1 : 0)
        // this.searchObj.checkStatus = this.isChecked ? 1 : 0
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
    :first-child {
      margin-right: 5px;
    }
    .picker-box,
    .check-box {
      padding: 10px;
      background-color: #f9f9f9;
    }
    /deep/.check-box {
      padding: 0 10px 10px 10px;
      .ant-checkbox {
        margin-right: 0;
      }
    }
  }
</style>
