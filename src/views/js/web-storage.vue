<template>
  <div class="web-storage-wrapperr">
    <h1>Web Storage</h1>
  </div>
</template>

<script>
  export default {
    name: 'WebStorage',
    props: {},
    data() {
      return {}
    },
    computed: {},
    watch: {},
    mounted() {
      this.testMaxLocalStorage()
      this.testTimeConsume()
    },
    methods: {
      testMaxLocalStorage() {
        let data = ''
        for (let i = 0; i < 1024 * 1024 * 1; i++) {
          data += 'a'
        }
        localStorage.setItem('testMaxLocalStorage', data)
      },
      testTimeConsume() {
        let data = ''
        for (let i = 0; i < 1024 * 1024; i++) {
          data += 'b'
        }
        console.time('testTimeConsume')
        for (let i = 0; i < 1000; i++) {
          localStorage.setItem('testTimeConsume', data)
          localStorage.removeItem('testTimeConsume')
        }
        console.timeEnd('testTimeConsume')
      },
    },
  }
</script>

<style lang="less">
</style>