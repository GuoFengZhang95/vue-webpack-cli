<template>
  <div class="group-wrap">
    <a-select
      v-if="selectVisible"
      class="group-wrap-select"
      dropdown-class-name="group-wrap-dropdown"
      :dropdown-match-select-width="false"
      :get-popup-container="triggerNode => triggerNode.parentNode"
      :default-value="defaultValueCptd"
      @change="handleSelectChange"
    >
      >
      <a-select-option
        v-for="item in optionsList"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </a-select-option>
    </a-select>
    <a-input-search
      v-model="searchKey"
      :placeholder="placeholder"
      class="search-input"
      @change="handleInputChange"
      @search="handleSearch"
    >
      <a-button slot="enterButton" type="primary">搜索</a-button>
    </a-input-search>
    <MuButton
      v-if="hasFilter"
      class="filter-reset ml10"
      type="ghost"
      shape="round"
      icon="mi-refresh-circle"
      @click="resetFilter"
    >
      重置筛选
    </MuButton>
  </div>
</template>

<script>
  export default {
    name: 'MuSearchGroup',
    props: {
      hasFilter: {
        type: Boolean,
        default: false,
      }, // 重置筛选按钮
      selectVisible: {
        type: Boolean,
        default: true,
      }, // 搜索组件select是否展示
      value: {
        type: [String, Number],
        default: '',
      }, // 搜索值keyword（change时实时触发$emit事件会卡顿）
      defaultValue: {
        type: [String, Number],
        default: '',
        require: true,
      }, // select菜单指定默认选中的条目
      defaultInputValue: {
        type: [String, Number],
        default: '',
        require: true,
      }, //输入框默认值
      optionsList: {
        type: Array,
        require: true,
        default: () => [],
      }, // select菜单选项
      placeholder: {
        type: String,
        default: '请输入要搜索的内容',
      },
      inputValueTrim: {
        type: Boolean,
        default: true,
      }, // 是否需要对搜索值trim
    },
    data() {
      return {
        searchKey: '',
      }
    },
    computed: {
      defaultValueCptd() {
        if (this.defaultValue) {
          return this.defaultValue
        } else {
          return this.optionsList && this.optionsList[0]
            ? this.optionsList[0].value
            : ''
        }
      },
    },
    mounted() {
      this.searchKey = this.defaultInputValue
    },
    methods: {
      // 重置所有筛选
      resetFilter() {
        this.$emit('resetFilter')
      },
      // 搜索
      handleSearch() {
        if (this.inputValueTrim) {
          this.searchKey = this.searchKey.toString().trim()
        }
        this.$emit('search', this.searchKey)
      },
      // select change事件
      handleSelectChange(value) {
        this.$emit('selectChange', value)
      },
      // 输入框
      handleInputChange(e) {
        // this.$emit('input', e.target.value)
      },
    },
  }
</script>

<style lang="less">
  .group-wrap {
    display: flex;
    > .group-wrap-select {
      width: auto;
      font-size: 13px;
      > .ant-select-selection {
        border: none;
        box-shadow: none;
        width: auto !important;
        > .ant-select-selection__rendered {
          margin-left: 0;
          margin-right: 35px;
          color: @primary-color;
        }
        > .ant-select-arrow {
          color: @primary-color;
          right: 16px;
        }
      }
    }
    .group-wrap-dropdown {
      .ant-select-dropdown-content {
        .ant-select-dropdown-menu-item {
          font-size: 13px;
        }
      }
    }

    > .search-input {
      width: 300px;
      > .ant-input-wrapper {
        > .ant-input {
          font-size: 13px;
        }
        > .ant-input-group-addon {
          > .ant-btn {
            font-size: 13px;
          }
        }
      }
    }
  }
</style>
