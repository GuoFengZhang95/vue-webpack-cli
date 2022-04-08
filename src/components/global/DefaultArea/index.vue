<template>
  <a-spin
    v-if="visible"
    :spinning="loadingStatus === 1"
    :tip="loadingTips"
    :delay="30"
  >
    <div class="default-area-wrp">
      <div v-if="loadingStatus == 2" class="default-area_inner">
        <img class="default-img" :src="defaultImg" alt="default" />
        <div class="desc-wrp">
          <span v-if="!$scopedSlots.desc" class="desc">{{ desc }}</span>
          <slot v-else name="desc"></slot>
        </div>
        <div v-if="links.length" class="link-list">
          <div
            v-for="(item, index) in links"
            :key="index"
            class="link-item"
            @click="$emit('handleLinksClick', item)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script>
  export default {
    name: 'DefaultArea',
    props: {
      loadingTips: {
        type: String,
        default: 'Loading...',
      },
      desc: {
        type: String,
        default: '暂无内容',
      },
      defaultImg: {
        type: String,
        default: () => {
          return require('@/assets/images/common/detail-default.svg')
        },
      },
      /**请求状态 0请求失败 1请求中 2请求完成无结果 3请求完成有结果 */
      loadingStatus: {
        type: Number,
        default: -1,
      },
      links: {
        type: Array,
        default: () => [],
      },
    },
    computed: {
      visible() {
        return ![-1, 3].includes(this.loadingStatus)
      },
    },
  }
</script>

<style lang="less" scoped>
  .default-area-wrp {
    width: 100%;
    min-width: 310px;
    height: 310px;
    display: flex;
    align-items: center;
    justify-content: center;

    .default-area_inner {
      position: relative;
      width: 100%;
      font-size: 14px;

      .default-img {
        display: block;
        margin: 0 auto;
        width: 310px;
        height: 310px;
      }

      .desc-wrp {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 24px;
        width: 100%;
        text-align: center;

        // .desc {
        // }

        // .desc-slot {
        // }
      }

      .link-list {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0px;
        width: 100%;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;

        .link-item {
          font-size: 14px;
          position: relative;
          padding-right: 16px;
          color: #00c7db;
          cursor: pointer;

          &:not(:last-child)::after {
            content: '';
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 12px;
            background-color: #ebebeb;
          }
        }
      }
    }
  }
</style>
