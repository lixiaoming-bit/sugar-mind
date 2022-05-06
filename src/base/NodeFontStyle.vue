<template>
  <div class="node-font-style-container">
    <a-row type="flex" :gutter="[16, 16]">
      <!-- 设置字体 font-family -->
      <a-col :span="14">
        <a-select
          style="width: 100%"
          v-model="nodeFontStyle.fontFamily"
          @change="handleSelectFamilyChange"
        >
          <a-icon slot="suffixIcon" type="caret-down" />
          <a-select-opt-group label="中 - cn">
            <a-select-option :key="item.value" v-for="item in cnFontFamily">
              <span :style="item.style">{{ item.label }}</span>
            </a-select-option>
          </a-select-opt-group>

          <a-select-opt-group label="英 - en">
            <a-select-option :key="item.value" v-for="item in enFontFamily">
              <span :style="item.style">{{ item.label }}</span>
            </a-select-option>
          </a-select-opt-group>
        </a-select>
      </a-col>
      <!-- 设置字号 font-size -->
      <a-col :span="10">
        <a-select
          style="width: 100%"
          v-model="nodeFontStyle.fontSize"
          @change="handleSelectFontSizeChange"
        >
          <a-icon slot="suffixIcon" type="font-size" />
          <a-select-option :key="item.value" v-for="item in fontSize">
            <span :style="item.style">{{ item.label }}</span>
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <!-- 设置字体 color weight text-decoration clear-style -->
    <div class="font-icons-group">
      <div
        class="one-font-icon"
        v-for="(item, index) in fontStyleIcons"
        :key="item.icon"
        :class="{ 'is-active': checkIsActive(item) }"
      >
        <a-popover placement="top">
          <template slot="content">{{ item.title }}</template>
          <a-icon v-if="index" :type="item.icon" @click="handleChangeFontStyle(item)"></a-icon>
          <color-picker v-else @change="handleChangeFontColor" :value="color">
            <div class="choose-font-color">
              <a-icon :type="item.icon"></a-icon>
              <span :style="{ backgroundColor: color }"></span>
            </div>
          </color-picker>
        </a-popover>
      </div>
    </div>
    <!-- 设置text-align -->
    <div class="align-group">
      <a-radio-group :default-value="align" button-style="solid" @change="handleTextAlignChange">
        <a-radio-button :value="item.icon" v-for="item in fontAlignIcons" :key="item.title">
          <a-popover placement="top">
            <template slot="content">{{ item.title }}</template>
            <a-icon :type="item.icon"></a-icon>
          </a-popover>
        </a-radio-button>
      </a-radio-group>
    </div>
  </div>
</template>

<script>
import ColorPicker from './ColorPicker.vue'
import {
  CN_FONT_FAMILY,
  EN_FONT_FAMILY,
  FONT_SIZE,
  FONT_ALIGN_ICONS,
  generateFontIcons
} from '@/config'
import { mapGetters } from 'vuex'

export default {
  // 节点字体样式
  name: 'NodeFontStyle',
  components: {
    ColorPicker
  },
  data() {
    return {
      fontStyleIcons: [],
      color: '#ffffff',
      isBold: false,
      isItalic: false
    }
  },
  mounted() {
    this.setFontStyleIcons()
    this.minder.on('interactchange', () => {
      this.isBold = this.minder.queryCommandValue('bold') === 'bold'
      this.isItalic = this.minder.queryCommandValue('italic') === 'italic'
    })
  },
  activated() {
    this.color = this.nodeFontStyle.color || '#ffffff'
  },
  computed: {
    ...mapGetters(['macosCommandText', 'minder', 'nodeFontStyle']),
    cnFontFamily() {
      const target = CN_FONT_FAMILY.slice()
      return Array.from(target, item => {
        return {
          ...item,
          style: `font-family: ${item.value}`
        }
      })
    },
    enFontFamily() {
      const target = EN_FONT_FAMILY.slice()
      return Array.from(target, item => {
        return {
          ...item,
          style: `font-family: ${item.value}`
        }
      })
    },
    fontSize() {
      const target = FONT_SIZE.slice()
      return Array.from(target, item => {
        return {
          label: item,
          style: `font-size: ${item}px;line-height: ${item}px;`,
          value: item
        }
      })
    },
    fontAlignIcons() {
      return FONT_ALIGN_ICONS.slice()
    },
    // 检查是否被选中
    checkIsActive() {
      return item => {
        const value = this.minder.queryCommandValue(item.command)
        let result
        switch (item.icon) {
          case 'delete':
          case 'color':
            result = false
            break
          case 'bold':
            result = this.isBold
            break
          case 'italic':
            result = this.isItalic
            break
          default:
            result = value === item.command
        }
        return result
      }
    },
    align() {
      const value = this.minder.queryCommandValue('text-align')
      return value ? `align-${value}` : 'align-left'
    }
  },
  methods: {
    setFontStyleIcons() {
      this.fontStyleIcons = generateFontIcons(this.macosCommandText).slice()
    },
    // 设置字体family
    handleSelectFamilyChange(value) {
      this.minder.execCommand('fontfamily', value)
    },
    // 设置字体font-size
    handleSelectFontSizeChange(value) {
      this.minder.execCommand('fontsize', value)
    },
    // 设置当前选中的字体的样式
    handleChangeFontStyle(item) {
      this.minder.execCommand(item.command)
      this.setFontStyleIcons()
    },
    // 设置当前选中字体的颜色
    handleChangeFontColor({ hex8 }) {
      this.color = hex8
      this.minder.execCommand('color', hex8)
    },
    // 设置当前选中字体的居中
    handleTextAlignChange(e) {
      const direction = e.target.value.substr(6)
      this.minder.execCommand('text-align', direction)
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
  border-radius: 2px;
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
      color: var(--theme-color);
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
  .is-active {
    color: #0fa731;
  }
}
.align-group {
  margin-top: 16px;
}
.choose-font-color {
  position: relative;
  span {
    left: 50%;
    width: 14px;
    height: 4px;
    bottom: 6px;
    position: absolute;
    transform: translateX(-50%);
    border: 1px solid #000000;
  }
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
