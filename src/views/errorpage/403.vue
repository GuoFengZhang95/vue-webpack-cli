<template>
  <div class="page-403-wrp"></div>
</template>

<script>
  import { logout } from '@/api/login'
  export default {
    name: 'Page403',
    mounted() {
      this.$error({
        title: `${this.$route.params.msg}`,
        content: '您沒有使用权限！',
        onOk: () => {
          logout()
        },
      })
    },
    methods: {},
  }
</script>

<style lang="scss" scoped></style>
