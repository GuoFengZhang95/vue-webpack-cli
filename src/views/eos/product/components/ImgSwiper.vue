<template>
  <div id="img-swiper-wrp" class="img-swiper-wrp">
    <div class="current-img-wrp" @click="modal1Visible = true">
      <template v-for="(item, index) in coverImg">
        <mu-image
          v-if="index == selected"
          :key="index"
          width="254"
          height="254"
          :src="item"
        ></mu-image>
      </template>
    </div>
    <div class="operations">
      <ul class="all-img-wrp clearfix" :style="{ left: -step * 62 + 'px' }">
        <li
          v-for="(item, index) in coverImg"
          :key="index"
          class="img-item-wrp fl"
          :class="{ selected: selected === index }"
          @click="selected = index"
        >
          <mu-image width="48" height="48" :src="item" alt="pic"></mu-image>
        </li>
      </ul>
      <div class="left icon-wrp" @click="move('left')">
        <img
          class="icon-arrow"
          :src="require('@/assets/images/icon/arrow-left.png')"
          alt="pic"
        />
      </div>
      <div class="right icon-wrp" @click="move('right')">
        <img
          class="icon-arrow"
          :src="require('@/assets/images/icon/arrow-right.png')"
          alt="pic"
        />
      </div>
    </div>
    <a-modal
      width="auto"
      centered
      :footer="null"
      :visible="modal1Visible"
      :get-container="getContainer"
      @cancel="modal1Visible = false"
    >
      <img class="img-preview" :src="coverImg[selected]" />
    </a-modal>
  </div>
</template>

<script>
  export default {
    name: 'ImgSwiper',
    props: {
      coverImg: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        selected: 0,
        step: 0,
        modal1Visible: false,
      }
    },
    computed: {
      shopcartCount() {
        return this.$store.state.shopcart.shopcartCount
      },
    },
    mounted() {},
    methods: {
      // 前往购物车
      goShopcart() {
        this.$router.push({ name: 'EosShopcartList' })
      },
      // 切换图片
      move(dir) {
        if (dir === 'left') {
          if (this.step <= 0) return
          this.step--
        } else if (dir === 'right') {
          if (this.step >= this.coverImg.length - 4) return
          this.step++
        }
      },
      getContainer() {
        return document.getElementById('img-swiper-wrp')
      },
    },
  }
</script>

<style lang="less" scoped>
  .img-swiper-wrp {
    position: relative;
    width: 256px;

    .current-img-wrp {
      width: 256px;
      height: 256px;
      margin-bottom: 8px;
      background: rgba(0, 0, 0, 0);
      border: 1px solid #e9e9e9;
      border-radius: 2px;
    }
    .operations {
      // width: 100%;
      // height: 50px;
      padding: 0 12px;
      position: relative;
      overflow: hidden;

      .icon-wrp {
        position: absolute;
        top: 0px;
        z-index: 10;
        width: 12px;
        height: 54px;
        cursor: pointer;
        background: white;

        &.left {
          left: 0;
        }

        &.right {
          right: 0;
        }

        .icon-arrow {
          margin-top: 2px;
          width: 12px;
          height: 50px;
        }
      }

      .all-img-wrp {
        position: relative;
        width: 4000px;
        transition: all 0.3s;
        .img-item-wrp {
          margin: 0 4px;
          background: rgba(0, 0, 0, 0);
          border: 1px solid #e9e9e9;
          border-radius: 2px;
          cursor: pointer;

          &.selected {
            border: 1px solid #00c7db;
          }
        }
      }
    }
  }
</style>

<style lang="less">
  .img-swiper-wrp {
    .ant-modal-body {
      padding: 40px 40px 40px 40px;

      .img-preview {
        display: block;
        margin: 0 auto;
      }
    }
  }
</style>
