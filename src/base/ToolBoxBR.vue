<template>
  <transition name="slide-fade-bottom">
    <div class="tool-box-bottom-right-container" v-if="isShowComponent" :style="layout">
      <a-popover placement="top">
        <template slot="content">{{ layoutText }}，点击切换布局</template>
        <icon-font type="iconicon_common_mouse_l" class="option-one" @click="toggleLayout" />
      </a-popover>
      <a-popover placement="top">
        <template slot="content">导航器</template>
        <icon-font type="iconicon_common_navigation1" class="option-one" @click="toggleNavigator" />
      </a-popover>
      <a-popover placement="top">
        <template slot="content">缩小</template>
        <icon-font type="iconicon_common_narrow2" class="option-one" @click="handleZoomOut" />
      </a-popover>
      <a-popover placement="top">
        <template slot="content">双击空白或点击此处，回到视图中心</template>
        <span class="option-one zoom-value" @click="handleCamera">{{ minderZoomValue }}</span>
      </a-popover>
      <a-popover placement="top">
        <template slot="content">放大</template>
        <icon-font type="iconicon_common_enlarge1" class="option-one" @click="handleZoomIn" />
      </a-popover>
      <a-popover placement="top">
        <template slot="content">沉浸模式</template>
        <icon-font
          type="iconicon_common_full-screen1"
          class="option-one"
          @click="handleFullscreen"
        />
      </a-popover>
      <a-popover placement="topLeft">
        <template slot="content">疑问帮助&偏好设置</template>

        <a-dropdown :trigger="['click']">
          <icon-font type="iconicon_smalltool_more" class="option-one" />
          <a-menu slot="overlay">
            <!-- <a-menu-item>新手入门</a-menu-item> -->
            <a-menu-item @click="handleShortcut">快捷键查看</a-menu-item>
            <!-- <a-menu-item>偏好设置</a-menu-item> -->
          </a-menu>
        </a-dropdown>
      </a-popover>
      <transition name="scale-in">
        <navigator v-if="isShowNavigator"></navigator>
      </transition>
    </div>
  </transition>
</template>

<script>
import screenfull from 'screenfull'

import { mapGetters, mapMutations } from 'vuex'
import Navigator from './Navigator'
export default {
  name: 'ToolBoxBR',
  components: {
    Navigator
  },
  computed: {
    ...mapGetters(['isShowComponent', 'isCompact', 'minder', 'visibleModal']),
    minderZoomValue() {
      return this.minder._zoomValue + '%'
    },
    layout() {
      return {
        '--layout-height': this.isCompact ? '30px' : '45px'
      }
    },
    layoutText() {
      return this.isCompact ? '迷你布局' : '普通布局'
    },
    isShowNavigator() {
      return this.visibleModal === 'navigator'
    }
  },
  methods: {
    ...mapMutations(['SET_DISPLAY_MODE', 'SET_VISIBLE_MODAL']),
    // 处理疑问帮助，偏好设置
    // 切换手柄
    toggleLayout() {
      const layout = this.isCompact ? 'normal' : 'compact'
      this.SET_DISPLAY_MODE(layout)
    },
    // 放大
    handleZoomIn() {
      this.minder.execCommand('zoomin')
    },
    // 缩小
    handleZoomOut() {
      this.minder.execCommand('zoomout')
    },
    // 回到页面
    handleCamera() {
      this.minder.execCommand('camera', this.minder.getRoot(), 600)
    },
    // 切换导航器显示
    toggleNavigator() {
      this.SET_VISIBLE_MODAL('navigator')
    },
    // 快捷键查看
    handleShortcut() {
      this.SET_VISIBLE_MODAL('ShortcutModal')
    },
    // 设置全屏
    handleFullscreen() {
      if (screenfull.isEnabled) {
        screenfull.toggle()
      }
    }
  }
}
</script>

<style scoped lang="less">
.tool-box-bottom-right-container {
  position: fixed;
  bottom: 20px;
  right: 16px;
  width: 263px;
  height: var(--layout-height);
  transition: height 0.5s ease;
  padding: 0 8px;
  user-select: none;
  display: inline-flex;
  justify-content: space-around;
  align-items: center;
  background: hsla(0, 0%, 100%, 0.6);
  border-radius: 6px;
  box-shadow: 0 2px 16px 0 #0000000f;
  .option-one {
    display: inline-block;
    font-size: 18px;
    transition: color 0.2s ease;
    cursor: pointer;

    &:nth-child(4) {
      font-size: 16px;
      cursor: inherit;
    }
    &:not(:nth-child(4)):hover {
      color: var(--theme-color);
      transition: color 0.2s ease;
    }
  }
  .zoom-value {
    font-size: 16px;
    cursor: pointer;
    min-width: 44px;
    display: inline-block;
    text-align: center;
    user-select: none;
  }
}

.slide-fade-bottom-enter-active {
  transition: all 0.25s linear;
}
.slide-fade-bottom-leave-active {
  transition: all 0.25s linear;
}
.slide-fade-bottom-enter,
.slide-fade-bottom-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.scale-in-enter,
.scale-in-leave-to {
  opacity: 0;
  transform: scale(0);
}
.scale-in-enter-to,
.scale-in-leave {
  opacity: 1;
  transform: scale(1);
}
.scale-in-leave-active,
.scale-in-enter-active {
  transition: transform 0.25s ease, opacity 0.25s ease, height 0.25s ease;
}
</style>
