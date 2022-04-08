<template>
  <div class="mu-img-wrp">
    <img
      v-if="src"
      v-bind="$attrs"
      class="mu-img_self"
      :src="src"
      :style="{ 'object-fit': mode, 'font-family': `object-fit: ${mode};` }"
    />
  </div>
</template>

<script>
  import objectFitImages from 'object-fit-images'
  export default {
    name: 'MuImage',
    inheritAttrs: false,
    props: {
      src: {
        type: String,
        default: '',
        // required: true
      },
      mode: {
        type: String,
        default: 'cover', //
        // contain 保持原有尺寸比例。内容被缩放
        // cover 保持原有尺寸比例。但部分内容可能被剪切
        // fill 默认，不保证保持原有的比例，内容拉伸填充整个内容容器
        // none 保留原有元素内容的长度和宽度，也就是说内容不会被重置
        // scale-down 保持原有尺寸比例。内容的尺寸与 none 或 contain 中的一个相同，取决于它们两个之间谁得到的对象尺寸会更小一些
        // initial 设置为默认值
      },
    },
    data() {
      return {
        width: 'auto',
        height: 'auto',
      }
    },
    mounted() {
      // console.log(this.$attrs)
      this.$nextTick(() => {
        let imgObjectFit = document.querySelectorAll('.mu-img_self')
        // console.log('imgObjectFit', imgObjectFit)
        objectFitImages(imgObjectFit)
      })
    },
  }
</script>

<style lang="less" scoped>
  .mu-img_self {
    display: block;
  }
</style>
