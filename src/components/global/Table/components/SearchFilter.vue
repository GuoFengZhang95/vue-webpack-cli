<template>
  <div class="table-filter">
    <p class="filetr-head">
      <img src="../icon/filter.png" class="icon-img" />
      筛选
    </p>
    <div class="search-filter table-filter-main">
      <a-input-search
        v-model="keyword"
        placeholder="筛选条件"
        class="mb10"
        @change="onSearchChange"
      ></a-input-search>
      <a-row v-show="checkOpts.length">
        <a-col v-if="hasFixedItem" class="mb10">
          <a-checkbox
            :checked="checkAll"
            :indeterminate="indeterminate"
            @change="onCheckAllChange"
          >
            全部
          </a-checkbox>
        </a-col>
        <a-col>
          <div>
            <a-checkbox-group
              v-model="searchFilter.checkList"
              :disabled="false"
              style="width: 100%"
              @change="checkGroupChange"
            >
              <a-col class="opts-warpper">
                <div ref="content">
                  <div v-for="e in checkOpts" :key="e.value" class="mb10">
                    <a-checkbox
                      :value="e.value"
                      class="row-word-change"
                      @change="checkboxChange"
                    >
                      {{ e.label }}
                    </a-checkbox>
                  </div>
                </div>
              </a-col>
            </a-checkbox-group>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<!-- eslint-disable -->
