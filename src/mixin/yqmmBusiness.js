import { getUnlockAuth } from '@/api/yqmmPro/public'
import { mapGetters } from 'vuex'
/**
 * @description 验证已解锁信息列表权限
 * @param {object} config
 * @param {number} config.moduleId
 * @returns {{data, methods,computed}}
 */
export function yqmmBusinessMix(config) {
  const moduleId = config?.moduleId ?? 0
  return {
    data() {
      return {
        tabList: [
          {
            value: 0,
            label: '我的',
          },
        ],
        power: 0,
        activeKey: 0,
        moduleId,
      }
    },
    computed: {
      ...mapGetters(['baseUserInfo']),
    },
    watch: {
      baseUserInfo: {
        handler(val) {
          if (val) {
            this.checkListPower()
          }
        },
        immediate: true,
      },
    },
    methods: {
      // 页面tab切换回调
      handleTabChange(e) {
        this.checkListPower(this.moduleId).then(res => {
          if (res === 3) {
            this.activeKey = 0
          } else {
            this.activeKey = e.value
          }
        })
      },
      //判断权限
      async checkListPower() {
        let companyId = this.$store.getters.baseUserInfo.companyId
        let res = await getUnlockAuth({
          companyId: companyId,
          module: this.moduleId,
        })
        this.power = res.data.menuAuthority
        if (this.power === 1) {
          this.tabList = [
            {
              value: 0,
              label: '我的',
            },
            {
              value: 1,
              label: '全部',
            },
          ]
        } else if (this.power === 3) {
          // this.$message.warning('您的权限已被修改，请联系企业管理员。')
          this.tabList = [
            {
              value: 0,
              label: '我的',
            },
          ]
        } else {
          this.tabList = []
        }
        return this.power
      },
    },
  }
}
