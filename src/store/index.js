import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    visibleModal: null,
    displayMode: 'normal' // compact | pure
  },
  mutations: {
    SET_VISIBLE_MODAL(state, payload = null) {
      state.visibleModal = payload
    }
  },
  actions: {},
  modules: {},
  getters: {
    visibleModal(state) {
      return state.visibleModal
    },
    displayMode(state) {
      return state.displayMode
    }
  }
})
