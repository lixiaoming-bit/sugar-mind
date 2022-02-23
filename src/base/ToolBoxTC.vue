<template>
  <transition name="slide-fade-top">
    <div class="tool-box-top-center-container" v-if="isShowComponent" :style="isCompact">
      <div
        class="one-option"
        v-for="item in options"
        :key="item.key"
        :class="item.class"
        @click="handleUserAction(item)"
      >
        <a-popover placement="bottom">
          <template slot="content">
            {{ item.tips }}
          </template>
          <div class="center">
            <icon-font :type="item.icon" class="one-option-icon" />
            <transition name="scale-in">
              <div class="one-option-title" v-if="isShowTitle">{{ item.title }}</div>
            </transition>
          </div>
        </a-popover>
      </div>
      <div class="one-option">
        <a-popover placement="bottom" :trigger="['click']" overlay-class-name="more-popover">
          <template slot="content">
            <div
              class="more-one-option"
              v-for="item in moreOptions"
              :key="item.key"
              :class="item.class"
              @click="handleUserAction(item)"
            >
              <icon-font :type="item.icon" />
              <span class="more-one-option-title">{{ item.title }}</span>
            </div>
          </template>
          <div class="center">
            <icon-font type="iconicon_draw_tools_more" class="one-option-icon" />
            <transition name="scale-in">
              <div class="one-option-title" v-if="isShowTitle">更多</div>
            </transition>
          </div>
        </a-popover>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ToolBoxTC',
  filters: {},
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['displayMode', 'history', 'minder']),
    isShowComponent() {
      return this.displayMode !== 'pure'
    },
    isShowTitle() {
      return this.displayMode !== 'compact'
    },
    isCompact() {
      return {
        '--layout-height': this.displayMode === 'compact' ? '40px' : '60px',
        '--layout-width': this.displayMode === 'compact' ? '40px' : '60px'
      }
    },
    options() {
      const checkDisabled = command =>
        this.minder.queryCommandState(command) === -1 ? 'disabled' : ''
      return [
        {
          key: 'undo',
          icon: 'iconicon_draw_revocation',
          title: '撤回',
          tips: '快捷操作：Command+Z',
          class: this.history.hasUndo() ? '' : 'disabled'
        },
        {
          key: 'redo',
          icon: 'iconicon_draw_recovery',
          title: '恢复',
          tips: '快捷操作：Command+Y',
          class: this.history.hasRedo() ? '' : 'disabled'
        },
        {
          key: 'copy-style',
          icon: 'iconicon_draw_brush',
          title: '格式刷',
          tips: '选中主题-点格式刷-点其他主题',
          class: checkDisabled('copystyle')
        },
        {
          key: 'append-sibling',
          icon: 'iconicon_draw_topic',
          title: '主题',
          tips: '添加同级主题（enter）',
          class: checkDisabled('AppendSiblingNode')
        },
        {
          key: 'append-child',
          icon: 'iconicon_draw_subtheme',
          title: '子主题',
          tips: '添加下级主题（tab）',
          class: checkDisabled('AppendChildNode')
        },
        {
          key: 'connect',
          icon: 'iconicon_draw_association',
          title: '关联线',
          tips: '选择主题-点关联线-点其他主题',
          class: checkDisabled('ConnectionNode')
        },
        {
          key: 'summary',
          icon: 'iconicon_draw_summary',
          title: '概要',
          tips: '选中主题-点击概要',
          class: checkDisabled('AppendChildNode')
        },
        {
          key: 'note',
          icon: 'iconicon_draw_remark',
          title: '备注',
          tips: '用于注释主题的文本',
          class: checkDisabled('note')
        },
        {
          key: 'image',
          icon: 'iconicon_draw_photo',
          title: '图片',
          tips: '图文并茂',
          class: checkDisabled('Image')
        },
        {
          key: 'priority',
          icon: 'iconicon_draw_emoji',
          title: '图标',
          tips: '表达优先级、进度、心情等',
          class: checkDisabled('priority')
        }
      ]
    },
    moreOptions() {
      const checkDisabled = command =>
        this.minder.queryCommandState(command) === -1 ? 'disabled' : ''
      return [
        {
          key: 'hyperlink',
          icon: 'iconicon_draw_link',
          title: '超链接',
          class: checkDisabled('HyperLink')
        },
        {
          key: 'matrix',
          icon: 'iconicon_draw_more_math',
          title: '公式',
          class: checkDisabled('Matrix')
        }
      ]
    }
  },
  methods: {
    // 处理用户点击事件
    handleUserAction(item) {
      if (item.class === 'disabled') return
      switch (item.key) {
        case 'undo':
          this.history.undo()
          break
        case 'redo':
          this.history.redo()
          break
        case 'copy-style':
          this.minder.execCommand('copystyle')
          break
        case 'append-sibling':
          this.minder.execCommand('AppendSiblingNode', '分支主题')
          break
        case 'append-child':
          this.minder.execCommand('AppendChildNode', '分支主题')
          break
        case 'connect':
          this.minder.execCommand('ConnectionNode')
          break
        case 'summary':
          this.minder.execCommand('AppendChildNode')
          break
        case 'note':
          // this.modal.open()
          break
        case 'image':
          this.minder.execCommand('Image')
          break
        case 'priority':
          this.minder.execCommand('priority')
          break
        case 'hyperlink':
          this.minder.execCommand('HyperLink')
          break
        case 'matrix':
          break
        default:
          break
      }
    }
  }
}
</script>

<style scoped lang="less">
.tool-box-top-center-container {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  margin: 0 10px;
  height: var(--layout-height);
  background: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  text-align: center;
  transition: height 0.5s ease;
  .one-option {
    cursor: pointer;
    height: 100%;
    width: var(--layout-width);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: width 0.5s ease;
    &:hover {
      background-color: #f5f5f5;
    }
    .one-option-icon {
      display: inline-block;
      width: 40px;
      height: 30px;
      font-size: 30px;
      line-height: 100%;
    }

    .one-option-title {
      color: #666;
    }

    &.disabled {
      cursor: not-allowed;
      color: #bcbcbc !important;
      .one-option-title {
        color: inherit;
      }
    }
  }
}

.slide-fade-top-enter-active {
  transition: all 0.25s linear;
}
.slide-fade-top-leave-active {
  transition: all 0.25s linear;
}
.slide-fade-top-enter,
.slide-fade-top-leave-to {
  transform: translate(-50%, -100%);
  opacity: 0;
}

.scale-in-enter,
.scale-in-leave-to {
  height: 0;
  opacity: 0;
  transform: scale(0);
}
.scale-in-enter-to,
.scale-in-leave {
  height: 18px;
  opacity: 1;
  transform: scale(1);
}
.scale-in-leave-active,
.scale-in-enter-active {
  transition: transform 0.25s ease, opacity 0.25s ease, height 0.25s ease;
}
</style>
<style lang="less">
.more-popover {
  .more-one-option {
    cursor: pointer;
    padding: 3px 5px;
    border-radius: 2px;
    &.disabled {
      cursor: not-allowed;
      color: #bcbcbc !important;
      .more-one-option-title {
        color: #bcbcbc;
      }
    }
    &:hover {
      background-color: #f5f5f5;
    }
    .more-one-option-title {
      margin-left: 12px;
      color: #666666;
    }
  }
}
</style>
