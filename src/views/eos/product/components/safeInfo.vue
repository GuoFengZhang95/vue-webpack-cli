<template>
  <div class="safe-info-wrp">
    <div class="safe-info-list">
      <div
        v-for="(item, index) in safeList"
        :key="index"
        class="safe-info-item"
      >
        <template v-if="item.symbols && item.ghs">
          <div class="label">{{ item.name }}</div>
          <div class="value symbol">
            <div class="symbol-list">
              <div v-for="(d, i) in item.symbols" :key="i" class="symbol-item">
                <a-popover trigger="hover">
                  <template slot="content">
                    <div class="symbol-pop">
                      <div>
                        <span>{{ d.value }}</span>
                        <span>{{ d.ch }}</span>
                      </div>
                      <div>{{ d.en }}</div>
                    </div>
                  </template>
                  <span :class="d.value" class="symbol-bg"></span>
                  <span class="symbol-text">{{ d.value }}</span>
                </a-popover>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="item.symbols && !item.ghs">
          <div class="label">{{ item.name }}</div>
          <div class="value symbol">
            <div class="symbol-list">
              <div v-for="(d, i) in item.symbols" :key="i" class="symbol-item">
                <a-popover trigger="hover">
                  <template slot="content">
                    <div class="symbol-pop">
                      <div>
                        <span>{{ d.value }}</span>
                        <span>{{ d.ch }}</span>
                      </div>
                      <div>{{ d.en }}</div>
                    </div>
                  </template>
                  <span class="symbol-text">{{ d.value }}</span>
                </a-popover>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="label">{{ item.name }}</div>
          <div class="value">{{ item.value }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import safeInfo from '@/utils/safeInfo.js'
  export default {
    name: 'SafeInfo',
    props: {
      safeList: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        specialSigns: [
          '标识符号',
          '风险声明(欧洲)',
          '安全声明(欧洲)',
          '警示性声明',
          '危害码(欧洲)',
          '危害声明',
        ],
      }
    },
    watch: {
      safeList: {
        handler(newVal, oldVal) {
          newVal.forEach(item => {
            if (this.specialSigns.indexOf(item.name) !== -1) {
              item.ghs = item.name === '标识符号'
              item.symbols = []
              item.value.split(',').forEach(d => {
                // console.log('d', d)
                let obj = {}
                obj.value = d
                obj.ch = safeInfo[d] ? safeInfo[d].ch : ''
                obj.en = safeInfo[d] ? safeInfo[d].en : ''
                item.symbols.push(obj)
              })
            }
          })
          // console.log(newVal)
        },
        immediate: true,
      },
    },
    mounted() {
      // console.log(safeInfo)
    },
    methods: {},
  }
</script>

<style lang="less" scoped>
  .safe-info-wrp {
    width: 100%;

    .safe-info-list {
      color: #444;

      .safe-info-item {
        display: flex;
        align-content: flex-start;
        justify-content: flex-start;

        &:last-child {
          .label {
            border-bottom: 1px solid #ccc;
          }

          .value {
            border-bottom: 1px solid #ccc;
          }
        }

        .label {
          padding-right: 20px;
          width: 150px;
          min-height: 30px;
          background: #f3f6f9;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          border-top: 1px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .value {
          flex: 1;
          text-align: left;
          padding-left: 20px;
          line-height: 30px;
          border-top: 1px solid #ccc;
          border-right: 1px solid #ccc;
          transition: all 0.2s;

          &:hover {
            background: #f3f6f9;
          }

          &.symbol {
            .symbol-list {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              flex-wrap: wrap;

              .symbol-item {
                > span {
                  margin-top: 5px;
                  margin-right: 10px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  cursor: pointer;
                }

                &:hover {
                  .symbol-text {
                    background: #f66;
                    color: #fff;
                  }
                }

                .symbol-bg {
                  width: 50px;
                  height: 50px;
                  background-image: url('../../../../assets/images/icon/GHS-pic.svg');
                  background-size: 500px 50px;
                  background-repeat: no-repeat;
                  background-position: -25px 0;

                  &.GHS01 {
                    background-position: -25px 0;
                  }

                  &.GHS02 {
                    background-position: -75px 0;
                  }

                  &.GHS03 {
                    background-position: -125px 0;
                  }

                  &.GHS04 {
                    background-position: -175px 0;
                  }

                  &.GHS05 {
                    background-position: -225px 0;
                  }

                  &.GHS06 {
                    background-position: -275px 0;
                  }

                  &.GHS07 {
                    background-position: -325px 0;
                  }

                  &.GHS08 {
                    background-position: -375px 0;
                  }

                  &.GHS09 {
                    background-position: -425px 0;
                  }
                }

                .symbol-text {
                  margin-top: 10px;
                  margin-bottom: 5px;
                  padding: 0 5px;
                  height: 18px;
                  color: #f44;
                  font-size: 12px;
                  line-height: 16px;
                  border: 1px solid #f66;
                  text-align: center;
                  border-radius: 10px;
                  transition: all 0.2s;
                }
              }
            }
          }
        }
      }
    }
  }
</style>

<style lang="less">
  .symbol-pop {
    > div {
      margin-bottom: 10px;

      &:nth-child(1) {
        > span:nth-child(1) {
          display: inline-block;
          padding: 0 5px;
          height: 18px;
          line-height: 18px;
          color: white;
          background: #fb0;
          font-size: 12px;
          text-align: center;
          border-radius: 10px;
        }
      }
    }
  }
</style>
