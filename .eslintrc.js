module.exports = {
  root: true, // 根节点
  /**关键字指定你想启用的环境 */
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  /**继承的配置规则集 均为default配置 */
  extends: ['eslint:recommended', 'plugin:vue/recommended'],
  plugins: ['eslint-plugin-vue'],
  parser: 'vue-eslint-parser', // 解析器
  parserOptions: {
    ecmaVersion: 6,
    parser: '@babel/eslint-parser',
    sourceType: 'module', // 启用 ESModule
    ecmaFeatures: {
      // 关闭 jsx 语法校验, 默认为 true
      jsx: false,
    },
  },
  /**可以继承配置的默认值进行修改
   * 规则 'off' 0 = 关闭 'warn' 1 = 警告 'error' 2 = 报错
   */
  rules: {
    /**严格模式 */
    strict: 2,
    /**禁止定义未使用 */
    'no-unused-vars': 2,
    /**2空格缩进 */
    indent: ['error', 2],
    /**强制js单引号 */
    quotes: [2, 'single'],
    /**禁用分号结尾 */
    semi: [2, 'never'],
    /**块语句中的内容不能为空 */
    'no-empty': 2,
    /**禁止出现无法执行到的语句 */
    'no-unreachable': 2,
    /**禁止直接使用对象的hasOwnProperty */
    'no-prototype-builtins': 2,
    /**最多连续2个空行，文件首尾最多一个空行 */
    'no-multiple-empty-lines': [2, { max: 2, maxEOF: 1, maxBOF: 1 }],
    /**要求 generator 函数内有 yield */
    'require-yield': 2,
    /**关闭不正常的空行 */
    'no-irregular-whitespace': 2,
    /**禁止混用空格和table */
    'no-mixed-spaces-and-tabs': 2,
    /**可以使用debugger */
    'no-debugger': 0,
    /**函数()前不加空格 */
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'never',
      },
    ],
    /**运算符周围有空格 */
    'space-infix-ops': ['error', { int32Hint: false }],
    /**括号内左右不能有空格 */
    'space-in-parens': ['error', 'never'],
    /**大括号缩进风格 */
    'brace-style': ['error', '1tbs'],
    /**大括号前有空格 */
    'space-before-blocks': ['error', 'always'],
    /**强制在对象字面量的键和值之间使用一致的空格 */
    'key-spacing': ['error'],
    /**对象属性强制换行 */
    'object-property-newline': ['error'],
    /**一元操作符之前或之后存在空格 */
    'space-unary-ops': [
      2,
      {
        words: true,
        nonwords: false,
      },
    ],
    /**禁止属性前有空白 */
    'no-whitespace-before-property': 2,
    /**强制关键字周围空格的一致性 */
    'keyword-spacing': ['error', { before: true, before: true }],
    /**console可用 */
    'no-console': 0,
    /**禁止使用异步函数作为 Promise executor */
    'no-async-promise-executor': 0,
    /**禁止定义未使用 */
    'vue/no-unused-vars': 2,
    /**使用推荐的属性顺序 */
    'vue/attributes-order': 2,
    /**禁止子组件直接操作prop的值 */
    'vue/no-mutating-props': 2,
    /** attr绑定使用连字符格式 */
    'vue/attribute-hyphenation': 2,
    /**禁用不必要的template */
    'vue/no-lone-template': 2,
    /**组件name首字母大写驼峰 */
    'vue/component-definition-name-casing': [2, 'PascalCase'],
    /**消除 v-for 指令或范围属性的阴影变量声明 */
    'vue/no-template-shadow': 2,
    /**行内'='前后不需要空格 */
    'vue/no-spaces-around-equal-signs-in-attribute': 2,
    /**消除template中冗余的连续空格 */
    'vue/no-multi-spaces': 2,
    /**template循环禁止使用key */
    'vue/no-v-for-template-key': 2,
    /**template必须存在一个根节点 */
    'vue/no-multiple-template-root': 2,
    /**禁止template中使用无效解构 */
    'vue/no-empty-pattern': 2,
    /**textarea 禁止使用 差值表达式 */
    'vue/no-textarea-mustache': 2,
    /**禁止无效插值：{{'abc'}} */
    'vue/no-useless-mustaches': 2,
    /**强制v-on使用缩写 */
    'vue/v-on-style': 2,
    /**强制v-bind使用缩写 */
    'vue/v-bind-style': 2,
    /**强制v-slot使用缩写 */
    'vue/v-slot-style': 2,
    /**prop必须有默认值 */
    'vue/require-default-prop': 2,
    /**强制prop包含类型定义 */
    'vue/require-prop-types': 2,
    /**vue文件内声明按顺序熟悉 */
    'vue/order-in-components': 2,
    /**禁止标签多余空格 */
    'vue/html-closing-bracket-spacing': 2,
    /**标签必须闭合 */
    'vue/html-end-tags': 2,
    /**template中使用双引号 */
    'vue/html-quotes': ['error', 'double', { avoidEscape: false }],
    /**组件可以直接使用v-model */
    'vue/no-v-model-argument': 2,
    'vue/html-closing-bracket-newline': [
      2,
      {
        singleline: 'never',
        multiline: 'always',
      },
    ],
    /**prop强制使用驼峰 */
    'vue/prop-name-casing': [2, 'camelCase'],
    /**插值表达式内前后有一个空格 */
    'vue/mustache-interpolation-spacing': [2, 'always'],
    /**单行最多五个标签，多行事每行只能有一个标签 */
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 5,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    /**多行html标签的内容前后强制换行 */
    'vue/multiline-html-element-content-newline': 2,
    /**单行html标签的内容前后强制换 */
    'vue/singleline-html-element-content-newline': 2,
    /**标签闭合原则 */
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'never',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    /**.vue文件每个部分不能位空   */
    'vue/no-empty-component-block': 0,
    /**组件名使用连接符 */
    'vue/multi-word-component-names': 0,
    /**computed内禁止操作其他数据导致影响页面 */
    'vue/no-side-effects-in-computed-properties': 0,
    /**禁止v-html防止xss攻击 */
    'vue/no-v-html': 0,
  },
}
