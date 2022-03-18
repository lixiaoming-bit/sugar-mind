import Vue from 'vue'
import Vuex from 'vuex'
import { getBrowserType } from '@/utils'
Vue.use(Vuex)

import { NODE_FONT_STYLE_SETTING } from '@/config'

export default new Vuex.Store({
  state: {
    minder: {},
    nodeFontStyle: { ...NODE_FONT_STYLE_SETTING },
    minderZoom: 100,
    visibleModal: null,
    displayMode: 'pure' // compact | pure
  },
  mutations: {
    SET_MINDER(state, payload) {
      state.minder = payload
    },
    SET_MINDER_ZOOM(state, payload) {
      state.minderZoom = payload
    },
    SET_VISIBLE_MODAL(state, payload = null) {
      payload = state.visibleModal === payload ? null : payload
      state.visibleModal = payload
    },
    SET_DISPLAY_MODE(state, payload = 'normal') {
      state.displayMode = payload
    },
    SET_NODE_STYLE(state, payload = NODE_FONT_STYLE_SETTING) {
      state.nodeFontStyle = payload
    }
  },
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
    },
    nodeFontStyle(state) {
      return state.nodeFontStyle
    },
    isShowComponent(state) {
      return state.displayMode !== 'pure'
    },
    isCompact(state) {
      return state.displayMode === 'compact'
    },
    macosCommandText() {
      const { system } = getBrowserType()
      return system === 'macos' ? 'Cmd' : 'Ctrl'
    },
    macosOptionText() {
      const { system } = getBrowserType()
      return system === 'macos' ? 'Option' : 'Alt'
    }
  }
})
