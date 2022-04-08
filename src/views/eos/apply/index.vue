<template>
  <div id="page-saas-apply" class="content-page-wrp">
    <header-bar></header-bar>
    <div class="main">
      <MuPageHeader :show-reload="false" title="分销申请"></MuPageHeader>
      <div class="detail-wrp">
        <MuPageHeader :show-reload="false" sub-title="基本信息"></MuPageHeader>
        <div class="info-wrp">
          <div class="info-item">
            <img :src="userInfo.userAvatar" alt="pic" class="avatar" />
            <a-descriptions :column="1" style="flex: 1">
              <a-descriptions-item label="用户名">
                {{ userInfo.userName }}
              </a-descriptions-item>
              <a-descriptions-item label="用户类型">经销商</a-descriptions-item>
            </a-descriptions>
          </div>
          <div class="info-item status">
            <a-descriptions :column="1">
              <a-descriptions-item label="姓名">
                {{ userInfo.realName }}
              </a-descriptions-item>
            </a-descriptions>
            <div class="status-wrp">
              <div class="dl">状态：</div>
              <div class="dt">
                <div v-if="auditStatus == 0" class="status">未提交认证</div>
                <div v-if="auditStatus == 1" class="status">认证中</div>
                <div v-if="auditStatus == 2" class="status">已认证</div>
                <template v-if="auditStatus == 3">
                  <div class="status" style="width: 40px">驳回</div>
                  <div class="reason ftc_refuse">
                    （原因：{{ eosUserInfo.auditReason }}）
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="info-item"></div>
        </div>
        <MuPageHeader :show-reload="false" sub-title="公司信息"></MuPageHeader>
        <div class="info-wrp indent">
          <div class="info-item">
            <a-descriptions :column="1">
              <a-descriptions-item label="企业全称">
                {{ distributorInfo.companyName }}
              </a-descriptions-item>
              <a-descriptions-item label="统一社会信用代码">
                {{ distributorInfo.taxCode }}
              </a-descriptions-item>
              <a-descriptions-item label="企业地址">
                {{ distributorInfo.regAddress }}
              </a-descriptions-item>
              <a-descriptions-item label="企业固话">
                {{ distributorInfo.regTel }}
              </a-descriptions-item>
            </a-descriptions>
          </div>
          <div class="info-item">
            <a-descriptions :column="1">
              <a-descriptions-item label="企业性质">
                <span v-if="distributorInfo.companyType == 1">
                  政府机关/事业单位
                </span>
                <span v-if="distributorInfo.companyType == 2">国营</span>
                <span v-if="distributorInfo.companyType == 3">私营</span>
                <span v-if="distributorInfo.companyType == 4">中外合资</span>
                <span v-if="distributorInfo.companyType == 5">外资</span>
                <span v-if="distributorInfo.companyType == 6">其他</span>
              </a-descriptions-item>
              <a-descriptions-item label="企业规模">
                <span v-if="distributorInfo.companyScope == 1">1-49人</span>
                <span v-if="distributorInfo.companyScope == 2">50-99人</span>
                <span v-if="distributorInfo.companyScope == 3">100-499人</span>
                <span v-if="distributorInfo.companyScope == 4">500-999人</span>
                <span v-if="distributorInfo.companyScope == 5">1000以上</span>
              </a-descriptions-item>
              <a-descriptions-item label="认证时间">
                {{ distributorInfo.authTime }}
              </a-descriptions-item>
            </a-descriptions>
          </div>
          <div class="info-item">
            <div class="auth-image-list">
              <div class="image-item-wrp">
                <span>营业执照：</span>
                <div class="image-wrp center-flex">
                  <img :src="distributorInfo.material" alt />
                </div>
              </div>
              <div class="image-item-wrp">
                <span>授权委托书：</span>
                <div class="image-wrp center-flex">
                  <img :src="distributorInfo.proxy" alt />
                </div>
              </div>
            </div>
          </div>
        </div>
        <MuPageHeader
          :show-reload="false"
          sub-title="增税专票信息"
        ></MuPageHeader>
        <!-- -------------------------增税专票信息 -------------------------------->
        <div class="info-wrp indent">
          <div class="content">
            <a-descriptions :column="1">
              <a-descriptions-item label="单位名称">
                {{ distributorInfo.companyName }}
              </a-descriptions-item>
              <a-descriptions-item label="纳税人识别号">
                {{ distributorInfo.taxCode }}
              </a-descriptions-item>
            </a-descriptions>
            <a-form-model ref="ruleForm" :model="form" :rules="rules">
              <a-form-model-item label="注册地址" prop="regAddress">
                <a-input
                  v-model="form.regAddress"
                  :disabled="auditStatus === 1 || auditStatus === 2"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item label="注册电话" prop="regTel">
                <a-input
                  v-model="form.regTel"
                  :disabled="auditStatus === 1 || auditStatus === 2"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item label="开户银行" prop="bank">
                <a-input
                  v-model="form.bank"
                  :disabled="auditStatus === 1 || auditStatus === 2"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item label="银行账号" prop="account">
                <a-input
                  v-model="form.account"
                  :disabled="auditStatus === 1 || auditStatus === 2"
                ></a-input>
              </a-form-model-item>
            </a-form-model>
            <a-button
              type="primary"
              :disabled="auditStatus == 1 || auditStatus === 2"
              :loading="loading"
              @click="submitForm('ruleForm')"
            >
              <span v-if="auditStatus == 0">申请成为分销商</span>
              <span v-if="auditStatus == 2">已成为分销商</span>
              <span v-if="auditStatus == 1">正在审核分销商资格</span>
              <span v-if="auditStatus == 3">申请成为分销商</span>
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import HeaderBar from '@/layout/components/HeaderBar'
  import { applyDistributor, getDistributionAuthInfo } from '@/api/eos/index'
  import { mapGetters } from 'vuex'
  // ========== 表单验证 ==========
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
      callback(new Error('请输入注册电话！'))
    } else {
      callback()
    }
  }
  // 验证开户银行（判断必填）
  let validateBankName = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入开户银行！'))
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
    name: 'EosApply',
    components: {
      HeaderBar,
    },
    data() {
      return {
        loading: false,
        eosUserInfo: {},
        userInfo: {},
        distributorInfo: {},
        vatInvoice: {},
        auditStatus: 0, //分销商认证状态： 0 未提交过认证 1 审核中 2 通过审核
        form: {
          regAddress: '',
          regTel: '',
          bank: '',
          account: '',
        },
        // 表单验证
        rules: {
          regAddress: [{ validator: validateRegAddress, trigger: 'blur' }],
          regTel: [{ validator: validateRegTel, trigger: 'blur' }],
          bank: [{ validator: validateBankName, trigger: 'blur' }],
          account: [{ validator: validateBankAccount, trigger: 'blur' }],
        },
      }
    },
    computed: {
      ...mapGetters(['baseUserInfo']),
    },
    watch: {
      baseUserInfo: {
        handler(val) {
          if (val) {
            console.log(val.userType)
            // 是认证的分销商 进入易采销首页
            if (val.userType === 5) {
              this.$router.push({
                path: '/eos',
              })
              return
            }
            // 是认证的经销商，获取认证的相关信息
            if (val.userType == 3 && val.authenticated == 1) {
              getDistributionAuthInfo().then(res => {
                this.eosUserInfo = res.data
                this.auditStatus = this.eosUserInfo.auditStatus
                this.userInfo = this.eosUserInfo.info
                this.distributorInfo = this.eosUserInfo.distributorInfo
                if (this.eosUserInfo.vatInvoice) {
                  Object.assign(this.form, this.eosUserInfo.vatInvoice)
                }
              })
            }
          }
        },
      },
    },
    methods: {
      submitForm(formName) {
        if (this.auditStatus == 1) {
          this.$message.error('您已提交过申请！')
        } else if (this.auditStatus == 2) {
          this.$message.error('您已获得分销商资格！')
        } else {
          this.$refs[formName].validate(valid => {
            if (valid) {
              applyDistributor(this.form).then(res => {
                if (res.success) {
                  this.$message.success('已提交分销商认证申请！')
                  this.auditStatus = 1
                }
              })
            } else {
              return false
            }
          })
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  #page-saas-apply {
    .main {
      height: calc(100vh - 60px);
      padding: 16px 16px 0 16px;
      background: #e3e5e6;
      box-sizing: border-box;
      overflow: hidden;
      overflow-y: auto;
    }
    .detail-wrp {
      background: white;

      .info-wrp {
        margin-left: 24px;
        margin-right: 24px;
        padding-bottom: 30px;
        border-bottom: 1px solid #ebebeb;
        display: flex;
        align-items: stretch;
        .info-item {
          flex: 1;
          display: flex;
          align-items: flex-start;
          .avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 20px;
          }
          .auth-image-list {
            display: flex;
            justify-content: space-between;
            .image-item-wrp {
              margin-right: 33px;
              span {
                width: 65px;
                height: 18px;
                font-size: 13px;
                font-weight: 400;
                text-align: left;
                color: #666666;
                line-height: 22px;
              }
              .image-wrp {
                width: 79px;
                height: 82px;
                border: 1px solid #d9d9d9;
                border-radius: 4px;
                img {
                  width: 57px;
                  height: 100%;
                  object-fit: contain;
                }
              }
            }
          }
        }
        .info-item.status {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-start;
          .status-wrp {
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
            .dl {
              width: 40px;
              height: 18px;
              line-height: 22px;
              font-size: 13px;
              font-weight: 400;
              color: #999999;
            }
            .dt {
              // .status {
              //   width: 90px;
              // }
              flex: 1;
              width: 90px;
              font-size: 13px;
              font-weight: 400;
              text-align: left;
              color: #444444;
              line-height: 22px;
              display: flex;
              align-items: flex-start;
            }
          }
        }
      }
      .info-wrp.indent {
        padding-left: 12px;
      }
    }

    .refuse {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
    }
  }
</style>

<style lang="less">
  #page-saas-apply {
    .main {
      background: white;
    }
    .ant-descriptions-item-content {
      font-size: 13px;
      font-weight: 400;
      text-align: left;
      color: #444444;
      line-height: 22px;
    }
    .ant-col-2 {
      width: 6%;
    }
    .detail-wrp {
      .ant-btn {
        display: block;
        margin: 48px auto;
        width: 240px;
        height: 40px;
        opacity: 1;
        border-radius: 4px;
        span {
          color: white;
          font-size: 16px;
        }
        &[disabled] {
          span {
            color: rgba(0, 0, 0, 0.25);
            font-size: 16px;
          }
        }
      }
    }

    .ant-form-item {
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      .ant-form-item-control-wrapper {
        width: 435px;
      }
    }
    .page-header-wrp {
      top: -16px;
    }
  }
</style>
