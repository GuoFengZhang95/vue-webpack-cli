<template>
  <a-input-search
    placeholder="请输入要搜索的内容"
    enter-button="搜索"
    size="default"
    class="search-input"
    @search="search"
  ></a-input-search>
</template>

<script>
  export default {
    name: 'MuSearch',
    props: {
      test: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {}
    },
    computed: {},
    watch: {},
    methods: {
      search(value, event) {
        // if (value.trim()) {
        //   this.$emit("globalSearch", value.trim())
        // }
        this.$emit('globalSearch', value.trim())
      },
    },
  }
</script>

<style lang="less" scoped>
  .search-input {
    width: 300px;
  }
</style>
