<template>
  <div class="text-con table-cell">
    <!-- 有悬浮弹层 -->
    <a-tooltip v-if="column.tooltip" placement="topLeft">
      <template #title>
        <i v-if="cellData instanceof Array">
          <i v-for="(ee, i) in cellData" :key="i">
            {{
              pureData(ee.label) && pureData(ee.label).length
                ? ee.label
                : defaultText
            }}{{
              i == cellData.length - 1
                ? ''
                : column.splitType || defaultSplitType
            }}
          </i>
        </i>
        <i v-else-if="cellData instanceof Object">
          {{
            pureData(cellData.label) && pureData(cellData.label).length
              ? cellData.label
              : defaultText
          }}
        </i>
        <i v-else>
          {{
            pureData(cellData) && pureData(cellData).length
              ? cellData
              : defaultText
          }}
        </i>
      </template>
      <i v-if="cellData instanceof Array">
        <i v-for="(ee, i) in cellData" :key="i">
          {{
            pureData(ee.label) && pureData(ee.label).length
              ? ee.label
              : defaultText
          }}{{
            i == cellData.length - 1 ? '' : column.splitType || defaultSplitType
          }}
        </i>
      </i>
      <i v-else-if="cellData instanceof Object">
        {{
          pureData(cellData.label) && pureData(cellData.label).length
            ? cellData.label
            : defaultText
        }}
      </i>
      <i v-else>
        {{
          pureData(cellData) && pureData(cellData).length
            ? cellData
            : defaultText
        }}
      </i>
    </a-tooltip>
    <!-- 无悬浮弹层 -->
    <div v-else>
      <i v-if="cellData instanceof Array">
        <i v-for="(ee, i) in cellData" :key="i">
          {{
            pureData(ee.label) && pureData(ee.label).length
              ? ee.label
              : defaultText
          }}{{
            i == cellData.length - 1 ? '' : column.splitType || defaultSplitType
          }}
        </i>
      </i>
      <i v-else-if="cellData instanceof Object">
        {{
          pureData(cellData.label) && pureData(cellData.label).length
            ? cellData.label
            : defaultText
        }}
      </i>
      <i v-else>
        {{
          pureData(cellData) && pureData(cellData).length
            ? cellData
            : defaultText
        }}
      </i>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CellText',
    props: {
      column: {
        type: Object,
        default: () => {},
      },
      cellData: {
        type: [Object, Array, Number, String],
        default: () => {},
      },
    },
    data() {
      return {
        defaultText: '-',
        defaultSplitType: '，',
      }
    },
    methods: {
      pureData(data) {
        return JSON.stringify(data).trim()
      },
    },
  }
</script>

<style lang="less" scoped>
  .action-item {
    cursor: pointer;
    color: #0cc7db;
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
</style>
