<template>
  <div
    v-if="renderItem"
    class="card-researcher-wrp"
    :class="renderItem.isExpired || renderItem.isDelete ? 'delete' : ''"
    @click="onClick"
  >
    <div class="user-info-wrp">
      <div class="avatar-wrp">
        <MuAvatar
          :username="renderItem.name"
          :show-mask="renderItem.isConceal == 1"
          :is-authenticated="0"
          :is-official="0"
          :gender="renderItem.sex"
          :src.sync="renderItem.headerImageUrl"
        ></MuAvatar>
      </div>
      <div class="user-info">
        <div class="top">
          <div class="user-name show-line_1" v-html="renderItem.richName"></div>
        </div>
        <div class="bottom">
          <div v-if="renderItem.city || renderItem.school" class="city-school">
            <div
              v-if="renderItem.city"
              class="city show-line_1"
              v-html="renderItem.city"
            ></div>
            <div
              v-if="renderItem.school"
              class="school show-line_1"
              v-html="renderItem.school + ' ' + renderItem.depart"
            ></div>
          </div>
          <div class="user-tag">
            <div v-if="renderItem.atp" class="user-position">
              {{ renderItem.atp }}
            </div>
            <div v-if="renderItem.title" class="user-title">
              {{ renderItem.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="hasAbstract" class="abstract">
      <div class="rich-text" v-html="abstractContent"></div>
    </div>
    <template v-if="renderItem.researchDirections">
      <div
        v-if="
          renderItem.researchDirections.length > 0 ||
          renderItem.researchDirections.length === 1
        "
        class="research-direction-wrp"
      >
        <div class="show-line_1">
          <div
            v-if="renderItem.researchDirections[0]"
            class="research-direction"
          >
            {{ renderItem.researchDirections[0] }}
          </div>
          <div
            v-if="renderItem.researchDirections[1]"
            class="research-direction research-direction-2"
          >
            {{ renderItem.researchDirections[1] }}
          </div>
        </div>
      </div>
    </template>
    <div v-if="cardType === 'attention'" class="slot-follow-wrp">
      <slot name="follow"></slot>
    </div>
    <!-- 关注过期图标：权益卡过期 -->
    <div
      v-if="!renderItem.isDelete && renderItem.isExpired"
      class="overdue-wrp"
    >
      <image
        class="overdue-img"
        src="https://img.mumuxili.com/yqmm/mobile/wx/images/icon/yiguoqi.svg"
      ></image>
    </div>
    <!-- 关注删除图标：从后台删除数据 -->
    <div v-if="renderItem.isDelete" class="delete-wrp">
      <image
        class="delete-img"
        src="https://img.mumuxili.com/yqmm/mobile/wx/images/icon/yishanchu.svg"
      ></image>
    </div>
  </div>
</template>

<script>
  import ResearcherDetail from './ResearcherDetail.vue'
  export default {
    name: 'ResearcherCard',
    props: {
      item: {
        type: Object,
        default: () => null,
      },
      cardType: {
        type: String,
        default: 'common', // 两种类型  common | attention （带关注按钮）
      },
    },
    data() {
      return {
        hasAbstract: false,
        abstractContent: '', // 摘要内容
        renderItem: null,
      }
    },
    watch: {
      item: {
        handler(newVal, oldVal) {
          if (newVal) {
            let renderItem = this.$lodash.cloneDeep(newVal)
            renderItem.richName = this.highLight(renderItem.name)
            renderItem.name = renderItem.name
              .replaceAll('<em>', '')
              .replaceAll('</em>', '') //用于头像组件
            renderItem.city = this.highLight(renderItem.city)
            renderItem.school = this.highLight(renderItem.school)
            renderItem.depart = renderItem.depart
              ? this.highLight(renderItem.depart)
              : ''
            if (
              renderItem.researchesTagSearch ||
              renderItem.educationBackground ||
              renderItem.project ||
              renderItem.work
            ) {
              this.hasAbstract = true
              if (
                renderItem.researchesTagSearch &&
                renderItem.researchesTagSearch.includes('<em>')
              ) {
                this.abstractContent =
                  '研究方向：...' +
                  this.highLight(renderItem.researchesTagSearch) +
                  '...'
              } else if (
                renderItem.educationBackground &&
                renderItem.educationBackground.includes('<em>')
              ) {
                renderItem.educationBackground = this.highLight(
                  renderItem.educationBackground
                )
                this.abstractContent =
                  '教育背景: ...' + renderItem.educationBackground + '...'
              } else if (
                renderItem.project &&
                renderItem.project.includes('<em>')
              ) {
                renderItem.project = this.highLight(renderItem.project)
                this.abstractContent =
                  '项目课题: ...' + renderItem.project + '...'
              } else if (renderItem.work && renderItem.work.includes('<em>')) {
                renderItem.work = this.highLight(renderItem.work)
                this.abstractContent = '工作经历: ...' + renderItem.work + '...'
              }
            }
            this.renderItem = renderItem
          }
        },
        deep: true,
        immediate: true,
      },
    },
    methods: {
      async onClick() {
        this.$globalDrawer.show({
          component: ResearcherDetail,
          options: {
            name: 'ResearcherDetail',
            title: '科研客户详情',
            props: {
              id: this.renderItem.customerId,
              tokenEncodeId: this.renderItem.targetId,
            },
            parent: this.$parent,
          },
        })
      },
      highLight(val = '') {
        return val
          .replaceAll('<em>', '<span style="color:#FF4433;">')
          .replaceAll('</em>', '</span>')
      },
    },
  }
</script>

<style lang="less" scoped>
  .card-researcher-wrp {
    position: relative;
    padding: 12px;
    width: 336px;
    min-height: 141px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #ebebeb;
    background: #ffffff;
    cursor: pointer;

    .user-info-wrp {
      position: relative;
      display: flex;
      justify-content: flex-start;

      .avatar-wrp {
        margin-right: 13px;
      }

      .user-info {
        width: calc(100% - 70px);

        .top {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .user-name {
            max-width: 210px;
            line-height: 22px;
            font-size: 14px;
            color: #444444;
            font-weight: 400;
          }
        }

        .bottom {
          .city-school {
            position: relative;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 20px;

            .city {
              position: relative;
              max-width: 100px;
              height: 20px;
              line-height: 20px;
              font-size: 13px;
              color: #666666;
            }

            .school {
              position: relative;
              flex: 1;
              height: 20px;
              line-height: 20px;
              font-size: 13px;
              color: #666666;
            }

            div:nth-child(2) {
              padding-left: 12px;

              &::after {
                content: '';
                position: absolute;
                top: 3px;
                left: 6px;
                width: 1px;
                height: 12px;
                background-color: #cecece;
              }
            }
          }

          .user-tag {
            display: flex;
            justify-content: flex-start;
            font-size: 13px;
            margin-top: 6px;

            .user-position,
            .user-title {
              height: 22px;
              line-height: 22px;
              padding: 0 8px;
              margin-right: 8px;
              border-radius: 2px;
              color: #1ba8f1;
              background: rgba(27, 168, 241, 0.15);
            }

            .user-title {
              color: #4c73e4;
              margin-right: 0;
              background: rgba(#4c73e4, 0.15);
            }
          }
        }
      }
    }
    .abstract {
      margin-top: 7px;
      font-size: 13px;
      .rich-text {
        width: 100%;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        word-break: break-all;
      }
    }

    .research-direction-wrp {
      position: relative;
      color: #999999;
      font-size: 13px;
      margin-top: 22px;
      &::before {
        position: absolute;
        top: -10px;
        left: -3px;
        content: '';
        width: 100%;
        border-bottom: 1px solid #ebebeb;
        transform: scaleY(0.5);
      }
      .research-direction {
        width: 100%;
        line-height: 22px;
        display: inline;
        word-break: break-all;
      }
      .research-direction-1 {
        &::before {
          content: '';
          padding: 0;
          position: absolute;
          top: 9px;
          left: 2px;
          width: 6px;
          height: 4px;
          background: #dbdbdb;
          border-radius: 50%;
        }
      }

      .research-direction-2 {
        position: relative;
        padding-left: 16px;

        &::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 7px;
          width: 1px;
          height: 12px;
          background-color: #cecece;
        }
      }
    }

    .slot-follow-wrp {
      position: absolute;
      z-index: 1;
      right: 12px;
      top: 12px;
    }
  }
  .delete-wrp {
    position: absolute;
    top: 55%;
    transform: translateY(-58%);
    right: 64px;

    .delete-img {
      width: 82px;
      height: 90px;
    }
  }
  .overdue-wrp {
    position: absolute;
    top: 50%;
    transform: translateY(-58%);
    right: 64px;

    .overdue-img {
      width: 80px;
      height: 38px;
    }
  }
  // 已删除样式
  .delete {
    .user-info-wrp {
      .avatar-wrp {
        opacity: 0.5;
      }

      .user-name {
        color: #999999 !important;
      }

      .city-school {
        .city,
        .school {
          color: #999999 !important;
        }
      }
    }

    .slot-follow-wrp {
      opacity: 0.5;
    }

    .user-tag {
      opacity: 0.5;
    }
  }
</style>
