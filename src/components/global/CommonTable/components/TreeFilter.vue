<template>
  <div>
    <a-tree-select
      v-model="value"
      style="width: 100%"
      :tree-data="treeData"
      tree-data-simple-mode
      tree-checkable
      :allow-clear="true"
      search-placeholder="Please select"
      :load-data="onLoadData"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      @focus="focus"
      @blur="blur"
      @search="search"
      @change="change"
    ></a-tree-select>
  </div>
</template>

<script>
  import { getProductCata } from '@/api/common'

  export default {
    name: 'TreeFilter',
    data() {
      return {
        value: [],
        treeData: [],
      }
    },
    mounted() {
      // console.log('mounted')
      let data = {
        pid: -1,
        level: 1,
      }
      getProductCata(data).then(res => {
        this.dealCata(res.data, -1)
        this.treeData = res.data
      })
    },
    methods: {
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
      onLoadData(treeNode) {
        const { id, level } = treeNode.dataRef //id:当前分类的id；index:当前分类在列表中的位置；level：当前分类是第几层分类
        let data = {
          pid: id,
          level: level + 1,
        }
        return getProductCata(data).then(res => {
          this.dealCata(res.data, id)
          this.treeData = this.treeData.concat(res.data)
        })
      },
      focus(e) {
        // console.log('focus', e)
      },
      blur(e) {
        // console.log('blur', e)
      },
      search(value) {
        // console.log('value', value)
      },
      change(value, label, extra) {
        this.$emit('filterChange', value.join(','))
        // console.log('value', value)
        // console.log('label', label)
        // console.log('extra', extra)
      },
      reset() {
        this.value = []
      },
    },
  }
</script>
