<template>
  <div id="page-sass-advertisement-index">
    <header-bar></header-bar>
    <div class="main">
      <div class="top-banner"></div>
      <div class="main-content">
        <div class="system-title">木木西里分销系统</div>
        <div class="system-subtitle run">
          木木西里
          <span>仪器买卖</span>
          旗下产品
        </div>
        <div class="qrcode-wrp">
          <div class="qrcode-content">
            <img src="@/assets/images/pic/minicode_1004.jpg" class="qrcode" />
          </div>
        </div>
        <div class="process-title">
          <span></span>
          <div>分销商认证流程</div>
          <span></span>
        </div>
        <div class="process-list">
          <div
            v-for="(item, index) in processList"
            :key="index"
            class="process-item"
          >
            <div class="content">
              <div class="img-wrp">
                <img :src="item.img" alt />
              </div>
              <div class="content-title">{{ item.title }}</div>
              <div
                class="content-description"
                @click="handleDescClick"
                v-html="item.description"
              ></div>
            </div>
            <div v-if="index !== processList.length - 1" class="arrow"></div>
          </div>
        </div>
        <div
          v-if="
            baseUserInfo &&
            baseUserInfo.userType == 3 &&
            baseUserInfo.authenticated == 1 &&
            baseUserInfo.isAdmin == 1
          "
          class="be-distributors"
          @click="$router.push({ path: '/eosapply' })"
        >
          <img class="icon-tag" src="@/assets/images/icon/icon-user-dis.svg" />
          <span>立即成为分销商</span>
        </div>
        <div class="line"></div>
        <div class="tips-wrp">
          <div>
            <img src="@/assets/images/info-tips.png" alt="pic" />
            1.完成第一步后，可将微信对应的手机号、初始密码短信发送给木木西里助理，助理将会帮您完成后续注册步骤。
          </div>
          <div>
            2.咨询或加急审核请联系对接助理或拨打
            <span style="color: #00c7db">400-677-0001</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import HeaderBar from '@/layout/components/HeaderBar'
  import { mapGetters } from 'vuex'
  export default {
    name: 'EosAdver',
    components: {
      HeaderBar,
    },
    data() {
      return {
        processList: [
          {
            img: require('@/assets/images/pic/process_1.svg'),
            title: '微信扫码登录',
            description:
              '扫码进入仪器买卖小程序并选择微信登录；登录成功后会收到账号初始密码的短信',
          },
          {
            img: require('@/assets/images/pic/process_2.svg'),
            title: '完善个人信息',
            description:
              '完成小程序登录后，选择角色为“经销商”，并根据提示完善公司信息',
          },
          {
            img: require('@/assets/images/pic/process_3.svg'),
            title: '认证经销商',
            description:
              '信息完善后，点击经销商认证的弹窗，填写资料进行认证；授权文件为您已签约盖章的申请入驻协议',
          },
          {
            img: require('@/assets/images/pic/process_4.svg'),
            title: '登录分销系统',
            description:
              '<span style="color: #00c7db; user-select: none;">点击登录</span>，使用仪器买卖小程序账号密码或绑定微信的手机号和验证码登录进入分销资格申请页面',
          },
          {
            img: require('@/assets/images/pic/process_5.svg'),
            title: '认证分销资格',
            description: '根据提示填写专票的开票信息并点击认证按钮，等待审核',
          },
          {
            img: require('@/assets/images/pic/process_6.svg'),
            title: '完成注册',
            description:
              '审核通过后即可使用账号登录木木西里仪器买卖小程序和分销平台',
          },
        ],
      }
    },
    computed: {
      ...mapGetters(['baseUserInfo']),
    },
    methods: {
      handleDescClick(e) {},
    },
  }
</script>

