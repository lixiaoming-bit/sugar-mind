<template>
  <!-- popover 显示在节点正下方 -->
  <div class="popover-container" v-if="popoverVisible && showingComponent" :style="popoverStyle">
    <div class="popover-arrow"></div>
    <!-- 容器 -->
    <component
      :is="showingComponent"
      @fix-position="onFixPosition"
      ref="showingComponent"
    ></component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as PopoverComponents from './popover/index'

// import { clickOutside, removeClickOutside } from '@/utils/click-outside'

export default {
  name: 'Popover',
  filters: {},
  components: {
    ...PopoverComponents
  },
  data() {
    return {
      popoverVisible: false,
      type: null,
      popoverStyle: {
        left: 0,
        top: 0
      }
    }
  },
  computed: {
    ...mapGetters(['minder']),
    // 正在渲染的组件
    showingComponent() {
      if (!this.type) return null
      const map = {
        label: 'Label'
      }
      return map[this.type]
    }
  },
  mounted() {
    this.bindEvents()
  },
  beforeDestroy() {
    this.minder.off('openpopoverrequest', this.initPopover)
    this.minder.off('viewchanged', this.hidePopover)
    this.minder.off('mousedown', this.hidePopover)
  },
  methods: {
    // 初始化弹窗
    initPopover(e = {}) {
      this.hidePopover()
      const selected = this.minder.getSelectedNode()
      if (!selected) return
      const { popoverType } = e
      this.type = popoverType || this.type
      this.popoverVisible = true
      this.showPopover()
    },
    // 显示弹窗(二次渲染)
    showPopover() {
      if (this.$refs.showingComponent) {
        this.setPosition()
      }
    },
    // 设置弹窗位置
    setPosition() {
      const node = this.minder.getSelectedNode()
      console.log('node: ', node)
      const style = this.$refs.showingComponent?.$el || {}
      const width = style.offsetWidth || 0
      // const height = style.offsetHeight || 0
      const box = node.getRenderBox('LabelRenderer')
      console.log('LabelRenderer: ', box)
      console.log('LabelRenderer: ', node.getContentBox())
      const left = Math.round(box.left) - Math.abs(box.width - width) / 2
      const top = Math.round(box.bottom) + 10
      this.popoverStyle = {
        left: left + 'px',
        top: top + 'px'
      }
      // 需要判断当前的popover 是否被页面遮住
      const dragger = this.minder.getViewDragger()
      let dx = 0
      let dy = 0
      if (left < 0) {
        dx = Math.abs(left) + 100
      }

      // if (top + height >= window.innerHeight) {
      //   dy = -Math.abs(top - window.innerHeight) - 100
      // }

      // if (top < 0) {
      //   dy = Math.abs(top) + 100
      // }

      // if (left + width >= window.innerWidth) {
      //   dx = -Math.abs(left - window.innerWidth) - 100
      // }

      const point = new window.kity.Point(dx, dy)
      console.log('point: ', point)

      dragger.move(point)
      this.popoverStyle.left = dx + left + 'px'
      // this.popoverStyle = {
      //   left: (dx || left) + 'px',
      //   top: (dy || top) + 'px'
      // }
    },
    // 重置弹窗位置
    hidePopover() {
      this.popoverStyle = {
        left: 0,
        top: 0
      }
      this.type = null
      this.popoverVisible = false
      this.offEvents()
    },
    // 监听组件初始化完成的重绘动作
    onFixPosition() {
      this.setPosition()
    },
    stopPropagation(e) {
      e.stopPropagation()
    },
    // 绑定按键
    bindEvents() {
      // this.minder.on('click', e => console.log(e))
      this.minder.on('openpopoverrequest', this.initPopover)
      // 在视图发生变化，或者鼠标点击时，隐藏弹窗
      this.minder.on('viewchanged mousedown resize', this.hidePopover)
      // 容器内部元素点击时，不隐藏弹窗
      const element = this.$el
      if (!element) return
      element.addEventListener('mousedown', this.stopPropagation)
      element.addEventListener('mousewheel', this.stopPropagation)
      element.addEventListener('DOMMouseScroll', this.stopPropagation)
    },
    // 取消绑定
    offEvents() {
      const element = this.$el
      if (!element) return
      element.removeEventListener('mousedown', this.stopPropagation)
      element.removeEventListener('mousewheel', this.stopPropagation)
      element.removeEventListener('DOMMouseScroll', this.stopPropagation)
    }
  }
}
</script>

<style scoped lang="less">
.popover-container {
  position: fixed;
  z-index: 1000;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 0px 5px #e4e4e4;
  // .popover-arrow {
  // width: 0;
  // height: 0;
  // border-bottom: 16px solid #f5f5f5;
  // border-right: 16px solid transparent;
  // border-left: 16px solid transparent;
  // }
  .popover-body {
  }
}
</style>
