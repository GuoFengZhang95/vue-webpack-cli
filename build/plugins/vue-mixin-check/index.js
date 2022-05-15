
const ESLINT_PLUGIN = 'VueMixinCheck'
const fileHandler = require('./handler')
let counter = 0
function isMatch(path) {
  return path.indexOf('node_modules') === -1 && path.indexOf('src') !== -1 && /(\.vue)$/.test(path)
}
class VueMixinCheck {
  constructor(options = {}) {
    this.key = ESLINT_PLUGIN
    this.run = this.run.bind(this)
  }
  apply(compiler) {
    // console.log('compiler.name', compiler.name)
    this.key = compiler.name || `${this.key}_${counter += 1}`
    // 在监听模式下，一个新的 compilation 触发之后，但在 compilation 实际开始之前执行。
    compiler.hooks.watchRun.tapPromise(this.key, c => {
      return this.run(c)
    })
  }
  async run(compiler) {
    if (
      compiler.hooks.compilation.taps.find(({
        name
      }) => name === this.key)) {
      return
    }

    compiler.hooks.compilation.tap(this.key, compilation => {
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
      compilation.hooks.finishModules.tap(this.key, () => {
        // console.log('finishModules', files)
      })
      // 为 compilation 创建额外 asset
      compilation.hooks.additionalAssets.tapPromise(this.key, async () => {
      })
    })
  }
}

module.exports = VueMixinCheck