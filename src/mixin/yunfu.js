import AiFrame from '@/views/ai/components/AiFrame'
import { getLoginAddress, getUserStatus } from '@/api/ai/index.js'
/**
 *
 * @param {object} [config]
 * @param {string} [config.target] 云蝠目标地址
 * @returns {{components,data,mounted,methods}}
 */
export function yunfuMix(config) {
  const target = config?.target ?? ''
  return {
    components: {
      AiFrame,
    },
    data() {
      return {
        /**云蝠目标地址 */
        yunfuTarget: '',
        /**云蝠登录地址 */
        yunfuLoginUrl: '',
        /**云蝠登录失败提示 */
        showAuthTips: false,
        /**云蝠目标地址 */
        target,
      }
    },
    async mounted() {
      let { code, data } = await getUserStatus()
      if (code === '0') {
        // 已认证并且有过权益卡就可以访问，不用判断是否过期
        if (data.isAuth === 1) {
          if (data.hasCompanyEquity === 1) {
            this.registerAI()
          } else {
            this.showAuthTips = true
          }
        }
      } else {
        this.showAuthTips = true
      }
    },
    methods: {
      // 注册云蝠成功 展示云蝠界面
      async registerAI() {
        if (this.$store.state.user.isYunfuLogin && this.target) {
          this.yunfuTarget = this.target
        } else {
          let res = await getLoginAddress()
          if (res.code === '0') {
            let errorMsg = res.data.errorMsg
            if (errorMsg) {
              if (errorMsg) {
                this.$message.error(errorMsg)
              }
              this.showAuthTips = true
            } else {
              if (res.data.url) {
                this.yunfuLoginUrl = res.data.url
                this.$nextTick(() => {
                  this.yunfuTarget = this.target
                })
                this.$store.dispatch('user/setYunfuLoginStatus', true)
              }
            }
          } else {
            this.showAuthTips = true
          }
        }
      },
    },
  }
}
