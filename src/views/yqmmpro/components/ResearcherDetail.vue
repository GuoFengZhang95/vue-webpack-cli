<template>
  <div class="detail-box">
    <MuPageHeader :title="'科研客户详情'" :show-reload="false">
      <div class="detail-title-buttons-wrp">
        <a-button @click="copyShareLink">分享链接</a-button>
        <template v-if="!isUnlock">
          <a-button :type="collectButtonStatus.type" @click="collect">
            {{ collectButtonStatus.text }}
          </a-button>
        </template>
      </div>
    </MuPageHeader>
    <div class="detail-basicInfo">
      <div class="detail-basicInfo-head">
        <div class="user-info">
          <div v-if="detailInfo.headerImageUrl" class="avatar-uploader">
            <div class="img-item">
              <img :src="detailInfo.headerImageUrl" alt="头像" />
            </div>
          </div>
          <div class="detail-person-info">
            <div class="person-item">
              <span v-if="detailInfo.name">{{ detailInfo.name }}</span>
              <span v-if="detailInfo.tutorLevel">
                {{ detailInfo.tutorLevel }}
              </span>
            </div>
            <div class="person-item">
              <span v-if="detailInfo.school">{{ detailInfo.school }}</span>
              <span v-if="detailInfo.depart">{{ detailInfo.depart }}</span>
              <span v-if="detailInfo.city">{{ detailInfo.city }}</span>
              <span
                v-if="
                  detailInfo.sex !== null &&
                  detailInfo.sex !== '' &&
                  detailInfo.sex >= 0
                "
              >
                {{ sexObj[detailInfo.sex] }}
              </span>
            </div>
          </div>
        </div>
        <div class="right">
          <!-- <span class="follow">1关注</span> -->
          <span class="collect">{{ detailInfo.collectionCount }}收藏</span>
        </div>
      </div>
      <div v-if="!isUnlock" class="base-info">
        <a-row class="base-info-row" :gutter="[0, 12]">
          <a-col :span="8" class="base-info-col">
            <span class="label">个人主页：</span>
            <a
              :href="
                detailInfo.webSite && detailInfo.webSite.indexOf('http') > -1
                  ? detailInfo.webSite
                  : 'https://' + detailInfo.webSite
              "
              target="_blank"
            >
              {{ detailInfo.webSite || '-' }}
            </a>
          </a-col>
          <a-col :span="8" class="base-info-col">
            <span class="label">职称级别：</span>
            <span class="value">{{ detailInfo.titles || '-' }}</span>
          </a-col>
          <a-col :span="8" class="base-info-col">
            <span class="label">行政职务：</span>
            <span class="value">{{ detailInfo.atps || '-' }}</span>
          </a-col>
        </a-row>
        <a-row class="base-info-row" :gutter="[0, 12]">
          <a-col :span="8" class="base-info-col">
            <span class="label">座机：</span>
            <span class="value">{{ detailInfo.telephones || '-' }}</span>
          </a-col>
          <a-col :span="8" class="base-info-col">
            <span class="label">邮箱：</span>
            <span class="value">
              {{ (detailInfo.emails && detailInfo.emails.join('，')) || '-' }}
            </span>
          </a-col>
          <a-col :span="8" class="base-info-col">
            <span class="label">地址：</span>
            <span class="value">{{ detailInfo.address || '-' }}</span>
          </a-col>
        </a-row>
        <a-row class="base-info-row" :gutter="[0, 12]">
          <a-col :span="8" class="base-info-col">
            <span class="label">手机：</span>
            <span class="value">
              {{ (detailInfo.mobiles && detailInfo.mobiles.join('，')) || '-' }}
            </span>
          </a-col>
        </a-row>
        <a-row
          v-if="
            detailInfo.researchDirections &&
            detailInfo.researchDirections.length
          "
          class="base-info-row"
          :gutter="[0, 12]"
        >
          <a-col :span="24" class="base-info-col" style="display: flex">
            <span class="label">研究方向：</span>
            <OverflowText
              class="value"
              :text="formatArr(detailInfo.researchDirections).join('，') || '-'"
              :line="2"
            ></OverflowText>
          </a-col>
        </a-row>
      </div>
    </div>
    <div v-if="!isUnlock" class="detail-tab-box">
      <a-tabs :active-key="tabKey" @change="e => (tabKey = e)">
        <a-tab-pane key="1" tab="基金课题" force-render>
          <div>基金课题表格</div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="项目课题" force-render>
          <div class="product-text">
            <a-collapse
              :active-key="[1]"
              :bordered="false"
              expand-icon-position="right"
              @change="() => {}"
            >
              <a-collapse-panel key="1" class="school-info" header="项目课题">
                <MuTable
                  ref="operaTable"
                  :scroll="{ y: 400 }"
                  :pagination-flag="false"
                  :has-index="true"
                  :setting-act-flag="false"
                  :setting-type-flag="false"
                  :columns="columns"
                  :data-source="detailInfo.customerProjects"
                ></MuTable>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </a-tab-pane>
        <a-tab-pane v-if="personalWorkVisible" key="3" tab="个人经历">
          <div class="product-text">
            <a-collapse
              :active-key="[1, 2, 3]"
              :bordered="false"
              expand-icon-position="right"
              @change="() => {}"
            >
              <a-collapse-panel key="2" class="school-info" header="工作经历">
                <div
                  v-for="(item, index) in detailInfo.customerWorks"
                  :key="index"
                  class="detail-list-item"
                >
                  <div class="panel-title">
                    <!-- || '-' -->
                    <span v-if="formatTime(item.startTime)">
                      {{ timeFilter(item) }}
                    </span>
                    <span v-else>-</span>
                    <span>{{ item.unitName || '-' }}</span>
                    <span>{{ item.departName || '-' }}</span>
                    <span>{{ workType[item.type] }}</span>
                    <span>{{ item.postName || '-' }}</span>
                    <!-- <span>{{
                            (workType[item.type] && workType[item.type] + ' | ') + (item.postName || '-')
                          }}</span> -->
                  </div>
                  <!-- <div class="panel-content">
                          <OverflowText
                            :key="index"
                            :text="text"
                            :keys="'workContent' + index"
                            :line="2"
                          ></OverflowText>
                        </div> -->
                </div>
              </a-collapse-panel>
              <a-collapse-panel key="3" class="school-info" header="教育背景">
                <div
                  v-for="(item, index) in detailInfo.customerEducations"
                  :key="index"
                  class="detail-list-item"
                >
                  <div class="panel-title">
                    <span v-if="formatTime(item.startTime)">
                      {{ timeFilter(item) }}
                    </span>
                    <span v-else>-</span>
                    <span>{{ item.schoolName || '-' }}</span>
                    <span>{{ item.collegeName || '-' }}</span>
                    <span>{{ item.majorName || '-' }}</span>
                    <span>{{ eduType[item.type] }}</span>
                    <span>{{ item.education || '-' }}</span>
                  </div>
                  <div class="panel-content">
                    <!-- {{ item.remark || '-' }} -->
                    <!-- <template>
                            <p>
                              <OverflowText
                                :text="item.remark"
                                :keys="'educationContent' + index"
                                :line="3"
                              ></OverflowText>
                            </p>
                          </template> -->
                  </div>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <Blur
      v-if="isUnlock"
      module="researcher"
      src="https://img.mumuxili.com/yqmm/pc/saas/images/blur/purchase.png"
      :qrcode="'data:image/png;base64,' + qrCode"
    ></Blur>
  </div>
