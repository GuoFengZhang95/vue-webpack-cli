<template>
  <div id="shopcart-settlement-wrp" class="content-page-wrp">
    <a-spin :spinning="spinning" class="spin"></a-spin>
    <MuPageHeader
      :show-reload="true"
      :show-back="true"
      title="填写订单 "
      @parentReload="parentReload"
    ></MuPageHeader>
    <MuPageHeader :show-reload="false" sub-title="收货地址"></MuPageHeader>
    <div class="page-content address-wrp">
      <div class="address-info">
        <template v-if="addressInfo.receiver">
          <span>{{ addressInfo.receiver }}</span>
          <span>{{ addressInfo.phone }}</span>
          <span>{{ addressInfo.province }}</span>
          <span>{{ addressInfo.city }}</span>
          <span>{{ addressInfo.district }}</span>
          <span>{{ addressInfo.detail }}</span>
          <span v-if="addressInfo.isDefault === 1" class="default">
            默认地址
          </span>
        </template>
        <template v-else>请选择收货地址</template>
      </div>
      <div class="operations">
        <div class="operations-item">
          <img src="@/assets/images/edit-primary.png" alt="pic" />
          <a-button type="link" @click="openAddressDrawer">更改地址</a-button>
        </div>
        <div class="operations-item">
          <a-button type="link" @click="editAdress()">
            <span class="span-jiahao">+</span>
            新增临时地址
          </a-button>
        </div>
      </div>
    </div>
    <MuPageHeader :show-reload="false" sub-title="产品清单"></MuPageHeader>
    <div class="shopcart-list page-content">
      <common-table
        :scroll="{ x: 1072 }"
        :columns="columns"
        :data-source="settlementInfo.buyList"
        :table-size="tableSize"
      ></common-table>
      <div class="message">
        <span>留言：</span>
        <a-textarea
          v-model="msg"
          style="width: 435px"
          :auto-size="true"
          :max-length="500"
          placeholder="500字以内"
        ></a-textarea>
      </div>
    </div>
    <MuPageHeader :show-reload="false" sub-title="结算方式"></MuPageHeader>
    <div class="page-content settlement-type">
      <a-radio-group
        v-model="payMode"
        name="radioGroup"
        @change="payModeChange"
      >
        <div
          v-for="(item, index) in settlementInfo.payMode"
          :key="index"
          class="type-radio-item"
        >
          <a-radio :value="item.value">{{ item.name }}</a-radio>
          <span class="tips">{{ item.desc }}</span>
        </div>
      </a-radio-group>
    </div>
    <MuPageHeader :show-reload="false" sub-title="订单结算"></MuPageHeader>
    <div class="page-content settlement-result">
      <div class="detailed-list">
        <div class="detail-item">
          <span class="label">产品金额</span>
          <span class="value">(CNY){{ settlementInfo.totalPrice }}</span>
        </div>
        <div class="detail-item">
          <span class="label">邮费</span>
          <span class="value">(CNY){{ settlementInfo.postage }}</span>
        </div>

        <div v-if="hasPlatDis" class="detail-item">
          <span class="label">
            平台补贴
            <a-checkbox
              :default-checked="
                settlementInfo.discountInfo.discount ? true : false
              "
              @change="platformDiscountChange"
            ></a-checkbox>
          </span>
          <span class="value has-tooltip">
            <span>(CNY)-{{ settlementInfo.discountAmount }}</span>
            <a-tooltip v-if="settlementInfo.discountInfo">
              <template slot="title">
                当前折扣有效时间为{{ settlementInfo.discountInfo.startDate }}-{{
                  settlementInfo.discountInfo.endDate
                }}。折扣基数为产品金额不包含其他费用（优惠券、原子抵扣、邮费等。）
              </template>
              <img
                src="@/assets/images/info-tips.png"
                class="image-tooltip"
                alt="pic"
              />
            </a-tooltip>
          </span>
        </div>
        <div v-if="hasAton" class="detail-item">
          <span class="label">
            原子抵扣
            <a-checkbox
              v-if="settlementInfo.yuanZi"
              :default-checked="userAtom"
              @change="atomChange"
            ></a-checkbox>
          </span>
          <span class="value has-tooltip">
            <span v-if="userAtom">
              (CNY)-{{ settlementInfo.yuanZi.canUsePrice }}
            </span>
            <span v-else>(CNY)-0.00</span>
            <a-tooltip>
              <template slot="title">20原子 = (CNY) 1</template>
              <img
                class="image-tooltip"
                src="@/assets/images/info-tips.png"
                alt="pic"
              />
            </a-tooltip>
          </span>
        </div>
        <div
          v-if="settlementInfo.yuanZi && settlementInfo.yuanZi.canUse"
          class="detail-item atom-tips"
        >
          <span class="label">当前剩余：{{ settlementInfo.yuanZi.total }}</span>
          <span class="value">
            本单可用：{{ settlementInfo.yuanZi.canUse }}
          </span>
        </div>
        <div class="detail-item">
          <span class="label">优惠券</span>
          <span class="value">无可用</span>
        </div>
      </div>
    </div>
    <div class="settlement-create">
      <div class="totla-price">
        <span class="label">应付总额：</span>
        <span class="value">(CNY) {{ totalPriceDue }}</span>
      </div>
      <div class="address-info">
        <span>寄送至：</span>
        <span>{{ addressInfo.receiver }}</span>
        <span>{{ addressInfo.phone }}</span>
        <span>{{ addressInfo.province }}</span>
        <span>{{ addressInfo.city }}</span>
        <span>{{ addressInfo.district }}</span>
        <span>{{ addressInfo.detail }}</span>
      </div>
      <a-button
        type="primary"
        class="commit"
        :loading="loading"
        @click="commit"
      >
        提交订单
      </a-button>
    </div>
    <!-- 地址弹窗 -->
    <edit-address
      v-if="addressModalVisible"
      :address-modal-visible="addressModalVisible"
      address-type="temporary"
      @closeAddressModal="closeAddressModal"
      @setTemporaryAddress="setTemporaryAddress"
    ></edit-address>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import {
    getDefaultAdress,
    getAddressList,
    getSettlementInfo,
    createOrder,
  } from '@/api/eos/index'
  import SelectAddress from '@/views/eos/address/components/SelectAddress'
  import EditAddress from '@/views/eos/address/components/EditAddress'

  export default {
    name: 'EosSettlement',
    components: {
      EditAddress,
    },
    inject: ['reload'],
    props: {
      test: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        spinning: false,
        hasAton: false, //是否拥有原子
        userAtom: true, //是否使用原子-默认使用
        hasPlatDis: false, //是否拥有平台补贴
        usePlatDis: true, //是否使用平台补贴-默认使用
        loading: false,
        payMode: '',
        anonymous: false,
        msg: '',
        addressInfo: {},
        settlementInfo: {},
        // 地址弹窗
        addressModalVisible: false,
        // 表头设置
        columns: [
          {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 80,
            customRender: (text, record, index) => {
              return index + 1
            },
          },
          {
            title: '图片',
            dataIndex: 'coverImage',
            key: 'coverImage',
            customRender: (text, record, index) => {
              return (
                <div class='td-img'>
                  <MuImage width='28' height='28' src={text} />
                </div>
              )
            },
          },
          {
            title: 'SKU编码',
            dataIndex: 'itemCode',
            key: 'itemCode',
          },
          {
            title: '产品名称',
            dataIndex: 'productName',
            key: 'productName',
          },
          {
            title: '下单组合',
            dataIndex: 'specifications',
            key: 'specifications',
          },
          {
            title: '货期',
            dataIndex: 'deliveryPeriod',
            key: 'deliveryPeriod',
          },
          {
            title: '单价',
            dataIndex: 'univalence',
            key: 'univalence',
            customRender: (text, record, index) => {
              return (
                <span>
                  （{record.currencyCode ? record.currencyCode : 'CNY'}）{text}
                </span>
              )
            },
          },
          {
            title: '数量',
            dataIndex: 'count',
            key: 'count',
          },
          {
            title: '包装',
            dataIndex: 'packing',
            key: 'packing',
          },
          {
            title: '总价',
            dataIndex: 'total',
            key: 'total',
            customRender: (text, record, index) => {
              return (
                <span>
                  （{record.currencyCode ? record.currencyCode : 'CNY'}）{text}
                </span>
              )
            },
          },
        ],
      }
    },
    computed: {
      ...mapGetters(['tableSize']),
      // 计算应付总价 总价 - 邮费 - 平台补贴（若使用） - 原子抵扣（若使用）
      totalPriceDue() {
        let total = this.settlementInfo.postage || 0
        total = total * 100 + Number(this.settlementInfo.totalPrice) * 100 //产品总价
        if (this.hasAton && this.userAtom) {
          total = total - Number(this.settlementInfo.yuanZi.canUsePrice) * 100
        }
        if (this.hasPlatDis && this.usePlatDis) {
          total = total - Number(this.settlementInfo.discountAmount) * 100 //平台补贴
        }
        return total ? (total / 100).toFixed(2) : '0.00'
      },
    },
    created() {
      // 监听侧拉框修改地址
      this.$bus.$on('modifyAddress', e => {
        this.addressInfo = e
        this.$globalDrawer.back()
      })
      // 监听侧拉框设置默认地址
      this.$bus.$on('setDefaultAddress', e => {
        if (e.addressId === this.addressInfo.addressId) {
          this.addressInfo = e
        }
      })
    },
    beforeDestroy() {
      this.$bus.$off('modifyAddress')
      this.$bus.$off('setDefaultAddress')
    },
    mounted() {
      getDefaultAdress().then(res => {
        // 没有默认地址
        if (res.data.length === 0) {
          getAddressList().then(res => {
            // 地址列表为空
            if (res.data.length !== 0) {
              this.addressInfo = res.data[0]
            }
          })
        } else {
          this.addressInfo = res.data
        }
      })
      this.getSettlementData('yes')
    },
    methods: {
      parentReload() {
        this.reload()
      },
      // 打开地址侧拉框选择地址
      openAddressDrawer() {
        this.$globalDrawer.show({
          component: SelectAddress,
          options: { name: 'SelectAddress', title: '地址信息', props: {} },
        })
      },
      // 新增临时地址
      editAdress() {
        this.addressModalVisible = true
      },
      // 设置临时地址
      setTemporaryAddress(data) {
        this.addressInfo = data
      },
      // 关闭地址弹窗
      closeAddressModal(e) {
        this.addressModalVisible = false
        if (e.isSubmit) {
          this.parentReload()
        }
      },
      // 更换结算方式
      payModeChange(e) {},
      // 平台补贴
      platformDiscountChange(e) {
        if (e.target.checked) {
          this.getSettlementData('yes')
        } else {
          this.getSettlementData('no')
        }
        this.usePlatDis = e.target.checked
      },
      // 原子
      atomChange(e) {
        this.userAtom = e.target.checked
      },
      // 获取结算信息
      getSettlementData(useDiscount) {
        let settlementData = {
          from: this.$route.params.from,
          useDiscount: useDiscount,
        }
        if (this.$route.params.from === 'cart') {
          settlementData.cartId =
            this.$store.state.shopcart.shopcartSelectedRowkeys.join(',')
        } else {
          settlementData.productId = this.$route.params.productId
          settlementData.count = this.$route.params.count
          settlementData.skuId =
            this.$store.state.shopcart.shopcartSelectedRowkeys.join(',')
        }
        this.spinning = true
        getSettlementInfo(settlementData)
          .then(res => {
            this.$addListId(res.data.buyList, 'skuId')
            this.settlementInfo = res.data
            this.settlementInfo.discountAmount = Number(
              this.settlementInfo.discountAmount
            ).toFixed(2)
            this.payMode = res.data.payMode[0].value
            // 判断是否有可以使用的原子
            this.hasAton = Number(this.settlementInfo.yuanZi.canUse)
              ? true
              : false
            if (!this.hasAton) {
              this.userAtom = false
            }
            // 是否拥有折扣权限
            this.hasPlatDis =
              this.settlementInfo.discountInfo.length === 0 ? false : true
            if (!this.hasPlatDis) {
              this.usePlatDis = false
            }
            this.spinning = false
          })
          .catch(err => {
            this.spinning = false
          })
      },
      // 结算
      commit() {
        let data = {
          from: this.$route.params.from,
          paymode: this.payMode,
          invoice: 0,
          anonymous: this.anonymous,
          ordertype: this.settlementInfo.orderType.Normal,
          useYuanzi: this.userAtom ? 'yes' : 'no',
          useDiscount: this.usePlatDis ? 'yes' : 'no',
          ts: this.settlementInfo.ts,
          M_token: this.settlementInfo.MToken,
          msg: this.msg,
        }
        if (this.$route.params.from === 'cart') {
          data.cartIds =
            this.$store.state.shopcart.shopcartSelectedRowkeys.join(',')
        } else {
          data.itemId = this.$route.params.productId
          data.skuId = this.$route.params.skuId
          data.count = this.$route.params.count
        }
        if (this.addressInfo.addressId) {
          data.addrId = this.addressInfo.addressId
        } else {
          this.addressInfo.streetdetailaddr = this.addressInfo.detail
          this.addressInfo.zip = '' //邮政编码
          data.tempAddress = JSON.stringify({ ...this.addressInfo })
        }

        if (this.addressInfo.receiver) {
          this.loading = true
          createOrder(data)
            .then(res => {
              this.$store.dispatch(
                'shopcart/getShopcartCount',
                this.$store.state.shopcart.shopcartCount -
                  this.$store.state.shopcart.shopcartSelectedRowkeys.length
              )
              this.loading = false
              this.$router.replace({
                name: 'EosPayment',
                params: {
                  orderId: [res.orderId],
                  msg: res.msg,
                  payAll: {
                    isAll: 0,
                  },
                },
              })
            })
            .catch(err => {
              this.loading = false
            })
        } else {
          this.$message.error('请填写地址信息！')
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .address-wrp {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;

    .address-info {
      margin-bottom: 24px;
      display: flex;
      flex-wrap: wrap;
      height: 18px;

      span {
        &.default {
          width: 58px;
          height: 20px;
          color: white;
          text-align: center;
          line-height: 20px;
          background: #999999;
          border-radius: 2px;
        }

        margin-right: 20px;
        font-size: 13px;
        font-weight: 400;
        text-align: left;
        color: #666666;
        line-height: 22px;
      }
    }

    .operations {
      display: flex;
      align-items: center;

      .operations-item {
        margin-right: 80px;
      }
    }
  }

  .shopcart-list {
    .message {
      margin-top: 16px;
      display: flex;
      align-items: center;
    }
  }

  .type-radio-item {
    .tips {
      width: 444px;
      height: 17px;
      font-size: 12px;
      font-weight: 400;
      text-align: left;
      color: #999999;
      line-height: 22px;
    }
  }

  .settlement-result {
    display: flex;
    justify-content: flex-end;

    .detailed-list {
      .detail-item {
        min-width: 250px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .value.has-tooltip {
          position: relative;

          .image-tooltip {
            position: absolute;
            right: -20px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }

      .detail-item.atom-tips {
        justify-content: flex-start;
        font-size: 12px;
        font-weight: 400;
        text-align: right;
        color: #999999;
        line-height: 22px;

        span:nth-of-type(2) {
          margin-left: 20px;
        }
      }
    }
  }

  .settlement-create {
    height: 127px;
    padding-right: 35px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    background: #f3f6f9;

    .totla-price {
      margin-top: 15px;

      .label {
        margin-right: 84px;
        width: 56px;
        height: 18px;
        font-size: 13px;
        font-weight: 700;
        text-align: left;
        color: #666666;
        line-height: 22px;
      }

      .value {
        width: 103px;
        height: 22px;
        font-size: 16px;
        font-weight: 700;
        text-align: right;
        color: #00c7db;
        line-height: 22px;
      }
    }

    .address-info {
      display: flex;
      margin-top: 13px;
      height: 17px;
      font-size: 12px;
      font-weight: 400;
      text-align: left;
      color: #999999;
      line-height: 22px;

      span {
        margin-right: 20px;
        font-size: 13px;
        font-weight: 400;
        text-align: left;
        color: #666666;
        line-height: 22px;
      }
    }

    .ant-btn {
      margin-top: 12px;
      width: 158px;
      height: 40px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 400;
      color: #ffffff;
    }

    .span-jiahao {
      color: #00c7db;
      font-size: 16px;
    }
  }
</style>
<style lang="less"></style>
