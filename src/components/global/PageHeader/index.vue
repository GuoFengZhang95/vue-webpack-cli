<template>
  <div :class="title ? 'page-header-wrp has-bottom-border' : 'page-header-wrp'">
    <div class="page-header-content">
      <div class="left-area">
        <!-- 页面标题 -->
        <div v-if="title" class="page-title title">{{ title }}</div>
        <!-- 内容标题 -->
        <div v-if="subTitle" class="page-sub-title title">{{ subTitle }}</div>
      </div>
      <div class="right-area">
        <slot></slot>
        <div v-if="showBack" class="go-back" @click="goBack">
          <img
            src="@/assets/images/goback.png"
            style="width: 12px; height: 12px"
            alt="pic"
          />
          <span>返回</span>
        </div>
        <global-reload
          v-if="showReload"
          @parentReload="parentReload"
        ></global-reload>
      </div>
    </div>
  </div>
</template>

<script>
  import GlobalReload from '../GlobalReload'
  export default {
    name: 'MuPageHeader',
    components: {
      GlobalReload,
    },
    props: {
      title: {
        type: String,
        default: '',
      },
      subTitle: {
        type: String,
        default: '',
      },
      showReload: {
        type: Boolean,
        default: true,
      },
      showBack: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {}
    },
    methods: {
      parentReload() {
        // 如果存在全局侧拉框，那么使用侧拉框中的刷新功能
        if (this.$store.state.app.drawerList.length) {
          this.$globalDrawer.reload()
        } else {
          this.$emit('parentReload')
        }
      },
      goBack() {
        // 如果存在全局侧拉框，删除侧拉框页面，否则进outer.back(-1)
        if (this.$store.state.app.drawerList.length) {
          this.$globalDrawer.back()
        } else {
          this.$router.back(-1)
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .page-header-wrp {
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
    height: 50px;
    background: white;

    &.has-bottom-border {
      height: 56px;
      border-bottom: 1px solid #ebebeb;
    }

    .page-header-content {
      padding-right: 24px;
      height: 100%;
      display: flex;
      align-items: stretch;
      justify-content: space-between;

      .left-area {
        display: flex;
        align-items: center;
        .title {
          margin-left: 24px;
        }
        // 标题样式
        .page-title {
          height: 25px;
          font-size: 18px;
          font-weight: bold;
          text-align: left;
          color: #00c7db;
        }
        .page-sub-title {
          padding-left: 12px;
          position: relative;
          height: 22px;
          font-size: 16px;
          line-height: 22px;
          font-weight: 400;
          color: #666666;

          &::before {
            position: absolute;
            content: '';
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 14px;
            background-color: #00c7db;
          }
        }
      }

      .right-area {
        display: flex;
        align-items: center;
        & > div {
          // margin-left: 24px;
          cursor: pointer;
        }
        .go-back {
          margin-right: 24px;
        }
      }
    }
  }
</style>
<style lang="less"></style>
