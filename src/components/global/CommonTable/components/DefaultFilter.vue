<template>
  <div class="default-filter">
    <a-input-search
      :value="inputValue"
      @search="onSearch"
      @change="e => onSearchChange(e)"
    ></a-input-search>
    <a-checkbox-group :ref="domFlag" :value="checkboxValue" @change="onChange">
      <a-checkbox
        v-for="(e, index) in temOptions"
        :key="`${e.value}${index}`"
        ref="defaultFilterItem"
        :value="e.value"
        class="defaultFilterItem"
      >
        {{ e.name }}
      </a-checkbox>
    </a-checkbox-group>
  </div>
</template>
<script>
  export default {
    name: 'DefaultFilter',
    props: {
      options: {
        type: Array,
        default: () => [],
      },
      domFlag: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        inputValue: '',
        checkboxValue: [],
        list: this.options,
        page: 1,
        temOptions: this.options.slice(0, 50),
      }
    },
    mounted() {
      this.$refs[this.domFlag].$el.addEventListener('scroll', this.handleScroll)
    },
    beforeDestroy() {
      this.$refs[this.domFlag].$el.removeEventListener(
        'scroll',
        this.handleScroll
      )
    },
    methods: {
      handleScroll(e) {
        const ss = e.target.scrollTop
        if (
          ss >= 770 * this.page &&
          this.temOptions.length < this.list.length
        ) {
          this.page += 1
          let list = this.list.slice(50 * (this.page - 1), 50 * this.page)
          this.temOptions = this.temOptions.concat(list)
        }
      },
      onChange(e) {
        this.$emit('filterChange', e)
        this.checkboxValue = e
      },
      onSearch(e) {
        this.temOptions = []
        this.page = 1
        this.$refs[this.domFlag].$el.scrollTop = 0
        if (e === '') {
          this.list = this.$props.options
        } else {
          this.list = this.$props.options.filter(item => {
            let name = item.name.toLowerCase(),
              target = e.toLowerCase()
            return name.indexOf(target) !== -1
          })
        }
        this.temOptions = this.list.slice(0, 50)
      },
      onSearchChange(data) {
        const e = data.target.value
        this.inputValue = e
        this.temOptions = []
        this.page = 1
        this.$refs[this.domFlag].$el.scrollTop = 0
        if (e === '') {
          this.list = this.$props.options
        } else {
          this.list = this.$props.options.filter(item => {
            let name = item.name.toLowerCase(),
              target = e.toLowerCase()
            return name.indexOf(target) !== -1
          })
        }
        this.temOptions = this.list.slice(0, 50)
      },
      clearSelections(data) {
        // this.$emit("filterChange", []);
        // this.checkboxValue = [];
        // console.log(this.checkboxValue)
      },
      reset() {
        this.$refs[this.domFlag].$el.scrollTop = 0
        this.checkboxValue = []
        this.inputValue = ''
        this.temOptions = this.options.slice(0, 50)
      },
    },
  }
</script>
<style lang="less" scope>
  .default-filter {
    .ant-checkbox-group {
      display: block;
      margin-top: 9px;
      overflow: hidden;
      overflow-y: auto;
      max-height: calc(100vh * 0.2);
      width: 300px;

      .ant-checkbox-wrapper {
        display: block;
        margin-left: 0;
        padding: 6px 0;
      }
    }
  }
</style>
