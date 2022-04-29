/**
 * @author zevan
 * @description 通用的工具方法
 */
export { debounce, cloneDeep } from 'lodash-es'
/**处理数字显示 */
export const formateNum = num => {
  if (num >= 0) {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w'
    } else if (num >= 1000) {
      let count = (num / 1000).toFixed(1)
      if (count < 10) {
        return count + 'k'
      } else {
        return (count / 10).toFixed(1) + 'w'
      }
    } else {
      return num
    }
  } else {
    return 0
  }
}
/**
 * @description 替换em标签
 * @param {object} data
 * @param {string} data.value 需要处理的值
 * @param {string} [data.originTag] 被替换的标签
 * @param {string} [data.targetTag] 替换标签
 * @param {string} [data.color] 颜色
 * @returns {string}
 */
export const replaceHtmlTag = ({ value = '', originTag = 'em', targetTag = 'span', color = '#FF4433' }) => {
  // console.log(value)
  // console.log(originTag)
  // console.log(targetTag)
  // console.log(color)
  if (!value) return ''
  if (!targetTag) {
    return value.replaceAll(`<${originTag}>`, '').replaceAll(`</${originTag}>`, '')
  } else {
    return value.replaceAll(`<${originTag}>`, `<${targetTag} style="color:${color}">`).replaceAll(`</${originTag}>`, `</${targetTag}>`)

  }
}
/**
* @description 获取当前日期指定天数前的日期字符串
* @param {string} days
* @return {string} 'yyyy-mm-dd' 
*/
export const filterPrevDate = (days) => {
  const date = new Date()
  const currentTime = date.getTime()
  const diffTime = Number(days) * 24 * 60 * 60 * 1000
  const targeTime = currentTime - diffTime
  const targetDate = new Date(targeTime).toLocaleDateString()
  // 后端如果格式化数据的话需要给到
  const formateDate = targetDate
    .split('/')
    .map((item, index) => {
      if (index === 1) {
        if (item.length === 1) {
          item = '0' + item
        }
      }
      return item
    })
    .join('-')
  return formateDate
}
