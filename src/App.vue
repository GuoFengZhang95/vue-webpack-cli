<template>
  <a-config-provider :locale="zhCN">
    <div id="app">
      <router-view></router-view>
    </div>
  </a-config-provider>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import moment from 'moment'
  import 'moment/locale/zh-cn'
  import { getDistributionAuthInfo } from '@/api/eos/index'
  import { getLoginStatus } from '@/api/common'
  moment.locale('zh-cn')
  export default {
    name: 'App',
    data() {
      return {
        zhCN,
      }
    },
    async mounted() {
      const loginRes = await getLoginStatus()
      if (loginRes.isLogin) {
        await this._getBaseUserInfo()
      }
    },
    methods: {
      // 获取用户信息
      async _getBaseUserInfo() {
        let baseUserInfoRes = await this.$store.dispatch('user/setBaseUserInfo')
        if (baseUserInfoRes.code === '0') {
          this.handlerBaseUserInfo(baseUserInfoRes.data)
        } else {
          this.$router.push({
            name: 'Login',
          })
        }
      },
      // 根据用户信息进行相关处理
      async handlerBaseUserInfo(baseInfo) {
        const { authenticated, userType } = baseInfo || {}
        // 如果是分销商，获取分销相关信息
        if (userType === 5 && authenticated === 1) {
          let authRes = await getDistributionAuthInfo()
          this.$store.dispatch('user/setEosUserInfo', authRes.data)
        }
      },
    },
  }
</script>

<style lang="less">
  #app {
    width: 100%;
    // min-width: 1280px;
    height: 100%;
    // overflow: auto;
    #home {
      width: 100%;
      height: 100%;
      position: relative;
      // 侧边栏模块根页面
      .module-home {
        width: 100%;
        height: 100%;
      }
      // 列表页
      .list-page-wrp {
        width: 100%;
        height: 100%;
        overflow: auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .list-page-table-wrp {
          flex: 1;
        }
      }
      // 内容页
      .content-page-wrp {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    }
  }
  // 表格操作栏样式
  .table-operations-wrp {
    .operations-item {
      margin-left: 16px;
      padding-right: 16px;
      position: relative;
      font-size: 13px;
      &::after {
        position: absolute;
        content: '';
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        height: 14px;
        background: #e9e9e9;
      }
      &:last-child {
        &::after {
          width: 0px;
        }
      }
      .ant-btn.ant-btn-link {
        font-size: 13px;
      }
    }
  }
  // 页面主要模块
  .page-content {
    margin-left: 36px;
    margin-right: 36px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ebebeb;
  }
  // 侧拉框标题样式
  .ant-drawer-title {
    font-size: 20px;
    font-weight: 700;
    color: #00c7db;
  }
  // 操作按钮
  .btn-operation {
    width: 102px;
    height: 32px;
    color: white;
    background: #00c7db;
    border-radius: 4px;
    display: flex;
    align-items: center;
    cursor: pointer;
    img,
    .anticon {
      width: 14px;
      height: 14px;
      margin-left: 12px;
      margin-right: 6px;
    }
    span {
      color: white;
    }
    .address-info-add {
      font-size: 13px;
    }
  }
  // 加载状态
  .spin {
    position: absolute !important;
    z-index: 9999;
    left: 0;
    right: 0;
    top: 100px;
    bottom: 0;
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 30px 50px;
    margin: 20px 0;
  }
  // nprogress
  #nprogress .bar {
    background: #00c7db !important; //自定义颜色
    opacity: 0.5;
  }
</style>
