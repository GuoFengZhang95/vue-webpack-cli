<template>
  <div id="common-detail-container">
    <component :is="currentComp" :id="detailId" class="detail-com"></component>
  </div>
</template>

<script>
  export default {
    name: 'CommonDetailContainer',
    data() {
      return {
        detailMap: null,
        detailName: '',
        detailId: '',
        currentComp: null,
      }
    },

    mounted() {
      this.detailName = `${this.toFirstLetterUpper(
        this.$route.params.name
      )}Detail`
      this.detailId = this.$route.params.id
      this.getCurrentComp(this.detailName).then(res => {
        this.currentComp = res.default
      })
    },

    methods: {
      getCurrentComp(name) {
        if (name == 'BidDetail') {
          return import(`../components/${name}/index.vue`)
        } else {
          return import(`../components/${name}.vue`)
        }
      },

      toFirstLetterUpper(letter) {
        return letter[0].toUpperCase() + letter.substring(1)
      },
    },
  }
</script>

<style></style>
