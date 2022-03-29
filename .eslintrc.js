module.exports = {
  root: true, // 根节点
  /**关键字指定你想启用的环境 */
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  /**继承的配置规则集 default配置 */
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended'
  ],
  plugins: ['vue'],
  parser: 'vue-eslint-parser',// 解析器
  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module', // 启用 ESModule
    ecmaFeatures: {
      // 关闭 jsx 语法校验, 默认为 true
      jsx: false
    }
  },
  rules: {
    // 规则 'off' 0 = 关闭 'warn' 1 = 警告 'error' 2 = 报错
    // 'indent': ['error', 'tab'], // tab缩进
    'strict': 0,// 严格模式，规则关闭
    'quotes': [2, 'single'], // 强制单引号
    'semi': [2, 'never'], // 强制分号结尾
    'global-require': 0,// 要求 require() 出现在顶层模块作用域中，规则关闭
    'require-yield': 2, // 要求 generator 函数内有 yield，规则关闭
    'no-debugger': 2, //禁止使用debugger
    'no-empty': 2,//块语句中的内容不能为空
    'no-unreachable': 2, // 无法执行到
    'no-prototype-builtins': 2, // hasOwnProperty
    'no-multiple-empty-lines': [2, { max: 2, maxEOF: 1, maxBOF: 1 }], // 最多连续2个空行，文件首尾最多一个空行
    'vue/component-definition-name-casing': [2, 'PascalCase'],// 组件name首字母大写驼峰
    'vue/no-template-shadow': 2, // 消除 v-for 指令或范围属性的阴影变量声明
    'vue/no-spaces-around-equal-signs-in-attribute': 2, // 行内'='前后不需要空格
    'vue/no-multi-spaces': 2,// 消除拢余的连续空格
    'vue/no-v-for-template-key': 2, // template循环禁止使用key
    'vue/no-multiple-template-root': 2, // template必须存在一个根节点
    'vue/no-empty-pattern': 2,
    'vue/no-textarea-mustache': 2, // testarea 禁止使用 {{}}
    'vue/no-useless-mustaches': 2, // 无效插值 {{'abc'}}
    'vue/v-on-style': 2, // 强制v-on使用缩写
    'vue/v-bind-style': 2, // 强制v-bind使用缩写
    'vue/v-slot-style': 2, // 强制v-slot使用缩写
    'vue/require-default-prop': 2, // prop必须有默认值
    'vue/require-prop-types': 2, // 强制prop包含类型定义
    'vue/order-in-components': 2, // vue文件内声明顺序
    'vue/html-closing-bracket-spacing': 2, // 禁止标签多余空格
    'vue/html-end-tags': 2, // 标签必须闭合
    'vue/html-quotes': ['error', 'double', { 'avoidEscape': false }],
    'vue/no-v-model-argument': 2, // 组件可以直接使用v-model
    'vue/html-closing-bracket-newline': [2, {
      'singleline': 'never',
      'multiline': 'always'
    }], // 标签闭合>单行
    'vue/prop-name-casing': [2, 'camelCase'], // prop强制使用驼峰
    'vue/mustache-interpolation-spacing': [2, 'always'], // {{}}插值内前后有一个空格
    'vue/max-attributes-per-line': ['error', {
      'singleline': {
        'max': 5
      },
      'multiline': {
        'max': 1
      }
    }], // 一行可以有5个属性，多行每一行最多有1个属性
    'space-before-function-paren': 0, // 方法()前是否空格
    'no-console': 0, // 禁用 console 对象方法，规则关闭
    'no-unused-vars': 0,  // 定义未使用
    'no-irregular-whitespace': 0, // 关闭不正常的空格（注释内空行）
    'no-mixed-spaces-and-tabs': 0, // 关闭不正常tab和回车（注释内回车 tab）
    'no-async-promise-executor': 0, // 禁止使用异步函数作为 Promise executor
    'vue/multiline-html-element-content-newline': 0, // 多行html标签的内容前后强制换行
    'vue/singleline-html-element-content-newline': 0, // 单行html标签的内容前后强制换行
    'vue/attributes-order': 0, // attr顺序
    'vue/html-self-closing': 0, // 标签无内容自我闭合
    'vue/attribute-hyphenation': 0, // attr绑定使用连字符
    'vue/no-empty-component-block': 0, // .vue文件每个部分不能位空
    'vue/no-unused-vars': 0, // 定义未使用
    'vue/multi-word-component-names': 0, // 组件名使用连接符
    'vue/no-mutating-props': 0, // 直接操作prop的值
    'vue/no-side-effects-in-computed-properties': 0, // computed内禁止操作其他数据导致影响页面
    'vue/no-v-html': 0, // 禁止v-html防止xss攻击
    'vue/no-lone-template': 0, // ???
  }
}
