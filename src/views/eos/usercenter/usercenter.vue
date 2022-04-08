<template>
  <div id="page-saas-usercenter" class="content-page-wrp">
    <a-spin :spinning="spinning" class="spin"></a-spin>
    <div class="except-bottom-operations">
      <MuPageHeader
        :show-reload="false"
        title="个人中心"
        @parentReload="parentReload"
      ></MuPageHeader>
      <div class="detail-wrp">
        <MuPageHeader :show-reload="false" sub-title="基本信息"></MuPageHeader>
        <div v-if="userInfo" class="info-wrp">
          <div class="info-item">
            <mu-image
              v-if="userInfo.userAvatar"
              class="avatar"
              width="50"
              height="50"
              :src="userInfo.userAvatar"
            ></mu-image>
            <img
              v-else
              style="width: 50px; height: 50px"
              src="@/assets/images/pic/default-avatar.png"
            />
            <a-descriptions :column="1" style="flex: 1; margin-left: 22px">
              <a-descriptions-item label="用户名">
                {{ userInfo.userName }}
              </a-descriptions-item>
              <a-descriptions-item label="用户类型">分销商</a-descriptions-item>
            </a-descriptions>
          </div>
          <div class="info-item">
            <a-descriptions :column="1">
              <a-descriptions-item label="姓名">
                {{ userInfo.realName }}
              </a-descriptions-item>
              <a-descriptions-item label="状态">
                <span v-if="auditStatus == 2">审核通过</span>
              </a-descriptions-item>
            </a-descriptions>
          </div>
          <div class="info-item"></div>
        </div>
        <MuPageHeader :show-reload="false" sub-title="公司信息"></MuPageHeader>
        <div v-if="distributorInfo" class="info-wrp">
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
                  <mu-image
                    width="56"
                    height="79"
                    mode="contain"
                    :src="distributorInfo.material"
                  ></mu-image>
                  <!-- <img :src="distributorInfo.material" alt /> -->
                </div>
              </div>
              <div class="image-item-wrp">
                <span>授权委托书：</span>
                <div class="image-wrp center-flex">
                  <mu-image
                    width="56"
                    height="79"
                    mode="contain"
                    :src="distributorInfo.proxy"
                  ></mu-image>
                  <!-- <img :src="distributorInfo.proxy" alt /> -->
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
        <div v-if="vatInvoice" class="info-wrp">
          <div class="content">
            <a-descriptions :column="1">
              <a-descriptions-item label="单位名称">
                {{ vatInvoice.companyName }}
              </a-descriptions-item>
              <a-descriptions-item label="纳税人识别号">
                {{ vatInvoice.taxCode }}
              </a-descriptions-item>
              <a-descriptions-item label="注册地址">
                {{ vatInvoice.regAddress }}
              </a-descriptions-item>
              <a-descriptions-item label="注册电话">
                {{ vatInvoice.regTel }}
              </a-descriptions-item>
              <a-descriptions-item label="开户银行">
                {{ vatInvoice.bank }}
              </a-descriptions-item>
              <a-descriptions-item label="银行账号">
                {{ vatInvoice.account }}
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getDistributionAuthInfo } from '@/api/eos/index'
  import { mapGetters } from 'vuex'
  export default {
    name: 'EosUserCenter',
    data() {
      return {
        spinning: false,
        userInfo: null,
        distributorInfo: null,
        vatInvoice: null,
        auditStatus: 0,
      }
    },
    computed: {
      ...mapGetters(['eosUserInfo']),
    },
    mounted() {
      this.auditStatus = this.eosUserInfo.auditStatus
      this.userInfo = this.eosUserInfo.info
      this.distributorInfo = this.eosUserInfo.distributorInfo
      this.vatInvoice = this.eosUserInfo.vatInvoice
    },
    methods: {
      parentReload() {
        this.spinning = true
        getDistributionAuthInfo()
          .then(res => {
            this.$store.dispatch('user/setEosUserInfo', res.data)
            this.auditStatus = res.data.auditStatus
            this.userInfo = res.data.info
            this.distributorInfo = res.data.distributorInfo
            this.vatInvoice = res.data.vatInvoice
            this.spinning = false
          })
          .catch(err => {
            this.spinning = false
          })
      },
    },
  }
</script>

<style lang="less" scoped>
  #page-saas-usercenter {
    position: relative;
    .detail-wrp {
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
          align-items: center;

          .avatar {
            border-radius: 50%;
            overflow: hidden;
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
              }
            }
          }
        }
      }
    }
  }
</style>

<style lang="less">
  #page-saas-usercenter {
    .ant-descriptions-item-content {
      font-size: 13px;
      font-weight: 400;
      text-align: left;
      color: #444444;
      line-height: 22px;
    }
  }
</style>
