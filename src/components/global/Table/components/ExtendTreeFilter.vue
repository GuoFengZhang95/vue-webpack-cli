<template>
  <!-- 树组件扩展 ----  选择父级时只显示父级数据 子集全选 取消其中一个子集 父级选中状态消失 -->
  <div class="wrap">
    <div class="box">
      <div class="options">
        <p class="box-head">
          <img src="../icon/filter.png" alt="" class="icon-img" />
          筛选
        </p>
        <a-input class="tree-search" allow-clear @change="onChange"></a-input>
        <div class="tree-container">
          <a-tree
            v-model="selectedKeys"
            height="{200}"
            class="filter-tree"
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :selected-keys="selectedKeys"
            :tree-data="gData"
            checkable
            style="height: 200px; overflow: auto; padding-right: 3px"
            :replace-fields="replaceFields"
            @expand="onExpand"
            @check="onCheck"
            @select="onSelect"
          >
            <template slot="custom" slot-scope="item">
              <span
                :id="item.id"
                :render="showParent(item)"
                v-html="
                  item.name &&
                  item.name.replace(
                    searchValue,
                    `<i style='color:#00c7db'>${searchValue}</i>`
                  )
                "
              ></span>
            </template>
          </a-tree>
        </div>
      </div>
      <div class="line"></div>
      <div class="changeBox">
        <p class="selectCount">已选{{ selectData.length }}项</p>
        <ul>
          <li
            v-for="(e, i) in selectData"
            :key="i"
            class="tag-item"
            @click="preventDefault(e)"
          >
            <a-tooltip placement="top">
              <template slot="title">
                {{ e.name }}
              </template>
              <span class="tagLabel">{{ e.name }}</span>
            </a-tooltip>
            <i class="mmxlicon mi-close-circle-fill"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      column: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        expandedKeys: [],
        selectedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        gData: [],
        renderData: [],
        searchData: [],
        replaceFields: {
          //替换组件中字段为数据源中的字段
          title: 'name',
          key: 'id',
          children: 'children',
        },
        dataList: [], //处理后数据容器
        selectData: [], //选择数据
        customFieldsFlag: false, // 是否自定义数据字段名
        nodeList: [],
        searchResult: [],
        checkStrictly: false,
        isSearch: false,
        cacheData: [],
        timer: null,
      }
    },
    watch: {
      selectedKeys: {
        deep: true,
        handler: function (val, pre) {
          this.$emit('beforeFilter', {
            tree: {
              dataIndex: this.column.dataIndex,
              filterKey: this.column.filterKey,
              filterObj: {
                value: val,
                filtered: val.length > 0 ? 1 : 0,
              },
              filtered: val.length > 0 ? 1 : 0,
            },
          })
        },
      },
      column: {
        handler: function (val) {
          if (val.replaceFields) {
            this.replaceFields = Object.assign(
              {
                title: 'name',
                key: 'id',
                children: 'children',
              },
              val.replaceFields
            )
          } else if (val.checkOpts.some(item => item.son)) {
            this.replaceFields.children = 'son'
          }
          this.loadData(val)
        },
        deep: true,
        immediate: true,
      },
    },
    mounted() {
      window.onwraning = function (message, source, lineno, colno, error) {
        console.log('捕获到异常：', { message, source, lineno, colno, error })
      }
    },
    methods: {
      showParent(item) {
        let _this = this
        setTimeout(() => {
          document.getElementById(
            item.id
          ).parentNode.parentNode.parentNode.style.display = 'block'
          if (!item.show && _this.isSearch) {
            document.getElementById(
              item.id
            ).parentNode.parentNode.parentNode.style.display = 'none'
          }
        }, 10)
      },

      //处理数据
      loadData(val) {
        this.gData = []
        this.renderData = []
        this.dataList = []
        const emptyObj = {
          children: [],
          id: -1,
          name: '空（未填写）',
          superId: -1,
          superName: null,
        }
        this.gData = this.setLeaf([emptyObj, ...val.checkOpts])
        this.renderData = this.setLeaf([emptyObj, ...val.checkOpts])
        this.generateList(this.renderData)
      },
      generateList(data) {
        //遍历数据，加父级标识
        for (let i = 0; i < data.length; i++) {
          const node = data[i]
          const id = node[this.replaceFields.key]
          const name = node[this.replaceFields.title]
          const superId = node.superId
          this.dataList.push({
            id,
            name,
            superId,
            isParent:
              node[this.replaceFields.children] &&
              node[this.replaceFields.children].length > 0
                ? true
                : false,
            childList:
              node[this.replaceFields.children] &&
              node[this.replaceFields.children].map(item => item.id),
          }) //添加父级标识
          if (node[this.replaceFields.children]) {
            this.generateList(node[this.replaceFields.children])
          }
        }
      },
      onExpand(expandedKeys) {
        //展开项事件
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      },
      //已选中的存在父级时，过滤该父级下的子集
      checkParent(node) {
        this.dataList.forEach(item => {
          if (item.id == node.id && item.isParent) {
            this.nodeList = item.childList
          }
        })
        this.nodeList.forEach(item => {
          this.selectedKeys.forEach((item2, index2) => {
            if (item == item2) {
              this.selectedKeys.splice(index2, 1)
            }
          })
          this.selectData.forEach((item3, index3) => {
            if (item == item3.id) {
              this.selectData.splice(index3, 1)
            }
          })
        })
        this.$forceUpdate()
      },
      //检查是否需要展开
      checkExpand() {
        let idArr = []
        this.dataList.forEach(item1 => {
          this.searchResult.forEach(item2 => {
            if (item1.id == item2) {
              if (item1.childList && item1.childList.length > 0) {
                item1.childList.forEach(item => {
                  if (this.searchResult.indexOf(item) > -1) {
                    idArr.push(item)
                  }
                })
              } else {
                idArr.push(item2)
              }
            }
          })
        })
        return idArr
      },
      //check事件
      onCheck(e, info) {
        this.selectData = []
        this.selectedKeys = []
        info.checkedNodes.forEach(item => {
          if (!item.data.props.isEmpty) {
            this.selectedKeys.push(item.key)
            this.selectData.push({
              name: item.data.props.name,
              id: item.key,
              superId: item.data.props.superId,
              parents: item.data.props.parents,
            })
          }
        })
        this.$forceUpdate()
        this.checkRule(info)
        this.nodeList = []
      },
      //去重
      deleteData() {},
      //检查数据
      checkRule(info) {
        let checkId = info.node._props.dataRef.id
        let superId = info.node._props.dataRef.superId
        let parents = info.node._props.dataRef.parents
        let dataIndex = []
        this.dataList.forEach(item1 => {
          this.selectedKeys.forEach((item2, index2) => {
            if (item1.id == item2) {
              item1.childList &&
                item1.childList.forEach((item3, index3) => {
                  this.selectedKeys.forEach((item4, index4) => {
                    if (item4 == item3) {
                      dataIndex.push(index4)
                    }
                  })
                })
            }
          })
        })
        //从后向前删除
        dataIndex.sort((a, b) => {
          return b - a
        })
        dataIndex.forEach(index => {
          this.selectedKeys.splice(index, 1)
          this.selectData.splice(index, 1)
        })
        //缓存已选择数据 去重
        this.cacheData = [...this.cacheData, ...this.selectData]
        let obj = {}
        this.cacheData = this.cacheData.reduce(function (a, b) {
          obj[b.id] ? '' : (obj[b.id] = true && a.push(b))
          return a
        }, [])
        if (!info.checked) {
          //取消选中 所有子集都要取消
          this.cacheData = this.cacheData.filter(
            item => item.parents.indexOf(checkId) == -1
          )
          //取消选中 所有关联父级都要取消
          this.cacheData = this.cacheData.filter(
            item => parents.indexOf(item.id) == -1
          )
          //取消自身节点
          this.cacheData = this.cacheData.filter(item => item.id != checkId)
        } else {
          //选中时取消所有子集
          this.cacheData.forEach(item => {
            this.cacheData = this.cacheData.filter(
              item2 => item2.parents.indexOf(item.id) < 0
            )
          })
        }
        this.selectData = this.cacheData.map(item => item)
        this.selectedKeys = this.selectData.map(item => item.id)
      },
      //遍历树
      setLeaf(obj) {
        function add(arr, idArr, id) {
          let temp = []
          arr &&
            arr.map(item => {
              item['scopedSlots'] = { title: 'custom' }
              item['show'] = false
              temp.indexOf(id) == -1 && id && temp.push(id)
              item.parents = [...temp, ...idArr]
              if (item.children && item.id) {
                add(item.children, item.parents, item.id)
              }
            })
        }
        add(obj, [], 0)
        return obj
      },
      onChange(e) {
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.searchTree(e)
        }, 500)
      },
      //搜索树
      searchTree(e) {
        this.gData = JSON.parse(JSON.stringify(this.renderData))
        this.searchResult = []
        this.searchValue = e.target.value
        if (this.searchValue.trim().length == 0) {
          this.isSearch = false
          this.expandedKeys = []
          return
        }
        this.gData = this.filterTree()
        this.autoExpandParent = true
        this.expandedKeys = this.searchResult
      },
      // 筛选树
      filterTree() {
        let renderData = []
        let _this = this
        this.isSearch = true
        function loop(target, keyword) {
          let result = []
          target.forEach(item => {
            if (item.children && item.children.length) {
              let childTemp = loop(item.children, keyword)
              if (childTemp.length) {
                if (!(item.children.length == childTemp.length)) {
                  childTemp.push({
                    //随机数id
                    id:
                      new Date().getTime() + Math.floor(Math.random() * 10000),
                    name: (
                      new Date().getTime() + Math.floor(Math.random() * 10000)
                    ).toString(),
                    isEmpty: true,
                    show: false,
                    scopedSlots: { title: 'custom' },
                  })
                }
                item.show = true
                result.push(
                  Object.assign({}, item, {
                    children: childTemp,
                  })
                )
              } else {
                if (item.name.indexOf(keyword) > -1) {
                  item.show = true
                  item.children &&
                    item.children.forEach(item => {
                      item['show'] = true
                    })
                  _this.searchResult.push(item.superId)
                  result.push(item)
                }
              }
            } else {
              if (item.name.indexOf(keyword) > -1) {
                item.show = true
                item.children &&
                  item.children.forEach(item => {
                    item['show'] = true
                  })
                _this.searchResult.push(item.superId)
                result.push(item)
              }
            }
          })
          return result
        }
        renderData = loop(this.gData, this.searchValue)
        return renderData
      },
      onSelect(selectKeys, e) {
        e.node.$el.childNodes[1].click() //通过e对象获取checkBox事件，解决点击文字不触发选中问题
      },
      //选择项删除事件
      preventDefault(e) {
        let id
        this.selectedKeys.splice(this.selectedKeys.indexOf(e.id), 1)
        this.selectData.map((item, i) => {
          if (e.id === item.id) {
            id = i
          }
        })
        this.selectData.splice(id, 1)
        this.cacheData.splice(id, 1)
        this.selectedKeys = this.selectData.map(item => item.id)
        this.$forceUpdate()
      },
      //重置列表
      reset() {
        this.expandedKeys = []
        this.selectedKeys = []
        this.selectData = []
        this.cacheData = []
        const flag = document.getElementsByClassName('ant-input-clear-icon')
        if (flag.length > 0) {
          document.getElementsByClassName('ant-input-clear-icon')[0].click()
        }
        this.$emit('beforeFilter', {
          tree: {
            dataIndex: this.column.dataIndex,
            filterKey: this.column.filterKey,
            filterObj: {
              value: [],
              filtered: this.selectedKeys.length > 0 ? 1 : 0,
            },
            filtered: this.selectedKeys.length > 0 ? 1 : 0,
          },
        })
        this.selectedKeys = []
      },
    },
  }
