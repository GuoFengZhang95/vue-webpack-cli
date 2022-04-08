<template>
  <a-modal
    v-if="visible"
    :visible="visible"
    width="380px"
    :footer="null"
    @cancel="cancel"
  >
    <template slot="title">设置角色</template>
    <div class="role-box">
      角色：
      <a-select
        class="panel-input"
        show-search
        placeholder="请选择"
        option-label-prop="label"
        :default-active-first-option="false"
        :show-arrow="true"
        :filter-option="false"
        :value="selectedValue"
        :get-popup-container="
          triggerNode => {
            return triggerNode.parentNode || document.body
          }
        "
        @select="roleSelectOption"
      >
        <a-select-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.title"
        >
          <div class="select-item">
            <div class="title-wrap">{{ item.title }}</div>
            <div class="select-text">{{ item.desc }}</div>
          </div>
        </a-select-option>
      </a-select>
    </div>
    <div class="modal-footer">
      <MuButton @click="submit">确定</MuButton>
      <MuButton type="plain" @click="cancel">取消</MuButton>
    </div>
  </a-modal>
</template>

<script>
  export default {
    name: 'SetMemberRole',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      selectRoleValue: {
        type: Number,
        default: 2,
      },
    },
    data() {
      return {
        selectedValue: undefined,
        roleList: [
          // 0 管理员， 2 协同管理员，3 主要成员，1 普通成员
          {
            id: 2,
            title: '协同管理员',
            desc: '拥有全部功能权限',
          },
          {
            id: 3,
            title: '主要成员',
            desc: '可查看全部商机',
          },
          {
            id: 1,
            title: '普通成员',
            desc: '默认仅可查看自己解锁的商机',
          },
        ],
      }
    },
    watch: {
      selectRoleValue: {
        immediate: true,
        handler(val) {
          this.selectedValue = val
        },
      },
    },
    methods: {
      submit() {
        this.$emit('action', { type: 'submit', roleType: this.selectedValue })
      },
      cancel() {
        this.$emit('action', { type: 'cancel', roleType: undefined })
      },
      // 选择角色
      roleSelectOption(e) {
        this.selectedValue = e
      },
    },
  }
</script>

<style lang="less" scoped>
  .role-box {
    padding-top: 16px;
    padding-bottom: 20px;

    .panel-input {
      width: 269px;
    }

    .select-item {
      .title-wrap {
        color: #666;
      }

      .select-text {
        color: #999;
      }
    }
  }
</style>
