<template>
  <div class="fund-card-wrapper">
    <div class="fund-card_inner">
      <div class="title" v-html="renderItem.title"></div>
      <div class="level-subject-wrapper">
        <div v-if="renderItem.level" class="level item show-line_1">
          {{ renderItem.level }}
        </div>
        <div v-if="renderItem.subject" class="subject item show-line_1">
          {{ renderItem.subject }}
        </div>
      </div>
      <div class="module-list">
        <div class="module-item money">
          <span class="label">科研经费：</span>
          <span class="value">{{ renderItem.money }}万元</span>
        </div>
        <div class="module-item people">
          <span class="label">负责人：</span>
          <span class="value" v-html="renderItem.people">万元</span>
        </div>
        <div class="module-item company">
          <span class="label">依托单位：</span>
          <span class="value" v-html="renderItem.company"></span>
        </div>
      </div>
      <div class="city-time-wrapper">
        <div class="city-list">
          <div
            v-for="(item, index) in renderItem.citys"
            :key="index"
            class="city-item"
          >
            {{ item }}
          </div>
        </div>
        <div class="time">
          <span>{{ renderItem.createTime }}</span>
          <span v-if="renderItem.createTime">~</span>
          <span>{{ renderItem.endTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FundCard',
    props: {
      info: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        renderItem: {},
      }
    },
    computed: {},
    watch: {
      info: {
        /**
         * 名称 负责人 依托单位 高亮显示
         * 学科标题和学科编号拼接
         */
        handler(val) {
          if (val) {
            this.renderItem = val
          }
        },
        immediate: true,
      },
    },
    mounted() {},
    methods: {},
  }
</script>

<style lang="less" scoped>
  .fund-card-wrapper {
    padding: 12px 16px;
    height: 218px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #ececec;
    box-sizing: border-box;
    cursor: pointer;

    .fund-card_inner {
      .title {
        height: 48px;
        font-size: 16px;
        color: #333333;
        line-height: 24px;
        .ellipsis();
      }

      .level-subject-wrapper {
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .item {
          margin-right: 10px;
          padding: 3px 6px;
          height: 24px;
          border-radius: 2px;
          box-sizing: border-box;
          font-size: 12px;
          line-height: 18px;
        }

        .level {
          max-width: 100px;
          background: rgba(27, 168, 241, 0.15);
          color: #1ba8f1;
        }

        .subject {
          max-width: 200px;
          background: rgba(255, 153, 25, 0.15);
          color: #ff9919;
        }
      }

      .module-list {
        margin-top: 8px;

        .module-item {
          height: 22px;
          line-height: 22px;
          font-size: 14px;
          color: #666666;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          .ellipsisLines(1);
        }
      }

      .city-time-wrapper {
        margin-top: 12px;
        padding-top: 10px;
        font-size: 12px;
        color: #999999;
        border-top: 1px solid rgba(233, 233, 233, 0.5);
        display: flex;
        align-items: center;
        justify-content: space-between;

        .city-list {
          display: flex;
          align-items: center;
          justify-content: flex-start;

          .city-item {
            position: relative;
            padding-right: 10px;
            height: 18px;
            line-height: 18px;

            &:not(:last-child) ::after {
              position: absolute;
              content: '';
              width: 1px;
              height: 12px;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }

        .time {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }
    }
  }
</style>
