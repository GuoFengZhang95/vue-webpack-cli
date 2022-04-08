const state = {
  sideBarCollapsed: false,
  tableSize: 'default',
  tableHeight: 0,
  tableWidth: 0,
  pageSize: 20,
  drawerList: [],
  screenPanelRect: {},
  pageSearchRect: {},
  drawerLayoutLoading: false,
}
const mutations = {
  Toggle_Side_Bar: (state, val) => {
    state.sideBarCollapsed = val
  },
  Set_Table_Size: (state, val) => {
    state.tableSize = val
  },
  Set_Table_Height: (state, val) => {
    state.tableHeight = val
  },
  Set_Table_Width: (state, val) => {
    state.tableWidth = val
  },
  Set_Page_Size: (state, val) => {
    state.pageSize = val
  },
  Set_Drawer_List: (state, val) => {
    state.drawerList = val
  },
  Set_Screen_Panel_Rect: (state, val) => {
    state.screenPanelRect = val
  },
  Set_Page_Search_Rect: (state, val) => {
    state.pageSearchRect = val
  },
  Set_Drawer_Layout_Loading: (state, val) => {
    state.drawerLayoutLoading = val.flag
  },
}

const actions = {
  // 侧导航是否折叠
  toggleSideBar({ commit }, val) {
    commit('Toggle_Side_Bar', val)
  },
  // 设置表格大小
  setTableSize({ commit }, val) {
    commit('Set_Table_Size', val)
  },
  // 设置表格高度
  setTableHeight({ commit }, val) {
    commit('Set_Table_Height', val)
  },
  // 设置表格宽度
  setTableWidth({ commit }, val) {
    commit('Set_Table_Width', val)
  },
  // 设置表格pageSize
  setPageSize({ commit }, val) {
    commit('Set_Page_Size', val)
  },
  // 全局侧拉框中的组件列表
  setDrawerList({ commit }, val) {
    commit('Set_Drawer_List', val)
  },
  /** 设置公共筛选组件的rect */
  setScreenPanelRect({ commit }, val) {
    commit('Set_Screen_Panel_Rect', val)
  },
  /** 设置公共搜索框的rect */
  setPageSearchRect({ commit }, val) {
    commit('Set_Page_Search_Rect', val)
  },
  /**设置侧拉狂加载 */
  setDrawerLayoutLoading({ commit }, val) {
    commit('Set_Drawer_Layout_Loading', val)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
