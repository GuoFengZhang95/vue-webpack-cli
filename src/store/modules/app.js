const state = {
  sideBarCollapsed: false,
}
const mutations = {
  Toggle_Side_Bar: (state, val) => {
    state.sideBarCollapsed = val
  },
}

const actions = {
  // 侧导航是否折叠
  toggleSideBar({ commit }, val) {
    commit('Toggle_Side_Bar', val)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
