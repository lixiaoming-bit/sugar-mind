<template>
  <transition name="slide-fade-right">
    <div
      class="tool-box-middle-right-container"
      v-show="isShowComponent"
      :style="isCompact"
      key="tool-box-container"
    >
      <div class="one-option" v-for="(item, index) in options" :key="index">
        <a-popover placement="left">
          <template slot="content">
            {{ item.tips }}
          </template>
          <div
            class="center"
            @click="handleSelected(item)"
            :class="{ 'is-active': visibleModal === item.childComponent }"
          >
            <icon-font :type="item.icon" class="one-option-icon" />
            <div class="one-option-title" v-if="isShowTitle">{{ item.title }}</div>
          </div>
        </a-popover>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ToolBoxMR',
  computed: {
    ...mapGetters(['displayMode', 'visibleModal']),
    isShowComponent() {
      return this.displayMode !== 'pure'
    },
    isShowTitle() {
      return this.displayMode !== 'compact'
    },
    isCompact() {
      return {
        '--layout-width': this.displayMode === 'compact' ? '40px' : '60px'
      }
    },
    options() {
      return [
        {
          icon: 'iconicon_draw_style',
          title: '风格',
          tips: '一键切换好看的风格',
          childComponent: 'ThemeStyleModal'
        },
        {
          icon: 'iconicon_draw_format_new',
          title: '样式',
          tips: '选中主题-个性化每一个元素',
          childComponent: 'FontStyleModal'
        },
        {
          icon: 'iconicon_draw_canvas',
          title: '画布',
          tips: '切换结构、背景',
          childComponent: 'CanvasStructModal'
        },
        {
          icon: 'iconicon_draw_outline',
          title: '大纲',
          tips: '大纲编辑文本',
          childComponent: 'SynopsisModal'
        }
      ]
    }
  },
  watch: {
    visibleModal(newVal) {
      let offset = 5
      const flag = this.options.findIndex(item => item.childComponent === newVal) !== -1
      if (flag) {
        offset = 360
      }
      this.$el.style.right = `${offset}px`
    }
  },
  mounted() {},
  created() {},
  methods: {
    ...mapMutations(['SET_VISIBLE_MODAL']),
    // 选择
    handleSelected(item) {
      if (this.visibleModal === item.childComponent) {
        this.SET_VISIBLE_MODAL()
        return
      }
      this.SET_VISIBLE_MODAL(item.childComponent)
    }
  }
}
</script>

<style scoped lang="less">
.tool-box-middle-right-container {
  position: fixed;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  background: #fff;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: right 0.25s linear;
  .one-option {
    padding: 8px 0;
    width: var(--layout-width);
    text-align: center;
    font-size: 13px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #464646;
    cursor: pointer;
    &:hover {
      background-color: #f5f5f5;
    }
    .is-active {
      .one-option-icon {
        color: #01bb35;
      }
      .one-option-title {
        color: #01bb35;
      }
    }
    .one-option-icon {
      display: block;
      font-size: 26px;
    }
    .one-option-title {
      user-select: none;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #464646;
      cursor: pointer;
    }
  }
}

.slide-fade-right-enter-active {
  transition: all 0.25s linear;
}
.slide-fade-right-leave-active {
  transition: all 0.25s linear;
}
.slide-fade-right-enter,
.slide-fade-right-leave-to {
  transform: translate(100%, -50%);
  opacity: 0;
}
</style>
