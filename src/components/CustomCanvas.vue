<template>
  <div class="custom-canvas-container"></div>
</template>

<script>
/* eslint-disable no-unused-vars */

import 'hotbox-minder/hotbox.css'
import hotbox from 'hotbox-minder/hotbox'
import kity from 'kity'
// import kityminder from 'kityminder-core'
import '../core/kityminder.core'
import '../core/kityminder.css'
console.log('window', window.kityminder)
import KMEditor from '../editor/editor'
export default {
  name: 'CustomCanvas',
  filters: {},
  components: {},
  props: {},
  data() {
    return {
      editor: null
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.init()
  },
  created() {},
  methods: {
    init() {
      const el = document.querySelector('.custom-canvas-container')
      this.editor = new KMEditor(el)
      // this.editor = new window.kityminder.Minder()
      // this.editor.renderTo(el)
      // this.editor.setTheme(null)
      // this.editor.select(this.editor.getRoot(), true)
      // this.editor.execCommand('text', '中心主题')
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
