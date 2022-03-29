import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

import app from './modules/app'

const store = {
  modules: {
    app
  },
  getters,
  state: {

  },
  mutations: {

  },
}


export default new Vuex.Store(store)
