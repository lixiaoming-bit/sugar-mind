<template>
  <div class="canvas-background-container">
    <a-checkbox-group @change="handleCheckboxChange" v-model="selectedKeys">
      <a-row type="flex" align="middle" :gutter="[16, 16]">
        <a-col :span="2"><a-checkbox value="watermark" /></a-col>
        <a-col :span="6">水印文字</a-col>
        <a-col :span="16">
          <a-input
            placeholder="请输入文字（14个以内）"
            v-model.trim="watermark"
            @change="handleWatermarkChange"
          ></a-input>
        </a-col>
        <a-col :span="2"><a-checkbox value="custom" /></a-col>
        <a-col :span="6">背景颜色</a-col>
        <a-col :span="16">
          <color-picker :value="color" @change="handleColorChange"></color-picker>
        </a-col>
      </a-row>
    </a-checkbox-group>
  </div>
</template>

<script>
import ColorPicker from './ColorPicker'
import { mapGetters } from 'vuex'

export default {
  name: 'CanvasBackground',
  filters: {},
  components: {
    ColorPicker
  },
  props: {},
  data() {
    return {
      selectedKeys: [],
      watermark: '',
      color: ''
    }
  },
  computed: {
    ...mapGetters(['minder'])
  },
  mounted() {},
  activated() {
    this.color = this.color || this.minder.getStyle('background') || '#fffffff'
  },
  methods: {
    // 设置水印内容
    setContent(value = '') {
      this.minder.getWatermark().setContent(value)
      console.log('this.minder.getWatermark(): ', this.minder.getWatermark())
    },
    // 设置选中
    handleCheckboxChange(selectedKeys) {
      if (selectedKeys.includes('watermark')) {
        const value = this.watermark || '这是一个测试水印'
        this.setContent(value)
      } else {
        this.setContent()
      }

      const container = this.minder.getRenderTarget()

      const targetColor = selectedKeys.includes('custom')
        ? this.color
        : this.minder.getStyle('background') || '#fffffff'
      if (container) {
        container.style.background = targetColor
      }
    },
    // 设置水印
    handleWatermarkChange() {
      const value = this.watermark || '这是一个测试水印'
      this.setContent(value)
    },
    // 设置背景颜色
    handleColorChange(value) {
      this.color = value.hex8
      if (this.selectedKeys.includes('custom')) {
        const container = this.minder.getRenderTarget()
        if (container) {
          container.style.background = this.color
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.canvas-background-container {
  margin-top: 16px;
}
</style>
