<template>
  <div class="tool-box-bottom-right-container">
    <icon-font type="iconicon_common_mouse_r" class="option-one" />
    <icon-font type="iconicon_common_navigation1" class="option-one" />
    <icon-font type="iconicon_common_narrow2" class="option-one" />
    <span class="option-one">100%</span>
    <icon-font type="iconicon_common_enlarge1" class="option-one" />
    <icon-font type="iconicon_common_full-screen1" class="option-one" />
    <icon-font type="iconicon_smalltool_more" class="option-one" />
  </div>
</template>

<script>
export default {
  name: 'ToolBoxBR',
  filters: {},
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {},
  methods: {}
}
</script>

<style scoped lang="less">
.tool-box-bottom-right-container {
  position: fixed;
  bottom: 20px;
  right: 16px;
  width: 263px;
  height: 44px;
  padding: 0 8px;
  display: inline-flex;
  justify-content: space-around;
  align-items: center;
  background: hsla(0, 0%, 100%, 0.6);
  border-radius: 6px;
  .option-one {
    display: inline-block;
    font-size: 18px;
    transition: color 0.2s ease;
    cursor: pointer;

    &:nth-child(4) {
      font-size: 16px;
      cursor: inherit;
    }
    &:not(:nth-child(4)):hover {
      color: #12bb37;
      transition: color 0.2s ease;
    }
  }
}
</style>
