<script>
  export default {
    name: 'TableCell',
    functional: true,
    props: {
      text: {
        type: [String, Object, Array, Number, Boolean],
        default: () => '',
      },
      record: {
        type: Object,
        default: () => {},
      },
      column: {
        type: Object,
        default: () => {},
      },
    },
    render(h, content) {
      let cellText
      // 单元格点击事件
      const handleCellClick = (type, data) => {
        content.listeners.cellClick(type, data, content.props.record)
      }
      const { text: colText, record: colRecord, column } = content.props
      const { type: colType, tooltip = true } = content.props.column
      // 如果是图片
      if (colType === 'img') {
        const src = (colText && colText.src) || colRecord.img.src || ''
        cellText = (
          <div class='cell-img'>
            <img src={src} onClick={() => handleCellClick('img', src)} />
          </div>
        )

        // 如果是状态项
      } else if (colType === 'status') {
        cellText = colText.status ? (
          <span
            class={'cell-status ' + colText.status}
            onClick={() => handleCellClick('status', colText.status)}
          >
            {colText.label}
          </span>
        ) : (
          <span>-</span>
        )

        // 如果是操作按钮
      } else if (colType === 'action') {
        // 如果是数组，多个按钮
        if (Array.isArray(colText)) {
          cellText = (
            <span class='action-list'>
              {colText.map((ee, i) => {
                return (
                  <span
                    key={i}
                    class={ee.disabled ? 'disabled' : ''}
                    class='cell-action list'
                    onClick={() => handleCellClick('action', ee)}
                  >
                    {ee.label}
                  </span>
                )
              })}
            </span>
          )
        } else {
          // 如果是单个按钮
          const cellContent = (
            <span
              class={colText.disabled ? 'cell-action disabled' : 'cell-action'}
              onClick={() => handleCellClick('action', colText)}
            >
              {column.fixed && column.len && colText.label.length > column.len
                ? ` ${colText.label.trim().substring(0, column.len)}...`
                : colText.label
                ? colText.label.trim()
                : '-'}
            </span>
          )

          // 判断是否需要tooltip
          if (tooltip) {
            cellText = (
              <a-tooltip placement='topLeft'>
                <template slot='title'>{colText.label}</template>
                {cellContent}
              </a-tooltip>
            )
          } else {
            cellText = cellContent
          }
        }
        // 如果是html字符串
      } else if (colType === 'html') {
        cellText = <span domPropsInnerHTML={colText} />
        // 默认是普通文本
      } else {
        let cellContent, labelContent
        if (Array.isArray(colText)) {
          labelContent = colText.map((ee, i) => {
            return (
              ee.label +
              (i < colText.length - 1 ? column.splitType || '，' : '')
            )
          })
        } else if (colText instanceof Object) {
          labelContent = colText.label || '-'
        } else {
          labelContent = colText || '-'
        }
        cellContent = <span>{labelContent}</span>
        // 判断是否需要tooltip
        if (tooltip && labelContent != '-') {
          cellText = (
            <a-tooltip placement='topLeft'>
              <template slot='title'>{labelContent}</template>
              {cellContent}
            </a-tooltip>
          )
        } else {
          cellText = cellContent
        }
      }
      return cellText
    },
  }
</script>

<style lang="less" scoped>
  /*** 按钮样式 ***/
  .cell-action {
    cursor: pointer;
    color: #0cc7db;
    &.disabled {
      color: #999;
      cursor: context-menu;
    }
  }
  .action-list {
    display: flex;
    align-items: center;
    .cell-action {
      box-sizing: content-box;
      min-width: 40px;
      text-align: center;
      padding-right: 11px;
      position: relative;
      &:last-child {
        &::after {
          display: none;
        }
      }
      &::after {
        position: absolute;
        content: '';
        top: 50%;
        margin-top: -9px;
        right: 5px;
        width: 1px;
        height: 15px;
        background: #e9e9e9;
        text-align: center;
      }
    }
  }
  /*** 状态样式 ***/
  .cell-status {
    cursor: pointer;
    position: relative;
    &::before {
      margin-right: 10px;
      transform: translateY(-50%);
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    &.success {
      &::before {
        background-color: #52c41a;
      }
    }
    &.warning {
      &::before {
        background-color: #ffbf00;
      }
    }
    &.error {
      &::before {
        background-color: #ff4433;
      }
    }
    &.defaults {
      &::before {
        background-color: #52c41a;
      }
    }
  }
  /*** 图片样式 ***/
  .cell-img {
    display: inline-block;
    width: 40px;
    height: 40px;
    cursor: pointer;
    > img {
      width: 100%;
      height: 100%;
    }
  }
</style>
