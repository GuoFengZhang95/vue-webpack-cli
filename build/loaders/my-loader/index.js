module.exports = function (source) {
  // console.log('my-loader',source)
  // console.log('this.resource',this.resource)
  let callback = this.async()
  setTimeout(() => {
    callback(null, source)
  }, 500)
  return undefined
}