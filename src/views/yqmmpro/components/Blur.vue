<template>
  <div
    class="blur-container"
    :class="'blur-' + module"
    :style="{ 'background-image': `url(` + src + `)` }"
  >
    <div class="pic">
      <img :src="qrcode" class="qrcode" alt="qrcode" />
    </div>
    <div class="mark">暂无查看额度，微信扫码获取额度！</div>
    <div class="text">获取额度后需刷新页面</div>
  </div>
</template>

<script>
  export default {
    props: {
      qrcode: {
        type: String,
        default: '',
      },
      module: {
        type: String,
        default: '',
      },
      src: {
        type: String,
        default: '',
      },
    },
  }
</script>

<style lang="less" scoped>
  .blur-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    background-position: center;
    background-size: 100% 100%;

    .pic {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 179px;
      height: 179px;
      margin-bottom: 41px;
      background: #fff;
      border-radius: 50%;
      overflow: hidden;

      .qrcode {
        width: 160px;
        height: 160px;
      }
    }

    .mark {
      position: relative;
      width: fit-content;
      height: 22px;
      font-size: 20px;
      font-weight: bold;
      color: #00c7db;
      line-height: 22px;
      margin-bottom: 3px;

      &::before,
      &::after {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        content: '';
        width: 47px;
        height: 1px;
        margin-top: 2px;
      }

      &::before {
        left: -62px;
        background-image: linear-gradient(
          270deg,
          rgba(0, 199, 219, 1),
          rgba(0, 199, 219, 0)
        );
      }

      &::after {
        right: -51px;
        background-image: linear-gradient(
          270deg,
          rgba(0, 199, 219, 0),
          rgba(0, 199, 219, 1)
        );
      }
    }

    .text {
      height: 22px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 198, 219, 0.5);
      line-height: 22px;
      letter-spacing: 12px;
      transform: scale(0.9167);
    }

    &.blur-researcher,
    &.blur-news {
      padding-top: 80px;
      height: 850px;
    }

    &.blur-purchase,
    &.blur-fund {
      height: 871px;
      padding-top: 120px;
    }

    &.blur-bid {
      height: 1161px;
      padding-top: 120px;
    }
  }
</style>
