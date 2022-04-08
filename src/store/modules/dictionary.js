/* eslint-disable no-unused-vars */
import {
  getAptsData,
  getTitleData,
  getCollegeData,
  getSchoolData,
  getCountryList,
  getBidType,
  getCompanyType,
} from '@/api/dictionary'

/**
 * @description 数据字典store
 * @author zevan
 * @time 2022年3月2日 15:35:24
 */
const state = {
  /**公司类型 */
  companyType: [],
  /**城市 */
  city: [],
  /**标讯类型 */
  bidType: [],
  /**学校 */
  school: [],
  /**学院 */
  college: [],
  /**职称 */
  title: [],
  /**行政职务 */
  adminiPost: [],
  /**客源搜索选项 */
  researchSearchOptions: [
    {
      label: '综合搜索',
      value: '1',
    },
    {
      label: '姓名',
      value: '2',
    },
    {
      label: '研究方向',
      value: '3',
    },
    {
      value: '4',
      label: '手机',
    },
    {
      value: '5',
      label: '手机2',
    },
    {
      value: '6',
      label: '手机3',
    },
    {
      value: '7',
      label: '座机',
    },
    {
      value: '8',
      label: '邮箱',
    },
    {
      value: '9',
      label: '邮箱2',
    },
    {
      value: '10',
      label: '邮箱3',
    },
  ],
}
const mutations = {
  Get_Company_Type: (state, val) => {
    state.companyType = val
  },
  Get_City: (state, val) => {
    state.city = val
  },
  Get_Bid_Type: (state, val) => {
    state.bidType = val
  },
  Get_School: (state, val) => {
    state.school = val
  },
  Get_College: (state, val) => {
    state.college = val
  },
  Get_Title: (state, val) => {
    state.title = val
  },
  Get_Admin_Post: (state, val) => {
    state.adminiPost = val
  },
}

const actions = {
  getTargetDicts({ commit, dispatch }, val) {
    val.forEach(action => {
      dispatch(action)
    })
  },
  async getCompanyType({ commit, state }, val) {
    if (state.companyType.length) return
    const res = await getCompanyType({ isAll: 1 })
    commit('Get_Company_Type', res.data)
  },
  async getCity({ commit }, val) {
    if (state.city.length) return
    const res = await getCountryList({ superId: -1 })
    commit('Get_City', res.data)
  },
  async getBidType({ commit }, val) {
    if (state.bidType.length) return
    const res = await getBidType()
    commit('Get_Bid_Type', res.data)
  },
  async getSchool({ commit }, val) {
    if (state.school.length) return
    const res = await getSchoolData({ page: 1, pageSize: 999999 })
    commit('Get_School', res.data)
  },
  async getCollege({ commit }, val) {
    if (state.college.length) return
    const res = await getCollegeData({
      page: 1,
      pageSize: 999999,
      schoolId: '',
    })
    commit('Get_College', res.data)
  },
  async getTitle({ commit }, val) {
    if (state.title.length) return
    const res = await getTitleData({ superId: -1 })
    commit('Get_Title', res.data)
  },
  async getAdminiPost({ commit }, val) {
    if (state.adminiPost.length) return
    const res = await getAptsData({ superId: -1 })
    commit('Get_Admin_Post', res.data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
