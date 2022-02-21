import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    minder: {},
    minderZoom: 100,
    visibleModal: null,
    displayMode: 'normal' // compact | pure
  },
  mutations: {
    SET_MINDER(state, payload) {
      state.minder = payload
    },
    SET_MINDER_ZOOM(state, payload) {
      state.minderZoom = payload
    },
    SET_VISIBLE_MODAL(state, payload = null) {
      state.visibleModal = payload
    },
    SET_DISPLAY_MODE(state, payload = 'normal') {
      state.displayMode = payload
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
    },
    minderInfo(state) {
      const { minderZoom: zoom } = state
      return { zoom }
    },
    minder(state) {
      return state.minder
    }
  }
})
