<template>
  <a-modal
    :visible="invoiceModalVisible"
    :title="invoiceModalTitle"
    :centered="true"
    width="740px"
    :footer="null"
    destroy-on-close
    @cancel="closeInvoiceModal"
  >
    <div class="edit-invoice-wrp">
      <div class="item">
        <div class="label">发票类型：</div>
        <div class="content">
          <span v-if="type == 1" style="color: #444444">增值税普通发票</span>
          <span v-else style="color: #444444">增值税专用发票</span>
        </div>
      </div>
      <div class="item">
        <div class="label">发票类型：</div>
        <div class="content">
          <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-form-model-item label="单位名称" prop="title">
              <a-input v-model="form.title" :disabled="type === 2"></a-input>
            </a-form-model-item>
            <a-form-model-item label="纳税人识别号" prop="taxCode">
              <a-input v-model="form.taxCode" :disabled="type === 2"></a-input>
            </a-form-model-item>
            <a-form-model-item label="注册地址" prop="regAddress">
              <a-input v-model="form.regAddress"></a-input>
            </a-form-model-item>
            <a-form-model-item label="注册电话" prop="regTel">
              <a-input v-model="form.regTel"></a-input>
            </a-form-model-item>
            <a-form-model-item label="开户银行" prop="bankName">
              <a-input v-model="form.bankName"></a-input>
            </a-form-model-item>
            <a-form-model-item label="银行账号" prop="bankAccount">
              <a-input v-model="form.bankAccount"></a-input>
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>
      <div class="confirm clearfix">
        <a-button
          type="primary"
          class="fr"
          :loading="loading"
          @click="submitForm('ruleForm')"
        >
          确定
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
  import { editCommonInvoice } from '@/api/eos/index'
  // ========== 表单验证 ==========
  // 验证单位名称（判断必填）
  let validateTitle = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入单位名称！'))
    } else {
      callback()
    }
  }
  // 验证纳税人识别号（）
  let validateTaxCode = (rule, value, callback) => {
    let reg = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g
    if (!reg.test(value)) {
      callback(new Error('请输入正确的纳税人识别号'))
    } else {
      callback()
    }
  }
  // 验证注册地址（判断必填）
  let validateRegAddress = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入注册地址！'))
    } else {
      callback()
    }
  }
  // 验证注册电话（判断必填）
  let validateRegTel = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入注册电话'))
    } else {
      callback()
    }
  }
  // 验证开户银行（判断必填）
  let validateBankName = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入开户银行'))
    } else {
      callback()
    }
  }
  // 验证银行账号（判断必填）
  let validateBankAccount = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入银行账号！'))
    } else {
      callback()
    }
  }

  export default {
    props: {
      invoiceModalVisible: {
        type: Boolean,
        default: false,
      },
      //  发票类型，1普票、2专票
      type: {
        type: Number,
        default: 1,
      },
      // 发票信息，编辑传
      invoiceInfo: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        invoiceModalTitle: '',
        loading: false,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        form: {
          title: '',
          taxCode: '',
          regAddress: '',
          regTel: '',
          bankName: '',
          bankAccount: '',
        },
        // 表单验证
        rules: {
          title: [{ validator: validateTitle, trigger: 'blur' }],
          taxCode: [{ validator: validateTaxCode, trigger: 'blur' }],
        },
      }
    },
    watch: {},
    mounted() {
      if (this.invoiceInfo.id) {
        this.invoiceModalTitle = '编辑我的发票'
        this.form.title = this.invoiceInfo.title
        this.form.taxCode = this.invoiceInfo.taxCode
        this.form.regAddress = this.invoiceInfo.regAddress
        this.form.regTel = this.invoiceInfo.regTel
        this.form.bankName = this.invoiceInfo.bank
        this.form.bankAccount = this.invoiceInfo.account
      } else {
        this.invoiceModalTitle = '新增我的发票'
      }
      if (this.type === 2) {
        this.invoiceModalTitle = '编辑我的专票'
        this.rules.regAddress = [
          { validator: validateRegAddress, trigger: 'blur' },
        ]
        this.rules.regTel = [{ validator: validateRegTel, trigger: 'blur' }]
        this.rules.bankName = [{ validator: validateBankName, trigger: 'blur' }]
        this.rules.bankAccount = [
          { validator: validateBankAccount, trigger: 'blur' },
        ]
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let data = { ...this.form }
            data.type = this.type
            if (this.invoiceInfo.id) {
              data.id = this.invoiceInfo.id
            }
            editCommonInvoice(data).then(res => {
              this.$emit('commitInvoice')
            })
          } else {
            return false
          }
        })
      },
      // 关闭发票弹窗
      closeInvoiceModal() {
        this.$emit('closeInvoiceModal')
      },
    },
  }
</script>

<style lang="less" scoped>
  .edit-invoice-wrp {
    // margin-top: 16px;
    .item {
      margin-top: 22px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      .label {
        width: 70px;
        text-align: left;
        color: #666666;
      }
      .content {
        margin-left: 20px;
        flex: 1;
      }
    }
  }
</style>
<style lang="less">
  .edit-invoice-wrp {
    .ant-form {
      .ant-form-item {
        .ant-form-item-label {
          label {
            color: #666666;
          }
        }
      }
    }
  }
</style>
