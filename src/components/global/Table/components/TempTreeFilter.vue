<template>
  <div>
    <a-tree-select
      v-model="selectedKeys"
      style="width: 100%"
      :tree-data="treeData"
      tree-data-simple-mode
      tree-checkable
      :allow-clear="true"
      search-placeholder="Please select"
      :load-data="onLoadData"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    ></a-tree-select>
  </div>
</template>

<script>
  export default {
    name: 'TempTreeFilter',
    props: {
      column: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        selectedKeys: [],
        treeData: [],
        autoExpandParent: true,
      }
    },
    watch: {
      selectedKeys: {
        deep: true,
        handler: function (val, pre) {
          this.$emit('beforeFilter', {
            temptree: {
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
    },
    mounted() {
      this.getProductCatalog()
    },
    methods: {
      async getProductCatalog() {
        let opts = {
          method: 'get',
          url: '/cmsApi/common/catalog',
          data: {
            pid: -1,
            level: 1,
          },
        }
        let res = await this.$mumuHttp(opts)
        this.dealCata(res.data.data, -1)
        this.treeData = res.data.data
      },

      dealCata(arr, pId, isLeaf = false) {
        arr.forEach((item, index) => {
          if (item.level === 5) {
            isLeaf = true
          }
          item.title = item.name
          item.value = item.id
          item.pId = pId
          item.isLeaf = isLeaf
          delete item.firstLetter
          delete item.img
          delete item.is_show
          delete item.num
          delete item.paramsUrl
          delete item.time
        })
      },
      async onLoadData(treeNode) {
        const { id, level } = treeNode.dataRef //id:当前分类的id；index:当前分类在列表中的位置；level：当前分类是第几层分类
        let opts = {
          method: 'get',
          url: '/cmsApi/common/catalog',
          data: {
            pid: id,
            level: level + 1,
          },
        }
        let res = await this.$mumuHttp(opts)
        this.dealCata(res.data.data, id)
        return (this.treeData = this.treeData.concat(res.data.data))
      },
      reset() {
        this.selectedKeys = []
        this.$emit('beforeFilter', {
          temptree: {
            dataIndex: this.column.dataIndex,
            filterKey: this.column.filterKey,
            filterObj: {
              value: [],
              filtered: this.selectedKeys.length > 0 ? 1 : 0,
            },
            filtered: this.selectedKeys.length > 0 ? 1 : 0,
          },
        })
      },
    },
  }
</script>
