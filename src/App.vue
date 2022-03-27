<template>
  <div id="app">
    {{ awaitNum }}
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      awaitNum: 0,
    };
  },
  async mounted() {
    const  fn =   () => {
      console.log(1)
    }
    let map = new Map()
    let bool = [1, 2, 3].includes(1)
    let p = new Promise((resolve, reject) => {})
    let httpRes = await this.http()

    console.log('箭头函数', fn);
    console.log('Map', map)
    console.log('includes',bool)
    console.log('Promise', p)
    console.log('Vuex', this.$store)
    console.log('await', httpRes)
    this.awaitNum = httpRes
  },
  methods: {
    http() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(1)
        }, 2000)
      })
    }
  }
};
</script>

<style lang="less">
</style>