</script>

<style lang="scss" scoped>
  .wrap {
    padding: 0;
    .box {
      background: transparent;
      display: flex;
      font-size: 13px;
      .options {
        .box-head {
          font-size: 14px;
          margin-bottom: 10px;
          .icon-img {
            vertical-align: -2px;
          }
        }
        .tree-container {
          /deep/ .filter-tree {
            position: relative;
            .ant-tree-checkbox {
              position: absolute;
              right: 8px;
            }
            //tree默认样式
            > li {
              padding-right: 37px;
              .ant-tree-node-content-wrapper {
                width: calc(100% - 9px);
                &:hover {
                  color: #00c7db;
                  background: transparent;
                }
              }
              .ant-tree-node-selected {
                background: transparent;
              }
            }
          }
        }
        .tree-search {
          margin: 7px 16px 15px 1px;
          padding-right: 12px;
          /deep/.ant-input-suffix {
            right: 20px;
          }
        }
      }
      .line {
        width: 1px;
        height: 347px;
        background: #e9e9e9;
        opacity: 1;
        position: absolute;
        right: 227px;
        top: 0;
      }
      .changeBox {
        height: 268px;
        width: 213px;
        overflow-y: auto;
        border: 0;
        padding: 0;
        position: relative;
        transform: translateX(15px);
        flex-shrink: 0;
        & > :first-child {
          margin-top: 3px;
        }
        .selectCount {
          width: 100%;
        }
        ul {
          margin-top: 17px;
          width: 100%;
        }
        .tag-item {
          position: relative;
          color: #666;
          padding: 3px;
          margin-bottom: 3px;
          .tagLabel {
            user-select: none;
            display: inline-block;
            width: 150px;
            max-width: 150px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
            font-weight: 400;
            overflow-x: hidden;
          }
          .mmxlicon {
            font-size: 14px;
            position: absolute;
            right: 16px;
            color: #cccccc;
            cursor: pointer;
          }
        }
      }
    }
  }
  //滚动条
  *::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }
  *::-webkit-scrollbar-track {
    background: #ffffff;
  }
  *::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #d9d9d9;
  }
</style>
