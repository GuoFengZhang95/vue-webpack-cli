<template>
  <button
    class="mu-button"
    :disabled="disabled"
    :type="nativeType"
    :class="[
      type ? 'mu-button-type-' + type : '',
      size ? 'mu-button-size-' + size : '',
      shape ? 'mu-button-shape-' + shape : '',
      {
        'is-disabled': disabled,
        'is-loading': loading,
      },
    ]"
    @click="handleClick"
  >
    <template v-if="loading">
      <a-icon v-if="aicon" type="loading"></a-icon>
      <i v-else class="mmxlicon mi-loading"></i>
    </template>
    <template v-else>
      <a-icon v-if="aicon" :type="aicon"></a-icon>
      <i v-else :class="'mmxlicon ' + icon"></i>
    </template>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>

<script>
  export default {
    name: 'MuButton',
    props: {
      type: {
        type: String,
        default: 'default',
      }, // 可选值：ghost(背景透明)、plain(朴素按钮)
      size: {
        type: String,
        default: 'default',
      }, // 可选值：small、large
      disabled: {
        type: Boolean,
        default: false,
      }, // 可选值：small、large
      loading: {
        type: Boolean,
        default: false,
      }, // 按钮loading(暂不支持)
      icon: {
        type: String,
        default: '',
      }, // iconfont图标
      aicon: {
        type: String,
        default: '',
      }, // antdv图标
      shape: {
        type: String,
        default: 'default',
      }, // 可选值：round、circle(暂不支持)
      nativeType: {
        type: String,
        default: 'button',
      }, // 原生button按钮类型
    },
    data() {
      return {}
    },
    methods: {
      handleClick(e) {
        this.$emit('click', e)
      },
    },
  }
</script>
<style lang="less">
  @color-secondary: #00d3e8;
  @color-disable: #d9d9d9;
  .mu-button {
    border-radius: 4px;
    color: white;
    outline: none;
    border: 1px solid transparent;
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    user-select: none;
    text-align: center;
    /** 按钮类型 **/
    &.mu-button-type-default {
      background: @primary-color;
      border-color: @primary-color;
      &:hover {
        background-color: @color-secondary;
      }
      &.is-disabled {
        background-color: @color-disable;
        cursor: not-allowed;
      }
    }
    &.mu-button-type-ghost {
      background: white;
      border: 1px solid @primary-color;
      color: @primary-color;
      &:hover {
        color: @color-secondary;
        border-color: @color-secondary;
        background: rgba(0, 199, 219, 0.08);
      }
      &.is-disabled {
        background: #f9f9f9;
        border: 1px solid @color-disable;
        color: @color-disable;
        cursor: not-allowed;
      }
    }
    &.mu-button-type-plain {
      background: white;
      color: #666666;
      border: 1px solid #d9d9d9;
      &:hover {
        color: @primary-color;
        border-color: @primary-color;
      }
      &.is-disabled {
        border: 1px solid @color-disable;
        color: @color-disable;
        cursor: not-allowed;
      }
    }
    /** 按钮尺寸 **/
    &.mu-button-size-default {
      height: 32px;
      line-height: 32px;
      padding: 0 15px;
      font-size: 13px;
      &.mu-button-shape-default {
        border-radius: 4px;
      }
      &.mu-button-shape-round {
        border-radius: 16px;
      }
      &.mu-button-shape-circle {
        border-radius: 16px;
      }
      .mmxlicon {
        font-size: 13px;
      }
    }
    &.mu-button-size-small {
      height: 24px;
      line-height: 23px;
      padding: 0 7px;
      font-size: 13px;
      &.mu-button-shape-default {
        border-radius: 3px;
      }
      &.mu-button-shape-round {
        border-radius: 12px;
      }
      &.mu-button-shape-circle {
        border-radius: 12px;
      }
      .mmxlicon {
        font-size: 13px;
      }
    }
    &.mu-button-size-large {
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      font-size: 16px;
      border-radius: 3px;
      &.mu-button-shape-default {
        border-radius: 4px;
      }
      &.mu-button-shape-round {
        border-radius: 20px;
      }
      &.mu-button-shape-circle {
        border-radius: 20px;
      }
      .mmxlicon {
        font-size: 16px;
      }
    }
    /** 按钮形状 **/
    &.mu-button-shape-default {
    }
    &.mu-button-shape-round {
    }
    &.mu-button-shape-circle {
    }
    /** 按钮disabled样式 **/
    &.is-disabled {
    }
    /** 按钮loading样式 **/
    &.is-loading {
    }
  }
</style>
