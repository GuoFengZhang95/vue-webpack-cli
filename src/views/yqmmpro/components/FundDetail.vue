<template>
  <div class="fund-detail-wrapper">
    <!-- 已被删除 -->
    <template v-if="isDelete">
      <LoadStep
        :loading-satus="2"
        :result-status="1"
        style="margin-top: 55px"
      ></LoadStep>
    </template>
    <!-- 未被删除 -->
    <template v-else>
      <MuPageHeader title="基金课题详情" :show-reload="false">
        <div class="detail-title-buttons-wrp">
          <a-button type="primary" @click="copyShareLink">分享链接</a-button>
          <template v-if="isUnlock">
            <a-button :type="collectButtonStatus.type" @click="collect">
              {{ collectButtonStatus.text }}
            </a-button>
          </template>
        </div>
      </MuPageHeader>
      <div class="fund-title-wrapper">
        <div class="title-content">
          <div class="title">{{ detail.title }}</div>
          <div class="tag">纵向基金</div>
        </div>
        <div class="bottom">
          <div class="left">
            <div class="item">{{ detail.pizhunhao }}</div>
            <div class="item">{{ detail.money }}</div>
          </div>
          <div class="right">
            {{ detail.collectNum }}
            <span>收藏</span>
          </div>
        </div>
      </div>

      <!-- 已解锁 -->
      <template v-if="isUnlock">
        <div class="base-title">基本信息</div>
        <div class="base-info-wrapper">
          <div class="row-col">
            <a-row :gutter="[0, 12]">
              <a-col :span="8">
                <span class="label">级别：</span>
                <span class="value">{{ detail.level }}</span>
              </a-col>
              <a-col :span="8">
                <span class="label">项目来源：</span>
                <span class="value">{{ detail.origin }}</span>
              </a-col>
              <a-col :span="8">
                <span class="label">类别：</span>
                <span class="value">{{ detail.cata }}</span>
              </a-col>
            </a-row>
            <a-row :gutter="[0, 12]">
              <a-col :span="8">
                <span class="label">来源城市：</span>
                <span class="value">{{ detail.city }}</span>
              </a-col>
              <a-col :span="8" class="flex">
                <span class="label">依托单位：</span>
                <span class="value">
                  <div class="value-list">
                    <div
                      v-for="(item, index) in detail.company"
                      :key="index"
                      class="value-item"
                      style="color: #999999; cursor: auto"
                    >
                      {{ item.companyName }}
                    </div>
                  </div>
                </span>
              </a-col>
              <a-col :span="8" class="flex">
                <span class="label">负责人：</span>
                <span class="value">
                  <div class="value-list">
                    <div
                      v-for="(item, index) in detail.people"
                      :key="index"
                      class="value-item"
                      @click="openResearcherDetail(item)"
                    >
                      {{ item.name }}
                    </div>
                  </div>
                </span>
              </a-col>
            </a-row>
            <a-row :gutter="[0, 12]">
              <a-col :span="8">
                <span class="label">依托单位所属城市：</span>
                <span class="value">{{ detail.belongCity }}</span>
              </a-col>
              <a-col :span="8">
                <span class="label">立项时间：</span>
                <span class="value">{{ detail.createTime }}</span>
              </a-col>
              <a-col :span="8">
                <span class="label">结项时间：</span>
                <span class="value">{{ detail.endTime }}</span>
              </a-col>
            </a-row>
            <a-row :gutter="[0, 12]">
              <a-col :span="8">
                <span class="label">批准年份：</span>
                <span class="value">{{ detail.year }}</span>
              </a-col>
              <a-col :span="8">
                <span class="label">学科：</span>
                <span class="value">{{ detail.subject }}</span>
              </a-col>
              <a-col :span="8">
                <span class="label">更新时间：</span>
                <span class="value">{{ detail.updateTime }}</span>
              </a-col>
            </a-row>
          </div>
          <div class="info-list">
            <div class="list-item">
              <span class="label">关键词：</span>
              <span class="value">{{ detail.keyword }}</span>
            </div>
            <div class="list-item">
              <span class="label">英文关键词：</span>
              <span class="value">{{ detail.enKeyword }}</span>
            </div>
            <div class="list-item">
              <span class="label">中文摘要：</span>
              <span class="value">{{ detail.abstract }}</span>
            </div>
            <div class="list-item">
              <span class="label">英文摘要：</span>
              <span class="value">{{ detail.enAbstract }}</span>
            </div>
            <div class="list-item">
              <span class="label">结题摘要：</span>
              <span class="value">{{ detail.projectAbstract }}</span>
            </div>
            <div class="list-item">
              <span class="label">备注</span>
              <span class="value">{{ detail.tips }}</span>
            </div>
          </div>
        </div>
      </template>
      <!-- 未解锁 -->
      <template v-else>
        <Blur
          module="fund"
          src="https://img.mumuxili.com/yqmm/pc/saas/images/blur/business.png"
          :qrcode="'data:image/png;base64,' + qrCode"
        ></Blur>
      </template>
    </template>
  </div>
</template>

