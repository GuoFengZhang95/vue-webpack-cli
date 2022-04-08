<template>
  <div class="express-list">
    <template v-if="list.length">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="express-item"
        :class="{ fold: item.fold }"
      >
        <div class="express-title" @click="foldList(index)">
          <div class="index">
            <img src="@/assets/images/package.png" alt />
            <span>包裹{{ index + 1 }}</span>
          </div>
          <div class="icon-fold-wrp" :class="{ fold: item.fold }">
            <img src="@/assets/images/icon/arrow-down-666666.png" alt />
          </div>
        </div>
        <div class="express-content clearfix">
          <div class="left fl">
            <ul>
              <li>
                <span>送货方式：</span>
                <span>{{ item.expressName }}</span>
                <a-button type="link" @click="complaintOrder">投诉</a-button>
              </li>
              <li>
                <span>运单号：</span>
                <span>
                  {{ item.expressNum }}
                  <img
                    style="width: 12px; height: 12px; cursor: pointer"
                    src="@/assets/images/icon/copy.png"
                    @click="oneClicCopy(item.expressNum)"
                  />
                </span>
              </li>
              <li>
                <span>物流状态：</span>
                <MuDotStatus
                  v-if="item.deliveryStatus == 1"
                  text="在途中"
                  font-size="14px"
                  dot-status="status_underway"
                ></MuDotStatus>
                <MuDotStatus
                  v-if="item.deliveryStatus == 2"
                  text="正在派件"
                  font-size="14px"
                  dot-status="status_underway"
                ></MuDotStatus>
                <MuDotStatus
                  v-if="item.deliveryStatus == 3"
                  text="已签收"
                  font-size="14px"
                  dot-status="status_normal"
                ></MuDotStatus>
                <MuDotStatus
                  v-if="item.deliveryStatus == 4"
                  text="派送失败"
                  font-size="14px"
                  dot-status="status_abnormal"
                ></MuDotStatus>
              </li>
              <li>
                <span>产品数量：</span>
                <span>{{ item.productCount }}</span>
              </li>
            </ul>
          </div>
          <div class="right fl">
            <a-empty
              v-if="!item.logistics"
              :description="'暂无详细的物流信息~'"
            ></a-empty>
            <div v-else class="time-line-wrp">
              <ul v-for="(d, i) in item.logistics" :key="i" class="time-line">
                <li class="time-line-item">
                  <!-- 左侧内容 -->
                  <div class="time-line-item-content left">{{ d.time }}</div>
                  <!-- 节点 竖线 -->
                  <div class="dot-tail-wrp">
                    <div class="dot-tail-content">
                      <div class="time-line-item-dot"></div>
                      <div class="time-line-item-tail"></div>
                    </div>
                  </div>
                  <!-- 右侧内容 -->
                  <div class="time-line-item-content right">{{ d.status }}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div style="margin: 50px; text-align: center">暂未发货~</div>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'MuExpressList',
    props: {
      expressList: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        list: [],
      }
    },
    watch: {
      //监听包裹详情信息
      expressList: {
        handler(newVal, oldVal) {
          newVal.forEach(item => {
            if (item.logistics) {
              item.logistics = JSON.parse(item.logistics)
            }
          })
          this.list = JSON.parse(JSON.stringify(newVal))
        },
        immediate: true,
      },
    },
    methods: {
      // 在线申诉
      complaintOrder() {
        this.$info({
          title: '在线申诉通道暂未开通！',
          mask: false,
          content: <div>客服电话：400-677-0001</div>,
        })
      },
      // 折叠物流列表
      foldList(index) {
        this.$set(this.list[index], 'fold', !this.list[index].fold)
      },
      // 一键复制
      oneClicCopy(value) {
        let transfer = document.createElement('input')
        document.body.appendChild(transfer)
        transfer.value = value // 这里表示想要复制的内容
        transfer.focus()
        transfer.select()
        if (document.execCommand('copy')) {
          document.execCommand('copy')
        }
        transfer.blur()
        this.$message.success(`已复制物流编号（${value}）`)
        document.body.removeChild(transfer)
      },
    },
  }
</script>

<style lang="less" scoped>
  .express-list {
    width: 100%;
    background: #ffffff;

    .express-item {
      margin-bottom: 16px;
      border: 1px solid #d9d9d9;
      overflow: hidden;
      transition: height 0.3s;
      height: 248px;
      &.fold {
        height: 34px;
      }

      .express-title {
        cursor: pointer;
        margin-left: 14px;
        margin-top: 6px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .index {
          display: flex;
          align-items: center;
          img {
            margin-right: 4px;
            width: 16px;
            height: 16px;
          }
          span {
            height: 22px;
            font-size: 16px;
            font-weight: 400;
            text-align: left;
            color: #444444;
            line-height: 22px;
          }
        }
        .icon-fold-wrp {
          margin-right: 15px;
          width: 15px;
          height: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s;
          &.fold {
            transform: rotate(180deg);
          }
          img {
            width: 15px;
            height: 15px;
          }
        }
      }

      .express-content {
        margin-top: 10px;
        margin-left: 16px;
        display: flex;

        & > .left {
          ul {
            width: 260px;
            min-height: 160px;
            padding-right: 60px;
            border-right: 1px solid #d9d9d9;
            padding-bottom: 21px;
            li {
              margin-top: 12px;
              width: 220px;
              display: flex;
              align-items: center;
              > span:nth-of-type(1) {
                width: 70px;
              }
              .ant-btn.ant-btn-link {
                margin-left: 32px;
              }
            }
          }
        }

        & > .right {
          margin: 10px auto;
          height: 170px;
          overflow: auto;
          .time-line-wrp {
            .time-line-item {
              padding: 0 0 20px;
              display: flex;
              align-items: stretch;
              justify-content: flex-start;
              .time-line-item-content {
                font-size: 13px;
                font-weight: 400;
                text-align: left;
                color: #666666;
                word-break: break-all;
                &.left {
                  text-align: center;
                  min-width: 200px;
                }
                &.right {
                  padding-left: 25px;
                  min-width: 600px;
                }
              }
              .dot-tail-wrp {
                .dot-tail-content {
                  position: relative;
                  height: 100%;
                  width: 10px;
                  .time-line-item-dot {
                    position: absolute;
                    left: 0;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #00c7db;
                    top: 0;
                  }
                  .time-line-item-tail {
                    position: absolute;
                    top: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    height: calc(100% + 10px);
                    border-left: 1px solid #d9d9d9;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
