import { getBaseUserInfo } from '@/api/common'
import { getCompanyUnlockStat } from '@/api/dashboard'
const state = {
  eosUserInfo: null,
  baseUserInfo: null,
  unlockStatInfo: null,
  isYunfuLogin: false,
}
const mutations = {
  SET_EOS_USER_INFO: (state, val) => {
    state.eosUserInfo = val
  },
  SET_BASE_USER_INFO: (state, val) => {
    state.baseUserInfo = val
  },
  /**设置用户解锁信息 */
  SET_Unlock_Stat: (state, val) => {
    state.unlockStatInfo = val
  },
  Set_Yunfu_Login_Status: (state, val) => {
    state.isYunfuLogin = val
  },
}

const actions = {
  /**设置EOS用户信息 */
  setEosUserInfo({ commit }, val) {
    commit('SET_EOS_USER_INFO', val)
  },
  /**设置基础用户信息 */
  /* eslint-disable-next-line no-unused-vars */
  async setBaseUserInfo({ commit }, val) {
    let baseUserInfoRes = await getBaseUserInfo()
    if (baseUserInfoRes.code === '0') {
      commit('SET_BASE_USER_INFO', baseUserInfoRes.data)
      if (baseUserInfoRes.data.authenticated === 1) {
        let unlockStatRes = await getCompanyUnlockStat()
        commit('SET_Unlock_Stat', unlockStatRes.data)
      }
    }
    return baseUserInfoRes
  },
  /**记录用户云蝠智能登录状态 */
  setYunfuLoginStatus({ commit }, val) {
    commit('Set_Yunfu_Login_Status', val)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
