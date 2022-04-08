<template>
  <div class="product-detail-wrp">
    <MuPageHeader :show-refresh="false" :show-back="false" title="产品详情">
      <div class="btn-operation btn-shopcart" @click="goShopcart">
        <a-badge :count="shopcartCount" show-zero :offset="[10, 0]">
          <a-icon type="shopping-cart" color="white"></a-icon>
          <span>查看购物车</span>
        </a-badge>
      </div>
    </MuPageHeader>
    <div class="main-wrp">
      <div class="main-content">
        <img-swiper :cover-img="coverImg"></img-swiper>
        <div class="product-introduction">
          <div class="product-title">{{ productInfo.productName }}</div>
          <div class="product-describe">{{ productInfo.description }}</div>
          <ul v-if="reagentProdperties.length" class="cas-wrp clearfix">
            <li
              v-for="item in reagentProdperties"
              :key="item.name"
              class="fl show-line_1"
            >
              <template v-if="item.name === 'PubChem编号'">
                <span class="label">{{ item.name }}：</span>
                <a-button type="link" @click="goPubChem(item.value)">
                  {{ item.value }}
                </a-button>
              </template>
              <template v-else>
                <span class="label">{{ item.name }}：</span>
                <span class="value">{{ item.value }}</span>
              </template>
            </li>
          </ul>
          <div class="product-price">
            <div class="price">
              <div class="price-left">分销价</div>
              <div class="price-right">
                <!-- <template v-if="!currentSkuInfo">
                  <div class="current-price">CNY{{ productInfo.minPrice }}-{{ productInfo.maxPrice }}</div>
                  <div class="previous-price">CNY{{ productInfo.minSalePrice }}-{{ productInfo.maxSalePrice }}</div>
                </template> -->
                <template v-if="currentSkuInfo">
                  <div class="current-price">
                    <span>CNY</span>
                    <span>{{ currentSkuInfo.distributionPrice }}</span>
                  </div>
                  <div class="previous-price">
                    CNY{{ currentSkuInfo.salePrice }}
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="list-module">
            <div class="module-left">品牌:</div>
            <div class="module-right">
              {{ brandInfo.brandName }}·{{ brandInfo.country }}
            </div>
          </div>
          <div class="list-module">
            <div class="module-left">产品编码:</div>
            <div class="module-right">{{ productInfo.itemCode }}</div>
          </div>
          <div class="list-module">
            <div class="module-left">产品分类:</div>
            <div class="module-right">{{ cataNames.join('>') }}</div>
          </div>
          <div class="brand-image">
            <mu-image
              width="96"
              height="30"
              :src="brandInfo.logo"
              mode="contain"
              alt="品牌"
            ></mu-image>
          </div>
          <div
            v-for="(item, index) in combs"
            :key="index"
            class="list-module sku"
          >
            <div class="module-left">{{ item.cbtypeshowname }}:</div>
            <div class="module-right">
              <div
                v-for="(d, i) in item.items"
                :key="i"
                class="model-item"
                :class="{ selected: d.selected }"
                @click="
                  selectSpecificationValue(index, i, item.cbtypeid, d.vcombid)
                "
              >
                {{ d.vname }}
              </div>
            </div>
          </div>
          <div class="list-module number">
            <div class="module-left">数量:</div>
            <div class="module-right">
              <MuInputNumber
                ref="inputNumber"
                size="detail"
                :default-value="defaultValue"
                :min="0"
                :max="currentMax"
                :disabled="currentSkuInfo && currentSkuInfo.mumuStock === 0"
                @numberChange="e => (count = e)"
              ></MuInputNumber>
              <div v-if="currentSkuInfo" class="stock-number">
                库存{{ currentSkuInfo.mumuStock }}
              </div>
              <div v-if="!currentSkuInfo" class="stock-number">
                库存{{ productStock }}
              </div>
              <div class="stock-advice">
                <span>库存及货期仅供参考，下单前请</span>
                <a-button type="link" @click="afterSale">咨询客服</a-button>
              </div>
            </div>
          </div>
          <div class="option-button">
            <a-button
              class="buy-button"
              :disabled="
                (currentSkuInfo && currentSkuInfo.mumuStock == 0) || count == 0
              "
              type="primary"
              @click="buyNow"
            >
              立即购买
            </a-button>
            <a-button
              class="shop-car-button"
              :disabled="
                (currentSkuInfo && currentSkuInfo.mumuStock == 0) || count == 0
              "
              :loading="loadingAdd"
              @click="addCart"
            >
              加入购物车
            </a-button>
          </div>
        </div>
      </div>
      <!-- tab -->
      <div class="tab-list rich-text-wrp">
        <div class="tab-left">
          <a-tabs
            :active-key="activeKey"
            :animated="false"
            @tabClick="e => (activeKey = e)"
          >
            <div
              slot="tabBarExtraContent"
              class="export-pdf"
              @click="exportPdf"
            >
              <img src="@/assets/images/pdf.svg" alt="" />
              <span>导出PDF</span>
            </div>
            <a-tab-pane v-if="productInfo.content" key="content" tab="产品介绍">
              <div v-html="productInfo.content"></div>
            </a-tab-pane>
            <a-tab-pane
              v-if="reagentPACP.length"
              key="reagentPACP"
              tab="物化性质"
            >
              <div>
                <safe-info :safe-list="reagentPACP"></safe-info>
              </div>
            </a-tab-pane>
            <a-tab-pane
              v-if="reagentSecurity.length"
              key="reagentSecurity"
              tab="安全信息"
            >
              <div>
                <safe-info :safe-list="reagentSecurity"></safe-info>
              </div>
            </a-tab-pane>
            <a-tab-pane
              v-if="productInfo.specification"
              key="specification"
              tab="技术参数"
            >
              <div v-html="productInfo.specification"></div>
            </a-tab-pane>
            <a-tab-pane
              v-if="productInfo.application"
              key="application"
              tab="产品应用"
            >
              <div v-html="productInfo.application"></div>
            </a-tab-pane>
            <a-tab-pane
              v-if="productInfo.dimension"
              key="dimension"
              tab="尺寸规格"
            >
              <div v-html="productInfo.dimension"></div>
            </a-tab-pane>
            <a-tab-pane
              v-if="productInfo.docs && productInfo.docs.length"
              key="download"
              tab="资料下载"
            >
              <div class="download-list">
                <div
                  v-for="(item, index) in productInfo.docs"
                  :key="index"
                  class="download-item"
                  @click="downLoad(item.path)"
                >
                  <img
                    v-if="item.ext === 'pdf'"
                    class="icon"
                    src="@/assets/images/icon/pdf-colorful.png"
                    alt=""
                  />
                  <img
                    v-if="item.ext === 'zip' || item.ext === 'rar'"
                    class="icon"
                    src="@/assets/images/icon/zip-colorful.png"
                    alt=""
                  />
                  <div class="content">
                    <div class="title show-line_1">{{ item.name }}</div>
                    <div class="info">
                      <!-- <span>3MB</span>
                      <a-divider type="vertical" /> -->
                      <span>{{ item.time }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getProductDetail,
    getCombinesSkuInfo,
    addShopcart,
    getShopcartList,
  } from '@/api/eos/index'
  import ImgSwiper from './ImgSwiper'
  import SafeInfo from './safeInfo'
  export default {
    name: 'ProductDetail',
    components: {
      ImgSwiper,
      SafeInfo,
    },
    props: {
      externalProp: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        coverImg: [],
        productInfo: {},
        brandInfo: {}, //品牌信息
        cataNames: [], //分类名称
        combs: [],
        cbType: '', //组合串类型多个用英文逗号隔开，如1024:10730,1025:10769
        count: 1, //产品数量
        currentSkuInfo: null,
        hasReagentProperty: false, //是否是试剂类
        reagentProdperties: [], //试剂cas号等信息
        reagentPACP: [], //物化性质
        reagentSecurity: [], //安全信息
        productStock: 0,
        activeKey: 'content',
        loadingAdd: false,
        loadingBuy: false,
      }
    },
    computed: {
      defaultValue() {
        if (this.currentSkuInfo && this.currentSkuInfo.mumuStock) {
          return 1
        } else {
          return 0
        }
      },
      shopcartCount() {
        return this.$store.state.shopcart.shopcartCount
      },
      canBuy() {
        //是否在每个规格中都选择了规格值
        let tempArr = this.combs.filter(item => {
          return item.items.some(d => {
            return d.selected
          })
        })
        return tempArr.length === this.combs.length
      },
      currentMax() {
        return this.currentSkuInfo
          ? this.currentSkuInfo.mumuStock
          : this.productStock
      },
    },
    watch: {
      'externalProp.id': {
        handler(newVal) {
          if (newVal) {
            this.init()
          }
        },
        immediate: true,
      },
    },
    methods: {
      init() {
        this.$store.dispatch('app/setDrawerLayoutLoading', { flag: true })
        getProductDetail({ productId: this.externalProp.id })
          .then(res => {
            this.productInfo = res.data.productInfo
            this.brandInfo = res.data.brandInfo
            this.cataNames = res.data.cataNames
            this.coverImg = res.data.productInfo.coverImage
            this.hasReagentProperty = res.data.hasReagentProperty
            res.data.combs.forEach(item => {
              item.items.forEach(d => {
                d.selected = false
              })
            })
            // 让每个规格中属于最小sku的规格值选中（只处理满足条件的第一个规格值）
            for (let i = 0; i < res.data.combs.length; i++) {
              for (let j = 0; j < res.data.combs[i].items.length; j++) {
                if (res.data.combs[i].items[j].isMin === 1) {
                  res.data.combs[i].items[j].selected = true
                  break
                }
              }
            }
            this.combs = res.data.combs
            this.getCurrentSkuInfo()
            if (this.hasReagentProperty) {
              //试剂类型
              this.reagentProdperties = res.data.reagentProdperties
              this.reagentPACP = res.data.reagentPACP
              this.reagentSecurity = res.data.reagentSecurity
            }
            this.productStock = res.data.productStock
          })
          .finally(() => {
            this.$store.dispatch('app/setDrawerLayoutLoading', { flag: false })
          })
      },
      // 选择规格值
      async selectSpecificationValue(index, i, cbtypeid, vcombid) {
        this.combs[index].items.forEach((j, k) => {
          if (k === i) {
            j.selected = !j.selected
          } else {
            j.selected = false
          }
        })
        if (this.canBuy) {
          this.getCurrentSkuInfo()
          this.$refs['inputNumber'].setValue(1) //切换规格组合时，重置输入框的值为1
        } else {
          // this.currentSkuInfo = null
        }
      },
      // 立即购买
      async buyNow() {
        if (this.canBuy) {
          try {
            this.loadingBuy = true
            this.$store.dispatch('shopcart/getShopcartSelectedRowKeys', [
              this.currentSkuInfo.skuId,
            ])
            this.$router.push({
              name: 'EosSettlement',
              params: {
                from: 'item_detail',
                productId: this.externalProp.id,
                count: this.count,
                skuId: this.currentSkuInfo.skuId,
              },
            })
            this.loadingBuy = false
          } catch (err) {
            this.loadingBuy = false
          }
        } else {
          this.$message.warn('请先确认下单组合')
        }
      },
      // 加入购物车
      async addCart() {
        if (this.canBuy) {
          try {
            this.loadingAdd = true
            let cartData = {
              productName: this.productInfo.productName,
              productId: this.externalProp.id,
              from: 'PCClient',
              skuList: JSON.stringify([
                {
                  skuId: this.currentSkuInfo.skuId,
                  currentPrice: this.currentSkuInfo.distributionPrice,
                  count: this.count,
                },
              ]),
            }
            await addShopcart(cartData)
            let cartRes = await getShopcartList()
            this.$message.success('已加入购物车！')
            // 清空规格选择状态
            // this.combs.forEach(item => {
            //   item.items.forEach(d => {
            //     d.selected = false
            //   })
            // })
            this.$refs['inputNumber'].setValue(1) // 重置输入框的值
            this.$store.dispatch(
              'shopcart/getShopcartCount',
              cartRes.data.length
            )
            this.loadingAdd = false
          } catch (err) {
            this.loadingAdd = false
          }
        } else {
          this.$message.warn('请先确认下单组合')
        }
      },
      // 获取当前sku信息
      async getCurrentSkuInfo() {
        //获取当前sku的库存
        this.getCbType()
        let data = {
          productId: this.externalProp.id,
          cbType: this.cbType,
        }
        let res = await getCombinesSkuInfo(data)
        this.currentSkuInfo = res.data
        this.currentSkuInfo.mumuStock ? (this.count = 1) : (this.count = 0)
      },
      getCbType() {
        let tempArr = []
        this.combs.forEach(item => {
          item.items.forEach(d => {
            if (d.selected) tempArr.push(d.vcombid)
          })
        })
        this.cbType = tempArr.join(',')
      },
      // 前往购物车
      goShopcart() {
        this.$router.push({ name: 'EosShopcartList' })
      },
      // 咨询客服
      afterSale() {
        this.$info({
          title: '客服电话：400-677-0001',
          mask: false,
        })
      },
      // 试剂产品跳转PubChem
      goPubChem(id) {
        window.open(`https://pubchem.ncbi.nlm.nih.gov/substance/${id}`)
      },
      // 下载附件
      downLoad(url) {
        window.open(url)
      },
      // 导出pdf
      exportPdf() {
        window.open(
          `https://mall-api${process.env.ENV}.mumuxili.com/common/generate/pdf?id=${this.productInfo.productId}&pdftype=product`
        )
      },
    },
  }