<script>
  export default {
    name: 'SearchFilter',
    props: {
      column: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        indeterminate: false,
        checkAll: false,
        keyword: '',
        searchFilter: {
          input: '',
          checkList: [],
        },
        searchFlag: true, //标记是否需要搜索功能
        isSearch: false, //是否进行过搜索操作
        timer: null,
        hasFixedItem: true, //标记是否需要空值/全部选项
        isInitCheckOption: true, //标记是否第一次加载下拉选项值
        page: 1,
        pageSize: 20, //分页数量
        cacheValueList: [], //
      }
    },
    computed: {
      checkOpts() {
        this.keyword = this.keyword.trim()
        //判断是否搜索
        if (this.keyword.length === 0) {
          this.isSearch = false
        } else {
          this.isSearch = true
        }
        //搜索功能
        if (this.keyword) {
          this.isInitCheckOption = false
          return this.column.checkOpts.filter(
            e => e.label.toLowerCase().indexOf(this.keyword.toLowerCase()) > -1
          )
        } else {
          let emptyFlag = this.column.checkOpts.some(e => {
            //判断接口数据中是否存在空值
            return e.value == '-1'
          })
          if (!emptyFlag) {
            //不存在空值项，数组第一个元素添加空值项
            this.column.checkOpts.unshift({ label: '空(未填写)', value: -1 })
          }
          return this.column.checkOpts.slice(0, this.pageSize * this.page)
        }
      },
    },

    watch: {
      keyword(val, pre) {
        this.page = 1
      },
      checkOpts(e) {
        //是否搜索 搜索后与搜索结果对比 不搜索与所有数据对比
        let val = this.keyword ? e : this.column.checkOpts
        // 筛选项数据变化时，缓存的选中项要选中
        this.searchFilter.checkList = this.cacheValueList
        // 根据当前选中项，设置是否全选
        this.checkAll = val.every(
          i => this.searchFilter.checkList.indexOf(i.value) > -1
        )
        //解决半选覆盖全选样式
        if (!this.checkAll) {
          this.indeterminate = val.some(
            i => this.searchFilter.checkList.indexOf(i.value) > -1
          )
        } else {
          this.indeterminate = false
        }

        console.log(this.checkAll, this.indeterminate)
      },
      searchFilter: {
        deep: true,
        handler: function (val, pre) {
          // 筛选项 = 当前选中项 + 历史选中项
          const data = this.checkOpts.filter(
            k =>
              val.checkList.indexOf(k.value) > -1 ||
              this.cacheValueList.indexOf(k.value) > -1
          )
          const value =
            !this.isSearch && this.checkAll
              ? []
              : [...new Set([...val.checkList, ...this.cacheValueList])]

          this.$emit('beforeFilter', {
            search: {
              dataIndex: this.column.dataIndex,
              filterKey: this.column.filterKey,
              filterType: 'search', //search筛选组件标识
              filterObj: {
                input: val.input,
                value,
                data,
              },
              filtered: [...new Set([...val.checkList, ...this.cacheValueList])]
                .length
                ? 1
                : 0,
            },
          })
        },
      },
    },
    mounted() {
      this.$refs.content.offsetParent.addEventListener('scroll', this.scroll)
    },
    methods: {
      scroll(e) {
        if (
          e.srcElement.scrollTop + e.srcElement.clientHeight + 1 >=
          e.srcElement.scrollHeight
        ) {
          if (this.page * this.pageSize < this.column.checkOpts.length) {
            //搜索结果不滚动加载&&截取的数据小于总数据量
            this.page++
          }
        }
      },
      // checkgroup复选操作
      checkGroupChange(checkedList) {
        this.indeterminate =
          !!checkedList.length && checkedList.length < this.checkOpts.length
        this.checkAll = checkedList.length === this.checkOpts.length
      },
      // checkbox
      checkboxChange(e) {
        const target = e.target
        if (target.checked) {
          // 缓存选中项
          this.cacheValueList = [
            ...new Set([...[target.value], ...this.cacheValueList]),
          ]
        } else {
          // 取消选中时，把当前数据从缓存数据中移除
          this.cacheValueList = this.cacheValueList.filter(
            i => i != target.value
          )
        }
      },
      // 全部取消选中/全部选中
      onCheckAllChange(e) {
        let allTemp = []
        // 1250改动 本地分页 存在搜索条件时全选搜索结果 不存在搜索条件时全选所有内容
        if (this.keyword) {
          allTemp = this.checkOpts.map(k => k.value)
        } else {
          allTemp = this.column.checkOpts.map(k => k.value)
        }
        this.indeterminate = false
        this.checkAll = e.target.checked

        if (e.target.checked) {
          this.cacheValueList = [
            ...new Set([...allTemp, ...this.cacheValueList]),
          ]
          this.searchFilter.checkList = allTemp
        } else {
          this.cacheValueList = this.cacheValueList.filter(
            i => allTemp.indexOf(i) < 0
          )
          this.searchFilter.checkList = []
        }
      },
      // 筛选
      onSearchChange() {},
      // 数据重置
      reset() {
        this.checkAll = false
        this.indeterminate = false
        // 搜索后 重置操作置为初始化状态
        this.isInitCheckOption = true
        this.keyword = ''
        this.cacheValueList = []
        Object.assign(this.searchFilter, {
          input: '',
          checkList: [],
        })
        this.$emit('beforeFilter', {
          search: {
            dataIndex: this.column.dataIndex,
            filterType: 'search', //search筛选组件标识
            filterKey: this.column.filterKey,
            filterObj: {
              input: '',
              value: [],
              filtered: 0,
            },
            filtered: 0,
          },
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .table-filter {
    min-width: 248px;
    .filetr-head {
      font-size: 14px;
      color: #666;
      .icon-img {
        vertical-align: -2px;
      }
      :first-child {
        margin-right: 5px;
      }
    }
    .search-filter {
      width: 100%;
      background-color: #f9f9f9;
      .opts-warpper {
        width: 248px;
        // max-height: calc(100vh * 0.2);
        max-height: calc(60vh * 0.2);
        overflow-y: auto;
        overflow-x: hidden;
        .row-word-change {
          width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
      }
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        height: 100%;
        // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        // background-color: #bbebe4;
        border-radius: 3px;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 7px;
        box-shadow: inset 0 0 6px #d9d9d9;
        -webkit-box-shadow: inset 0 0 6px #d9d9d9;
      }
      ::-webkit-scrollbar-button {
        font-style: inherit;
        // background-color: #E8E8E8;
      }
      ::-webkit-scrollbar-corner {
        font-style: inherit;
        // background:rgb(247, 245, 228);
      }
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        height: 100%;
        // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        // background-color: #bbebe4;
        border-radius: 3px;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 7px;
        box-shadow: inset 0 0 6px #d9d9d9;
        -webkit-box-shadow: inset 0 0 6px #d9d9d9;
      }
      ::-webkit-scrollbar-button {
        font-style: inherit;
        // background-color: #E8E8E8;
      }
      ::-webkit-scrollbar-corner {
        font-style: inherit;
        // background:rgb(247, 245, 228);
      }
    }
  }
</style>
<style lang="scss" scoped></style>
