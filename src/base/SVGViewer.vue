<template>
  <div class="svg-viewer-container">
    <svg
      v-if="type === 'minder'"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      viewBox="0 0 494 216"
      :style="{ background: source.backgroundColor }"
    >
      <path
        fill="none"
        :stroke="source.connectColor[index]"
        stroke-width="3"
        v-for="(connect, index) in source.connect"
        :d="connect"
        :key="connect"
      ></path>
      <path
        :fill="source.nodeFillColor[index]"
        stroke="none"
        v-for="(n, index) in source.node"
        :d="n"
        :key="n"
      ></path>
    </svg>
  </div>
</template>
<script>
export default {
  name: 'SVGViewer',
  props: {
    source: {
      type: Object,
      default: () => {
        return {
          backgroundColor: '',
          connect: [],
          node: [],
          connectColor: [],
          nodeFillColor: []
        }
      }
    },
    type: {
      type: String,
      default: 'minder'
    }
  }
}
</script>
<style lang="less" scoped>
.svg-viewer-container {
  cursor: pointer;
  pointer-events: none;
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
}
</style>
