module.exports = {
  /**指定每行代码的最佳长度， 如果超出长度则换行 */
  printWidth: 80,
  /**缩进的长度两个空格 */
  tabWidth: 2,
  /**使用制表符缩进 */
  useTabs: false,
  /**是否使用分号 */
  semi: false,
  /**如果为 true，将使用单引号而不是双引号 */
  singleQuote: true,
  /**对象中的键是否需要引号 */
  quoteProps: 'as-needed',
  jsxSingleQuote: true,
  /**尽可能控制尾随逗号的输出。 有效选项： '无' - 无尾随逗号 ' es5' - 在ES5中有效的尾随逗号（对象，数组等） 'all' - 尾随逗号 尽可能（函数参数） */
  trailingComma: 'es5',
  /**控制对象字面量的空格输出 */
  bracketSpacing: true,
  /**属性换行时第一个标签的闭合符号是否跟随在最后一个属性后面 */
  bracketSameLine: false,
  /**当箭头函数仅有一个参数时加上括号 */
  arrowParens: 'avoid',
  /**endOfLine */
  endOfLine: 'crlf',
  /**vue文件中的template style script 内部的代码和这三个标签是否有缩进 */
  vueIndentScriptAndStyle: true,
  /**指定HTML文件的全局空白区域敏感度。 有效选项： 'css' - 尊重CSS显示属性的默认值。 'strict' - 空格被认为是敏感的。 'ignore' - 空格被认为是不敏感的。 */
  htmlWhitespaceSensitivity: 'ignore',
  // embeddedLanguageFormatting: 'auto',
}
