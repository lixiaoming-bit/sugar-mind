<template>
  <div class="node-font-style-container">
    <a-row type="flex" :gutter="[16, 16]">
      <a-col :span="14">
        <a-select style="width: 100%">
          <a-icon slot="suffixIcon" type="caret-down" />
          <a-select-opt-group label="中 - cn">
            <a-select-option :key="item.value" v-for="item in cnFontFamily">
              <span :style="item.value">{{ item.label }}</span>
            </a-select-option>
          </a-select-opt-group>

          <a-select-opt-group label="英 - en">
            <a-select-option :key="item.value" v-for="item in enFontFamily">
              <span :style="item.value">{{ item.label }}</span>
            </a-select-option>
          </a-select-opt-group>
        </a-select>
      </a-col>
      <a-col :span="10">
        <a-select style="width: 100%">
          <a-icon slot="suffixIcon" type="font-size" />
          <a-select-option :key="item.value" v-for="item in fontSize">
            <span :style="item.value">{{ item.label }}</span>
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <div class="font-icons-group">
      <div class="one-font-icon" v-for="(item, index) in fontStyleIcons" :key="item.icon">
        <a-popover placement="top">
          <template slot="content">{{ item.title }}</template>
          <a-icon :type="item.icon" v-if="index"></a-icon>
          <color-picker v-else>
            <a-icon :type="item.icon"></a-icon>
          </color-picker>
        </a-popover>
      </div>
    </div>
    <div class="align-group">
      <a-radio-group default-value="align-left" button-style="solid">
        <a-radio-button :value="item.icon" v-for="item in fontAlignIcons" :key="item.title">
          <a-popover placement="top">
            <template slot="content">{{ item.title }}</template>
            <a-icon :type="item.icon"></a-icon>
          </a-popover>
        </a-radio-button>
      </a-radio-group>
    </div>
    <!-- <div class="font-icons-group align-group">

      <div class="one-font-icon" v-for="item in fontAlignIcons" :key="item.icon">
       
      </div>
    </div> -->
  </div>
</template>

<script>
import ColorPicker from './ColorPicker.vue'
import {
  CN_FONT_FAMILY,
  EN_FONT_FAMILY,
  FONT_SIZE,
  generateFontIcons,
  FONT_ALIGN_ICONS
} from '@/config'

export default {
  // 节点字体样式
  name: 'NodeFontStyle',
  components: {
    ColorPicker
  },
  data() {
    return {
      colors: '#000000'
    }
  },
  computed: {
    cnFontFamily() {
      return CN_FONT_FAMILY.slice()
    },
    enFontFamily() {
      return EN_FONT_FAMILY.slice()
    },
    fontSize() {
      const target = FONT_SIZE.slice()
      return Array.from(target, item => {
        return {
          label: item,
          value: `font-size: ${item}px;line-height: ${item}px;`
        }
      })
    },
    fontStyleIcons() {
      return generateFontIcons().slice()
    },
    fontAlignIcons() {
      return FONT_ALIGN_ICONS.slice()
    }
  }
}
</script>

<style scoped lang="less">
.font-icons-group {
  width: 100%;
  height: 32px;
  display: flex;
  cursor: pointer;
  margin-top: 16px;
  border-radius: 6px;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
  border: 1px solid #d9d9d9;
  // overflow: hidden;
  .one-font-icon {
    flex: 1;
    color: #000000a6;
    font-size: 16px;
    line-height: 30px;
    text-align: center;
    box-sizing: border-box;
    position: relative;
    &:hover {
      color: #0fa731;
    }
    &:not(:last-child)::after {
      content: '';
      top: 50%;
      right: 0;
      width: 1px;
      height: 1em;
      position: absolute;
      transform: translateY(-50%);
      background-color: #e9e9e9;
    }
  }
}
.align-group {
  margin-top: 16px;
}
</style>
<style lang="less">
.node-font-style-container {
  margin-top: 16px;
  .ant-select-selection-selected-value {
    span {
      font-size: 14px !important;
      line-height: 22px !important;
    }
  }
  .ant-radio-button-wrapper {
    height: 30px;
  }
}
</style>