</template>

<script>
  import { getYqmmQrCode, getCustomerDetail, collect } from '@/api/yqmmPro'
  import { FormateNum } from '@/utils'
  const OverflowText = () => import('@/components/local/OverflowText')
  const Blur = () => import('@/views/yqmmpro/components/Blur')
  export default {
    name: 'ResearcherDetail',
    components: {
      OverflowText,
      Blur,
    },
    props: {
      id: {
        type: [String, Number],
        default: 0,
      },
      externalProp: {
        type: Object,
        default: () => {
          return {
            tokenEncodeId: '',
            id: '',
          }
        },
      },
    },
    data() {
      return {
        isUnlock: false,
        qrCode: '',
        textNumber: 155, //文字显示弹窗阈值
        sourceData: [],
        columns: [
          {
            dataIndex: 'projectName',
            title: '项目名称',
          },
          {
            dataIndex: 'projectNo',
            title: '项目编号',
          },
          {
            dataIndex: 'projectSource',
            title: '项目来源',
          },
          {
            dataIndex: 'startTime',
            title: '开始日期',
          },
          {
            dataIndex: 'endTime',
            title: '完成日期 ',
          },
          {
            dataIndex: 'projectFunds',
            title: '项目经费',
          },
        ],
        detailInfo: {},
        page: 1,
        pageSize: 20,
        total: 10,
        tabKey: '1',
        customerInfo: {
          id: 454554,
        },
        //教育类别
        eduType: {
          1: '',
          2: '非全日制',
        },
        //工作类型
        workType: { 1: '', 2: '兼职' },
        edutionType: {
          1: '大专以下',
          2: '大专',
          3: '本科',
          4: '硕士',
          5: '博士',
          6: '博士后',
          7: '其他',
        },
        sexObj: {
          0: '女',
          1: '男',
          2: '保密',
        },
      }
    },
    computed: {
      personalWorkVisible() {
        return (
          (this.detailInfo.customerWorks &&
            this.detailInfo.customerWorks.length) ||
          (this.detailInfo.customerEducations &&
            this.detailInfo.customerEducations.length)
        )
      },
      collectButtonStatus() {
        let status = { text: '收藏', type: 'default' }
        if (this.detailInfo.isCollection) {
          status.text = '已收藏'
          status.type = 'primary'
        } else {
          status.text = '收藏'
          status.type = 'default'
        }
        return status
      },
    },
    watch: {
      id: {
        async handler(newVal) {
          if (newVal) {
            this.$store.dispatch('app/setDrawerLayoutLoading', { flag: true })
            await this.loaddetail(newVal)
            this.$store.dispatch('app/setDrawerLayoutLoading', { flag: false })
          }
        },
        immediate: true,
      },
    },
    methods: {
      formatTime(time) {
        let arr = (time && time.split('.')) || []
        let timeStr = (arr[0] && [arr[0], arr[1]]) || []
        return timeStr.join('.')
      },
      timeFilter(item) {
        return `${this.formatTime(item.startTime) || '-'}${
          item.present
            ? '-' + item.present
            : this.formatTime(item.endTime)
            ? ' - ' + this.formatTime(item.endTime)
            : '至今'
        }`
      },
      async loaddetail(customerId) {
        this.tabKey = '1'
        const res = await getCustomerDetail({ customerId })
        if (!res.data) {
          this.$message.error('该内容已被删除或下架')
          return
        } else {
          this.detailInfo = res.data
          this.detailInfo.address =
            (res.data.provinceName ?? '') +
            (res.data.cityName ?? '') +
            (res.data.districtName ?? '') +
            (res.data.address ?? '')

          // 处理项目课题，去除没有项目名称的课题
          this.detailInfo.customerProjects = this.detailInfo.customerProjects
            // .filter(i => i.projectName)
            .map(e => {
              e.endTime = e.startTime ? (e.endTime ? e.endTime : '至今') : '-'
              return e
            })

          // this.detailInfo.customerWorks = this.detailInfo.customerWorks.filter(i => i.unitName) // 去除没有单位名称的工作经历
          // this.detailInfo.customerEducations = this.detailInfo.customerEducations.filter(i => i.schoolName) // 去除没有学校名称的教育背景

          this.detailInfo.atps = this.detailInfo.atps
            ? this.detailInfo.atps.replaceAll('、', '，')
            : ''
          this.detailInfo.titles = this.detailInfo.titles
            ? this.detailInfo.titles.replaceAll('、', '，')
            : ''

          if (this.detailInfo.unlock === 1 || this.detailInfo.unlock === -1) {
            this.isUnlock = false
            if (this.detailInfo.unlock === 1) {
              this.$message.info('科研客户额度-1')
            }
          } else {
            this.isUnlock = true
            //无法解锁 获取小程序二维码
            await this.handleQRCode()
          }
        }
      },
      // 获取小程序码回调
      async handleQRCode() {
        let params = {
          page: 'pages/content/customer/detail/index/index',
          scene: `id=${this.id}&platform=saas`,
        }
        let { code, data } = await getYqmmQrCode(params)
        if (code === '0') {
          this.qrCode = data
        }
      },
      formatArr(arr) {
        return arr.map(e => {
          return e.content
        })
      },
      copyShareLink() {
        const text = `${window.location.origin}/yqmmpro/detail/researcher/${this.id}#${this.detailInfo.name}`
        if (window.navigator.clipboard) {
          navigator.clipboard.writeText(text)
        } else if (window.clipboardData) {
          window.clipboardData.setData('Text', text)
        }
        this.$message.success('已复制页面链接')
      },
      /**收藏 */
      async collect() {
        // // todo 科研客户
        let action = this.detailInfo.isCollection === 1 ? 2 : 1
        let params = {
          targetId: this.externalProp.tokenEncodeId,
          module: 12,
          action,
        }
        const res = await collect(params)
        if (res.success) {
          this.detailInfo.isCollection = action === 1 ? 1 : 0
          let deltaCount = action === 1 ? 1 : -1
          let count = FormateNum(this.detailInfo.collectionCount + deltaCount)
          this.detailInfo.collectionCount = count
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .detail-box {
    // padding: 16px 34px 0 24px;
    word-break: break-all;
    .detail-basicInfo {
      // height: 266px;
      width: 100%;
      background: #f9f9f9;
      padding: 16px 34px 16px 24px;

      .detail-basicInfo-head {
        height: 48px;
        width: 100%;
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        .user-info {
          width: calc(100% - 155px);
          display: flex;
          // background: #ddd;
          .img-box {
            height: 48px;
            width: 48px;
            border-radius: 50%;
            position: relative;
            img {
              height: 100%;
              width: 100%;
              border-radius: 50%;
            }
            &:hover {
              border: hidden;
              &::after {
                position: absolute;
                content: '';
                opacity: 0.5;
                background: #000000;
                // background-image: url('');
                height: 48px;
                width: 48px;
                border-radius: 50%;
                top: 0;
                left: 0;
                z-index: 9999;
              }
            }
          }
          .detail-person-info {
            margin-left: 16px;
            .person-item {
              margin-top: 4px;
              span {
                display: inline-block;
                margin-right: 24px;
                font-size: 13px;
                color: #666666;
                position: relative;
                &::after {
                  display: block;
                  content: '|';
                  color: #d9d9d9;
                  position: absolute;
                  right: -16px;
                  top: 0;
                }
                &:last-child {
                  &::after {
                    content: '';
                  }
                }
              }
            }
          }
        }

        .right {
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;

          .follow,
          .collect {
            height: 22px;
            line-height: 22px;
            font-size: 14px;
            font-weight: 400;
            color: #999999;
          }

          .collect {
            margin-left: 32px;
          }
        }
      }
      .base-info {
        // height: 48px;
        width: 100%;
        margin-top: 25px;
        // background: #ddd;
        .base-info-row {
          .base-info-col {
            font-size: 13px;
            padding-right: 16px;
            .label {
              color: #999999;
              white-space: nowrap;
            }
            .value {
              color: #444444;
            }
          }
        }
      }
    }
    .detail-tab-box {
      padding: 12px 34px 0 24px;
      .product-text {
        // padding-top: 15px;
        padding-bottom: 20px;
        .school-info {
          width: 100%;
          .detail-list-item {
            margin-top: 12px;
            &:first-child {
              margin-top: 0;
            }
          }
          // margin-top: 25px;
          .base-info-row {
            .base-info-col {
              font-size: 13px;
              .label {
                color: #999999;
              }
              .value {
                color: #444444;
                word-break: break-all;
              }
            }
          }
          .panel-title {
            span {
              margin-right: 16px;
              font-weight: 700;
              color: #666666;
              font-size: 13px;
            }
          }
          .panel-content {
            font-size: 13px;
            color: #666666;
            font-weight: 400;
            margin-top: 6px;
          }
          /deep/.mumuxili-table {
            .action {
              padding: 0 !important;
            }
          }
        }
      }
      .product-text-form {
        word-break: break-all;
        white-space: pre-wrap;
      }
      .product-table {
        padding: 0 0 10px 0;
      }
      /deep/.ant-tabs {
        .ant-tabs-bar {
          margin: 0 0 4px 0 !important;
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  .ep-operation {
    .hideButton {
      margin-right: 10px;
    }
  }
  .detail-basicInfo-head {
    display: flex;
    /deep/.avatar-uploader {
      .ant-upload {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        padding: 0;
      }
      .img-item {
        position: relative;
        img {
          height: 48px;
          width: 48px;
          border-radius: 50%;
        }
      }
    }
    /deep/.ant-upload-select-picture-card {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      position: relative;
      border: hidden;
      &:hover {
        border: hidden;
        &::after {
          position: absolute;
          pointer-events: none;
          content: '';
          opacity: 0.5;
          background: #000000;
          // background-image: url('~@images/icon/Shape.svg');
          background-position: center;
          background-repeat: no-repeat;
          height: 48px;
          width: 48px;
          border-radius: 50%;
          top: 0;
          left: 0;
        }
      }
    }

    /deep/.ant-upload-select-picture-card {
      .ant-upload-text {
        margin-top: 8px;
        color: #666;
      }
    }
    /deep/.ant-upload-picture-card-wrapper {
      width: 48px !important;
    }
  }

  .school-info {
    /deep/.ant-collapse-arrow {
      left: 40px !important;
      margin-top: 1px;
    }
  }
  .school-info-long {
    /deep/.ant-collapse-arrow {
      left: 105px !important;
      margin-top: 1px;
    }
    .popoverCard-row {
      margin-bottom: 0;
    }
    .research-text {
      margin-bottom: 12px;
    }
    .research-content {
      margin-bottom: 0px !important;
      color: red;
    }
  }
  /deep/.ant-collapse {
    background-color: #fff;
    .ant-collapse-header {
      font-size: 16px;
      font-weight: 400;
      color: #666666 !important;
      padding: 12px 0 10px !important;
      width: 150px;
      &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 14px;
        background-color: #00c7db;
        vertical-align: -2px;
        margin-right: 11px;
      }
    }
    .ant-collapse-item {
      border: none;
      .ant-collapse-content > .ant-collapse-content-box {
        padding: 0;
      }
    }
  }
  /deep/ .code-modal {
    .scan-code {
      text-align: center;
      > img {
        width: 300px;
        height: 300px;
        margin: 0 auto;
      }
    }
  }
</style>
