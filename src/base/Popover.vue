<template>
  <div class="popover-container" v-if="visible" @click.stop="hidePopover">
    <a-popover
      v-model="visible"
      placement="bottom"
      :destroy-tooltip-on-hide="true"
      @visibleChange="onVisibleChange"
    >
      <template slot="content">
        <component :is="componentId"></component>
      </template>
      <div class="popover-box" :style="boxStyle"></div>
    </a-popover>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as PopoverComponents from './popover/index'

const COMPONENT_MAP = {
  label: 'Label',
  Relationship: 'Relationship'
}

export default {
  name: 'Popover',
  filters: {},
  components: {
    ...PopoverComponents
  },
  props: {},
  data() {
    return {
      visible: false,
      componentId: null,
      type: null,
      boxStyle: {}
    }
  },
  computed: {
    ...mapGetters(['minder'])
  },
  watch: {},
  mounted() {
    this.bindEvents()
  },
  created() {},
  beforeDestroy() {
    this.offEvents()
  },
  methods: {
    // 绑定事件
    bindEvents() {
      this.minder.on('openpopoverrequest', this.initPopover)
      this.minder.on('viewchanged resize', this.hidePopover)
    },
    // 移除绑定事件
    offEvents() {},
    // 检测组件是否存在
    checkComponentAvailable() {
      this.componentId = COMPONENT_MAP[this.type]
      this.visible = !!this.componentId
    },
    // 初始化
    initPopover(e = {}) {
      const { popoverType, renderBox } = e
      this.type = popoverType || this.type
      this.box = renderBox || this.box
      const selected = this.minder.getSelectedNode()
      if (!selected && !this.box) return
      const box = this.box || selected.getRenderContainer().getRenderBox('screen')
      this.boxStyle = {
        left: box.x + 'px',
        top: box.y + 'px',
        width: box.width + 'px',
        height: box.height + 'px'
      }
      this.checkComponentAvailable()
    },
    // 关闭
    hidePopover() {
      this.visible = false
      this.componentId = null
      this.type = null
      this.box = null
    },
    onVisibleChange(visible) {
      if (!visible) {
        this.hidePopover()
      }
    }
  }
}
</script>

<style scoped lang="less">
.popover-container {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 10000;
}
.popover-box {
  position: absolute;
  visibility: hidden;
  z-index: -1;
}
</style>
