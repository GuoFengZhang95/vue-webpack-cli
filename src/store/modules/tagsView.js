const state = {
  tabMax: 3,
  tabList: [], // 全部tab
  renderTab: [], // 展示tab
  extendTab: [], // 扩展tab
}

const mutations = {
  /**设置tab最多容纳数 */
  Set_Tab_Max: (state, val) => {
    state.tabMax = val
  },
  /**
   *@description 点击导航||点击tab页
   * data无值：页面resize，重新计算展示tab和扩展tab
   * data有值：判断是否点过该导航，点过则排序放到最后，未点过则加入全局tab列表
   */
  Set_Tabs(state, val) {
    if (val) {
      let idx = state.tabList.findIndex(e => e.path === val.path)
      let idx2 = state.renderTab.findIndex(e => e.path === val.path)
      if (idx < 0) {
        state.tabList.push(val)
      } else {
        if (idx2 < 0) {
          state.tabList.splice(idx, 1)
          state.tabList.push(val)
        }
      }
    }
    state.renderTab =
      state.tabList.length > state.tabMax
        ? state.tabList.slice(state.tabList.length - state.tabMax)
        : state.tabList
    state.extendTab =
      state.tabList.length > state.tabMax
        ? state.tabList.slice(0, state.tabList.length - state.tabMax)
        : []
  },
  /**删除tab页签 */
  Delete_Tabs(state, val) {
    const idx = state.tabList.findIndex(e => e.path === val.path)
    if (idx > -1) {
      state.tabList.splice(idx, 1)
      state.renderTab = state.tabList
    }
  },
}

const actions = {
  setTabMax({ commit }, val) {
    commit('Set_Tab_Max', val)
  },
  setTabs({ commit }, val) {
    commit('Set_Tabs', val)
  },
  deleteTabs({ commit }, val) {
    commit('Delete_Tabs', val)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