</script>

<style lang="less" scoped>
  .product-detail-wrp {
    .btn-shopcart {
      width: 115px;
    }

    .main-wrp {
      margin: 0 auto;
      padding: 0 24px 0 24px;

      .main-content {
        margin-top: 16px;
        display: flex;
        align-items: flex-start;

        .product-introduction {
          flex: 1;
          position: relative;
          width: 476px;
          margin-left: 24px;

          .brand-image {
            position: absolute;
            top: 0px;
            right: 0px;
          }

          .cas-wrp {
            margin: 10px 0 15px 0;
            color: #495f69;
            font-size: 12px;
            line-height: 24px;
            background-color: rgba(243, 246, 249.7);
            padding: 5px 10px;

            > li {
              width: 50%;
            }
          }

          .product-title {
            width: 380x;
            height: 22px;
            font-size: 16px;
            font-weight: 700;
            text-align: left;
            color: #444444;
          }

          .product-describe {
            margin-top: 8px;
            height: 17px;
            font-size: 12px;
            font-weight: 500;
            text-align: left;
            color: #999999;
            line-height: 17px;
          }

          .product-price {
            margin-top: 12px;
            margin-bottom: 12px;
            padding-top: 14px;
            padding-left: 12px;
            height: 66px;
            background-color: rgba(243, 246, 249.7);
            border-radius: 2px;

            .price {
              width: 100%;

              .price-left {
                display: inline-block;
                width: 39px;
                height: 18px;
                font-size: 13px;
                font-weight: 500;
                text-align: left;
                color: #999999;
                line-height: 24px;
                vertical-align: top;
              }

              .price-right {
                display: inline-block;
                margin-left: 12px;
                vertical-align: top;

                .current-price {
                  height: 22px;

                  font-weight: 400;
                  text-align: left;
                  color: #ff4433;
                  line-height: 24px;

                  span:nth-child(1) {
                    font-size: 13px;
                  }
                  span:nth-child(2) {
                    font-size: 16px;
                    font-weight: bold;
                  }
                }

                .previous-price {
                  height: 18px;
                  font-size: 13px;
                  font-weight: 400;
                  text-decoration: line-through;
                  text-align: left;
                  color: #999999;
                  line-height: 24px;
                }
              }
            }
          }

          .list-module {
            margin-top: 12px;
            display: flex;
            align-items: center;
            font-size: 13px;

            .module-left {
              margin-right: 8px;
              width: 65px;
              color: #999999;
              text-align: right;
              word-break: break-all;
            }

            .module-right {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              text-align: left;
              color: #444444;
            }

            &.sku {
              margin-top: 0px;
              align-items: flex-start;

              .module-left {
                margin-top: 16px;
              }

              .module-right {
                display: flex;
                flex-wrap: wrap;

                .model-item {
                  padding: 0 8px;
                  margin-top: 12px;
                  margin-right: 12px;
                  height: 30px;
                  font-size: 12px;
                  line-height: 28px;
                  color: #666666;
                  background: #ffffff;
                  border: 1px solid #d9d9d9;
                  border-radius: 4px;
                  cursor: pointer;

                  &.selected {
                    color: white;
                    background: #00c7db;
                    border: #00c7db;
                  }
                }
              }
            }

            &.number {
              .stock-number {
                margin-left: 8px;
                font-size: 13px;
                color: #666666;
              }

              .stock-advice {
                margin-left: 24px;
                font-size: 12px;
                text-align: left;
                color: #999999;
              }
            }
          }

          .option-button {
            margin-top: 24px;

            .buy-button {
              width: 140px;
              height: 42px;
              border-radius: 4px;
              font-size: 13px;
              font-weight: 400;
              text-align: center;
              line-height: 24px;
            }

            .shop-car-button {
              margin-left: 16px;
              width: 140px;
              height: 42px;
              border: 1px solid #00c7db;
              border-radius: 4px;
              font-size: 13px;
              font-weight: 400;
              text-align: center;
              color: #00c7db;
              line-height: 24px;
            }
          }
        }
      }

      .tab-list {
        margin-top: 29px;

        .tab-left {
          display: inline-block;
          width: 100%;

          .download-list {
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
            flex-wrap: wrap;

            .download-item {
              margin-top: 16px;
              margin-left: 16px;
              padding-left: 36px;
              position: relative;
              width: 370px;
              height: 51px;
              border: 1px solid #e9e9e9;
              border-radius: 4px;
              cursor: pointer;

              .icon {
                position: absolute;
                left: 12px;
                top: 6px;
                width: 14px;
                height: 14px;
              }

              .content {
                .title {
                  width: 320px;
                  height: 18px;
                  font-size: 13px;
                  font-weight: 500;
                  text-align: left;
                  color: #666666;
                  line-height: 24px;
                }
                .info {
                  height: 17px;
                  font-size: 12px;
                  color: #cccccc;
                  line-height: 24px;
                }
              }
            }
          }

          .export-pdf {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #666666;
            cursor: pointer;
            > img {
              margin-right: 6px;
              width: 13px;
              height: 18px;
            }
          }
        }
      }
    }
  }
</style>

<style lang="less">
  .stock-advice {
    .ant-btn-link {
      font-size: 12px;
    }
  }

  .cas-wrp {
    .ant-btn.ant-btn-link {
      font-size: 12px;
    }
  }
  // 富文本内的一些默认样式
  .rich-text-wrp {
    h2 {
      margin: 16px 0 12px 0;
      padding-left: 12px;
      position: relative;
      height: 22px;
      line-height: 22px;
      font-size: 16px;
      text-align: left;
      color: #666666;

      &::before {
        position: absolute;
        content: '';
        left: 0;
        top: 50%;
        width: 4px;
        height: 14px;
        transform: translateY(-50%);
        background: #00c7db;
      }

      > span {
        margin-left: 6px;
        height: 22px;
        font-size: 12px;
        line-height: 22px;
        color: #d9d9d9;
      }
    }
  }
  .product-detail-wrp {
    .ant-tabs-bar {
      margin: 0px;
      .ant-tabs-nav-container {
        min-height: 44px;
        .ant-tabs-nav {
          .ant-tabs-tab {
            margin: 0;
          }
        }
      }
    }
  }
</style>
