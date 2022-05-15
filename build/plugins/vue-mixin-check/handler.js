const path = require('path')
const fs = require('fs')
const babelParser = require('@babel/parser')
const babelTraverse = require('@babel/traverse').default
const fields = ['name', 'components', 'mixins', 'directives', 'filters', 'data', 'props', 'watch', 'computed', 'methods',] // mixin中需要处理的字段

function fileHandler(path) {
  // console.log('===== path =====', path)

  // 1、读取代码文本
  const vueCode = fs.readFileSync(path, 'utf-8')
  // console.log('===== vueCode =====', vueCode)
  const jsCode = vueCode.split('<script>')[1].split('</script>')[0]
  // console.log('===== jsCode =====', jsCode)
  // 2、生成AST
  const ast = babelParser.parse(jsCode, { sourceType: 'module' })
  // 遍历AST
  babelTraverse(ast, {
    enter(path) {
      if (path.isProperty()) {
        if (fields.includes(path.node.key.name)) {
          console.log(`找到属性${path.node.key.name}`)
          // console.log(`找到${path.node.value.properties}\n`)
          // 1、value为非对象 name属性
          // 2、 value为对象
        }
      }
      if (path.isMethod() && path.node.key.name === 'data') {
        console.log(`找到方法data`)
      }
    },
    exit() {
      // console.log('退出')
    }
  })
}
module.exports = fileHandler