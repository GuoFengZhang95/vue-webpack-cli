<template>
  <div class="input-number-wrp" :class="[size]">
    <span :class="!minusDisabled ? 'minus' : 'minus disabled'" @click="minus">
      -
    </span>
    <div class="ant-input-wrp">
      <a-input-number
        :value="value"
        :default-value="defaultValue"
        :disabled="disabled"
        @change="change"
      ></a-input-number>
    </div>
    <span :class="!plusDisabled ? 'plus' : 'plus disabled'" @click="add">
      +
    </span>
  </div>
</template>

<script>
  export default {
    name: 'MuInputNumber',
    props: {
      size: {
        type: String,
        default: 'list',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        default: 'number',
      },
      // 父组件传入的初始值
      defaultValue: {
        type: [Number, String],
        default: 0,
      },
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
      step: {
        type: Number,
        default: 1,
      },
    },
    data() {
      return {
        value: 0,
        blured: false,
        //判断是否是数字（包含正负）
        reg: /(^[\-0-9][0-9]*([0-9]+)?)$/, // eslint-disable-line
      }
    },
    computed: {
      minusDisabled() {
        return !(this.min === undefined) && this.value <= this.min
      },
      plusDisabled() {
        return !(this.max === undefined) && this.value >= this.max
      },
    },
    watch: {
      defaultValue: {
        handler(newVal, oldVal) {
          this.value = newVal
        },
        immediate: true,
      },
      value: {
        handler(newVal, oldVal) {
          // console.log('newVal', newVal)
          let inputDom = this.$el.getElementsByClassName(
            'ant-input-number-input'
          )[0]
          if (this.reg.test(String(newVal))) {
            // console.log(newVal, this.max)
            if (this.max && newVal > this.max) {
              inputDom.blur()
              this.value = this.max
              // 此处兼容ie(IE中会提示两次)
              let noticeDom =
                document.getElementsByClassName('ant-message-notice')
              if (!noticeDom.length) {
                this.$message.warning('数量不能大于当前sku的库存！')
              }
            } else if (newVal < this.min) {
              inputDom.blur()
              this.value = this.min
              // 此处兼容ie(IE中会提示两次)
              let noticeDom =
                document.getElementsByClassName('ant-message-notice')
              if (!noticeDom.length) {
                this.$message.warning(`数量不能小于${this.min || 0}！`)
              }
            } else {
              this.$emit('numberChange', newVal)
            }
          } else {
            this.value = oldVal
            this.$message.warning('请输入有效的数字！')
          }
        },
        immediate: false,
      },
    },
    methods: {
      add() {
        if (this.disabled) return
        if (!this.plusDisabled) {
          this.value = this.value + this.step
        }
      },
      minus() {
        if (this.disabled) return
        if (!this.minusDisabled) {
          this.value -= this.step
        }
      },
      change(e) {
        this.value = e
      },
      isNumber(value) {
        return typeof value === 'number' && !isNaN(value)
      },
      setValue(e) {
        this.value = String(e)
      },
    },
  }
</script>

<style lang="less" scoped>
  .input-number-wrp {
    position: relative;

    &.list {
      padding: 0 20px;
      width: 82px;
      height: 28px;
      border: 1px solid #d9d9d9;
      border-radius: 2px;

      .minus,
      .plus {
        position: absolute;
        top: 0;
        width: 20px;
        height: 26px;
        line-height: 26px;
        font-size: 20px;
        text-align: center;
        cursor: pointer;
        &.disabled {
          cursor: not-allowed;
          color: #d9d9d9;
        }
      }

      .minus {
        left: 0px;
        border-right: 1px solid #d9d9d9;
      }

      .plus {
        right: 0px;
        border-left: 1px solid #d9d9d9;
      }
    }

    &.detail {
      width: 44px;
      height: 32px;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      align-items: center;

      .minus,
      .plus {
        position: absolute;
        z-index: 10;
        right: 0px;
        width: 12px;
        height: 15px;
        line-height: 14px;
        font-size: 12px;
        text-align: center;
        cursor: pointer;
        &.disabled {
          cursor: not-allowed;
          color: #d9d9d9;
        }
      }

      .minus {
        bottom: 0px;
        border-left: 1px solid #d9d9d9;
      }

      .plus {
        top: 0px;
        border-bottom: 1px solid #d9d9d9;
        border-left: 1px solid #d9d9d9;
      }
    }
  }
</style>
<style lang="less">
  .input-number-wrp {
    &.list {
      .ant-input-wrp {
        position: absolute;
        top: 0px;
        height: 100%;
        line-height: inherit;
        width: 40px;

        .ant-input-number {
          position: absolute;
          top: 0px;
          left: 0px;
          height: 100%;
          width: 100%;
          border: none;

          .ant-input-number-input-wrap {
            height: 100%;

            .ant-input-number-input {
              height: 100%;
              padding: 0px !important;
              text-align: center;
              border-radius: 0px;
            }
          }

          .ant-input-number-handler-wrap {
            display: none;
          }
        }
      }
    }

    &.detail {
      .ant-input-wrp {
        position: absolute;
        top: 0px;
        height: 100%;
        line-height: inherit;
        width: 30px;

        .ant-input-number {
          position: absolute;
          top: 0px;
          left: 0px;
          height: 100%;
          width: 100%;
          border: none;

          .ant-input-number-input-wrap {
            height: 100%;

            .ant-input-number-input {
              height: 100%;
              padding: 0px !important;
              text-align: center;
              border-radius: 0px;
            }
          }

          .ant-input-number-handler-wrap {
            display: none;
          }
        }
      }
    }
  }
</style>
