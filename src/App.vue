<template>
  <div id="app">
    <!-- 工具栏 -->
    <tool-boxes></tool-boxes>
    <!-- 核心画布区域 -->
    <custom-canvas></custom-canvas>
    <!-- 弹框区域 -->
    <modals></modals>
  </div>
</template>

<script>
import CustomCanvas from '@/components/CustomCanvas'
import ToolBoxes from '@/components/ToolBoxes'
import Modals from '@/components/Modals'
export default {
  name: 'App',
  components: {
    CustomCanvas,
    ToolBoxes,
    Modals
  }
}
</script>

<style>
#app {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f2f6f9;
}
</style>
