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
      <span class="msg-desc">{{ desc }}</span>
    </div>
    <div class="modal-footer">
      <MuButton @click="submit">确定</MuButton>
      <MuButton type="plain" @click="cancel">取消</MuButton>
    </div>
  </a-modal>
</template>

<script>
  export default {
    name: 'DeleteMember',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      selectedCount: {
        type: Number,
        default: 0,
      },
      isBatch: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {}
    },
    computed: {
      desc() {
        let val = this.selectedCount
        return val && val > 0 && this.isBatch
          ? `本次共计移除${val}名成员，请确认！`
          : '确定移除该成员？'
      },
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
