import { getUserStatus } from '@/api/ai/index.js'
const AdverDesc = () => import('@/views/yqmmpro/components/AdverDesc.vue')
/**
 * @description 处理用户权益卡相关状态
 * @returns {{components,data,mounted}}
 */
export function equityAuthMix() {
  return {
    components: {
      AdverDesc,
    },
    data() {
      return {
        /**判断未加入企业或已加入的企业未开通过企业套餐 */
        authType: 0,
      }
    },
    async mounted() {
      const { data } = await getUserStatus()
      if (data.isAuth == 1) {
        //是企业用户
        if (data.hasCompanyEquity === 0) {
          //未开通权益卡
          this.authType = 2
        } else {
          //已开通权益卡
          this.authType = 1
          // if (data.companyEquityUseful) {
          //   // 权益卡有效
          //   this.authType = 1
          // } else {
          //   // 权益卡无效
          //   this.authType = 2
          // }
        }
      } else {
        //不是企业用户
        this.authType = 2
      }
    },
  }
}
