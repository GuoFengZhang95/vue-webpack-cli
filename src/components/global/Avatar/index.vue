<template>
  <div class="avatar-wrp size-common">
    <div class="avatar">
      <img
        v-if="src"
        class="avatar-img"
        :class="showMask ? 'mask' : ''"
        :src="src"
        @error="imgLoadError"
      />
      <div v-else class="username-wrp" :class="showMask ? 'mask' : ''">
        <div class="username">{{ username[0] }}</div>
      </div>
    </div>
    <img
      v-if="isAuthenticated === 1 && isOfficial === 0"
      class="approve-type-icon"
      src="https://img.mumuxili.com/yqmm/mobile/wx/imgs/icon/approve-icon.svg"
    />
    <img
      v-if="isOfficial === 1"
      class="approve-type-icon"
      src="https://img.mumuxili.com/yqmm/mobile/wx/imgs/icon/guanfangrenzheng.svg"
    />
    <img
      v-if="gender === 1"
      class="approve-type-icon"
      src="./icon/gender-male.svg"
    />
    <img
      v-if="gender === 0"
      class="approve-type-icon"
      src="./icon/gender-female.svg"
    />
  </div>
</template>

<script>
  export default {
    name: 'MuAvatar',
    props: {
      /**头像url */
      src: {
        type: String,
        default: '',
      },
      /**用户名，图像加载不出来使用用户名第一个字 */
      username: {
        type: String,
        default: '',
      },
      /** 性别 1男 0女 null是为了兼容后端给null */
      gender: {
        type: Number,
        default: null,
      },
      /**是否已认证：0 未认证 1 已认证 */
      isAuthenticated: {
        type: Number,
        default: 0,
      },
      /**是否官方认证：0否 1是 */
      isOfficial: {
        type: Number,
        default: 0,
      },
      /**是否显示模糊遮罩 */
      showMask: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      imgLoadError() {
        this.$$emit('src', '')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .avatar-wrp {
    position: relative;
    top: 0;

    .avatar {
      border-radius: 50%;
      box-sizing: border-box;
      overflow: hidden;

      .username-wrp {
        position: relative;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #00c7db;

        .username {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
        }
      }

      &::before {
        content: '';
        position: absolute;
        top: -50%;
        bottom: -50%;
        left: -50%;
        right: -50%;
        border-radius: 50%;
        border: 1px solid #ebebeb;
        transform: scale(0.5);
      }

      .avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }

      .mask {
        -webkit-filter: blur(2.5px);
        -moz-filter: blur(2.5px);
        -ms-filter: blur(2.5px);
        filter: blur(2.5px);
      }
    }

    .approve-type-icon {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }

  .size-common {
    width: 42px;
    height: 42px;

    .avatar {
      width: 100%;
      height: 100%;

      .username {
        font-size: 20px;
      }
    }

    .approve-type-icon {
      width: 14px;
      height: 14px;
    }
  }
</style>
