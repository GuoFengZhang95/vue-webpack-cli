
const VUE_MIXIN_CHECK = 'VueMixinCheck'
const fileHandler = require('./handler')
let counter = 0
function isMatch(path) {
  return path.indexOf('node_modules') === -1 && path.indexOf('src') !== -1 && /(\.vue)$/.test(path)
}
class VueMixinCheck {
  constructor(options = {}) {
    this.key = VUE_MIXIN_CHECK
    this.run = this.run.bind(this)
  }
  apply(compiler) {
    // console.log('compiler', compiler)
    this.key = compiler.name || `${this.key}_${counter += 1}`
    // 在监听模式下，一个新的 compilation 触发之后，但在 compilation 实际开始之前执行。
    // AsyncSeriesHook 异步串行钩子
    compiler.hooks.watchRun.tapPromise(this.key, compiler => {
      return this.run(compiler)
    })
  }
  async run(compiler) {
    // 判断当前插件是否已经已经注册过
    let hasTap = compiler.hooks.compilation.taps.find(({ name }) => name === this.key)
    if (hasTap) return
    compiler.hooks.compilation.tap(this.key, compilation => {
      // compilation.warnings.push('222') //告警
      const files = []
      // 模块构建成功时执行
      compilation.hooks.succeedModule.tap(this.key, ({
        resource
      }) => {
        if (resource) {
          if (isMatch(resource)) {
            // console.log('succeedModule', resource)
            fileHandler(resource)
          }
        }
      })
      // 所有模块都完成构建并且没有错误时执行
      compilation.hooks.finishModules.tap(this.key, ({ modules }) => {
        // console.log('finishModules', modules)
      })
    })
    compiler.hooks.contextModuleFactory.tap(this.key, contextModuleFactory => {
      console.log('contextModuleFactory', 'contextModuleFactory')
      contextModuleFactory.hooks.contextModuleFiles.tap(this.key, (data) => {
        console.log('data', data)
        // callback()
      })
    })
  }
}

module.exports = VueMixinCheck