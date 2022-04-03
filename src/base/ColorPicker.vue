<template>
  <div class="color-picker-container">
    <a-popover placement="bottomLeft" :trigger="['click']" :get-popup-container="getPopupContainer">
      <template slot="content">
        <sketch-picker :value="value" @input="handleChangeColor" />
      </template>
      <slot>
        <div class="color-picker" :style="{ backgroundColor: value }"></div>
      </slot>
    </a-popover>
  </div>
</template>

<script>
export default {
  name: 'ColorPicker',
  props: {
    value: {
      type: String,
      default: '#000000'
    }
  },
  methods: {
    handleChangeColor(value) {
      this.$emit('change', value)
    },
    getPopupContainer() {
      return this.$el
      // return document.querySelector('.color-picker-container')
    }
  }
}
</script>

<style lang="less">
.color-picker-container {
  .ant-popover-inner-content {
    padding: 0;
  }
  .vc-sketch {
    background: none;
    border-radius: none;
    box-shadow: none;
  }
  .color-picker {
    width: 100%;
    height: 30px;
    cursor: pointer;
    border-radius: 2px;
    box-sizing: border-box;
    border: 1px solid #d9d9d9;
  }
}
</style>
