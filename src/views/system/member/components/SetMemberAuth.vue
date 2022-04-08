<template>
  <a-modal
    v-if="visible"
    :visible="visible"
    width="380px"
    :footer="null"
    @cancel="cancel"
  >
    <template slot="title">数据权限</template>
    <div class="auth-list-box">
      <a-checkbox-group
        v-model="value"
        name="auth"
        :options="options"
      ></a-checkbox-group>
    </div>
    <div class="auth-tips">
      <img
        class="icon"
        src="https://img.mumuxili.com/yqmm/pc/saas/images/icon/icon-warning.svg"
        alt="icon"
      />
      勾选后，成员可查看该模块的全量数据
    </div>
    <div class="modal-footer">
      <MuButton @click="submit">确定</MuButton>
      <MuButton type="plain" @click="cancel">取消</MuButton>
    </div>
  </a-modal>
</template>

<script>
  let options = [
    { label: '科研客户', value: '1' },
    { label: '采购意向', value: '2' },
    { label: '招投标', value: '3' },
    { label: '重大商情', value: '4' },
    { label: '基金课题', value: '6' },
    { label: '接单', value: '5' },
  ]
  export default {
    name: 'SetMemberAuth',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      defaultValue: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        authChecked: [],
        value: [],
        options,
      }
    },
    watch: {
      defaultValue: {
        immediate: true,
        handler(val) {
          this.value = val
        },
      },
    },
    methods: {
      submit() {
        this.$emit('action', { type: 'submit', value: this.value })
      },
      cancel() {
        this.$emit('action', { type: 'cancel', value: this.value })
      },
    },
  }
</script>

<style lang="less" scoped>
  .auth-list-box {
    max-height: 160px;
    overflow-y: auto;
    /deep/.ant-checkbox-group {
      width: 100%;
      .ant-checkbox-wrapper {
        display: block;
        margin-right: 0;
        padding: 5px 0;
        &:hover {
          background: #f4f4f4;
        }
        .ant-checkbox {
          float: right;
          margin-top: 4px;
          margin-right: 8px;
        }
      }
    }
  }
  .auth-tips {
    margin-top: 10px;
    color: #ff4433;
    font-size: 13px;
    .icon {
      margin-right: 4px;
      margin-top: -2px;
      width: 14px;
      height: 14px;
    }
  }
</style>
