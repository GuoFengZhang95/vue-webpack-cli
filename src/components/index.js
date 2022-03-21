const components = []
const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}
export default {
  version: '',
  install,
}
