<template>
  <transition name="slide-fade-top">
    <div class="copy-style-container" v-if="isShowComponent">
      <a-alert message="点击主题，粘贴样式，点任意空白处取消" banner class="alert" />
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CopyStyleModal',
  computed: {
    ...mapGetters(['isShowComponent'])
  }
}
</script>

<style scoped lang="less">
.copy-style-container {
  text-align: center;
  .alert {
    z-index: 2;
    top: 100px;
    width: auto;
    margin: 0 auto;
    background: #ffffff;
    display: inline-block;
  }
}

.slide-fade-top-enter-active {
  transition: all 0.25s linear;
}
.slide-fade-top-leave-active {
  transition: all 0.25s linear;
}
.slide-fade-top-enter,
.slide-fade-top-leave-to {
  transform: translate(-50%, -100%);
  opacity: 0;
}
</style>
