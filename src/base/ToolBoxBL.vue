<template>
  <transition name="slide-fade-bottom">
    <div class="tool-box-bottom-left-container" v-if="isShowComponent">
      <span class="text">节点</span>
      <span class="number">{{ nodeLength }}</span>
      <a-divider type="vertical"></a-divider>
      <span class="text">选中</span>
      <span class="number" style="color: #11bb37">{{ selectedNodeLength }}</span>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ToolBoxBL',
  filters: {},
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['displayMode', 'minder']),
    isShowComponent() {
      return this.displayMode !== 'pure'
    },
    nodeLength() {
      return this.minder.getAllNode().length
    },
    selectedNodeLength() {
      return this.minder.getSelectedNodes().length
    }
  },
  watch: {},
  mounted() {},
  created() {},
  methods: {}
}
</script>

<style scoped lang="less">
.tool-box-bottom-left-container {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 12;
  display: flex;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  margin: 20px 16px;
  font-size: 14px;
  padding: 3px 5px;
  align-items: center;
  .text {
    color: #555;
    &:nth-child(3) {
      padding-left: 12px;
    }
  }
  .number {
    color: #222;
    padding-left: 6px;
  }
}

.slide-fade-bottom-enter-active {
  transition: all 0.25s linear;
}
.slide-fade-bottom-leave-active {
  transition: all 0.25s linear;
}
.slide-fade-bottom-enter,
.slide-fade-bottom-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
