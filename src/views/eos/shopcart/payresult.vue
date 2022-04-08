<template>
  <div id="payment-wrp" class="content-page-wrp">
    <div class="except-bottom-operations">
      <MuPageHeader
        :show-reload="true"
        :show-back="false"
        title
        @parentReload="parentReload"
      ></MuPageHeader>
      <div v-if="success" class="result">
        <div class="img success center-flex">
          <div class="check-success"></div>
        </div>
        <div class="tips">支付成功</div>
        <div class="detail">
          订单编号{{ orderId }}支付成功，
          <a-button type="link">{{ time }}s</a-button>
          &nbsp;内自动跳转到订单列表，如未自动跳转请&nbsp;
          <a-button type="link" @click="goOrderList">点击这里</a-button>
        </div>
      </div>
      <div v-else class="result">
        <div class="img fail center-flex">
          <div class="check-close"></div>
        </div>
        <div class="tips">支付失败</div>
        <div class="detail">
          <a-button type="link">{{ time }}s</a-button>
          &nbsp;内自动跳转到订单列表，可在订单列表选择此订单选择其他支付方式继续完成支付，如未自动跳转&nbsp;
          <a-button type="link" @click="goOrderList">点击这里</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'EosPayResult',
    inject: ['reload'],
    props: {
      test: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        success: true,
        time: 5,
        timer: null,
        orderId: '',
      }
    },
    computed: {},
    watch: {},
    mounted() {
      this.success = this.$route.params.success
      this.orderId = this.$route.params.orderId
      this.timer = setInterval(() => {
        this.time--
        if (this.time == 0) {
          clearInterval(this.timer)
          this.$router.replace({
            name: 'EosrderList',
          })
        }
      }, 1000)
    },
    destroyed() {
      clearInterval(this.timer)
    },
    methods: {
      parentReload() {
        this.reload()
      },
      goOrderList() {
        clearInterval(this.timer)
        this.$router.replace({
          name: 'OrderList',
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .result {
    display: flex;
    flex-direction: column;
    align-items: center;
    .img {
      margin-top: 165px;
      width: 72px;
      height: 72px;
      border-radius: 50%;
    }
    .success {
      background: #36c626;
      .check-success {
        position: relative;
        transform: rotate(50deg);
        transform-origin: center;
        width: 20px;
        height: 40px;
        border-color: white;
        border-style: solid;
        border-width: 0 6px 6px 0;
      }
    }
    .fail {
      background: #ff1a2e;
      .check-close {
        position: relative;
      }
      .check-close::before,
      .check-close::after {
        position: absolute;
        content: '';
        background-color: white;
        left: -1px;
        top: -18px;
        width: 6px;
        height: 40px;
      }

      .check-close::before {
        transform: rotate(45deg);
      }

      .check-close::after {
        transform: rotate(-45deg);
      }
    }
    .tips {
      margin-top: 24px;
      width: 96px;
      height: 32px;
      font-size: 24px;
      text-align: left;
      color: rgba(0, 0, 0, 0.85);
      line-height: 32px;
    }
    .detail {
      margin-top: 16px;
      width: 720px;
      height: 60px;
      font-size: 14px;
      font-weight: 400;
      text-align: center;
      color: #666666;
      line-height: 22px;
    }
  }
</style>
<style lang="less"></style>
