<template>
  <div>
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
            class="filter-tree"
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :selected-keys="selectedKeys"
            :tree-data="gData"
            :block-node="true"
            checkable
            style="height: 200px; overflow: auto; padding-right: 3px"
            :replace-fields="replaceFields"
            :filter-tree-node="filterTreeNode"
            @expand="onExpand"
            @check="onCheck"
            @select="onSelect"
          ></a-tree>
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
    methods: {
      filterTreeNode(node) {
        //过滤筛选
        const title = node ? node.title : ''
        let result = false
        if (this.searchValue !== '') {
          result = title.indexOf(this.searchValue) >= 0 ? true : false
        }
        return result
      },

      //处理数据行业数据
      loadData(val) {
        if (val.needEmpty) {
          const emptyObj = {
            children: [],
            id: -1,
            name: '空（未填写）',
            superId: -1,
            superName: null,
          }
          this.gData = [emptyObj, ...val.checkOpts]
        } else {
          this.gData = val.checkOpts
        }

        this.generateList(this.gData)
      },
      generateList(data) {
        //遍历数据，加父级标识
        for (let i = 0; i < data.length; i++) {
          const node = data[i]
          const id = node[this.replaceFields.key]
          const name = node[this.replaceFields.title]
          this.dataList.push({
            id,
            name,
            isParent:
              node[this.replaceFields.children] &&
              node[this.replaceFields.children].length > 0
                ? true
                : false,
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
      checkParent(id) {
        //判断是否有子集
        let flag = this.dataList.some(e => {
          return e.id === id && e.isParent
        })
        return flag
      },
      //check事件
      onCheck(e, info) {
        this.selectData = []
        this.selectedKeys = []
        info.checkedNodes.map(item => {
          //筛选父元素不进入选择项栏中
          if (!this.checkParent(item.key)) {
            this.selectedKeys.push(item.key)
            this.selectData.push({
              name: item.data.props.title,
              id: item.key,
            })
          }
        })
      },
      onChange(e) {
        const value = e.target.value
        this.searchValue = e.target.value

        if (value == '') {
          this.expandedKeys = []
        } else {
          this.autoExpandParent = true
          this.expandedKeys = this.dataList
            .filter(item => {
              return item.name.indexOf(value) > -1
            })
            .map(item => item.id)
        }
        this.filterTreeNode()
      },
      onSelect(selectKeys, e) {
        e.node.$el.childNodes[1].click() //通过e对象获取checkBox事件，解决点击文字不触发选中问题
        this.$forceUpdate()
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
        // this.$forceUpdate();
      },
      //重置列表
      reset() {
        this.selectedKeys = []
        this.selectData = []
        // this.$forceUpdate();
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
  div {
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
          // margin: 0;
          // padding: 7px 16px 15px 1px;
          margin: 7px 16px 15px 1px;
          width: 196px;
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
