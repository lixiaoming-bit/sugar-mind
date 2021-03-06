<template>
  <transition name="slide-fade-left">
    <div class="theme-style-modal-container">
      <basic-modal title="配色">
        <template slot="content">
          <div class="theme-style-wrapper" v-for="(panel, i) in colorsPanel" :key="panel.key">
            <div class="theme-style-title">
              <div class="left">{{ panel.title }}</div>
              <a-icon
                :type="!panel.visible ? 'down' : 'up'"
                class="right"
                @click="handleClick(panel, i)"
              ></a-icon>
            </div>
            <a-row type="flex" align="middle" :gutter="[8, 8]" v-if="!panel.visible">
              <a-col
                :span="4"
                v-for="item in panel.thumbColors"
                :key="item.name"
                class="thumb-color"
                @click="handleSelectTheme(item)"
                :class="{ 'is-active': selectedTheme === item.name }"
              >
                <div :style="{ background: item.background }"></div>
              </a-col>
            </a-row>
            <a-row type="flex" align="middle" :gutter="[16, 16]" v-else>
              <a-col
                :span="12"
                v-for="(skeleton, index) in panel.skeleton"
                :key="skeleton.type + index"
                @click="handleSelectTheme(skeleton)"
                :class="{ 'is-active': selectedTheme === skeleton.name }"
              >
                <svg-viewer :type="skeleton.type" :source="skeleton"></svg-viewer>
              </a-col>
            </a-row>
          </div>
        </template>
      </basic-modal>
    </div>
  </transition>
</template>

<script>
import BasicModal from './BasicModal'
import SvgViewer from './SVGViewer'
import { COLORS_PANEL } from '@/config/paths'
import { mapGetters } from 'vuex'
export default {
  name: 'ThemeStyleModal',
  components: {
    BasicModal,
    SvgViewer
  },
  data() {
    return {
      expandedKey: undefined,
      selectedTheme: null,
      colorsPanel: []
    }
  },
  computed: {
    ...mapGetters(['minder'])
  },
  activated() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.colorsPanel = Array.from(COLORS_PANEL, item => {
        delete item.visible
        return item
      })

      const theme = this.minder.getTheme().replace('-compact', '')
      this.selectedTheme = theme
    },
    // 展开、关闭
    handleClick(panel, index) {
      // 关闭之前打开的面板
      if (typeof this.expandedKey === 'number') {
        this.$set(this.colorsPanel, this.expandedKey, {
          ...this.colorsPanel[this.expandedKey],
          visible: false
        })
      }
      this.expandedKey = index
      panel.visible = !panel.visible
      this.$set(this.colorsPanel, index, panel)
    },
    // 选择主题
    handleSelectTheme({ name }) {
      this.selectedTheme = name
      this.minder.execCommand('theme', name)
    }
  }
}
</script>

<style scoped lang="less">
.theme-style-modal-container {
  position: fixed;
  right: 10px;
  bottom: 80px;
  width: 340px;
  top: 100px;
  z-index: 2;
  box-shadow: 0 2px 16px 0 #0000000f;
  .theme-style-wrapper {
    margin: 16px 16px;
    .theme-style-title {
      display: flex;
      position: relative;
      align-items: center;
      padding-bottom: 16px;
      cursor: pointer;
      .left {
        flex: 1;
      }
      .right {
        padding: 5px;
        font-size: 14px;
        text-align: right;
        border-radius: 4px;
        &:hover {
          background-color: #f2f3f5c4;
        }
      }
    }
    .thumb-color {
      border-radius: 8px;
      div {
        cursor: pointer;
        height: 46px;
        border-radius: 8px;
        box-shadow: 0px 0px 5px #cfcfcf;
      }
      border: 1px solid transparent;
      box-sizing: border-box;
      &:hover {
        border-color: #e8e8e8;
      }
    }
  }
}
.is-active {
  border-color: var(--theme-color) !important;
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
