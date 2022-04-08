<template>
  <div v-if="authType == 2 || authType == 3" class="auth-tips">
    <div class="tips-icon">
      <img
        class="tips-icon-img"
        src="@/assets/images/pic/auth-tip.png"
        alt=""
      />
    </div>
    <div v-if="authType === 2" class="tips-text">
      您暂无该页面权限，请先开通企业套餐或加入企业。
    </div>
    <div v-if="authType === 3" class="tips-text">
      您没有该页面的权限，请联系企业管理员。
    </div>
    <div v-if="authType === 2" class="tips-contact">
      <div class="contact-left">
        <img class="contact-qrcode" src="@/assets/images/pic/kefu.png" alt="" />
      </div>
      <div class="contact-right">
        <div class="right-row1">微信扫一扫联系客服</div>
        <div class="right-row2">
          <p class="row2-item">咨询热线：17761710480</p>
          <p class="row2-item">工作时间：周一至周五 8:30-18:00</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AuthTips',
    props: {
      authType: {
        type: Number,
        default: 2,
      },
    },
  }
</script>

<style lang="less" scoped>
  .auth-tips {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 90px;
    .tips-icon {
      width: 228px;
      height: 307px;
      overflow: hidden;
      .tips-icon-img {
        width: 100%;
        height: 100%;
      }
    }
    .tips-text {
      margin-top: -79px;
      font-size: 14px;
      color: #666;
      line-height: 16px;
    }
    .tips-contact {
      margin-top: 60px;
      width: 338px;
      height: 102px;
      border-radius: 4px;
      border: 1px solid #d9d9d9;
      display: flex;
      overflow: hidden;
      .contact-left {
        padding: 10px;
        .contact-qrcode {
          width: 80px;
        }
      }
      .contact-right {
        font-size: 14px;
        line-height: 16px;
        .right-row1 {
          padding-top: 12px;
          color: #00c7db;
        }
        .right-row2 {
          padding-top: 8px;
          color: #666;
          .row2-item {
            padding-top: 8px;
          }
        }
      }
    }
  }
</style>
