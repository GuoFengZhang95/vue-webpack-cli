<template>
  <div id="app-main">
    <router-view></router-view>
  </div>
</template>

<script>
  import ResizeObserver from 'resize-observer-polyfill'
  export default {
    name: 'AppMain',
    provide() {
      return {
        reload: this.reload,
      }
    },
    data() {
      return {
        isRouterAlive: true,
        appMainResizeObserver: null,
        appMainNode: null,
      }
    },
    computed: {
      key() {
        return this.$route.path
      },
    },
    mounted() {
      this.appMainNode = document.getElementById('app-main')
      this.appMainResizeObserver = new ResizeObserver(this.appMainCallback)
      this.appMainResizeObserver.observe(this.appMainNode)
    },
    beforeDestroy() {
      this.appMainResizeObserver.unobserve(this.appMainNode)
    },
    methods: {
      reload() {
        this.isRouterAlive = false
        this.$nextTick(() => (this.isRouterAlive = true))
      },
      appMainCallback() {
        if (document.getElementsByClassName('list-page-table-wrp')[0]) {
          let pageTableWrpHeight = document.getElementsByClassName(
            'list-page-table-wrp'
          )[0].offsetHeight
          if (document.getElementsByClassName('ant-table-thead')[0]) {
            // 重新计算 app-main 中表格的scroll: X,y
            let appMainWidth = document.getElementById('app-main').offsetWidth
            this.$store.dispatch('app/setTableWidth', appMainWidth - 8)
            let antDesignTableHeight =
              document.getElementsByClassName('ant-table-thead')[0].offsetHeight
            this.$store.dispatch(
              'app/setTableHeight',
              pageTableWrpHeight - antDesignTableHeight
            )
            // console.log('x',appMainWidth - 8)
            // console.log('y',pageTableWrpHeight - antDesignTableHeight)
          }
        }
      },
    },
  }
</script>

<style lang="scss">
  #app-main {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
  }
</style>
>
