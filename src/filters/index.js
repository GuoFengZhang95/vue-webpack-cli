// 90 => 九折
function NumberToDiscount(number) {
  let num
  if (number % 10 === 0) {
    num = number / 10
    return `${num}折`
  } else {
    let newNumArr = String(number / 10).split('.')
    return `${NumberToChinese(newNumArr[0])}${NumberToChinese(newNumArr[1])}折`
  }
}

// 1 => 一
function NumberToChinese(number) {
  let arr1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  let arr2 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  return arr2[arr1.indexOf(Number(number))]
}
// 13151557233 =>
function AsteriskMobliephone(str) {
  let reg = /^(\d{3})\d*(\d{4})$/
  return str.replace(reg, '$1****$2')
}

export { NumberToDiscount, NumberToChinese, AsteriskMobliephone }
