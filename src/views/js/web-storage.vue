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
      this.testLocalStorageLimit()
      this.testLocalStorageTimeConsume()
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
        console.time('testLocalStorageTimeConsume')
        for (let i = 0; i < 1000; i++) {
          localStorage.setItem('testTimeConsume', data)
          localStorage.removeItem('testLocalStorageTimeConsume')
        }
        console.timeEnd('testTimeConsume')
      },
      indexedDBInit() {
        let db = null
        const IDBRequest = window.indexedDB.open('SchoolDb', 1)
        IDBRequest.onerror = function (e) {
          console.log('onerror', e)
        }
        IDBRequest.onsuccess = function (e) {
          db = IDBRequest.result
          console.log('success', db)
          // 插入数据
          console.time('testIndexDBTimeConsume')
          let trans = db.transaction('student', 'readwrite').objectStore('student')
          for (let i = 0; i < 1024 * 1024 * 1; i++) {
            trans.add({id: i, name: 'a'})
          }
          console.timeEnd('testIndexDBTimeConsume')
          trans.onsuccess = function(e) {
            console.log('trans.onsuccess', e)
          }
          trans.onerror = function(e) {
            console.log('trans.onerror', e)
          }
        }
        IDBRequest.onupgradeneeded = function (e) {
          db = IDBRequest.result
          console.log('onupgradeneeded', db)
          const objectStore = db.createObjectStore('student', {
            keyPath: 'id',
          })
          // 创建索引
          objectStore.createIndex('name', 'name', { unique: false })
          // objectStore.createIndex('age', 'age', { unique: true })
        }
      },
    },
  }
</script>

<style lang="less">
</style>