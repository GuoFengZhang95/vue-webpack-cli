<script>
  import DefaultFilter from './components/DefaultFilter'
  import DefaultFilterAjax from './components/DefaultFilterAjax'
  import RangeFilter from './components/RangeFilter'
  import TimeFilter from './components/TimeFilter'
  import TreeFilter from './components/TreeFilter'

  export default {
    name: 'CommonTable',
    components: {
      DefaultFilter,
      RangeFilter,
      TimeFilter,
      TreeFilter,
      DefaultFilterAjax,
    },
    props: {
      rowKey: {
        type: String,
        default: 'listId',
      },
      scroll: {
        type: Object,
        default: () => {},
      },
      columns: {
        type: Array,
        default: () => [],
      },
      rowSelection: {
        type: Object,
        default: () => {},
      },
      dataSource: {
        type: Array,
        default: () => [],
      },
      tableSize: {
        type: String,
        default: '',
      },
      loading: {
        type: Boolean,
        default: false,
      },
      expandedRowRender: {
        type: Function,
        default: () => {},
      },
      expandIconColumnIndex: {
        type: Number,
        default: -1,
      },
      expandedRowKeys: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        show: null,
        sortFlag: '',
        sortIndex: null,
        filterData: {},
        filterItemCollection: [],
      }
    },
    computed: {},
    methods: {
      // 设置表格行属性
      customRow(record, index) {
        return {
          on: {
            click: () => {
              this.$emit('tableRowClick', record, index)
            },
          },
        }
      },
      customRender(text, record, index, e) {
        let node = text
        if (e.customRender && e.customRender(text, record, index)) {
          node = e.customRender(text, record, index)
        }
        return node
      },
      showPop(e, index) {
        // 手动控制日期组件的显示隐藏
        if (this.$refs['TimeFilter']) {
          this.$refs['TimeFilter'].open = false
        }
        this.show = e ? index : null
      },
      // 主按钮操作
      operation(e) {
        // console.log('e', e)
        if (e === 'submit') {
          this.$emit('confirmFiltering', this.filterData)
        }
      },
      reset(e) {
        // console.log('重置', e)
        const type = e.filterInfo.type
        this.filterData.name = e.dataIndex
        // filter模块
        switch (type) {
          case 'default':
            this.$refs.DefaultFilter.reset()
            this.filterData = { ...this.filterData, ...{ value: '' } }
            break
          case 'default-ajax':
            this.$refs.DefaultFilterAjax.reset()
            // console.log(this.filterData)
            this.filterData = { ...this.filterData, ...{ value: '' } }
            break
          case 'range':
            this.$refs.RangeFilter.reset()
            this.filterData = { ...this.filterData, ...{ value: [] } }
            break
          case 'time':
            this.$refs.TimeFilter.reset()
            this.filterData = { ...this.filterData, ...{ value: [] } }
            break
          case 'tree':
            this.$refs.TreeFilter.reset()
            this.filterData = { ...this.filterData, ...{ value: [] } }
            break
        }
        // sort模块
        this.sortFlag = ''
        this.sortIndex = null
        this.$emit(
          'confirmFiltering',
          Object.assign(this.filterData, { isReset: true })
        )
        this.$emit('confirmSorting', {
          value: '',
          name: e.dataIndex,
          isReset: true,
          type,
        })
      },
      // 顶部筛选项展示
      filterItemCollectionRender(data) {
        let index = this.filterItemCollection.findIndex(
          item => item.name === data.name
        )
        if (index !== -1) {
          this.filterItemCollection.splice(index, 1, data)
        } else {
          this.filterItemCollection.push(this.filterData)
        }
      },
      //
      clearSelections(data) {},
      // 排序操作
      confirmSorting(e, dataIndex, index) {
        if (this.sortFlag === e) {
          this.sortFlag = ''
          this.sortIndex = null
          this.$emit('confirmSorting', { value: '', name: dataIndex })
        } else {
          this.sortFlag = e
          this.sortIndex = index
          this.$emit('confirmSorting', { value: e, name: dataIndex })
        }
      },
      // 筛选核心模块渲染
      filterFunctionRender(e) {
        let node = null
        if (e.filterInfo && e.filterInfo.type) {
          const type = e.filterInfo.type
          const name = e.titleName ? e.titleName : e.title
          switch (type) {
            case 'default':
              node = (
                <default-filter
                  options={e.filterInfo.options}
                  onFilterChange={i =>
                    this.defaultFilterChange(i, e.dataIndex, name)
                  }
                  domFlag={e.key}
                  ref='DefaultFilter'
                ></default-filter>
              )
              break
            case 'default-ajax':
              node = (
                <default-filter-ajax
                  ajax={e.filterInfo.ajax}
                  ajax-data={e.filterInfo.ajaxData}
                  onFilterChange={i =>
                    this.defaultAjaxFilterChange(i, e.dataIndex, name)
                  }
                  domFlag={e.key}
                  ref='DefaultFilterAjax'
                ></default-filter-ajax>
              )
              break
            case 'range':
              node = (
                <range-filter
                  onFilterChange={i => this.rangeFilterChange(i, e.dataIndex)}
                  ref='RangeFilter'
                ></range-filter>
              )
              break
            case 'time':
              node = (
                <time-filter
                  onFilterChange={i => this.timeFilterChange(i, e.dataIndex)}
                  ref='TimeFilter'
                ></time-filter>
              )
              break
            case 'tree':
              node = (
                <tree-filter
                  onFilterChange={i => this.treeFilterChange(i, e.dataIndex)}
                  ref='TreeFilter'
                ></tree-filter>
              )
              break
            default:
              node = (
                <DefaultFilter
                  options={e.filterInfo.options}
                  onFilterChange={i =>
                    this.defaultFilterChange(i, e.dataIndex, name)
                  }
                  domFlag={e.key}
                  ref='DefaultFilter'
                ></DefaultFilter>
              )
              break
          }
        } else {
          node = null
        }
        return node
      },
      // default筛选模块传出来的方法
      defaultFilterChange(e, dataIndex, title) {
        const value = e.join(',')
        this.filterData = { name: dataIndex, value, title }
      },
      // default-ajax筛选模块传出来的方法
      defaultAjaxFilterChange(e, dataIndex, title) {
        const value = e.join(',')
        this.filterData = { name: dataIndex, value, title }
      },
      // range筛选模块传出来的方法
      rangeFilterChange(e, dataIndex) {
        this.filterData = { name: dataIndex, value: e }
      },
      // time筛选模块传出来的方法
      timeFilterChange(e, dataIndex) {
        this.filterData = { name: dataIndex, value: e }
      },
      //
      treeFilterChange(e, dataIndex) {
        this.filterData = { name: dataIndex, value: e }
      },
      //
      expandIcon(props) {
        const id = props.record[this.rowKey]
        let list = this.expandedRowKeys
        if (props.expanded) {
          let index = list.indexOf(id)
          list.splice(index, 1)
        } else {
          list.push(id)
        }
        this.$emit('expandedListChange', list, id)
      },
    },
    render(h) {
      return (
        <div>
          {
            // this.filterItemCollection.length > 0 && this.filterItemCollection.map(item => {
            //   return item.value && item.value !== '' ? <div key={item.name} onClick={() => this.clearSelections(item)}>
            //   <span>{item.title}</span>: {item.value}
            //   </div> : null
            // })
          }
          <a-table
            scroll={this.scroll}
            class='common-table'
            rowSelection={this.rowSelection}
            dataSource={this.dataSource}
            size={this.tableSize}
            rowKey={record => record[this.rowKey]}
            pagination={false}
            customRow={this.customRow}
            customHeaderCell={this.customHeaderCell}
            id='common-table'
            loading={this.loading}
            expandIconAsCell={false}
            // expandIconColumnIndex={this.expandIconColumnIndex}
            expandedRowKeys={this.expandedRowKeys}
            expandIcon={props => (
              <span></span>
              // <a-icon
              //   type="down"
              //   onClick={() => this.expandIcon(props)}
              //   class={props.expanded ? "expandIcon up" : "expandIcon"}
              // />
            )}
            expandedRowRender={(record, index) => {
              return this.$scopedSlots?.expandedRowRender(record, index) // eslint-disable-line
            }}
          >
            {this.columns.map((e, index) => {
              if (e.hasPopover) {
                const sortOperation = e.sortOperation ? true : false
                const filterOperation = e.filterOperation ? true : false
                e.titleFinal = (
                  <div class='renderTh'>
                    <span class='title'>{e.title}</span>
                    <a-popover
                      trigger='click'
                      // trigger="null"
                      placement='bottom'
                      visible={this.show === index}
                      overlayClassName='common-popover'
                      onVisibleChange={e => this.showPop(e, index)}
                      arrowPointAtCenter={true}
                      autoAdjustOverflow={true}
                      getPopupContainer={() => {
                        return document.getElementById('common-table')
                      }}
                    >
                      <template slot='content'>
                        <div class='content'>
                          {sortOperation ? (
                            <ul class='select'>
                              <li
                                style={{
                                  cursor: 'pointer',
                                  color:
                                    this.sortFlag === 'asc' &&
                                    this.sortIndex === index
                                      ? '#00c7db'
                                      : '#666',
                                }}
                                onClick={() =>
                                  this.confirmSorting('asc', e.dataIndex, index)
                                }
                              >
                                升序A to Z
                              </li>
                              <li
                                style={{
                                  cursor: 'pointer',
                                  color:
                                    this.sortFlag === 'desc' &&
                                    this.sortIndex === index
                                      ? '#00c7db'
                                      : '#666',
                                }}
                                onClick={() =>
                                  this.confirmSorting(
                                    'desc',
                                    e.dataIndex,
                                    index
                                  )
                                }
                              >
                                降序Z to A
                              </li>
                            </ul>
                          ) : null}
                          {filterOperation ? (
                            <ul class='select'>
                              <li class='no-border'>筛选</li>
                            </ul>
                          ) : null}
                          {filterOperation ? (
                            <div class='main-function'>
                              {this.filterFunctionRender(e)}
                            </div>
                          ) : null}

                          <div class='btns'>
                            <a-button
                              type='primary'
                              onClick={() => this.operation('submit')}
                            >
                              确定
                            </a-button>
                            <a-button
                              type='plain'
                              onClick={() => this.reset(e)}
                            >
                              重置
                            </a-button>
                            <a-button
                              type='plain'
                              onClick={() => this.showPop(false, index)}
                            >
                              取消
                            </a-button>
                          </div>
                        </div>
                      </template>
                      <a-icon
                        type='down-circle'
                        style={{
                          color: this.show === index ? '#00C7DB' : '#999999',
                        }}
                      />
                    </a-popover>
                  </div>
                )
              }
              return (
                <a-table-column
                  align='left'
                  key={e.dataIndex}
                  title={e.titleFinal ? e.titleFinal : e.title}
                  dataIndex={e.dataIndex}
                  ellipsis={true}
                  width={e.width}
                  // fixed={e.fixed}
                  customRender={(text, record, index) =>
                    this.customRender(text, record, index, e)
                  }
                  rowKey={record => record.userId}
                ></a-table-column>
              )
            })}
          </a-table>
        </div>
      )
    },
  }
