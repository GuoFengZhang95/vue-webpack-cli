<template>
  <div class="table-filter range-filter">
    <p class="filetr-head">
      <img src="../icon/filter.png" alt="" class="icon-img" />
      筛选
    </p>
    <a-row class="table-filter-main">
      <div class="filter-item">
        <span>从</span>
        <div class="filter-item-row">
          <a-input v-model="rangeList[0]"></a-input>
        </div>
      </div>
      <div class="filter-item">
        <span>至</span>
        <div class="filter-item-row">
          <a-input v-model="rangeList[1]"></a-input>
        </div>
      </div>
      <!--目前场景无法验证 后期新场景需要后端提供添加新参数  -->
      <!-- <div class="filter-item">
				<a-checkbox @change="selectEmpty">
					空值
				</a-checkbox>
			</div> -->
    </a-row>
  </div>
</template>
<script>
  export default {
    name: 'RangeFilter',
    props: {
      column: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        rangeList: ['', ''],
      }
    },
    watch: {
      rangeList(pre, val) {
        this.$emit('beforeFilter', {
          range: {
            dataIndex: this.column.dataIndex,
            filterKey: this.column.filterKey,
            filterObj: {
              value: this.rangeList,
            },
            filtered:
              this.rangeList[0] !== '' || this.rangeList[1] !== ''
                ? true
                : false,
          },
        })
      },
    },
    methods: {
      // //选择空值
      // selectEmpty(){
      // 		this.rangeList = ["",""]
      // 	},
      reset() {
        this.rangeList = ['', '']
        this.$emit('beforeFilter', {
          range: {
            dataIndex: this.column.dataIndex,
            filterKey: this.column.filterKey,
            filterObj: {
              value: this.rangeList,
            },
            filtered:
              this.rangeList[0] !== '' || this.rangeList[1] !== ''
                ? true
                : false,
          },
        })
      },
    },
  }
</script>
<style lang="less" scoped="scoped">
  .table-filter {
    .filetr-head {
      font-size: 14px;
      color: #666;
    }
    .icon-img {
      vertical-align: -2px;
      margin-right: 5px;
    }
    .table-filter-main {
      // :first-child{
      // 	padding-bottom: 12px;
      // }
      .filter-item {
        padding-bottom: 12px;

        span {
          font-size: 13px;
          color: #666;
          display: inline-block;
        }
        .filter-item-row {
          display: inline-block;
          margin-left: 9px;
        }
      }
    }
  }

  .table-filter {
    .filter {
      margin-bottom: 10px;
    }
  }
</style>
