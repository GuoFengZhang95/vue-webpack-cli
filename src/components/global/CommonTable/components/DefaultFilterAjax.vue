<template>
  <div class="default-filter-ajax">
    <a-input-search
      :value="inputValue"
      @search="onSearch"
      @change="e => onInputChange(e)"
    ></a-input-search>
    <a-checkbox-group
      id="ant-checkbox-group"
      :ref="domFlag"
      :value="checkboxValue"
      @change="onChange"
    >
      <div ref="a-checkbox-item-wrp">
        <a-checkbox
          v-for="(e, index) in options"
          :key="`${e.value}${index}`"
          ref="defaultFilterItem"
          :value="e.value"
          class="defaultFilterItem"
        >
          {{ e.label }}
        </a-checkbox>
      </div>
    </a-checkbox-group>
  </div>
</template>
<script>
  export default {
    name: 'DefaultFilterAjax',
    props: {
      ajax: {
        type: Function,
        default: () => {},
      },
      ajaxData: {
        type: Object,
        default: () => {
          return {}
        },
      },
      domFlag: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        checkboxGroupHeight: 0, //当前复选框高度
        checkboxItemWrpHeight: 0, //当前复选框内容高度
        scrollTop: 0, //当前复选框内容向上滚动的距离
        direction: '', //滚动方向
        options: [], //当前显示的options
        inputValue: '',
        checkboxValue: [], //当前选中项的value（id）
        page: 1,
        defaultOptions: [], //列表加载的options
        defaultPno: 1,
        defaultTno: 1,
        distance: 100,
        searchOptions: [], // 搜索返回的options
        searchPno: 1,
        searchTno: 1,
        canRequest: true,
        hasEmitReachBottomFn: false, //是否已经触发过触底函数
        perpage: 20,
      }
    },
    computed: {
      // 触底状态
      underBottom() {
        return (
          this.checkboxItemWrpHeight - this.scrollTop <=
          this.checkboxGroupHeight + this.distance
        )
      },
      defaultHasMore() {
        return this.defaultPno <= this.defaultTno
      },
      searchHasMore() {
        return this.searchPno <= this.searchTno
      },
    },
    mounted() {
      this.getListByScroll()
      this.$refs[this.domFlag].$el.addEventListener('scroll', this.handleScroll)
      this.getListBySearch = this.$debounce(this.getListBySearch, 500)
    },
    beforeDestroy() {
      this.$refs[this.domFlag].$el.removeEventListener(
        'scroll',
        this.handleScroll
      )
    },
    methods: {
      // 输入框值变化
      onInputChange(e) {
        this.inputValue = e.target.value.trim()
        if (this.inputValue) {
          //搜索值不为空
          this.options = []
          this.searchOption = []
          this.searchPno = 1
          this.getListBySearch()
        } else {
          this.options = []
          this.options = this.defaultOptions
        }
      },
      onSearch() {
        if (this.inputValue) {
          //搜索值不为空
          this.options = []
          this.searchOption = []
          this.searchPno = 1
          this.getListBySearch()
        }
      },
      // 滚动函数
      handleScroll(e) {
        this.scrollTop = e.target.scrollTop
        if (this.underBottom) {
          if (this.hasEmitReachBottomFn == false) {
            this.onReachBottom()
            this.hasEmitReachBottomFn = true
          }
        } else {
          this.hasEmitReachBottomFn = false
        }
      },
      // 触底函数
      onReachBottom() {
        if (this.inputValue) {
          //带搜索条件搜索加载更多
          if (this.searchHasMore) {
            this.searchPno++
            this.getListBySearch()
          } else {
            this.$message.info('当前搜索结果暂无更多数据了~')
          }
        } else {
          //不带搜索条件加载更多
          if (this.defaultHasMore) {
            this.defaultPno++
            this.getListByScroll()
          } else {
            this.$message.info('当前列表暂无更多数据了~')
          }
        }
      },
      // 滚动获取options
      getListByScroll() {
        let data = {
          pno: this.defaultPno,
          perpage: this.perpage,
        }
        Object.assign(data, this.ajaxData)
        if (this.canRequest) {
          this.ajax(data).then(res => {
            this.defaultTno = res.tno
            this.defaultOptions = this.defaultOptions.concat(res.data)
            this.options = this.defaultOptions
            this.$nextTick(() => {
              this.checkboxGroupHeight =
                this.$refs[this.domFlag].$el.offsetHeight
              this.checkboxItemWrpHeight =
                this.$refs['a-checkbox-item-wrp'].offsetHeight
              this.canRequest = true
            })
          })
        }
      },
      // 搜索获取options
      getListBySearch() {
        let data = {
          pno: this.searchPno,
          perpage: this.perpage,
          keyword: this.inputValue,
        }
        Object.assign(data, this.ajaxData)
        this.ajax(data).then(res => {
          this.searchTno = res.tno
          this.searchOption = this.searchOption.concat(res.data)
          this.options = this.searchOption
          this.$nextTick(() => {
            this.checkboxGroupHeight = this.$refs[this.domFlag].$el.offsetHeight
            this.checkboxItemWrpHeight =
              this.$refs['a-checkbox-item-wrp'].offsetHeight
          })
        })
      },

      onChange(e) {
        this.$emit('filterChange', e)
        this.checkboxValue = e
      },
      reset() {
        this.checkboxValue = []
        this.inputValue = ''
        this.defaultPno = 1
        this.searchPno = 1
        this.searchOptions = []
        this.defaultOptions = []
        this.getListByScroll()
      },
    },
  }
</script>
<style lang="less" scope>
  .default-filter-ajax {
    .ant-checkbox-group {
      display: block;
      margin-top: 9px;
      overflow: hidden;
      overflow-y: auto;
      max-height: 190px;
      width: 300px;
      .ant-checkbox-wrapper {
        display: block;
        margin-left: 0;
        padding: 6px 0;
      }
    }
  }
</style>
