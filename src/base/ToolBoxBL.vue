<template>
  <transition name="slide-fade-bottom">
    <div class="tool-box-bottom-left-container" v-show="isShowComponent">
      <span class="text">字数</span>
      <span class="number">640</span>
      <span class="text">节点</span>
      <span class="number">100</span>
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
    ...mapGetters(['displayMode']),
    isShowComponent() {
      return this.displayMode !== 'pure'
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
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  margin: 20px 16px;
  font-size: 14px;
  padding: 3px 5px;
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