<style lang="less" scoped>
  #page-sass-advertisement-index {
    .main {
      position: relative;
      min-width: 1280px;
      max-width: 1920px;
      margin: 0 auto;
      height: calc(100vh - 60px);
      overflow: hidden;
      overflow-y: auto;

      .top-banner {
        position: absolute;
        width: 100%;
        height: 306px;
        background: url('../../../assets/images/a-d-banner.png') center;
      }
      .main-content {
        position: relative;
        width: 1280px;
        padding: 0 10px;
        margin: 0 auto;
        padding-top: 80px;

        .system-title {
          height: 70px;
          line-height: 70px;
          font-size: 55px;
          font-family: Microsoft YaHei, Microsoft YaHei-Light;
          font-weight: 300;
          text-align: left;
          color: #666666;
          line-height: 30px;
          letter-spacing: 4px;
        }
        .system-subtitle {
          display: inline-block;
          margin-left: 215px;
          padding: 0 10px;
          height: 17px;
          border-left: 3px solid #00c7db;
          border-right: 3px solid #00c7db;
          font-size: 16px;
          line-height: 17px;
          text-align: left;
          color: #999999;
          letter-spacing: 2px;
          > span {
            color: #00c7db;
          }
        }
        .qrcode-wrp {
          position: relative;
          top: 30px;
          left: -15px;
          width: 203px;
          height: 203px;
          background: url('../../../assets/images/pic/qrcode-bg.png') center;
          display: flex;
          justify-content: center;
          align-items: center;
          .qrcode-content {
            width: 131px;
            height: 131px;
            border-radius: 50%;
            overflow: hidden;
            .qrcode {
              display: block;
              border-radius: 50%;
              width: 131px;
              height: 131px;
            }
          }
        }
        .process-title {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 28px;
          font-size: 22px;
          line-height: 28px;
          color: #666666;
          letter-spacing: 4px;
          > span {
            transform: rotate(45deg);
            width: 1px;
            height: 25px;
            background: #d9d9d9;
          }
          > div {
            margin: 0 20px;
          }
        }
        .process-list {
          margin-top: 42px;
          display: flex;
          align-items: stretch;
          justify-content: space-around;
          .process-item {
            &:nth-of-type(4),
            &:nth-of-type(5),
            &:nth-of-type(6) {
              .content {
                .img-wrp {
                  img {
                    margin-top: 8px;
                  }
                }
              }
            }
            display: flex;
            align-items: flex-start;
            justify-items: flex-start;
            .content {
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
              .img-wrp {
                width: 148px;
                height: 139px;
                & > img {
                  display: block;
                  margin: 0 auto;
                }
              }
              .content-title {
                margin-top: 30px;
                margin-bottom: 21px;
                height: 22px;
                font-size: 16px;
                font-weight: 700;
                text-align: center;
                color: #666666;
                line-height: 24px;
              }
              .content-description {
                max-width: 152px;
                font-size: 12px;
                font-weight: 400;
                text-align: left;
                color: #999999;
                line-height: 20px;
              }
            }
            .arrow {
              margin-top: 174px;
              margin-left: 20px;
              border-left: 12px solid #d9d9d9;
              border-top: 7px solid transparent;
              border-right: 12px solid transparent;
              border-bottom: 7px solid transparent;
            }
          }
        }
        .be-distributors {
          display: flex;
          align-items: center;
          justify-content: space-around;
          font-size: 16px;
          color: #f3f6f9;
          width: 220px;
          height: 48px;
          box-sizing: border-box;
          padding: 0 39px;
          line-height: 48px;
          opacity: 1;
          background: #00c7db;
          border-radius: 4px;
          text-align: center;
          margin: 50px auto 23px;
          cursor: pointer;
          user-select: none;
          transition: all 0.3s;
          &:hover {
            background-color: #25dee8;
          }
          > img {
            width: 15px;
            height: 17px;
          }
        }
        .line {
          margin-top: 49px;
          width: 100%;
          border-top: 1px dashed #d9d9d9;
        }
        .tips-wrp {
          vertical-align: middle;
          padding: 24px 0 94px;
          text-align: center;
          border: 1px solid rgba(0, 0, 0, 0);
          line-height: 20px;
          font-size: 12px;
          text-align: center;
          color: #999999;
          img {
            margin-right: 10px;
          }
        }
      }
    }
  }
</style>

<style lang="less"></style>
