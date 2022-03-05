<template>
  <div class="basic-modal-container">
    <div class="basic-modal-header">
      <div class="basic-modal-header-title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="basic-modal-header-icon" @click="handleClose">
        <a-icon type="close"></a-icon>
      </div>
    </div>
    <div class="basic-modal-body">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'BasicModal',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapMutations(['SET_VISIBLE_MODAL']),
    // 关闭
    handleClose() {
      this.SET_VISIBLE_MODAL()
    }
  }
}
</script>

<style scoped lang="less">
.basic-modal-container {
  user-select: none;
  height: 100%;
  width: 100%;
  z-index: 1000;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0px 0px 5px #f2f3f5;
  .basic-modal-header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      height: 1px;
      background-color: #e8e8e8;
      bottom: 0;
      left: 16px;
      right: 16px;
    }
    &-title {
      font-size: 14px;
    }
    &-icon {
      cursor: pointer;
    }
  }
  .basic-modal-body {
    height: calc(100% - 50px);
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
