<template>
  <div class="basic-modal-container" v-if="visible">
    <div class="basic-modal-header">
      <div class="basic-modal-header-title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="basic-modal-header-icon">
        <a-icon type="close"></a-icon>
      </div>
    </div>
    <div class="basic-modal-body">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasicModal',
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="less">
.basic-modal-container {
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0px 0px 5px #f2f3f5;
  .basic-modal-header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #eeeeee;
    &-title {
      font-size: 14px;
    }
  }
  .basic-modal-body {
    max-height: 700px;
    overflow-y: auto;
    overflow: hidden;
  }
}
</style>
