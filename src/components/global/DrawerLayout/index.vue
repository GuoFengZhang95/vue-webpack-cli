<template>
  <a-config-provider :locale="zhCN">
    <div id="drawer-layout-wrp">
      <div
        class="drawer-layout"
        :class="visible ? 'show' : ''"
        :style="{
          height: `calc(100vh - ${topHeight}px)`,
          top: `${topHeight}px`,
        }"
      >
        <div class="close-btn" @click="close"></div>
        <a-spin
          :spinning="drawerLayoutLoading"
          :delay="delayTime"
          class="drawer-spin"
        >
          <div class="main-content">
            <section class="section">
              <template v-if="dynComList.length">
                <keep-alive>
                  <component
                    :is="dynComList[dynComList.length - 1]"
                    :id="currentCom.props.id"
                    :key="currentCom.key"
                    class="dyn-com"
                    :style="{
                      height: `calc(100vh - ${topHeight}px)`,
                      top: `${topHeight}px`,
                    }"
                    :external-prop="currentCom.props"
                  ></component>
                </keep-alive>
              </template>
            </section>
          </div>
        </a-spin>
      </div>
    </div>
  </a-config-provider>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import { mapGetters } from 'vuex'
  export default {
    name: 'DrawerLayout',
    data() {
      return {
        visible: false,
        dynComList: [],
        dynComParamList: [],
        spinning: false,
        delayTime: 100,
        topHeight: 0,
        zhCN,
      }
    },
    computed: {
      ...mapGetters(['drawerLayoutLoading']),
      currentCom() {
        let length = this.dynComParamList.length
        if (length) {
          return this.dynComParamList[this.dynComParamList.length - 1]
        } else {
          return []
        }
      },
    },
    watch: {
      dynComParamList(newVal) {
        this.$store.dispatch('app/setDrawerList', newVal)
      },
    },
    mounted() {},
    beforeDestroy() {},
    methods: {
      share() {
        console.log('share')
      },
      // 刷新当前侧拉框内的组件
      reload() {
        this.currentCom.key = new Date().getTime()
      },
      show(param) {
        // 动态设置侧拉框高度
        let tagViewEl = document.getElementById('tags-view-container')
        if (tagViewEl) {
          this.topHeight = 116
        } else {
          this.topHeight = 60
        }
        setTimeout(() => {
          this.visible = true
        }, 0)
        this.add(param)
      },
      add(param) {
        const { options, component } = param
        let index = this.dynComParamList.findIndex(
          item => item.name == options.name
        )
        if (index === -1) {
          options.key = new Date().getTime()
          this.dynComList.push(component)
          this.dynComParamList.push(options)
        } else {
          this.$set(this.dynComParamList, index, options)
        }
      },
      close() {
        this.dynComList = []
        this.dynComParamList = []
        this.visible = false
      },
      back() {
        this.dynComList.pop()
        this.dynComParamList.pop()
        if (this.dynComList.length === 0) {
          this.close()
        }
      },
    },
  }
</script>

<style lang="less">
  #drawer-layout-wrp {
    .drawer-layout {
      position: fixed;
      z-index: 999;
      right: -100%;
      // top: 116px;
      width: calc(100vw - 500px);
      // height: calc(100vh - 116px);
      // overflow-y: auto;
      min-width: 822px;
      background: white;
      box-shadow: -10px 0px 20px 0px rgba(0, 0, 0, 0.16);

      &.show {
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        right: 0;
      }
      .main-content {
        .section {
          .dyn-com {
            overflow-y: auto;
            padding-bottom: 100px;
          }
        }
      }

      .close-btn {
        position: absolute;
        left: -25px;
        top: 0px;
        width: 24px;
        height: 56px;
        opacity: 0.7;
        background: #000000;
        border-radius: 6px 0px 0px 6px;
        box-shadow: -5px 0px 6px 0px rgba(0, 0, 0, 0.16);
        cursor: pointer;

        &::before {
          position: absolute;
          content: '';
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 8px;
          border-style: solid;
          border-color: transparent transparent transparent #ffffff;
        }
      }

      .drawer-spin {
        top: 0px !important;
        margin: 0;
        padding: 0;
      }
    }
  }
</style>
