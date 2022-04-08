import business from './yqmmpro/business'
import project from './yqmmpro/project'
import customer from './yqmmpro/customer'
import mining from './yqmmpro/mining'
import outbound from './ai/outbound'
import speech from './ai/speech'
import eos from './eos'
import system from './system'

const state = {
  allNavList: {
    yqmmpro: {
      icon_h:
        'https://img.mumuxili.com/yqmm/pc/saas/images/icon/icon-yqmm-light.svg',
      icon: 'https://img.mumuxili.com/yqmm/pc/saas/images/icon/icon-yqmm-gray.svg',
      label: '情报中心',
      path: '/yqmmpro',
      children: [...business, ...project, ...customer, ...mining],
    },
    ai: {
      icon: 'https://img.mumuxili.com/yqmm/pc/saas/images/icon/icon-user-white.svg',
      icon_h:
        'https://img.mumuxili.com/yqmm/pc/saas/images/icon/icon-user-light.svg',
      label: '获客中心',
      path: '/ai',
      children: [...outbound, ...speech],
    },
    eos: {
      icon_h: require('@/assets/images/icon/icon-header-eos-selected.svg'),
      icon: require('@/assets/images/icon/icon-header-eos-unselected.svg'),
      label: '易采销',
      path: '/eos',
      children: [...eos],
    },
    system: {
      icon_h: require('@/assets/images/icon/icon-header-system-selected.png'),
      icon: require('@/assets/images/icon/icon-header-system-unselected.png'),
      label: '系统管理',
      path: '/system',
      children: [...system],
    },
  },
  asideList: [],
}
// 正式环境不展示易采销模块
if (process.env.ENV === '') {
  delete state.allNavList.eos
}
const mutations = {
  Set_Aside_List(state, data) {
    state.asideList = data
  },
}
const actions = {
  // 异步获取导航栏
  getAsideList({ commit }, module) {
    setTimeout(() => {
      let key = module.toLowerCase()
      let data = state.allNavList[key] && state.allNavList[key].children
      commit('Set_Aside_List', data)
    }, 500)
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
