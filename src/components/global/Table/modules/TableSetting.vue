<template>
  <a-popover
    v-model="headerVisible"
    trigger="click"
    placement="bottom"
    :get-popup-container="triggerNode => triggerNode.parentNode"
    class="header-setting"
  >
    <template #content>
      <div class="header-setting-content">
        <h3 class="header-setting-title">表头设置</h3>
        <div class="header-list">
          <div
            v-for="(item, idx) in columnsSetting"
            :key="item.dataIndex"
            :draggable="!item.fixed"
            :class="item.default ? 'default' : ''"
            class="header-item"
            :style="
              item.fixed ? { 'user-select': 'none', cursor: 'not-allowed' } : ''
            "
            @click="setTableHeader(item)"
            @dragstart="dragTableHeaderStart($event, item, idx)"
            @dragover.prevent="dragTableHeaderOver($event, item, idx)"
            @dragend="dragTableHeaderOver($event, item, idx)"
          >
            <div class="column-item">
              <a-icon type="menu" class="mr5"></a-icon>
              {{ item.title }}
            </div>
            <a-icon v-if="!item.extend" type="check"></a-icon>
          </div>
        </div>
      </div>
    </template>
    <a-button
      icon="setting"
      type="link"
      class="default-act"
      @click="headerVisible = false"
    >
      设置
    </a-button>
  </a-popover>
</template>

<script>
  export default {
    name: 'TableSetting',
    props: {
      columns: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        headerVisible: false, // 设置按钮切换&隐藏
        targetEl: null, // 挪动表头顺序释放时的位置
        dragEl: null, // 挪动表头顺序点击时的位置
        dragIdx: -1, // 挪动表头顺序当前列的idx
      }
    },
    computed: {
      //   设置头列表
      columnsSetting() {
        let temp = this.columns
          .filter(e => ['index', 'actions'].indexOf(e.dataIndex) < 0)
          .map(k => {
            if (Reflect.has(k, 'extend')) {
              return k
            } else {
              return Object.assign(k, {
                extend: false,
              })
            }
          })
        return temp
      },
    },
    methods: {
      // 选中&&取消设置表头
      setTableHeader(column) {
        if (!column.default) {
          this.$emit('setTableHeader', column)
        }
      },
      // 开始拖动表头
      dragTableHeaderStart(event, item, dragIdx) {
        event.dataTransfer.setData('te', event.target.innerText) //不能使用text，firefox会打开新tab
        this.dragEl = event.target
        this.dragIdx = dragIdx
      },
      // 拖动表头ing
      dragTableHeaderOver(event, item, targetIdx) {
        this.targetEl = event.target
        this.targetIdx = targetIdx
        let columnsNew = [...this.columns]
        if (
          this.targetEl.className === 'header-item' &&
          this.targetEl !== this.dragEl
        ) {
          let dragData = columnsNew.splice(this.dragIdx, 1)[0]
          columnsNew.splice(this.targetIdx, 0, dragData)
          this.dragIdx = this.targetIdx
          this.dragEl = this.targetEl
          this.targetEl = null
          this.$emit('dragTableHeaderOver', columnsNew)
        }
      },
      // 结束拖动表头
      dragTableHeaderEnd(event, item, targetIdx) {
        this.targetEl = event.target
        this.targetIdx = targetIdx
        let columnsNew = [...this.columns]
        if (
          this.targetEl.className === 'header-item' &&
          this.targetEl !== this.dragEl
        ) {
          let dragData = columnsNew.splice(this.dragIdx, 1)[0]
          columnsNew.splice(this.targetIdx, 0, dragData)
          this.dragIdx = this.targetIdx
          this.dragEl = this.targetEl
          this.targetEl = null
          this.$emit('dragTableHeaderEnd', columnsNew)
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  @primary-color: #00c7db;
  .default-act {
    padding: 0 0 0 0;
    margin: 0 0 0 24px;
    border: transparent;
    color: #666;
    &:hover {
      color: @primary-color;
    }
  }
  .header-setting-content {
    .header-setting-title {
      font-size: 16px;
      color: #444444;
      margin: 0;
      font-weight: 700;
      padding: 12px 16px;
      user-select: none;
    }
    .header-list {
      width: 200px;
      max-height: 400px;
      overflow: auto;
      .header-item {
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
        color: #666;
        &:hover {
          color: #fff;
          background-color: #00c7db;
        }
      }
      .default {
        background: #f5f5f5;
        &:hover {
          color: #666;
          background-color: #f5f5f5;
        }
      }
    }
  }
</style>
