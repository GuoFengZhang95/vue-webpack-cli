<template>
  <div id="payment-wrp" class="content-page-wrp">
    <div class="except-bottom-operations">
      <MuPageHeader
        :show-reload="true"
        :show-back="true"
        title="收银台"
        @parentReload="parentReload"
      ></MuPageHeader>
      <div v-if="timer" style="margin: 100px; text-align: center">
        此订单无需支付，{{ time }}s后自动跳转至订单列表...
      </div>
      <a-modal
        :centered="true"
        :get-container="getContainer"
        :visible="visible"
        title="请在新窗口完成支付！"
        ok-text="支付成功"
        cancel-text="重新支付"
        @ok="ok"
        @cancel="cancel"
      ></a-modal>
    </div>
  </div>
</template>

<script>
  import { getAllSettleOrders } from '@/api/eos/index'
  export default {
    name: 'EosPayment',
    inject: ['reload'],
    props: {
      test: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        time: 3,
        timer: null,
        visible: false,
      }
    },
    mounted() {
      this.initPay()
    },
    destroyed() {
      clearInterval(this.timer)
    },
    methods: {
      parentReload() {
        this.reload()
      },
      async initPay() {
        let orderId = ''
        if (this.$route.params.payAll.isAll) {
          let res = await getAllSettleOrders(this.$route.params.payAll)
          orderId = res.orderId
          window.open(
            `https://vip${process.env.ENV}.mumuxili.com/mall/order/waytopay?orderId=${orderId}`
          )
          this.visible = true
        } else {
          if (this.$route.params.msg == '无需付款订单提交成功') {
            this.timer = setInterval(() => {
              this.time--
              if (this.time === 0) {
                this.$router.replace({
                  name: 'EosOrderList',
                })
              }
            }, 1000)
          } else {
            orderId = this.$route.params.orderId.join(',')
            window.open(
              `https://vip${process.env.ENV}.mumuxili.com/mall/order/waytopay?orderId=${orderId}`
            )
            this.visible = true
          }
        }
      },
      initComfirm() {
        this.$confirm({
          title: '请在新窗口完成支付！',
          icon: 'info-circle',
          content: '',
          okText: '支付成功',
          okType: 'primary',
          cancelText: '重新支付',
          cancelType: 'danger',
          centered: true,
          keyboard: false,
          onOk: () => {
            this.$router.replace({
              name: 'EosOrderList',
            })
          },
          onCancel: () => {
            this.initPay()
            this.initComfirm()
          },
        })
      },
      ok() {
        this.$router.replace({
          name: 'EosOrderList',
        })
      },
      cancel(e) {
        // 兼容IE
        if (e.target.className === 'ant-modal-close') {
          //直接关闭
          this.$router.replace({
            name: 'EosOrderList',
          })
          return
        }
        if (e.target.tagName === 'BUTTON') {
          //重新支付
          this.initPay()
        } else {
          //直接关闭
          this.$router.replace({
            name: 'EosOrderList',
          })
        }
      },
      getContainer() {
        return document.getElementById('payment-wrp')
      },
    },
  }
</script>

<style lang="less" scoped></style>
<style lang="less">
  #payment-wrp {
    .ant-modal-body {
      padding: 0px;
    }
  }
</style>
