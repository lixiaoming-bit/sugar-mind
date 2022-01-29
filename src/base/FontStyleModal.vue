<template>
  <transition name="slide-fade-left">
    <div class="font-style-modal-container">
      <basic-modal title="字体样式">
        <template slot="content">123</template>
      </basic-modal>
    </div>
  </transition>
</template>

<script>
import BasicModal from './BasicModal'
export default {
  name: 'FontStyleModal',
  filters: {},
  components: { BasicModal },
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
.font-style-modal-container {
  position: fixed;
  right: 10px;
  bottom: 10px;
  width: 340px;
  top: 100px;
}
.slide-fade-left-enter-active {
  transition: all 0.25s linear;
}
.slide-fade-left-leave-active {
  transition: all 0.25s linear;
}
.slide-fade-left-enter,
.slide-fade-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
