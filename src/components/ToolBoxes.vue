<template>
  <div class="tool-boxes-container">
    <!-- 工具栏 上-左 -->
    <tool-box-t-l></tool-box-t-l>
    <!-- 工具栏 上-中 -->
    <tool-box-t-c></tool-box-t-c>
    <!-- 工具栏 上-右 -->
    <tool-box-t-r></tool-box-t-r>
    <!-- 工具栏 中-右 -->
    <tool-box-m-r></tool-box-m-r>
    <!-- 工具栏 下-左 -->
    <tool-box-b-l></tool-box-b-l>
    <!-- 工具栏 下-右 -->
    <tool-box-b-r></tool-box-b-r>
  </div>
</template>

<script>
import ToolBoxTL from '@/base/ToolBoxTL'
import ToolBoxTC from '@/base/ToolBoxTC'
import ToolBoxTR from '@/base/ToolBoxTR'
import ToolBoxMR from '@/base/ToolBoxMR'
import ToolBoxBL from '@/base/ToolBoxBL'
import ToolBoxBR from '@/base/ToolBoxBR'
import { mapGetters } from 'vuex'

export default {
  name: 'ToolBoxes',
  components: {
    ToolBoxTL,
    ToolBoxTC,
    ToolBoxTR,
    ToolBoxMR,
    ToolBoxBL,
    ToolBoxBR
  },
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['displayMode'])
  },
  watch: {},
  mounted() {},
  created() {},
  methods: {}
}
</script>

<style scoped lang="less">
.tool-boxes-container {
  // height: 100vh;
  // width: 100vw;
  position: fixed;
  z-index: 2;
}
</style>
<style lang="css">
.ant-popover-inner-content {
  padding: 5px 10px;
}
</style>
