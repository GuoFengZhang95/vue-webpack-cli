const getters = {
  sideBarCollapsed: state => {
    return state.app.sideBarCollapsed
  },
  tableSize: state => {
    return state.app.tableSize
  },
  tableHeight: state => {
    return state.app.tableHeight
  },
  tableWidth: state => {
    return state.app.tableWidth
  },
  pageSize: state => {
    return state.app.pageSize
  },
  drawerList: state => {
    return state.app.drawerList
  },
  screenPanelRect: state => {
    return state.app.screenPanelRect
  },
  pageSearchRect: state => {
    return state.app.pageSearchRect
  },
  tableOffset: state => {
    const screenPanelHeight = state.app.screenPanelRect.height ?? 0
    const pageSearchHeight = state.app.pageSearchRect.height ?? 0
    /**分页高度 */
    const paginationHeight = 53
    /**表格的表头高度 */
    const tableHeaderHeight = 40
    const offset =
      screenPanelHeight +
      pageSearchHeight +
      paginationHeight +
      tableHeaderHeight
    return offset
  },
  drawerLayoutLoading: state => {
    return state.app.drawerLayoutLoading
  },
  sideList: state => {
    return state.routes.allNavList
  },
  asideList: state => {
    return state.routes.asideList
  },
  tabMax: state => {
    return state.tagsView.tabMax
  },
  renderTab: state => {
    return state.tagsView.renderTab
  },
  eosUserInfo: state => {
    return state.user.eosUserInfo
  },
  baseUserInfo: state => {
    return state.user.baseUserInfo
  },

  companyTypeDict: state => {
    return state.dictionary.companyType
  },
  cityDict: state => {
    return state.dictionary.city
  },
  bidTypeDict: state => {
    return state.dictionary.bidType
  },
  schoolDict: state => {
    return state.dictionary.school
  },
  collegeDict: state => {
    return state.dictionary.college
  },
  titleDict: state => {
    return state.dictionary.title
  },
  adminiPostDict: state => {
    return state.dictionary.adminiPost
  },
  researchSearchOptions: state => {
    return state.dictionary.researchSearchOptions
  },
}
export default getters
