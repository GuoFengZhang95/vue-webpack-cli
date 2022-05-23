
const { createWriteStream } = require('fs')
const { Readable } = require('stream')
const VUE_MIXIN_CHECK = 'VueMixinCheck'
const fileHandler = require('./handler')
let counter = 0
function isMatch(path) {
  return path.indexOf('node_modules') === -1 && path.indexOf('src') !== -1 && /(\.vue)$/.test(path)
}
class StatsSerializeStream extends Readable {
  constructor(stats) {
    super();
    this._indentLevel = 0;
    this._stringifier = this._stringify(stats);
  }

  get _indent() {
    return '  '.repeat(this._indentLevel);
  }

  _read() {
    let readMore = true;

    while (readMore) {
      const { value, done } = this._stringifier.next();

      if (done) {
        this.push(null);
        readMore = false;
      } else {
        readMore = this.push(value);
      }
    }
  }

  * _stringify(obj) {
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || obj === null) {
      yield JSON.stringify(obj);
    } else if (Array.isArray(obj)) {
      yield '[';
      this._indentLevel++;

      let isFirst = true;
      for (let item of obj) {
        if (item === undefined) {
          item = null;
        }

        yield `${isFirst ? '' : ','}\n${this._indent}`;
        yield* this._stringify(item);
        isFirst = false;
      }

      this._indentLevel--;
      yield obj.length ? `\n${this._indent}]` : ']';
    } else {
      yield '{';
      this._indentLevel++;

      let isFirst = true;
      const entries = Object.entries(obj);
      for (const [itemKey, itemValue] of entries) {
        if (itemValue === undefined) {
          continue;
        }

        yield `${isFirst ? '' : ','}\n${this._indent}${JSON.stringify(itemKey)}: `;
        yield* this._stringify(itemValue);
        isFirst = false;
      }

      this._indentLevel--;
      yield entries.length ? `\n${this._indent}}` : '}';
    }
  }
}
async function writeStats(stats, filepath) {
  return new Promise((resolve, reject) => {
    new StatsSerializeStream(stats)
      .on('end', resolve)
      .on('error', reject)
      .pipe(createWriteStream(filepath));
  });
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
    const done = async (stats, callback) => {
      callback = callback || (() => { })
      // console.log('stats', stats.toJson())
      // await writeStats(stats, './analyze.js')
      callback()
    }
    compiler.hooks.done.tapAsync(this.key, done)
    // // 判断当前插件是否已经已经注册过
    // let hasTap = compiler.hooks.compilation.taps.find(({ name }) => name === this.key)
    // if (hasTap) return
    // compiler.hooks.compilation.tap(this.key, compilation => {
    //   // compilation.warnings.push('222') //告警
    //   const files = []
    //   // 模块构建成功时执行
    //   compilation.hooks.succeedModule.tap(this.key, ({ resource }) => {
    //     if (resource) {
    //       if (isMatch(resource)) {
    //         // console.log('succeedModule', resource)
    //         fileHandler(resource)
    //       }
    //     }
    //   })
    //   // 所有模块都完成构建并且没有错误时执行
    //   compilation.hooks.finishModules.tap(this.key, ({ modules }) => {
    //     // console.log('finishModules', modules)
    //   })
    // })
  }
}

module.exports = VueMixinCheck