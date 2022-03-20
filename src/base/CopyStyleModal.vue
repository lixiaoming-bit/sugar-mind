<template>
  <div class="copy-style-container" v-if="isShowComponent">
    <a-alert
      message="样式已复制，请点击其他任意主题应用样式，点击空白处取消粘贴"
      banner
      class="alert"
    />
  </div>
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
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
  }
}
</style>
