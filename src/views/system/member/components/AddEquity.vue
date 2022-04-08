<template>
  <a-modal
    v-if="visible"
    :visible="visible"
    width="380px"
    :footer="null"
    @cancel="cancel"
  >
    <template slot="title">提示</template>
    <div class="msg-box">
      <img
        class="msg-icon"
        src="https://img.mumuxili.com/yqmm/pc/saas/images/icon/icon-warning.svg"
        alt="icon"
      />
      <span class="msg-desc">
        本次将为{{ selectedCount }}名成员添加企业权益，请确认！
      </span>
    </div>
    <div class="modal-footer">
      <MuButton @click="submit">确定</MuButton>
      <MuButton type="plain" @click="cancel">取消</MuButton>
    </div>
  </a-modal>
</template>

<script>
  export default {
    name: 'AddEquity',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      selectedCount: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {}
    },
    methods: {
      submit() {
        this.$emit('action', 'submit')
      },
      cancel() {
        this.$emit('action', 'cancel')
      },
    },
  }
</script>

<style lang="less" scoped>
  .msg-box {
    .msg-icon {
      margin-top: -2px;
      margin-right: 5px;
      width: 20px;
      height: 20px;
    }
  }
</style>
