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
      // this.testLocalStorageLimit()
      // this.testLocalStorageTimeConsume()
      this.indexedDBInit()
    },
    methods: {
      testLocalStorageLimit() {
        let data = ''
        for (let i = 0; i < 1024 * 1024 * 1; i++) {
          data += 'a'
        }
        localStorage.setItem('testMaxLocalStorage', data)
      },
      testLocalStorageTimeConsume() {
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
      indexedDBInit() {
        const IDBFactory = window.indexedDB
        console.log(IDBFactory)
        const IDBRequest = IDBFactory.open('UserDB', 1)
        console.log(IDBRequest)
        IDBRequest.onerror = function(e) {
          console.log('打开数据库失败', e)
        }
        IDBRequest.onsuccess = function(e) {
          console.log('打开数据库成功', e)
        }
      }
    },
  }
</script>

<style lang="less">
</style>