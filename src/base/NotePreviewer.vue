<template>
  <transition name="scale-in">
    <div class="note-previewer-container" :style="previewerStyle" v-show="showNotePreviewer">
      {{ noteContent }}
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  // note 预览 全局共享一个previewer
  name: 'NotePreviewer',
  data() {
    return {
      noteContent: '',
      previewerStyle: {},
      showNotePreviewer: false
    }
  },
  mounted() {
    this.bindEvents()
  },
  computed: {
    ...mapGetters(['minder'])
  },
  methods: {
    // 绑定监听事件
    bindEvents() {
      this.minder.on('shownoterequest', e => {
        console.log('shownoterequest:')
        if (this.showNotePreviewer) return false
        this.handlePreview(e.node, e.keyword)
      })
      this.minder.on('hidenoterequest', () => {
        console.log('hidenoterequest:')
        this.showNotePreviewer = false
      })
      const element = document.querySelector('.note-previewer-container')
      document.addEventListener('mousedown', this.handleClose)
      document.addEventListener('mousewheel', this.handleClose)
      document.addEventListener('DOMMouseScroll', this.handleClose)
      if (!element) return
      element.addEventListener('mousedown', this.handleStopPropagation)
      element.addEventListener('mousewheel', this.handleStopPropagation)
      element.addEventListener('DOMMouseScroll', this.handleStopPropagation)
    },
    // 取消监听事件
    offEvents() {
      const element = document.querySelector('.note-previewer-container')
      this.minder.off('shownoterequest')
      this.minder.off('hidenoterequest')
      document.removeEventListener('mousedown', this.handleClose)
      document.removeEventListener('mousewheel', this.handleClose)
      document.removeEventListener('DOMMouseScroll', this.handleClose)
      if (!element) return
      element.removeEventListener('mousedown', this.handleStopPropagation)
      element.removeEventListener('mousewheel', this.handleStopPropagation)
      element.removeEventListener('DOMMouseScroll', this.handleStopPropagation)
    },
    // 处理阻止冒泡
    handleStopPropagation(e) {
      e.stopPropagation()
    },
    // 处理关闭
    handleClose() {
      if (!this.previewLive) return
      this.showNotePreviewer = false
    },
    // 处理预览
    handlePreview(node) {
      const icon = node.getRenderer('NoteIconRenderer').getRenderShape()
      const b = icon.getRenderBox('screen')
      const note = node.getData('note') || ''

      this.$el.scrollTop = 0
      this.noteContent = note

      this.previewerStyle = {
        left: Math.round(b.left) + 'px',
        top: Math.round(b.bottom) + 10 + 'px'
      }

      this.showNotePreviewer = true
    }
  },
  beforeDestroy() {
    this.offEvents()
  }
}
</script>

<style scoped lang="less">
.note-previewer-container {
  position: fixed;
  padding: 5px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 0px 10px 0 #00000030;
}

.scale-in-enter,
.scale-in-leave-to {
  opacity: 0;
  transform: scale(0);
}
.scale-in-enter-to,
.scale-in-leave {
  opacity: 1;
  transform: scale(1);
}
.scale-in-leave-active,
.scale-in-enter-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
</style>
