<template>
  <div id="app">
    <!-- 工具栏 -->
    <tool-boxes></tool-boxes>
    <!-- 核心画布区域 -->
    <custom-canvas></custom-canvas>
  </div>
</template>

<script>
import CustomCanvas from '@/components/CustomCanvas'
import ToolBoxes from '@/components/ToolBoxes'
export default {
  name: 'App',
  components: {
    CustomCanvas,
    ToolBoxes
  }
}
</script>

<style>
#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f2f6f9;
}
</style>
