/**
 *
 * @param {object} configs
 * @param {string|array} [configs.customListName] 自定义页面主列表名称
 * @returns
 */
export function loadingMix(configs) {
  let customListName = configs?.customListName ?? 'dataSource'
  return {
    data() {
      return {
        mixinLoding: true,
      }
    },
    computed: {
      /**请求状态 0请求失败 1请求中 2请求完成无结果 3请求完成有结果 */
      loadingStatus() {
        if (this.mixinLoding) {
          return 1
        } else {
          if (this[customListName].length) {
            return 3
          } else {
            return 2
          }
        }
      },
    },
    methods: {
      toggleMixinLoading(flag) {
        if (flag === false) {
          this.$nextTick(() => {
            this.mixinLoding = flag
          })
        } else {
          this.mixinLoding = flag
        }
      },
    },
  }
}
