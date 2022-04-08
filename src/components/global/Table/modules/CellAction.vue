<template>
  <div class="action-con">
    <i v-if="!!(cellData instanceof Array)">
      <i
        v-for="(ee, i) in cptdCellData"
        :key="i"
        :class="`action-item f0 ${ee.disabled ? 'disabled' : ''}`"
        @click="handleRowClick(column.type, ee)"
      >
        <span class="action-label">{{ ee.viewLabel }}</span>
        <em>
          {{
            i == cptdCellData.length - 1
              ? ''
              : column.splitType || defaultSplitType
          }}
        </em>
      </i>
    </i>
    <!-- 有弹框 -->
    <a-tooltip
      v-if="!(cellData instanceof Array) || column.tooltip"
      placement="topLeft"
      :get-popup-container="tooltipEl"
    >
      <template #title>{{ cptdCellData.label }}</template>
      <i
        :class="`action-item ${cptdCellData.disabled ? 'disabled' : ''}`"
        @click="handleRowClick(column.type, cptdCellData)"
      >
        {{ cptdCellData.viewLabel }}
      </i>
    </a-tooltip>
  </div>
</template>

<script>
  export default {
    name: 'CellAction',
    props: {
      column: {
        type: Object,
        default: () => {
          return {
            tooltip: false,
          }
        },
      },
      cellData: {
        type: [Object, Array, String],
        default: () => {},
      },
    },
    data() {
      return {
        defaultSplitType: '|',
        tooltipEl: null,
      }
    },
    computed: {
      cptdCellData() {
        let columnLen = this.column.len
        if ((typeof this.cellData).toLowerCase() == 'string') {
          // 字符串
          let temp = this.cellData.trim() || '-'
          return {
            viewLabel:
              temp.length > columnLen
                ? `${temp.substring(0, columnLen)}...`
                : temp,
            value: null,
          }
        } else if (this.cellData instanceof Array) {
          // 数组
          return this.cellData.map(cell => {
            if (Reflect.has(cell, 'label')) {
              let trimCellLabel = cell.label.trim() || '-'
              return Object.assign(cell, {
                viewLabel:
                  trimCellLabel.length > columnLen
                    ? `${trimCellLabel.substring(0, columnLen)}...`
                    : trimCellLabel,
              })
            } else {
              return Object.assign(cell, {
                viewLabel: '-',
              })
            }
          })
        } else {
          // 对象
          let cell = this.cellData
          if (Reflect.has(cell, 'label')) {
            let trimCellLabel = cell.label.trim() || '-'
            return Object.assign(cell, {
              viewLabel:
                trimCellLabel.length > columnLen
                  ? `${trimCellLabel.substring(0, columnLen)}...`
                  : trimCellLabel,
            })
          } else {
            return Object.assign(cell, {
              viewLabel: '-',
            })
          }
        }
      },
    },
    mounted() {
      this.$nextTick(() => {
        console.log(this.$refs.antTable)
        this.tooltipEl = this.$refs.antTable.$el
      })
    },
    methods: {
      handleRowClick(clickType, rowData) {
        this.$emit('handleRowClick', clickType, rowData)
      },
    },
  }
</script>

<style lang="less" scoped>
  .action-con {
    display: inline-block;
    color: #00c7db;
    .action-item {
      cursor: pointer;
      color: #00c7db;
      &.f0 {
        font-size: 0;
      }
      em {
        font-size: 13px;
        margin: 0 10px;
        color: #e9e9e9;
      }
      .action-label {
        font-size: 13px;
        min-width: 26px;
        display: inline-block;
        text-align: center;
      }
    }
    .disabled {
      color: #999;
      cursor: context-menu;
    }
  }
</style>
