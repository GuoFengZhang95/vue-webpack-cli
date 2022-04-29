
const components = []
/* eslint-disable-next-line no-unused-vars */
const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
  // Vue.use()
}

export default {
  version: '',
  install,
}
