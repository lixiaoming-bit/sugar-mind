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
import { canvas2watermark } from '@/utils'
import ColorPicker from './ColorPicker'
import { mapGetters } from 'vuex'

const DEFAULT_MARK = '请输入水印文字'

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
  activated() {
    this.color = this.color || this.minder.getStyle('background') || '#fffffff'
  },
  methods: {
    // 设置选中
    handleCheckboxChange(selectedKeys) {
      const selectedKey = selectedKeys.pop()
      this.selectedKeys = selectedKey ? [selectedKey] : []

      if (!selectedKey) {
        const background = '#ffffff'
        this.minder.setBackground(background)
        return
      }

      if (selectedKey === 'watermark') {
        const base64 = canvas2watermark(DEFAULT_MARK)
        const background = `#ffffff url(${base64}) repeat center center`
        this.minder.setBackground(background)
        return
      }
      if (selectedKey === 'custom') {
        this.minder.setBackground(this.color)
        return
      }
      // TODO: 处理图片的情况
      if (selectedKey === 'url') {
        const background = `#ffffff url() repeat center center`
        this.minder.setBackground(background)
        return
      }
    },
    // 设置水印
    handleWatermarkChange() {
      const value = this.watermark || DEFAULT_MARK
      if (this.selectedKeys.includes('watermark')) {
        const base64 = canvas2watermark(value)
        const background = `#ffffff url(${base64}) repeat center center`
        this.minder.setBackground(background)
      }
    },
    // 设置背景颜色
    handleColorChange(value) {
      this.color = value.hex8
      if (this.selectedKeys.includes('custom')) {
        const background = this.color
        this.minder.setBackground(background)
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
