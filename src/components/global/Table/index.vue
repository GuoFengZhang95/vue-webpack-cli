<template>
  <div class="mumuxili-table">
    <!-- 表格标题 -->
    <slot name="title"></slot>
    <!-- 批量操作 -->
    <div
      v-if="selectionsToggleFlag && selectedRowKeys.length"
      class="selection"
    >
      <span>
        已选择
        <i>{{ selected }}</i>
        条
      </span>
      <em>|</em>
      <slot name="selection"></slot>
    </div>
    <!-- 表格操作 -->
    <div
      v-show="!(selectionsToggleFlag && selectedRowKeys.length)"
      :style="{ padding: noActionFlagCptd ? '0' : '12px 24px' }"
      class="action"
    >
      <!-- 扩展操作 -->
      <div class="action-extend">
        <slot name="action"></slot>
      </div>
      <div v-if="settingActFlagCptd" class="action-default">
        <!-- 表头设置 -->
        <TableSetting
          :columns="columns"
          @setTableHeader="setTableHeader"
          @dragTableHeaderOver="dragTableHeaderOver"
          @dragTableHeaderEnd="dragTableHeaderOver"
        ></TableSetting>
        <!-- 表格刷新 -->
        <TableReload
          v-if="tableReload"
          @reloadTable="reloadTable"
        ></TableReload>
      </div>
    </div>
    <slot name="betweenActionTable"></slot>
    <!-- 表格内容 -->
    <a-table
      ref="antTable"
      class="table"
      :row-key="rowKey"
      :bordered="bordered"
      :pagination="false"
      :size="size"
      :scroll="mixScroll"
      :loading="isLoading"
      :data-source="dataSourceMap"
      :row-selection="rowSelection"
      :custom-row="customRow"
    >
      <a-table-column
        v-for="(column, columnIdx) in columnsMap"
        :key="column.dataIndex"
        :align="column.align || 'left'"
        :data-index="column.dataIndex"
        :width="column.width"
        :ellipsis="true"
        :fixed="column.fixed"
        @filterDropdownVisibleChange="
          openFilterDropdownVisible($event, columnIdx, column)
        "
      >
        <!-- 表头筛选 -->
        <div v-if="column.filter" slot="filterDropdown" class="filter-warpper">
          <!-- 排序筛选 -->
          <sort-filter
            v-if="column.filter.indexOf('sort') > -1"
            :ref="column.dataIndex"
            :column="column"
            :sort-index="columnIdx"
            @beforeFilter="beforeFilter"
          ></sort-filter>
          <!-- 范围筛选 -->
          <range-filter
            v-if="column.filter.indexOf('range') > -1"
            :ref="column.dataIndex"
            :column="column"
            @beforeFilter="beforeFilter"
          ></range-filter>
          <!-- 时间筛选 到时分秒-->
          <date-filter
            v-if="column.filter.indexOf('date') > -1"
            :ref="column.dataIndex"
            :column="column"
            @beforeFilter="beforeFilter"
          ></date-filter>
          <!-- 日期筛选 到日-->
          <month-filter
            v-if="column.filter.indexOf('month') > -1"
            :ref="column.dataIndex"
            :column="column"
            @beforeFilter="beforeFilter"
          ></month-filter>
          <!-- 日期筛选 仅月份 -->
          <single-month-filter
            v-if="column.filter.indexOf('singleMonth') > -1"
            :ref="column.dataIndex"
            :column="column"
            @beforeFilter="beforeFilter"
          ></single-month-filter>
          <!-- 查询筛选 -->
          <search-filter
            v-if="column.filter.indexOf('search') > -1"
            :ref="column.dataIndex"
            :column="column"
            @beforeFilter="beforeFilter"
          ></search-filter>
          <!-- 查询筛选 -->
          <search-filter-page
            v-if="column.filter.indexOf('searchPage') > -1"
            :ref="column.dataIndex"
            :column="column"
            @beforeFilter="beforeFilter"
            @handleColumnFilter="handleColumnFilter"
            @handleColumnScroll="handleColumnScroll"
          ></search-filter-page>
          <!-- 树筛选 -->
          <tree-filter
            v-if="column.filter.indexOf('tree') > -1"
            :ref="column.dataIndex"
            :column="column"
            @beforeFilter="beforeFilter"
          ></tree-filter>
          <!-- 表头搜索 -->
          <head-search
            v-if="column.filter.indexOf('headSearch') > -1"
            :ref="column.dataIndex"
            :column="column"
            @beforeFilter="beforeFilter"
          ></head-search>
          <!-- 暂时的树筛选 -->
          <temp-tree-filter
            v-if="column.filter.indexOf('temptree') > -1"
            :ref="column.dataIndex"
            :column="column"
            @beforeFilter="beforeFilter"
          ></temp-tree-filter>
          <ExtendTree
            v-if="column.filter.indexOf('extendTree') > -1"
            :ref="column.dataIndex"
            :column="column"
            @beforeFilter="beforeFilter"
          ></ExtendTree>
          <div class="filter-btn">
            <a-button class="mr10" @click="resetFilter($event, column)">
              重置
            </a-button>
            <a-button
              type="primary"
              @click="handleFilter($event, column, columnIdx)"
            >
              确定
            </a-button>
          </div>
        </div>
        <!-- 表格 thead 筛选状态 filterIcon -->
        <template #filterIcon>
          <div class="filter-icon">
            <a-icon
              type="down"
              :class="`icon ${
                column.filtered || clickFlag[columnIdx] ? 'active' : ''
              }`"
            ></a-icon>
          </div>
        </template>
        <!-- 表格 thead -->
        <template #title>
          <ColumnTitle
            :column="column"
            :title="column.title"
            :tips="column.tips"
          ></ColumnTitle>
        </template>
        <!-- 表格内容 -->
        <template slot-scope="text, record">
          <!-- 如果是自定义内容 -->
          <template v-if="column.type && column.type == 'slot'">
            <slot
              :name="column.slotName ? column.slotName : column.dataIndex"
              :text="text"
              :record="record"
              :column="column"
            ></slot>
          </template>
          <TableCell
            v-else
            :text="text"
            :record="record"
            :column="column"
            @cellClick="handleRowClick"
          ></TableCell>
          <!-- <template v-else>
            <CellImg
              v-if="column.type == 'img'"
              :cellData="text"
              :record="record"
              @handleRowClick="handleRowClick('img', record.img, record)"></CellImg>
            <CellStatus
              v-else-if="column.type == 'status'"
              :cellData="text"
              @handleRowClick="handleRowClick('status', text.status, record)"></CellStatus>
            <CellAction
              v-else-if="column.type == 'action'"
              :cellData="text"
              :column="column"
              @handleRowClick="handleRowClick(column.type, text, record)"></CellAction>
            <CellText v-else :cellData="text" :column="column"></CellText>
          </template>  -->
        </template>
      </a-table-column>
    </a-table>
    <!-- 表格底部 -->
    <div
      v-if="settingTypeFlagCptd || paginationFlagCptd"
      :class="`pagition plr20 mt15 ${settingTypeFlagCptd ? '' : 'flex-right'}`"
    >
      <!-- 设置表格间距 -->
      <TableSize
        v-if="settingTypeFlagCptd"
        :size="size"
        @asideResize="asideResize"
      ></TableSize>
      <!-- 表格分页(v1.4.1.0: 表格分页器不再根据size改变)-->
      <div v-if="paginationFlagCptd" class="pagition-act">
        <span>共{{ totalCount }}条</span>
        <a-pagination
          show-size-changer
          show-quick-jumper
          :current="page"
          :total="renderTotal"
          :page-size="pageSize"
          :page-size-options="pageSizeOptions"
          @change="pageChange"
          @showSizeChange="pageSizeChange"
        ></a-pagination>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable -->
<script>
  const SortFilter = () => import('./components/SortFilter') //排序筛选
  const RangeFilter = () => import('./components/RangeFilter') //范围筛选
  const DateFilter = () => import('./components/DateFilter') //日期时间筛选
  const MonthFilter = () => import('./components/MonthFilter') //日期筛选组件
  const SingleMonthFilter = () => import('./components/SingleMonthFilter') //日期筛选组件
  const SearchFilter = () => import('./components/SearchFilter') //搜索筛选
  const TreeFilter = () => import('./components/TreeFilter') //树结构筛选
  const TempTreeFilter = () => import('./components/TempTreeFilter') //树结构筛选
  const HeadSearch = () => import('./components/HeadSearch') //表头搜索类
  const ExtendTree = () => import('./components/ExtendTreeFilter') //新树状筛选
  const TableSetting = () => import('./modules/TableSetting') //
  const TableReload = () => import('./modules/TableReload') //
  const TableSize = () => import('./modules/TableSize') //
  import ColumnTitle from './modules/ColumnTitle'
  import TableCell from './modules/TableCell'
  export default {
    name: 'MuTable',
    components: {
      RangeFilter,
      SortFilter,
      DateFilter,
      SearchFilter,
      TreeFilter,
      TempTreeFilter,
      MonthFilter,
      HeadSearch,
      ExtendTree,
      SingleMonthFilter,
      TableSetting,
      TableReload,
      TableSize,
      ColumnTitle,
      TableCell,
    },
    props: {
      rowKey: {
        //指定选中该字段值
        type: String,
        default: 'id',
      },
      tableReload: {
        type: Boolean,
        default: false,
      },
      tableKey: {
        //table唯一标识
        type: String,
        default: '',
      },
      isLoading: {
        //表格重载loading
        type: Boolean,
      },
      scroll: {
        //表格超出滚动
        type: Object,
        default: () => {
          return {}
        },
      },
      bordered: {
        // 表格是否带线
        type: Boolean,
        default: () => false,
      },
      settingTypeFlag: {
        //表格紧凑类型
        type: Boolean,
        default: () => true,
      },
      settingActFlag: {
        // 是否扩展表格操作按钮（设置/刷新）
        type: Boolean,
        default: () => true,
      },
      hasIndex: {
        //是否带序列号
        type: Boolean,
        default: () => true,
      },
      columns: {
        //表头
        type: Array,
        default: () => [],
      },
      dataSource: {
        //表格数据
        type: Array,
        default: () => [],
      },
      paginationFlag: {
        //是否带分页
        type: Boolean,
        default: () => true,
      },
      page: {
        //当前页
        type: Number,
        default: () => 1,
      },
      pageSize: {
        //单页展示数据数
        type: Number,
        default: () => 20,
      },
      pageSizeOptions: {
        //每页条数配置
        type: Array,
        default: () => ['20', '30', '50'],
      },
      total: {
        // 数据总数
        type: Number,
        default: 0,
      },
      selectionsAllFlag: {
        // 是否跨页全选
        type: Boolean,
        default: false,
      },
      selectionsFlag: {
        // 复选扩展（e.g 跨页操作）
        type: Boolean,
        default: () => false,
      },
      selections: {
        // 复选自定义扩展配置（e.g 选择100条，选择20条）
        type: Array,
        default: () => [],
      },
      selectionsToggleFlag: {
        // 复选扩展切换效果
        type: Boolean,
        default: () => false,
      },
      selectedRowKeys: {
        // 复选选中的idx
        type: Array,
        default: () => [],
      },
      noActionFlag: {
        // 单表格无操作表头
        type: Boolean,
        default: () => false,
      },
      // contentHeight: {
      //   // 表格内容区域高度(覆盖scroll里的y)
      //   type: Number
      // }
      resizeHeightOffset: {
        type: Number,
        default: 150,
      }, // 计算内容区域高度时的顶部区域高度， 默认150
      tableModel: {
        type: String,
        default: 'common',
      }, // 表格类型 common: 适用于大列表页面；simple： 简单列表，适用于二级页面，无resize调整表格高度、无数据时不展示分页、无表头设置、无紧凑类型选择
    },
    data() {
      return {
        size: 'middle', // small middle default
        filterObj: {
          // 表头筛选集合
          sort: [],
          range: [],
          date: [],
          search: [],
          tree: [],
          temptree: [],
          month: [],
          headSerach: [],
        },
        renderTotal: 0,
        loadFlag: false, //标识筛条件是否有变化
        clickFlag: [], //控制下拉按钮样式
        hasFilterData: false,
        contentHeight: 0, // 表格内容区域高度
        resizeHeightOffsetDiff: 0, // 计算内容区域高度时的顶部区域高度偏差， 默认0
        minContentHeight: 150, // 表格空数据时内容区域最小高度
        resizeRunning: false,
      }
    },
    computed: {
      totalCount() {
        return this.total < this.renderTotal ? this.total : this.renderTotal
      },
      // 计算内容区域高度时的顶部区域高度
      resizeHeightOffsetCptd() {
        return this.resizeHeightOffset + this.resizeHeightOffsetDiff
      },
      // 表格紧凑类型选择 根据tableModel确定展示
      settingTypeFlagCptd() {
        return this.tableModel === 'common' ? this.settingTypeFlag : false
      },
      // 表格表头设置等 根据tableModel确定展示
      settingActFlagCptd() {
        return this.tableModel === 'common' ? this.settingActFlag : false
      },
      // 表格分页 根据tableModel确定展示
      paginationFlagCptd() {
        if (this.tableModel === 'common') {
          return this.paginationFlag
        } else {
          return this.paginationFlag && this.renderTotal > 0
        }
      },
      // 根据tableModel确定展示
      noActionFlagCptd() {
        return this.tableModel === 'common' ? this.noActionFlag : true
      },
      mixScroll() {
        return {
          x: this.scroll.x || this.columns.filter(e => !e.extend).length * 140,
          y: this.scroll.y || this.contentHeight,
        }
      },
      selected() {
        //this.$parent.$parent.mixTable.selectAll
        if (this.$parent.selectAll) {
          return this.renderTotal
        }
        return this.selectedRowKeys.length
      },
      //   添加序号列
      columnsMap() {
        let map = this.columns.filter(e => !e.extend)
        let item = {
          dataIndex: 'key',
          title: '序号',
          width: 60,
          align: 'center',
        }
        // 如果有fixed: left，序号也需要fixed
        if (this.columns.some(i => i.fixed && i.fixed === 'left')) {
          item.fixed = 'left'
        }
        //计算是否存在筛选条件
        this.hasFilterData = this.columns.some(item => item.filtered)
        this.$emit('filterFlag', this.hasFilterData)
        return this.hasIndex ? [item, ...map] : map
      },
      //   添加序号列数据
      dataSourceMap() {
        let temp = this.dataSource.map((e, i) =>
          Object.assign(e, { key: i + 1 })
        )
        // 如果数据为空，在tbody里动态添加一条tr td，保证横向滚动条可以滚动
        this.$nextTick(() => {
          const tBody =
            this.$refs.antTable.$el.getElementsByClassName('ant-table-tbody')[0]
          if (this.dataSource.length === 0) {
            if (tBody) {
              tBody.innerHTML = `<tr id="appendTr"><td style="height: ${this.minContentHeight}px;background: transparent"></td></tr>`
            }
          } else {
            const trs = tBody && tBody.childNodes ? tBody.childNodes : null
            if (trs) {
              const cacheTrs = [...trs]
              cacheTrs.forEach(item => {
                if (item.id.indexOf('appendTr') > -1) {
                  tBody.removeChild(item)
                }
              })
            }
          }
        })
        return temp
      },
      //   复选table行
      rowSelection() {
        if (this.selectionsFlag) {
          const {
            tableKey,
            renderTotal,
            selectedRowKeys,
            selections,
            $parent,
            dataSource,
          } = this
          let parent = this.findPartentEl($parent, 'selectChange')
          if (this.selectionsAllFlag) {
            let temp = [
              {
                key: 'select-current',
                text: `当前页${dataSource.length}条`,
                onSelect: (selectedRowKeys, selectedRows) =>
                  parent.selectChange(selectedRowKeys, tableKey, {
                    tableKey,
                    selectedRowKeys,
                    selectedRows,
                  }),
              },
              {
                key: 'select-all',
                text: `全部${renderTotal}条`,
                onSelect: (selectedRowKeys, selectedRows) =>
                  parent.handleSelectAllRow(selectedRowKeys, tableKey, {
                    tableKey,
                    selectedRowKeys,
                    selectedRows,
                  }),
              },
              ...selections,
            ]
            return {
              fixed: true,
              selectedRowKeys,
              selections: temp,
              hideDefaultSelections: true,
              onChange: (selectedRowKeys, selectedRows) => {
                parent.selectChange(selectedRowKeys, tableKey, {
                  tableKey,
                  selectedRowKeys,
                  selectedRows,
                })
              },
            }
          } else {
            return {
              selectedRowKeys,
              onChange: (selectedRowKeys, selectedRows) => {
                parent.selectChange(selectedRowKeys, tableKey, {
                  tableKey,
                  selectedRowKeys,
                  selectedRows,
                })
              },
            }
          }
        } else {
          return null
        }
      },
    },
    watch: {
      total: {
        handler() {
          this.handleTotal()
        },
        immediate: true,
      },
      pageSize: {
        handler() {
          this.handleTotal()
        },
        immediate: true,
      },
      resizeHeightOffsetCptd: {
        handler() {
          // 更新contentHeight
          this.windowResize()
        },
        immediate: true,
      },
      // 动态修改表格内容区域高度，实现表格置底
      contentHeight: {
        handler(val) {
          if (this.tableModel === 'common') {
            if (val) {
              this.$nextTick(() => {
                // 获取当前表格内的元素
                const bodys =
                  this.$refs.antTable.$el.getElementsByClassName(
                    'ant-table-body'
                  )
                const innerBodys =
                  this.$refs.antTable.$el.getElementsByClassName(
                    'ant-table-body-inner'
                  )
                const targets = [...bodys, ...innerBodys]
                for (let i = 0; i < targets.length; i++) {
                  targets[i].style.height = `${val}px`
                  targets[i].style.overflow = 'scroll'
                  if (
                    this.scroll &&
                    this.scroll.y &&
                    !Number.isNaN(parseInt(this.scroll.y))
                  ) {
                    targets[i].style.maxHeight = `${this.scroll.y}px`
                  } else {
                    targets[i].style.maxHeight = ''
                  }
                }
              })
            }
          }
        },
        immediate: true,
      },
      filterObj: {
        //监听筛选条件是否有变化，(筛选数据发生变化-->关闭下拉菜单-->重新加载数据)
        handler(pre, val) {
          this.loadFlag = true
        },
        deep: true,
      },
      size: {
        handler(val, pre) {
          // 表格size变动，标题高度变动，需要同步更改resizeHeightOffset
          if (val === 'small') {
            if (pre === 'middle') {
              this.resizeHeightOffsetDiff -= 8
            } else if (pre === 'default') {
              this.resizeHeightOffsetDiff -= 16
            }
          } else if (val === 'middle') {
            if (pre === 'small') {
              this.resizeHeightOffsetDiff += 8
            } else if (pre === 'default') {
              this.resizeHeightOffsetDiff -= 8
            }
          } else if (val === 'default') {
            if (pre === 'small') {
              this.resizeHeightOffsetDiff += 16
            } else if (pre === 'middle') {
              this.resizeHeightOffsetDiff += 8
            }
          }
        },
      },
      'dataSource.length': {
        handler(val) {
          this.$nextTick(() => {
            const targets =
              this.$refs.antTable.$el.getElementsByClassName('ant-table-body')
            if (val === 0) {
              // 无数据时设置最小高度，保证缺省图不浮出表格内容区域
              for (let i = 0; i < targets.length; i++) {
                targets[i].style.minHeight = `${this.minContentHeight}px`
              }
            } else {
              // 有数据时去除最小高度限制
              for (let i = 0; i < targets.length; i++) {
                targets[i].style.minHeight = ''
              }
            }
          })
        },
        immediate: true,
      },
    },
    mounted() {
      this.$nextTick(() => {
        if (
          document.getElementsByClassName('sub-view')[0] &&
          this.tableModel == 'common'
        ) {
          this.contentHeight =
            document.getElementsByClassName('sub-view')[0].clientHeight -
            this.resizeHeightOffsetCptd
          window.addEventListener('resize', this.windowResize)
        }
      })
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.windowResize)
    },
    methods: {
      windowResize() {
        if (this.resizeRunning) return
        this.resizeRunning = true
        setTimeout(() => {
          this.contentHeight =
            document.getElementsByClassName('sub-view')[0].clientHeight -
            this.resizeHeightOffsetCptd
          this.resizeRunning = false
        }, 200)
      },
      findPartentEl(e, funName) {
        let temp = e
        return temp[funName] ? temp : this.findPartentEl(e['$parent'], funName)
      },
      //触发浏览器窗口事件
      asideResize(flag) {
        this.size = flag
        let myEvent = new Event('resize')
        setTimeout(() => {
          window.dispatchEvent(myEvent)
        }, 1)
      },
      // 打开筛选框事件（处理关闭/打开筛选框时加载数据，下拉按钮样式问题）
      openFilterDropdownVisible(val, id, column) {
        if (!val) {
          //设置筛选框关闭下拉按钮样式
          // this.$set(this.clickFlag, id, false)
          //筛选框关闭且筛选数据有变化，重新加载数据
          if (this.loadFlag) {
            // 如果当前筛选存在排序
            if (
              this.filterObj.sort.some(s => s.dataIndex === column.dataIndex)
            ) {
              // 只保留当前排序，清除其他排序
              this.columns.forEach(col => {
                // 找出sort排序的列
                if (col.filter && col.filter.includes('sort')) {
                  // 获取sort排序dom
                  const sortArr = this.$refs[col.dataIndex]
                  if (sortArr) {
                    sortArr.forEach(k => {
                      // 如果确定是排序项，且存在筛选数据，且不是当前筛选项
                      if (
                        Reflect.has(k.$attrs, 'sortIndex') &&
                        k.$attrs.sortIndex != id
                      ) {
                        k.reset()
                      }
                    })
                  }
                }
              })
            }
            this.$emit('handleFilter', this.filterObj, this.tableKey)
            setTimeout(() => {
              this.loadFlag = false
            }, 0)
          }
        } else {
          //设置筛选框打开时样式
          // this.$set(this.clickFlag, id, true)
        }
      },
      // 关闭筛选框
      closeFilterDropdownVisible(column) {},
      // 点击选中整行
      customRow(record) {
        return {
          on: {
            // 事件
            click: event => {
              this.$emit('customRow', record, this.tableKey)
            }, // 点击行
            dblclick: event => {},
            contextmenu: event => {},
            mouseenter: event => {}, // 鼠标移入行
            mouseleave: event => {},
          },
        }
      },
      // 处理筛选数据
      beforeFilter(data) {
        let k = Object.keys(data)[0] //filter type
        let v = data[k] // filter obj
        let temp = this.filterObj[k]
        let idx = temp.findIndex(e => e.dataIndex == v.dataIndex)
        // filtered 0:筛选条件为空,需要删除上一次的数据或者不操作 1:有筛选条件，需要插入或者更新上一次数据
        if (v.filtered == 0) {
          if (idx > -1) {
            temp.splice(idx, 1)
          }
        } else {
          idx > -1 ? temp.splice(idx, 1, v) : temp.push(v)
        }
        Object.assign(this.filterObj, {
          [k]: temp,
        })
      },
      // 执行筛选操作
      handleFilter(e, column, columnIdx) {
        // this.$emit('handleFilter', this.filterObj, this.tableKey)
        let el = document.getElementsByClassName('ant-dropdown-open') //点击确定，关闭下拉框
        el[0].click()
      },
      //重置所有筛选条件
      resetAllFilter() {
        this.columnsMap.forEach(item => {
          //清空所有复选数据
          if (this.$refs[item.dataIndex]) {
            this.$refs[item.dataIndex].forEach(k => {
              if (item.filtered) {
                k.reset()
              }
            })
          }
        })
        //重置所有筛选条件
        this.filterObj = {
          sort: [],
          range: [],
          date: [],
          search: [],
          tree: [],
          temptree: [],
        }
        this.$emit('handleFilter', this.filterObj, this.tableKey)
        //重置数据后,数据无变化 后关闭下拉框,不再加载数据,改变标识值在监听之后
        setTimeout(() => {
          this.loadFlag = false
        }, 0)
      },
      // 重置筛选条件
      resetFilter(e, column) {
        //清空所有复选数据
        this.$refs[column.dataIndex].forEach(k => {
          k.reset()
        })
        this.$emit('handleFilter', this.filterObj, this.tableKey)
        //重置数据后,数据无变化 后关闭下拉框,不再加载数据,改变标识值在监听之后
        setTimeout(() => {
          this.loadFlag = false
        }, 0)
      },
      // 表头分页筛选-加载分页
      handleColumnScroll() {},
      // 表头分页筛选-输入筛选
      handleColumnFilter(keyword) {
        console.log(`keyword: ${keyword}`)
      },
      // 处理total数据超5000的情况
      handleTotal() {
        if (this.total != undefined && this.pageSize != undefined) {
          let all = this.total > 5000 ? 5000 : this.total
          let count1 = Math.ceil(all / this.pageSize)
          let count2 = Math.floor(all / this.pageSize)
          this.renderTotal =
            this.pageSize * count1 > 5000
              ? this.pageSize * count2
              : this.pageSize * count1 > this.total
              ? this.total
              : this.pageSize * count1
        }
      },
      // 操作事件
      handleRowClick(clickType, rowData, record) {
        this.$emit('handleRowClick', clickType, rowData, record, this.tableKey)
      },
      //   当前页数
      pageChange(page, pageSize) {
        this.$emit('pageChange', page, pageSize, this.tableKey)
      },
      //   每页条数变更
      pageSizeChange(page, pageSize) {
        this.$emit('pageSizeChange', page, pageSize, this.tableKey)
      },
      // 表格刷新
      reloadTable() {
        this.$emit('reloadTable', this.tableKey)
      },
      // 表头设置-选中&&取消
      setTableHeader(column) {
        this.$emit('setTableHeader', column, this.tableKey)
      },
      // 表头设置-拖动表头ing
      dragTableHeaderOver(columnsNew) {
        this.$emit('dragTableHeaderOver', columnsNew, this.tableKey)
      },
    },
  }
</script>

<style lang="less" scoped>
  .mumuxili-table {
    // 表头操作按钮
    background: #fff !important;
    .action {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .action-extend {
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: center;
      }
      .action-default {
        /deep/ .ant-popover-inner-content {
          padding: 0;
        }
        .default-act {
          padding: 0 0 0 0;
          margin: 0 0 0 24px;
          border: transparent;
          color: #666;
          &:hover {
            color: @primary-color;
          }
        }
      }
    }
    //   多选
    .selection {
      padding: 12px 24px;
      span {
        i {
          color: #00c7db;
        }
      }
      em {
        color: #d9d9d9;
        margin: 0 24px;
      }
    }
    //   分页
    .pagition {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0;
      padding-top: 10px;
      padding-bottom: 10px;
      border-top: 1px solid #ebebeb;
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
        }
      }
      .menu-icon {
        width: 30px;
        height: 30px;
        border: 1px solid #ebebeb;
        text-align: center;
        line-height: 30px;
      }
      .pagition-act {
        position: relative;
        display: flex;
        align-items: center;
        font-size: 14px;
        span {
          font-size: 14px;
          margin-right: 8px;
        }
        /deep/ .ant-pagination-item-active a {
          color: white;
          background: #00c7db;
        }
      }
    }
    .flex-right {
      justify-content: flex-end;
    }
  }
  // 表格空数据时，保证y方向出现滚动条，防止表头被遮住
  /deep/ .ant-table-empty .ant-table-body {
    overflow-y: scroll !important;
  }
  // // 表格空数据时，空白样式
  // /deep/ .ant-table-placeholder {
  //   position: absolute;
  //   width: 200px;
  //   top: 55px;
  // 	 border: none;
  // 	 background: transparent;
  //   left: 50%;
  //   margin-left: -100px;
  // }
  // // 表格高度过小时，缺省图浮出表格
  //   /deep/ .ant-table-content {
  // 	 position: relative;
  // 	 overflow: hidden;
  // }
  .filter-warpper {
    padding: 15px;
    box-sizing: border-box;
    .filter-btn {
      display: flex;
      justify-content: flex-end;
    }
  }
  .filter-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      transform: scale(0.7) !important;
      border: 1px solid #d3d4d4;
      background: #f3f6f9;
      color: #d3d4d4;
      border-radius: 50%;
      padding: 2px;
      font-size: 12px;
    }
    &:hover {
      background: #f3f6f9 !important;
      .icon {
        background: #00c7db;
        border: 1px solid #00c7db;
        transition: all 0.2s;
        color: #fff;
      }
    }
    .icon {
      &:hover {
        background: #00c7db;
        border: 1px solid #00c7db;
        transition: all 0.2s;
      }
    }
    .active {
      border: 1px solid #00c7db;
      background: #00c7db;
      color: #fff;
    }
  }
  .pagition-config {
    padding: 10px 15px;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      cursor: pointer;
      display: flex;
      align-items: center;
      margin: 0;
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
<style lang="less">
  // 表格基础样式变量
  .th-base {
    color: #444444;
    background: #f3f6f9;
    border-bottom: 1px solid #ffffff;
    border-right: 1px solid #ffffff;
    font-size: 14px;
    font-weight: normal;
  }
  .td-base {
    // white-space: pre;
    color: #666666;
    border-bottom: 1px solid #ffffff;
  }
  .thtd-small {
    height: 31px;
    line-height: 31px;
    padding: 0 8px !important;
  }
  .thtd-middle {
    height: 39px;
    line-height: 39px;
    padding: 0 12px !important;
  }
  .thtd-large {
    height: 47px;
    line-height: 47px;
    padding: 0 12px !important;
  }
  .mumuxili-table {
    // base conf
    .ant-table {
      font-size: 13px;
      // 缺省图样式
      .ant-table-placeholder {
        border-top: none;
        position: absolute;
        top: calc(50% + 25px);
        left: 50%;
        transform: translate(-50%, -50%);
        border-bottom: none;
        padding: 0;
        background: transparent;
        .ant-empty {
          .ant-empty-image {
            height: 56px;
            width: auto;
            svg {
              width: 100%;
              height: 100%;
            }
          }
          .ant-empty-description {
            color: #999999;
            font-size: 14px;
          }
        }
      }
      .ant-table-content {
        .ant-table-header,
        .ant-table-body-inner,
        .ant-table-body {
          table {
            .ant-table-thead {
              tr {
                th {
                  .th-base();
                }
              }
            }
          }
        }
        .ant-table-header::-webkit-scrollbar {
          background: #f3f6f9;
          border-bottom: 1px solid #ffffff;
        }
        .ant-table-body,
        .ant-table-body-inner {
          table {
            .ant-table-tbody {
              tr {
                td {
                  .td-base();
                }
              }
              tr:nth-child(odd) {
                td {
                  border-bottom: 1px solid #ffffff;
                }
              }
              tr:nth-child(2n) {
                td {
                  background: #f9f9f9;
                  border-right: 1px solid #f9f9f9;
                }
              }
            }
          }
        }
        .ant-table-body,
        .ant-table-body-inner {
          table {
            .ant-table-tbody {
              tr {
                td {
                  height: 31px;
                  line-height: 31px;
                  padding: 0 8px;
                }
              }
            }
          }
        }
      }
    }
    // size:small
    .ant-table.ant-table-small {
      font-size: 13px;
      border: none;
      border-radius: 0;
      .ant-table-content {
        .ant-table-header,
        .ant-table-body-inner,
        .ant-table-body {
          table {
            .ant-table-thead {
              tr {
                th {
                  .thtd-small();
                }
              }
            }
          }
        }
        .ant-table-body,
        .ant-table-body-inner {
          table {
            .ant-table-tbody {
              tr {
                td {
                  .thtd-small();
                }
              }
            }
          }
        }
      }
    }
    // size:middle
    .ant-table.ant-table-middle {
      font-size: 13px;
      border: none;
      border-radius: 0;
      .ant-table-content {
        .ant-table-header,
        .ant-table-body-inner,
        .ant-table-body {
          table {
            .ant-table-thead {
              tr {
                th {
                  .thtd-middle();
                }
              }
            }
          }
        }

        .ant-table-body,
        .ant-table-body-inner {
          table {
            .ant-table-tbody {
              tr {
                td {
                  .thtd-middle();
                }
              }
            }
          }
        }
      }
    }
    // size:large
    .ant-table.ant-table-default {
      font-size: 13px;
      border: none;
      border-radius: 0;
      .ant-table-content {
        .ant-table-header,
        .ant-table-body-inner,
        .ant-table-body {
          table {
            .ant-table-thead {
              tr {
                th {
                  .thtd-large();
                }
              }
            }
          }
        }
        .ant-table-body,
        .ant-table-body-inner {
          table {
            .ant-table-tbody {
              tr {
                td {
                  .thtd-large();
                }
              }
            }
          }
        }
        .ant-table-body,
        .ant-table-body-inner {
          table {
            .ant-table-tbody {
              tr {
                td {
                  height: 47px;
                  line-height: 47px;
                  padding: 0 12px;
                }
              }
            }
          }
        }
      }
    }
  }
  .ant-table-thead
    > tr
    > th.ant-table-column-has-actions.ant-table-column-has-filters
    .anticon-filter.ant-table-filter-open,
  .ant-table-thead
    > tr
    > th.ant-table-column-has-actions.ant-table-column-has-filters
    .ant-table-filter-icon.ant-table-filter-open {
    background: #f3f6f9 !important;
  }
  .ant-table-body-inner {
    background: #ffffff !important;
  }
  .ant-table-fixed-left {
    background: #ffffff !important;
  }
  .ant-table-fixed-right {
    background: #ffffff !important;
  }
  /deep/ .ant-table-body-inner {
    background: #ffffff !important;
  }
  /deep/ .ant-table-fixed-left {
    background: #ffffff !important;
  }
  /deep/ .ant-table-fixed-right {
    background: #ffffff !important;
  }
</style>
