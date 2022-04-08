<template>
  <div id="page-sass-invoice-application" class="content-page-wrp">
    <div class="except-bottom-operations">
      <MuPageHeader
        :show-reload="true"
        :show-back="true"
        title="填写开票信息"
        @parentReload="parentReload"
      ></MuPageHeader>
      <MuPageHeader :show-reload="false" sub-title="发票信息"></MuPageHeader>
      <div class="page-content invoice-info-wrp">
        <div class="invoice-list">
          <!-- 发票类型 -->
          <div class="invoice-item">
            <div class="info-dl">发票类型：</div>
            <div class="info-dt">
              <a-radio-group
                v-model="form.invoiceType"
                @change="invoiceTypeChange"
              >
                <div class="radio-group-wrp">
                  <div class="radio-item-wrp">
                    <a-radio :value="1">增值税普通发票</a-radio>
                  </div>
                  <div class="radio-item-wrp">
                    <a-radio :value="2">增值税专用发票</a-radio>
                  </div>
                </div>
              </a-radio-group>
            </div>
          </div>
          <!-- 发票抬头 -->
          <div class="invoice-item">
            <div class="info-dl">发票抬头：</div>
            <!-- 普票 -->
            <div v-if="form.invoiceType == 1" class="info-dt">
              <a-radio-group
                v-model="invoiceIdPuPiao"
                @change="invoiceTitleChange"
              >
                <div class="radio-group-wrp vertical">
                  <!-- <div class="radio-item-wrp" v-if="commonInvoiceList.length===0">
                    <a-radio checked>个人发票</a-radio>
                  </div>-->
                  <div
                    v-for="item in commonInvoiceList"
                    :key="item.id"
                    class="radio-item-wrp"
                  >
                    <a-radio :value="item.id">
                      {{ item.title }}（{{ item.taxCode }}）
                    </a-radio>
                  </div>
                </div>
              </a-radio-group>
              <div v-if="commonInvoiceList.length <= 14" class="edit">
                <span class="span-jiahao">+</span>
                <a-button type="link" @click="editCommonInvoice">
                  新增/修改抬头
                </a-button>
              </div>
            </div>
            <!-- 专票 -->
            <div v-if="form.invoiceType == 2" class="info-dt">
              <div class="a-descriptions-wrp">
                <a-descriptions :column="2">
                  <a-descriptions-item label="单位名称">
                    {{ vatInvoice.companyName }}
                  </a-descriptions-item>
                  <a-descriptions-item label="注册电话">
                    {{ vatInvoice.regTel }}
                  </a-descriptions-item>
                  <a-descriptions-item label="纳税人识别号">
                    {{ vatInvoice.taxCode }}
                  </a-descriptions-item>
                  <a-descriptions-item label="开户银行">
                    {{ vatInvoice.bank }}
                  </a-descriptions-item>
                  <a-descriptions-item label="注册地址">
                    {{ vatInvoice.regAddress }}
                  </a-descriptions-item>
                  <a-descriptions-item label="银行账号">
                    {{ vatInvoice.account }}
                  </a-descriptions-item>
                </a-descriptions>
              </div>
            </div>
          </div>
          <!-- 收票人信息 -->
          <div class="invoice-item">
            <div class="info-dl">收票人信息：</div>
            <div class="info-dt">
              <a-radio-group
                v-if="addressInfo.receiver"
                v-model="addressInfo.addressId"
                @change="invoiceReceiverChange"
              >
                <div class="radio-group-wrp vertical">
                  <div class="radio-item-wrp">
                    <a-radio :value="addressInfo.addressId"></a-radio>
                    <div class="address-info">
                      <span>{{ addressInfo.receiver }}</span>
                      <span>{{ addressInfo.phone }}</span>
                      <span>{{ addressInfo.province }}</span>
                      <span>{{ addressInfo.city }}</span>
                      <span>{{ addressInfo.district }}</span>
                      <span>{{ addressInfo.detail }}</span>
                      <span v-if="addressInfo.isDefault === 1" class="default">
                        默认地址
                      </span>
                    </div>
                  </div>
                </div>
              </a-radio-group>
              <div v-else>请选择收货地址</div>
              <div class="edit">
                <img src="@/assets/images/edit-primary.png" alt="pic" />
                <a-button type="link" @click="openAddressDrawer">
                  选择其他地址
                </a-button>
              </div>
              <div class="edit">
                <span style="color: #00c7db">+</span>
                <a-button type="link" @click="editAdress()">
                  新增临时地址
                </a-button>
              </div>
            </div>
          </div>
          <!-- 发票内容 -->
          <div class="invoice-item">
            <div class="info-dl">发票内容：</div>
            <div class="info-dt">
              <a-radio-group
                v-model="form.content"
                @change="invoiceContentChange"
              >
                <div class="radio-group-wrp">
                  <div
                    v-for="item in invoiceContent"
                    :key="item.key"
                    class="radio-item-wrp"
                  >
                    <a-radio :value="item.key">{{ item.value }}</a-radio>
                  </div>
                </div>
              </a-radio-group>
            </div>
          </div>
          <!-- 备注信息 -->
          <div class="invoice-item">
            <div class="info-dl">备注信息</div>
            <div class="info-dt">
              <a-textarea
                v-model="form.message"
                style="width: 435px"
                :auto-size="true"
                :max-length="300"
                placeholder="如果您有其他开票需求，请在此留言（300字以内）"
              ></a-textarea>
            </div>
          </div>
        </div>
      </div>
      <MuPageHeader :show-reload="false" sub-title="关联订单"></MuPageHeader>
      <div class="table-wrp">
        <common-table
          :scroll="{ x: 1072 }"
          :columns="invoicingColumns"
          :data-source="tableList"
          :table-size="tableSize"
        ></common-table>
      </div>
      <div class="operations">
        <a-button type="primary" :loading="loading" @click="commit">
          确定
        </a-button>
        <a-button @click="goBack">取消</a-button>
      </div>
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
    getInvoiceList,
    getDefaultAdress,
    getAddressList,
    getInvoiceContent,
    getDistributionAuthInfo,
    applyInvoice,
    getInvoiceApplicationList,
  } from '@/api/eos/index'
  import SelectAddress from '../address/components/SelectAddress'
  import EditAddress from '../address/components/EditAddress'
  export default {
    name: 'EosInvoiceApplication',
    components: {
      EditAddress,
    },
    inject: ['reload'],
    data() {
      return {
        loading: false,
        // 地址弹窗
        addressModalVisible: false,
        addressInfo: {},
        commonInvoiceList: [],
        vatInvoice: {},
        tableList: [],
        invoiceContent: [],
        // 待开票订单列表表头
        invoicingColumns: [
          {
            title: '序号',
            width: 80,
            dataIndex: 'index',
            key: 'index',
            customRender: (text, record, index) => {
              return index + 1
            },
          },
          {
            title: '订单编号',
            dataIndex: 'orderId',
            key: 'orderId',
          },
          {
            title: '申请时间',
            dataIndex: 'time',
            key: 'time',
          },
          {
            title: '订单金额',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            customRender: (text, record, index) => {
              return (
                <span>
                  （{record.currencyCode ? record.currencyCode : 'CNY'}）{text}
                </span>
              )
            },
          },
          {
            title: '可开票金额',
            dataIndex: 'invoicePrice',
            key: 'invoicePrice',
            customRender: (text, record, index) => {
              return (
                <span>
                  （{record.currencyCode ? record.currencyCode : 'CNY'}）{text}
                </span>
              )
            },
          },
        ],
        form: {
          orders: '', //订单id
          invoiceId: 0, //是否个人发票
          invoiceType: 1, //发票类型
          content: 1,
          invoiceReceiver: 1,
          message: '',
        },
        invoiceIdPuPiao: 0, //增税普票id 用于普票切换
        invAddrId: '',
      }
    },
    computed: {
      ...mapGetters(['tableSize']),
    },
    created() {
      // 监听侧拉框修改地址
      this.$bus.$on('modifyAddress', e => {
        this.addressInfo = e
        this.$globalDrawer.goBack()
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
      // 获取专票信息
      getDistributionAuthInfo().then(res => {
        this.vatInvoice = res.data.vatInvoice
      })
      // 获取我的发票列表
      getInvoiceList().then(res => {
        this.$addListId(res.data.normal, 'taxCode')
        this.commonInvoiceList = res.data.normal
        if (this.commonInvoiceList.length) {
          this.invoiceIdPuPiao = this.commonInvoiceList[0].id
        }
      })
      getDefaultAdress().then(res => {
        // 没有默认地址
        if (res.data.length === 0) {
          getAddressList().then(res => {
            // 地址列表为空
            if (res.data.length !== 0) {
              this.addressInfo = res.data[0]
              this.invAddrId = this.addressInfo.addressId
            }
          })
        } else {
          this.addressInfo = res.data
          this.invAddrId = this.addressInfo.addressId
        }
      })
      // 获取发票内容 产品明细 办公用品 仪器 耗材 试剂
      getInvoiceContent().then(res => {
        this.invoiceContent = res.data
      })
      // 需开票订单列表
      if (this.$route.params.isAll) {
        // 获取所有可开票订单
        let data = {
          listType: 1, //开票列表类型(1：待开票列表 2：已开票列表 3：开票申请记录列表)
          pno: 1,
          perpage: this.$route.params.totalCount,
        }
        getInvoiceApplicationList(data).then(res => {
          this.$addListId(res.data.orderList, 'orderId')
          this.tableList = res.data.orderList
        })
        this.form.isAll = 1
        this.form.source = 6
        this.form.ordergenre = 2
      } else {
        let ordersArr = []
        this.tableList = this.$route.params.selectedOrderList
        this.tableList.forEach(item => {
          ordersArr.push(item.orderId)
        })
        this.form.orders = ordersArr.join(',')
      }
    },
    methods: {
      parentReload() {
        this.reload()
      },
      invoiceTypeChange(e) {
        // console.log('invoiceTypeChange', e.target.value);
      },
      invoiceTitleChange(e) {
        // console.log('invoiceTitleChange', e.target.value);
      },
      invoiceReceiverChange(e) {
        // console.log('invoiceReceiverChange', e.target.value);
      },
      invoiceContentChange(e) {
        // console.log('invoiceContentChange', e.target.value);
      },
      // 打开地址侧拉框选择地址
      openAddressDrawer() {
        // this.$globalDrawer.show({ com: SelectAddress })
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
      // 新增修改抬头
      editCommonInvoice() {
        this.$router.push({
          name: 'EosMineInvoice',
        })
      },
      commit() {
        if (this.form.invoiceType == 2) {
          //当前是选择了增税专票
          this.form.invoiceId = this.vatInvoice.vatId
        } else if (this.form.invoiceType == 1) {
          //当前是选择了增税普票
          this.form.invoiceId = this.invoiceIdPuPiao
        }
        if (!this.form.invoiceId) {
          this.$message.error('请选择发票抬头！')
          return
        }
        let data = { ...this.form }
        if (this.addressInfo.addressId) {
          data.invAddrId = this.addressInfo.addressId
        } else {
          this.addressInfo.streetdetailaddr = this.addressInfo.detail
          this.addressInfo.zip = '' //邮政编码
          data.tempAddress = JSON.stringify(this.addressInfo)
        }
        this.loading = true
        applyInvoice(data)
          .then(res => {
            this.loading = false
            this.$message.success({
              content: '已提交开票申请！',
              duration: 2,
              onClose: () => {
                this.goBack()
              },
            })
          })
          .catch(err => {
            this.loading = true
          })
      },
      goBack() {
        this.$router.go(-1)
      },
    },
  }
</script>

<style lang="less" scoped>
  #page-sass-invoice-application {
    .invoice-info-wrp {
      .invoice-list {
        .invoice-item {
          margin-top: 12px;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          margin-bottom: 24px;
          .info-dl {
            min-width: 80px;
            height: 20px;
            font-size: 14px;
            font-weight: 700;
            text-align: left;
            color: #666666;
            line-height: 22px;
          }
          .info-dt {
            display: flex;
            flex-wrap: wrap;
            margin-left: 12px;
            .radio-group-wrp {
              display: flex;
              &.vertical {
                display: block;
                .radio-item-wrp {
                  display: flex;
                  align-items: center;
                  justify-content: flex-start;
                }
              }
              .radio-item-wrp {
                margin: 0 34px 12px 0;
                .ant-radio-wrapper {
                  max-width: 800px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }
            .edit {
              margin-right: 34px;
              .span-jiahao {
                color: #00c7db;
                font-size: 16px;
              }
            }
          }
        }
      }

      .address-info {
        display: flex;
        // width: 671px;
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
    }
    .operations {
      margin-top: 40px;
      margin-bottom: 40px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .ant-btn {
        margin-right: 24px;
      }
    }
  }
</style>
<style lang="less"></style>