</script>
<style lang="less">
  .common-table {
    position: relative;

    .ant-table-body {
      max-height: 660px !important;
    }

    td {
      position: relative;
      .expandIcon {
        font-size: 14px;
        color: rgb(0, 199, 219);
        position: absolute;
        // top: 50%;
        left: 52%;
        transform: translate(0, -50%);
        transition: all 0.3s;

        &.up {
          transform: rotate(180deg) translate(0, 50%);
        }
      }
    }
    th {
      position: relative;
      .ant-table-header-column {
        display: block !important;
      }
      .renderTh {
        padding-left: 12px;
        position: absolute;
        width: 100%;
        // height: 100%;
        top: 0;
        left: 0px;
        right: 0px;
        z-index: 9;
        .title {
          display: inline-block;
          width: 100%;
          height: 100%;
        }
        .anticon.anticon-down-circle {
          display: inline-block;
          right: 12px;
          position: absolute;
          top: 50%;
          transform: translate(0, -50%);
        }
        > span {
          position: relative;
        }
      }
    }
  }
  .common-popover {
    .content {
      min-width: 248px;
      .select {
        display: block;
        width: 100%;
        li {
          display: block;
          font-size: 14px;
          height: 40px;
          line-height: 38px;
          color: #666666;
          border-bottom: 1px solid #e9e9e9;
          &:hover {
            color: #00c7db;
          }
          &:last-child {
            border: none;
          }
        }
      }

      .main-function {
        background: #f9f9f9;
        padding: 10px;
      }

      .btns {
        margin-top: 12px;
        display: flex;
        justify-content: flex-end;
        .ant-btn {
          width: 58px;
          height: 32px;
          border-radius: 4px;
          margin-left: 12px;
          text-align: center;
          padding: 0;

          &.ant-btn-primary {
            background: #00c7db;
          }
          &.ant-btn-default {
            color: #666666;
            border: 1px solid #d9d9d9;
            &:hover,
            &.hover,
            &:active,
            &.active {
              color: #00c7db;
              border-color: #00c7db;
            }
          }
        }
      }
    }
  }

  .td-img {
    width: 28px;
    height: 28px;
  }
</style>
