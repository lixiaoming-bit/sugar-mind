<template>
  <transition name="slide-fade-bottom">
    <div class="tool-box-bottom-right-container" v-show="isShowComponent" :style="isCompact">
      <a-popover placement="top">
        <template slot="content">点击图标，切换左右键拖动</template>
        <icon-font type="iconicon_common_mouse_r" class="option-one" />
      </a-popover>
      <a-popover placement="top">
        <template slot="content">导航器</template>
        <icon-font type="iconicon_common_navigation1" class="option-one" />
      </a-popover>
      <a-popover placement="top">
        <template slot="content">缩小</template>
        <icon-font type="iconicon_common_narrow2" class="option-one" />
      </a-popover>
      <span class="option-one">100%</span>
      <a-popover placement="top">
        <template slot="content">放大</template>
        <icon-font type="iconicon_common_enlarge1" class="option-one" />
      </a-popover>
      <a-popover placement="top">
        <template slot="content">全屏</template>
        <icon-font type="iconicon_common_full-screen1" class="option-one" />
      </a-popover>
      <a-popover placement="topLeft">
        <template slot="content">疑问帮助&偏好设置</template>

        <a-dropdown :trigger="['click']">
          <icon-font type="iconicon_smalltool_more" class="option-one" />
          <a-menu slot="overlay">
            <a-menu-item>新手入门</a-menu-item>
            <a-menu-item>快捷键查看</a-menu-item>
            <a-menu-item>偏好设置</a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-popover>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ToolBoxBR',
  filters: {},
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['displayMode']),
    isShowComponent() {
      return this.displayMode !== 'pure'
    },
    isCompact() {
      return {
        '--layout-height': this.displayMode === 'compact' ? '30px' : '45px'
      }
    },
    options() {
      return [
        {
          icon: 'iconicon_common_mouse_r',
          tips: ''
        }
      ]
    }
  },
  mounted() {},
  created() {},
  methods: {
    // 处理疑问帮助，偏好设置
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
  padding: 0 8px;
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
      color: #12bb37;
      transition: color 0.2s ease;
    }
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
</style>
