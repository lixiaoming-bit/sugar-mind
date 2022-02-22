<template>
  <transition name="scale-in">
    <div class="navigator-container" :style="isCompact"></div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Navigator',
  filters: {},
  components: {},
  props: {},
  data() {
    return {
      paper: null,
      nodeThumb: null,
      connectionThumb: null,
      visibleRect: null,
      contentView: null,
      visibleView: null,
      pathHandler: null,
      dragging: false
    }
  },
  computed: {
    ...mapGetters(['minder', 'displayMode']),
    isCompact() {
      return {
        '--layout-bottom': this.displayMode === 'compact' ? '60px' : '80px'
      }
    }
  },
  watch: {},
  mounted() {
    this.initNavigator()
    this.bindEvents()
    this.updateContentView()
    this.updateVisibleView()
  },
  beforeDestroy() {
    this.offEvents()
  },
  methods: {
    // 绑定监听事件
    bindEvents() {
      this.minder.on('layout layoutallfinish', this.updateContentView)
      this.minder.on('viewchange', this.updateVisibleView)
    },
    // 取消绑定监听事件
    offEvents() {
      this.minder.off('layout layoutallfinish', this.updateContentView)
      this.minder.off('viewchange', this.updateVisibleView)
    },
    // 更新视图 内容区域
    updateContentView() {
      const view = this.minder.getRenderContainer().getBoundaryBox()

      this.contentView = view

      const padding = 30

      this.paper.setViewBox(
        view.x - padding - 0.5,
        view.y - padding - 0.5,
        view.width + padding * 2 + 1,
        view.height + padding * 2 + 1
      )

      const nodePathData = []
      const connectionThumbData = []

      this.minder.getRoot().traverse(node => {
        const box = node.getLayoutBox()
        this.pathHandler(nodePathData, box.x, box.y, box.width, box.height)
        if (node.getConnection() && node.parent && node.parent.isExpanded()) {
          connectionThumbData.push(node.getConnection().getPathData())
        }
      })

      this.paper.setStyle('background', this.minder.getStyle('background'))

      if (nodePathData.length) {
        this.nodeThumb.fill(this.minder.getStyle('root-background')).setPathData(nodePathData)
      } else {
        this.nodeThumb.setPathData(null)
      }

      if (connectionThumbData.length) {
        this.connectionThumb
          .stroke(this.minder.getStyle('connect-color'), '0.5%')
          .setPathData(connectionThumbData)
      } else {
        this.connectionThumb.setPathData(null)
      }

      this.updateVisibleView()
    },
    // 更新视图 可视化区域
    updateVisibleView() {
      this.visibleView = this.minder.getViewDragger().getView()
      this.visibleRect.setBox(this.visibleView.intersect(this.contentView))
    },
    // 创建导航器
    initNavigator() {
      const { kity } = window
      const element = document.querySelector('.navigator-container')
      this.paper = new kity.Paper(element)

      // 用两个路径来挥之节点和连线的缩略图
      this.nodeThumb = this.paper.put(new kity.Path())
      this.connectionThumb = this.paper.put(new kity.Path())

      // 表示可视区域的矩形
      this.visibleRect = this.paper.put(new kity.Rect(100, 100).stroke('#fda4af', '1%'))

      this.contentView = new kity.Box()
      this.visibleView = new kity.Box()

      // 增加特殊情况的处理 主题 天盘模式下
      this.pathHandler = this.getPathHandler(this.minder.getTheme())
      console.log('this.pathHandler: ', this.pathHandler)

      // 事件监听
      this.minder.on('themechange', e => {
        this.pathHandler = this.getPathHandler(e.theme)
      })

      this.paper.on('mousedown', e => {
        this.dragging = true
        this.moveView(e.getPosition('top'), 200)
        element.classList.add('grab')
      })

      this.paper.on('mousemove', e => {
        if (this.dragging) {
          this.moveView(e.getPosition('top'))
        }
      })

      window.addEventListener('mouseup', () => {
        this.dragging = false
        element.classList.remove('grab')
      })
    },
    // 移动视图
    moveView(center, duration) {
      let box = this.visibleView
      center.x = -center.x
      center.y = -center.y

      const viewMatrix = this.minder.getPaper().getViewPortMatrix()
      box = viewMatrix.transformBox(box)

      const targetPosition = center.offset(box.width / 2, box.height / 2)

      this.minder.getViewDragger().moveTo(targetPosition, duration)
    },
    // 获取天盘摸下的nodePathData
    getPathHandler(theme) {
      switch (theme) {
        case 'tianpan':
        case 'tianpan-compact':
          return function (nodePathData, x, y, width) {
            const r = width >> 1
            nodePathData.push('M', x, y + r, 'a', r, r, 0, 1, 1, 0, 0.01, 'z')
          }
        default: {
          return function (nodePathData, x, y, width, height) {
            nodePathData.push('M', x, y, 'h', width, 'v', height, 'h', -width, 'z')
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.navigator-container {
  position: fixed;
  width: 300px;
  height: 200px;
  bottom: var(--layout-bottom);
  right: 16px;
  box-shadow: 0 2px 16px 0 #00000011;
  border-radius: 6px;
  cursor: crosshair;
  transition: bottom 0.5s ease;
}
.grab {
  cursor: all-scroll;
}
</style>
