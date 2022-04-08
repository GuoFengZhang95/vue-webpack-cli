<template>
  <!-- 设置表格间距 -->
  <a-popover trigger="hover" placement="topLeft">
    <template #title>表格间距</template>
    <template #content>
      <div
        v-for="sizeItem in sizeOptions"
        :key="sizeItem.value"
        class="size-option"
        :class="size === sizeItem.value ? 'selected' : ''"
        @click="asideResize(sizeItem.value)"
      >
        <img :src="sizeItem.icon" class="size-option-icon" />
        {{ sizeItem.label }}
      </div>
    </template>
    <a-icon type="menu" class="menu-icon center-flex"></a-icon>
  </a-popover>
</template>

<script>
  const compact = require('../icon/line-compact.png')
  const comfortable = require('../icon/line-comfortable.png')
  const easy = require('../icon/line-easy.png')
  export default {
    name: 'SizePopover',
    props: {
      size: {
        type: String,
        default: 'middle',
      },
    },
    data() {
      return {
        sizeOptions: [
          { label: '紧凑', value: 'small', icon: compact },
          { label: '舒适', value: 'middle', icon: comfortable },
          { label: '宽松', value: 'default', icon: easy },
        ],
      }
    },
    methods: {
      asideResize(size) {
        this.$emit('asideResize', size)
      },
    },
  }
</script>

<style lang="less" scoped>
  .menu-icon {
    width: 30px;
    height: 30px;
    border: 1px solid #ebebeb;
    text-align: center;
    line-height: 30px;
  }
  .size-option {
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 8px 0;
    &:hover,
    &.selected {
      color: #00c7db;
    }
    .size-option-icon {
      margin: 0 10px 0 0;
    }
  }
</style>
