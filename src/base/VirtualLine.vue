<template>
  <div class="virtual-line-container" @mousedown="handleMouseDown" v-if="isShowComponent"></div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  // 虚拟横向滚动条
  name: 'VirtualLine',
  data() {
    return {
      isDragging: false
    }
  },
  computed: {
    ...mapGetters(['isShowComponent', 'minder'])
  },
  mounted() {},
  created() {},
  methods: {
    // 处理鼠标点击事件
    handleMouseDown(e) {
      let isDragging = true
      const { clientX: x } = e
      document.onmousemove = e1 => {
        const { clientX: x1 } = e1
        if (!isDragging) return
        console.log(x1 - x)
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        isDragging = false
      }
      console.log(this.minder.getViewDragger().getView())
    }
    // 移动事件
    // 移动结束事件
  }
}
</script>

<style scoped lang="less">
.virtual-line-container {
  position: fixed;
  bottom: 5px;
  width: 100% / 3;
  height: 7px;
  background-color: #f2f3f5;
  border-radius: 100px;
  z-index: 12;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  transition: all 0.25s ease;
  &:hover {
    background-color: #e8e8e8;
    transition: all 0.25s ease;
  }
}
</style>
