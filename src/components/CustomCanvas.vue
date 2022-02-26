<template>
  <div class="custom-canvas-container">
    <!-- 全局备注预览器 -->
    <note-previewer v-if="isShowChildComponent"></note-previewer>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */

import 'hotbox-minder/hotbox.css'
import hotbox from 'hotbox-minder/hotbox'
import kity from 'kity'
// import kityminder from 'kityminder-core'
import '../core/kityminder'
import '../core/kityminder.css'
import KMEditor from '../editor/editor'
import { mapGetters, mapMutations } from 'vuex'

import NotePreviewer from '@/base/NotePreviewer'
export default {
  name: 'CustomCanvas',
  components: {
    NotePreviewer
  },
  data() {
    return {
      editor: null
    }
  },
  computed: {
    ...mapGetters(['displayMode']),
    isShowChildComponent() {
      return this.displayMode === 'normal'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapMutations(['SET_MINDER_ZOOM', 'SET_MINDER', 'SET_HISTORY', 'SET_DISPLAY_MODE']),
    init() {
      const el = document.querySelector('.custom-canvas-container')
      this.editor = new KMEditor(el)
      const { minder, history } = this.editor
      this.SET_MINDER(minder)
      this.SET_HISTORY(history)
      this.SET_DISPLAY_MODE('normal')
      minder.on('zoom', event => {
        const { zoom } = event
        this.SET_MINDER_ZOOM(zoom)
      })
    }
  }
}
</script>

<style scoped lang="less">
.custom-canvas-container {
  z-index: 1;
  // padding: 80px 80px 40px 16px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