<script>
  import { FormateNum } from '@/utils'
  import { collect } from '@/api/yqmmPro'
  const LoadStep = () => import('./LoadStep/index.vue')
  const Blur = () => import('./Blur.vue')
  export default {
    name: 'FundDetail',
    components: {
      LoadStep,
      Blur,
    },
    filters: {},
    props: {
      id: {
        type: [String, Number],
        default: '',
      },
    },
    data() {
      return {
        /**未解锁小程序码 */
        qrCode: '',
        /**是否删除 */
        isDelete: false,
        detail: {
          title: '非均质材料中的非线性力学行为”国际理论与应用力学联盟暑期',
          tag: 1,
          pizhunhao: '12312313213',
          money: '123万',
          collectNum: 0,
          level: '级别',
          origin: '项目来源',
          cata: '类别',
          city: '来源城市',
          company: [
            {
              companyName: '北京大学',
              id: 1,
            },
            {
              companyName: '南京大学南京大学南京大学南京大学南京大学',
              id: 2,
            },
            {
              companyName: '南京大学',
              id: 3,
            },
            {
              companyName: '南京大学',
              id: 4,
            },
            {
              companyName: '南京大学',
              id: 5,
            },
          ],
          people: [
            {
              name: 'mike',
              id: 1,
            },
            {
              name: 'jack ',
              id: 2,
            },
          ],
          belongCity: '依托单位所属城市',
          createTime: '2021-12-12',
          endTime: '2021-12-12',
          year: '2021',
          subject: '2021A02物理化学',
          updateTime: '2022-2-22',
          keyword: '关键词',
          enKeyword: '英文关键词',
          abstract: '中文摘要',
          enAbstract: '英文摘要',
          projectAbstract: '结题摘要',
          tips: '备注',
        },
      }
    },
    computed: {
      /**是否已解锁 */
      isUnlock() {
        return true
      },
      collectButtonStatus() {
        let status = { text: '收藏', type: 'default' }
        // todo
        if (this.true) {
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
        handler: async function (val) {
          if (!val) return
          this.$store.dispatch('app/setDrawerLayoutLoading', { flag: true })
          await this.getDetail(val)
          this.$store.dispatch('app/setDrawerLayoutLoading', { flag: false })
        },
        immediate: true,
      },
    },
    methods: {
      async getDetail(id) {
        // todo 接口获取基金详情
        let res = {
          code: '0',
          data: {
            detail: {},
          },
        }
        if (res.code === '0') {
          this.detail = res.data.detail
        } else {
          this.isDelete = true
        }
      },
      /**复制链接 */
      copyShareLink() {
        const text = `${window.location.origin}/yqmmpro/detail/fund/${
          this.id || '测试id'
        }#todo 这里要填写标题`
        if (window.navigator.clipboard) {
          navigator.clipboard.writeText(text)
        } else if (window.clipboardData) {
          window.clipboardData.setData('Text', text)
        }
        this.$message.success('已复制页面链接')
      },
      /**收藏 */
      async collect() {
        let action = this.detailInfo.operateDetail.isCollect === 1 ? 2 : 1
        let params = {
          targetId: this.id,
          module: 1,
          action,
        }
        const res = await collect(params)
        if (res.success) {
          this.$set(
            this.detailInfo.operateDetail,
            'isCollect',
            action === 1 ? 1 : 0
          )
          let deltaCount = action === 1 ? 1 : -1
          let count = FormateNum(this.counts.collect + deltaCount)
          this.$set(this.detailInfo.titleDetail, 'collect', count)
          this.counts.collect += deltaCount
        }
      },
      /**打开客源详情 */
      openResearcherDetail(item) {
        console.log(item)
      },
    },
  }
</script>

<style lang="less" scoped>
  .fund-detail-wrapper {
    .fund-title-wrapper {
      position: relative;
      padding: 24px 24px 17px 24px;

      &::after {
        position: absolute;
        content: '';
        width: calc(100% - 48px);
        left: 24px;
        bottom: 0px;
        height: 0px;
        border-top: 1px dashed #ebebeb;
      }

      .title-content {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;

        .title {
          max-width: calc(100% - 76px);
          min-height: 30px;
          line-height: 30px;
          font-size: 20px;
          font-weight: bold;
          color: #444444;
        }

        .tag {
          margin-left: 12px;
          margin-top: 5px;
          width: 64px;
          height: 20px;
          border: 1px solid #00c7db;
          line-height: 18px;
          font-size: 12px;
          color: #00c7db;
          text-align: center;
          box-sizing: border-box;
          border-radius: 100px 100px 100px 100px;
        }
      }

      .bottom {
        margin-top: 9px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        color: #999999;

        .left {
          display: flex;
          align-items: center;
          justify-content: flex-start;

          .item {
            padding-right: 16px;
            position: relative;
            margin-right: 16px;

            &:not(:last-child)::after {
              position: absolute;
              content: '';
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 0px;
              height: 12px;
              width: 1px;
              background-color: #e9e9e9;
            }
          }
        }
      }
    }

    .base-title {
      margin-top: 20px;
      padding: 0 24px;
      height: 24px;
      font-size: 16px;
      font-weight: bold;
      color: #444444;
      line-height: 24px;
    }

    .base-info-wrapper {
      margin-top: 8px;
      padding: 0 24px;

      .row-col {
        // .ant-row {
        //   .ant-col {
        //     display: flex;
        //     align-items: flex-start;
        //   }
        // }

        .flex {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;

          .value {
            flex: 1;
          }
        }
      }

      .label {
        height: 20px;
        line-height: 20px;
        font-size: 13px;
        color: #999999;
      }

      .value {
        min-height: 20px;
        line-height: 20px;
        font-size: 13px;
        color: #444444;
      }

      .value-list {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: flex-start;

        .value-item {
          padding-right: 15px;
          position: relative;
          height: 20px;
          line-height: 20px;
          font-size: 13px;
          color: #00c7db;
          cursor: pointer;

          &:not(:last-child):after {
            content: '，';
            position: absolute;
            top: 0px;
            right: 5px;
            width: 10px;
            height: 10px;
            text-align: left;
            color: #444444;
          }
        }
      }

      .info-list {
        .list-item {
          margin-top: 12px;
        }
      }
    }
  }

  .detail-title-buttons-wrp {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    /deep/ .ant-btn {
      margin-left: 12px;

      &.ant-btn-default {
        &:focus {
          border-color: #d9d9d9;
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
  }
</style>
