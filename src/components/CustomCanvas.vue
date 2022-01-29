<template>
  <div class="custom-canvas-container" @click="handleClick"></div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'CustomCanvas',
  filters: {},
  components: {},
  props: {},
  data() {
    return {
      target: 'normal'
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {},
  methods: {
    ...mapMutations(['SET_DISPLAY_MODE']),
    handleClick() {
      if (this.target === 'pure') {
        this.target = 'normal'
      } else {
        this.target = 'pure'
      }
      this.SET_DISPLAY_MODE(this.target)
    }
  }
}
</script>

<style scoped lang="less">
.custom-canvas-container {
  z-index: 1;
  padding: 80px 80px 40px 16px;
}
</style>
