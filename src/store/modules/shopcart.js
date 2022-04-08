const state = {
  shopcartCount: 0,
  shopcartSelectedRowkeys: [],
}
const mutations = {
  Get_Shopcart_Count: (state, val) => {
    state.shopcartCount = val
  },
  Get_Shopcart_SelectedRowkeys: (state, val) => {
    state.shopcartSelectedRowkeys = val
  },
}

const actions = {
  // 购物车数量
  getShopcartCount({ commit }, val) {
    commit('Get_Shopcart_Count', val)
  },
  // 购物车中选中商品
  getShopcartSelectedRowKeys({ commit }, val) {
    commit('Get_Shopcart_SelectedRowkeys', val)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
