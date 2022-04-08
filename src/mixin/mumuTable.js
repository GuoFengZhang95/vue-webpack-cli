export const tableMix = {
  data() {
    return {
      tableHeight: 0,
      isLoading: false,
      total: 0,
      page: 1,
      pageSize: 20,
      selectAll: false,
      selectedRowKeys: [],
      dataSource: [],
      filterObj: {},
      filteredHistory: {}, //记录searchFiler筛选标识
      // resizeHeightOffset: 172
    }
  },
  computed: {},
  mounted() {},
  methods: {
    // 初始化表格
    initTableComp(tableKey) {
      if (tableKey) {
        this[tableKey].filterObj = {}
      } else {
        this.filterObj = {}
      }
    },
    // 异步树
    treeFilter(treeNode, resolve) {
      console.log(treeNode)
      return this.queryAdress(treeNode, resolve)
    },
    // 筛选
    handleFilter(filterObj, tableKey) {
      //解决筛选后 全选操作 二次才能选中的问题
      this.selectAll = false
      // 列有多个筛选时，计算列是否存在筛选中的值。设置筛选中状态
      let filteredList = {}
      let temp = {}
      /* 重置操作添加参数-2 目前php java统一 不传值查全部 */
      //serachFiletr重置之后,筛选条件置为-2
      // Object.keys(this.filteredHistory).forEach(item => {
      //   Object.assign(temp, {
      //     [item]: {
      //       input: '',
      //       value: [-2]
      //     }
      //   })
      // })
      Object.values(filterObj).forEach(k => {
        k.forEach(s => {
          Object.assign(temp, {
            [s.filterKey]: s.filterObj,
          })
          if (Object.prototype.hasOwnProperty.call(filteredList, s.dataIndex)) {
            filteredList[s.dataIndex]++
            //记录searchFilter组件筛选标识
            // if (s.filterType == 'search') {
            //   this.filteredHistory[s.filterKey]++
            // }
          } else {
            filteredList[s.dataIndex] = 1
            // if (s.filterType == 'search') {
            //   this.filteredHistory[s.filterKey] = 1
            // }
          }
        })
      })
      this.filterObj = temp
      if (tableKey) {
        this[tableKey].filterObj = temp
        this[tableKey].columns = this[tableKey].columns.map(e => {
          return Object.assign(e, {
            filtered:
              Object.prototype.hasOwnProperty.call(filteredList, e.dataIndex) &&
              filteredList[e.dataIndex] > 0,
          })
        })
      } else {
        this.filterObj = temp
        this.columns = this.columns.map(e => {
          return Object.assign(e, {
            filtered:
              Object.prototype.hasOwnProperty.call(filteredList, e.dataIndex) &&
              filteredList[e.dataIndex] > 0,
          })
        })
      }
      this.reloadTable(tableKey)
    },
    // 表格刷新
    reloadTable(tableKey) {
      if (tableKey) {
        Object.assign(this[tableKey], {
          page: 1,
        })
        this[`${tableKey}Init`](tableKey)
        this[tableKey].selectedRowKeys = []
      } else {
        this.page = 1
        this.defaultTableInit()
        this.selectedRowKeys = []
      }
    },
    // 设置表头顺序
    dragTableHeaderOver(columnsNew, tableKey) {
      if (tableKey) {
        Object.assign(this[tableKey], {
          columns: columnsNew,
        })
      } else {
        this.columns = columnsNew
      }
    },
    // 设置表格头部
    setTableHeader(column, tableKey) {
      console.log(`current table is ${tableKey} , setting column`)
      if (tableKey) {
        let idx = this[tableKey].columns.findIndex(
          e => e.dataIndex == column.dataIndex
        )
        this[tableKey].columns.splice(
          idx,
          1,
          Object.assign(column, {
            extend: !column.extend,
          })
        )
      } else {
        let idx = this.columns.findIndex(e => e.dataIndex == column.dataIndex)
        this.columns.splice(
          idx,
          1,
          Object.assign(column, {
            extend: !column.extend,
          })
        )
        // this.$forceUpdate()
      }
    },
    // 跨页全选
    handleSelectAllRow(selectedRowKeys, tableKey) {
      console.log(`current table is ${tableKey}`)
      if (tableKey) {
        Object.assign(this[tableKey], {
          selectedRowKeys: this[tableKey].selectAll ? [] : selectedRowKeys,
          selectAll: !this[tableKey].selectAll,
        })
      } else {
        this.selectedRowKeys = this.selectAll ? [] : selectedRowKeys
        this.selectAll = !this.selectAll
      }
    },
    // 复选框选择事件
    /* eslint-disable-next-line no-unused-vars */
    selectChange(selectedRowKeys, tableKey, selectedRowObj) {
      // console.log(`current table is : ${tableKey} , current selected list is : ${selectedRowKeys}`)
      if (
        this.selectedRowKeys.length === selectedRowKeys.length &&
        !this.selectAll
      ) {
        selectedRowKeys = []
      }
      if (tableKey) {
        Object.assign(this[tableKey], {
          selectedRowKeys: selectedRowKeys,
          selectAll: false,
        })
      } else {
        this.selectAll = false
        this.selectedRowKeys = selectedRowKeys
      }
    },
    //计算是否存在筛选条件
    filterFlag(flag) {
      this.hasFilter = flag
    },
    //重置所有筛选条件
    resetFilter() {
      this.$refs.mumuTable.resetAllFilter()
    },
    // 每页展示数据条数
    pageSizeChange(current, pageSize, tableKey) {
      // console.log(`current table is ${tableKey} , current page: ${current} , pageSize:${pageSize}`)
      if (tableKey) {
        Object.assign(this[tableKey], {
          page: 1,
          pageSize: pageSize,
        })
        this[`${tableKey}Init`](tableKey)
      } else {
        this.page = 1
        this.pageSize = pageSize
        this.defaultTableInit()
      }
      this.selectAll = false
      this.selectedRowKeys = []
    },
    // 页码变更
    pageChange(current, pageSize, tableKey) {
      // console.log(`current table is ${tableKey} , current page: ${current} , pageSize:${pageSize}`)
      if (tableKey) {
        Object.assign(this[tableKey], {
          page: current,
        })
        this[tableKey].selectedRowKeys = []
        this[`${tableKey}Init`](tableKey)
      } else {
        this.page = current
        this.selectedRowKeys = []
        this.defaultTableInit()
      }
      this.selectAll = false
      this.selectedRowKeys = []
    },
    // 将数字转数组  2=>[1,2]
    num2arr(num) {
      if (typeof num == 'number') {
        let res = []
        for (let i = 0; i < num; i++) {
          res.push(i)
        }
        return res
      } else {
        return []
      }
    },
  },
  // destroyed() {
  // 	window.removeEventListener('resize', this.windowResize)
  // }
}
