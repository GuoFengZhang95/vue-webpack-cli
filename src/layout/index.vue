<template>
  <a-spin :spinning="spinningFlag" :tip="spinningTip">
    <div id="layout">
      <!-- 顶部导航 -->
      <header-bar></header-bar>
      <!-- 1级主体内容 -->
      <div id="main" :style="{ height: `${mainH}px` }">
        <!-- 侧边导航 -->
        <div id="nav" :style="{ width: `${navW}px` }">
          <AsideBar :main-h="mainH" @changeSideBar="changeSideBar"></AsideBar>
        </div>
        <div id="container" :style="{ width: `${containerW}px` }">
          <!-- 全局tab页签 -->
          <TagsView></TagsView>
          <a-spin :spinning="subSpinningFlag" :tip="subSpinningTip">
            <div
              id="sub-view"
              class="sub-view"
              :style="{ height: `${subViewH}px` }"
            >
              <!-- 2级主体内容 -->
              <app-main></app-main>
              <!-- 侧拉 -->
              <div
                ref="drawer"
                class="drawer"
                :style="{ right: drawerFlag ? '0px' : `-${drawerW}px` }"
              >
                <div class="drawer-wrapper">
                  <!-- 侧拉头部 -->
                  <div ref="drawerTitleWrapper" class="drawer-title-wrapper">
                    <span class="drawer-title">
                      {{ drawerComponent.title }}
                    </span>
                    <div class="drawer-actions">
                      <a-button
                        v-for="(b, idx) in drawerComponent.actions"
                        :key="idx"
                        :type="b.type"
                        :ghost="b.isGhost"
                        style="margin-right: 15px"
                        @click="handleClick(b.method)"
                      >
                        {{ b.text }}
                      </a-button>
                      <div
                        v-if="drawerList.length > 1"
                        class="roll-back"
                        @click="handleRollBack"
                      >
                        <div class="roll-back-image"></div>
                        <i>返回</i>
                      </div>
                      <div class="refresh" @click="handleReload">
                        <div class="refresh-image"></div>
                        <i>刷新</i>
                      </div>
                    </div>
                  </div>
                  <div :style="{ height: `${sliderBodyH}px` }">
                    <component
                      :is="drawerComponent.name"
                      :drawer-props="drawerComponent.props"
                      :attribute="drawerComponent.props"
                    ></component>
                  </div>
                </div>
                <div class="drawer-btn" @click="closeDrawer"></div>
              </div>
            </div>
          </a-spin>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script>
  import { mapState } from 'vuex'
  import HeaderBar from './components/HeaderBar'
  import AsideBar from './components/AsideBar'
  import TagsView from './components/TagsView'
  import AppMain from './components/AppMain'
  export default {
    name: 'Layout',
    components: {
      HeaderBar,
      AsideBar,
      TagsView,
      AppMain,
    },
    data() {
      return {
        navW: '',
        containerW: '',
        drawerW: '',
        subViewH: '',
        mainH: 0,
        sliderBodyH: '',
      }
    },
    computed: {
      ...mapState({
        spinningFlag: state => state.spinning.value,
        spinningTip: state => state.spinning.label,
        subSpinningFlag: state => state.subSpinning.value,
        subSpinningTip: state => state.subSpinning.label,
        tabList: state => state.tabList,
        drawerComponent: state =>
          (state.drawerList.length &&
            state.drawerList[state.drawerList.length - 1]) ||
          {},
        drawerFlag: state => state.drawerFlag,
        drawerList: state => state.drawerList,
      }),
    },
    watch: {
      $route(pre, val) {
        this.$bus.$off()
        this.$store.commit('toggleDrawer', {
          drawerFlag: false,
        })
      },
    },
    mounted() {
      this.resize()
      window.addEventListener('resize', this.resize)
      let _this = this
      _this.$nextTick(function () {
        _this.cancelDrawerW()
      })
    },
    methods: {
      //   关闭全部侧拉
      closeDrawer() {
        this.$store.commit('toggleDrawer', {
          drawerFlag: false,
        })
      },
      //   侧拉返回上一层
      handleRollBack() {
        this.$store.commit('toggleDrawer', {
          drawerFlag: true,
        })
      },
      //   侧拉刷新
      handleReload() {
        this.$bus.$emit('drawerInit')
      },
      // 侧拉事件触发
      handleClick(action) {
        this.$bus.$emit('handleClick', action)
      },
      // 计算侧拉宽度
      cancelDrawerW() {
        // let el = document.getElementsByClassName('drawer')[0]
        const el = this.$refs.drawer
        this.drawerW = el.offsetWidth + 980
      },
      // 屏幕变化
      resize() {
        const drawerTitleWrapper = this.$refs.drawerTitleWrapper
        let clientW = document.body.clientWidth
        let clientH = document.body.clientHeight
        // let sliderBodyH = document.getElementsByClassName('drawer-title-wrapper')[0].clientHeight
        let sliderBodyH = drawerTitleWrapper.clientHeight
        this.navW = this.navW || document.getElementById('nav').offsetWidth
        this.containerW = clientW - this.navW
        this.mainH = clientH - 60
        // MIS-v1.4.1.0版本subViewH由clientH - 120改为clientH - 110，底部间距10px取消
        this.subViewH = clientH - 110
        this.sliderBodyH = this.subViewH - sliderBodyH
        this.cancelDrawerW()
      },
      changeSideBar(navW) {
        this.navW = navW
        this.resize()
      },
    },
  }
