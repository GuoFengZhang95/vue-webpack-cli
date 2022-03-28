<template>
  <div id="app">
    {{ awaitNum }}
    <div class="box"></div>
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
    const person = {
      name: 'zgf'
    }
    let name = person.name ?? 'zevan'
    console.log(name)
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
.box {
  width: 100px;
  height: 100px;
  border: 1px solid black;
  box-shadow: 10px 10px red;
  transform: translateX(30px);
  display: flex;
}
</style>
