<template>
  <div class="mumu-tabs">
    <a-tabs :active-key="activeValue" :type="type" @change="handleTabChange">
      <a-tab-pane
        v-for="e in tabList"
        :key="e.value"
        :tab="e.label"
        :disabled="isLoading"
        :style="styleObj"
      ></a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  export default {
    name: 'MuTab',
    props: {
      tabList: {
        type: Array,
        default: () => [],
      },
      type: {
        type: String,
        default: 'line',
      },
      isLoading: {
        type: Boolean,
        default: () => false,
      },
      size: {
        type: String,
        default: '',
      },
      styleObj: {
        type: Object,
        default: () => {},
      },
      activeKey: {
        type: [Number, String],
        default: () => {
          return 1
        },
      },
    },

    data() {
      return {
        activeValue: 0,
      }
    },
    watch: {
      activeKey: {
        handler(val) {
          setTimeout(() => {
            this.activeValue = val
          }, 100)
        },
        immediate: true,
      },
    },
    methods: {
      handleTabChange(activeTab) {
        let activeTabObj = this.tabList.filter(e => {
          return e.value == activeTab
        })
        this.$emit('handleTabChange', activeTabObj[0] || {})
      },
    },
  }
</script>

<style lang="less" scoped>
  .mumu-tabs {
    background-color: #fff;
  }
</style>