</script>

<style lang="less" scoped>
  .badge {
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #ddd;
    display: inline-block;
  }

  #layout {
    #main {
      display: flex;
      background: #e3e5e6;
      overflow: hidden;
      #nav {
        height: 100%;
        background: #fff;
        transition: all 0.2s;
      }
      #container {
        display: flex;
        flex-direction: column;

        .sub-view {
          margin: 10px 10px 0 10px;
          // background: #fff;
          overflow: auto;
          .drawer {
            position: absolute;
            top: 0;
            //   width: 80%;
            width: calc(100vw - 500px);
            min-width: 822px;
            height: 100%;
            transition: all 0.2s ease-in;
            box-shadow: -10px 0 20px 0 rgba(0, 0, 0, 0.16);
            z-index: 10;
            .drawer-wrapper {
              background: #fff;
              height: 100%;
              overflow-y: auto;
              .drawer-title-wrapper {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 700;
                box-sizing: border-box;
                margin: 0;
                padding: 0 24px;
                height: 56px;
                border-bottom: 1px solid #ebebeb;
                span {
                  color: #0cc7db;
                  font-size: 18px;
                  font-weight: 400;
                }
                .drawer-actions {
                  display: flex;
                  align-items: center;
                  .ant-btn-link {
                    color: #666;
                  }
                  .roll-back,
                  .refresh {
                    display: flex;
                    font-size: 0;
                    align-items: center;
                    cursor: pointer;
                    > i {
                      font-size: 14px;
                      color: #666;
                      font-weight: 400;
                    }
                  }
                  .roll-back {
                    margin-right: 16px;
                    &:hover {
                      .roll-back-image {
                        background-image: url('../assets/images/icon/roll-back-hover.svg');
                      }
                      > i {
                        color: #00c7db;
                      }
                    }
                    .roll-back-image {
                      margin-right: 6px;
                      width: 12px;
                      height: 12px;
                      background-image: url('../assets/images/icon/roll-back.svg');
                      background-size: 12px;
                    }
                  }
                  .refresh {
                    &:hover {
                      .refresh-image {
                        background-image: url('../assets/images/icon/refresh-hover.svg');
                      }
                      > i {
                        color: #00c7db;
                      }
                    }
                    .refresh-image {
                      margin-right: 6px;
                      width: 12px;
                      height: 12px;
                      background-image: url('../assets/images/icon/refresh.svg');

                      &:hover {
                        background-image: url('../assets/images/icon/refresh-hover.svg');
                      }
                    }
                  }
                }
              }
              .drawer-content-warpper {
                overflow-x: hidden;
                overflow-y: auto;
              }
            }
            .drawer-btn {
              position: absolute;
              left: -24px;
              top: 0;
              width: 24px;
              height: 56px;
              opacity: 0.7;
              background: #000;
              border-radius: 6px 0 0 6px;
              box-shadow: -5px 0 6px 0 rgba(0, 0, 0, 0.16);
              cursor: pointer;
              &::before {
                position: absolute;
                content: '';
                left: 8px;
                top: 50%;
                transform: translateY(-50%);
                border: 8px solid transparent;
                border-left-color: #fff;
              }
            }
          }
        }
      }
    }
  }
</style>
