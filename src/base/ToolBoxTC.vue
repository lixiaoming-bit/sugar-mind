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
        <a-popover placement="bottom" @visibleChange="handleVisibleChange">
          <template slot="content">
            <a-textarea
              v-if="item.key === 'note' && isShowNote"
              v-model="note"
              class="note-textarea"
              placeholder="请填写备注内容"
              @blur="handleTextAreaBlur"
            ></a-textarea>
            <span v-else>{{ item.tips }}</span>
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
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ToolBoxTC',
  filters: {},
  components: {},
  props: {},
  data() {
    return {
      note: null,
      timer: null,
      isShowNote: false
    }
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
      return [
        {
          key: 'undo',
          title: '撤回',
          visible: false,
          tips: '快捷操作：Command+Z',
          icon: 'iconicon_draw_revocation',
          class: this.history.hasUndo() ? '' : 'disabled'
        },
        {
          key: 'redo',
          title: '恢复',
          visible: false,
          tips: '快捷操作：Command+Y',
          icon: 'iconicon_draw_recovery',
          class: this.history.hasRedo() ? '' : 'disabled'
        },
        {
          key: 'copy-style',
          title: '格式刷',
          visible: false,
          tips: '选中主题-点格式刷-点其他主题',
          icon: 'iconicon_draw_brush',
          class: this.handleCheckDisabled('copystyle')
        },
        {
          key: 'append-sibling',
          title: '主题',
          visible: false,

          tips: '添加同级主题（enter）',
          icon: 'iconicon_draw_topic',
          class: this.handleCheckDisabled('AppendSiblingNode')
        },
        {
          key: 'append-child',
          title: '子主题',
          visible: false,
          tips: '添加下级主题（tab）',
          icon: 'iconicon_draw_subtheme',
          class: this.handleCheckDisabled('AppendChildNode')
        },
        {
          key: 'connect',
          title: '关联线',
          visible: false,
          tips: '选择主题-点关联线-点其他主题',
          icon: 'iconicon_draw_association',
          class: this.handleCheckDisabled('ConnectionNode')
        },
        {
          key: 'summary',
          title: '概要',
          visible: false,
          tips: '选中主题-点击概要',
          icon: 'iconicon_draw_summary',
          class: this.handleCheckDisabled('AppendChildNode')
        },
        {
          key: 'note',
          title: '备注',
          visible: false,
          tips: '用于注释主题的文本',
          icon: 'iconicon_draw_remark',
          class: this.handleCheckDisabled('note')
        },
        {
          key: 'image',
          title: '图片',
          visible: false,
          tips: '图文并茂',
          icon: 'iconicon_draw_photo',
          class: this.handleCheckDisabled('Image')
        },
        {
          key: 'priority',
          title: '图标',
          visible: false,
          tips: '表达优先级、进度、心情等',
          icon: 'iconicon_draw_emoji',
          class: this.handleCheckDisabled('priority')
        }
      ]
    },
    moreOptions() {
      return [
        {
          key: 'hyperlink',
          icon: 'iconicon_draw_link',
          title: '超链接',
          class: this.handleCheckDisabled('HyperLink')
        },
        {
          key: 'matrix',
          icon: 'iconicon_draw_more_math',
          title: '公式',
          class: this.handleCheckDisabled('Matrix')
        }
      ]
    }
  },
  methods: {
    ...mapMutations(['SET_VISIBLE_MODAL']),
    // 检查当前的状态
    handleCheckDisabled(command) {
      return this.minder.queryCommandState(command) === -1 ? 'disabled' : ''
    },
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
          this.note = this.minder.queryCommandValue('note') || ''
          this.isShowNote = true
          break
        case 'image':
          this.SET_VISIBLE_MODAL('InsertImagesModal')
          // this.minder.execCommand('Image')
          break
        case 'priority':
          this.SET_VISIBLE_MODAL('InsertIconModal')
          // this.minder.execCommand('priority')
          break
        case 'hyperlink':
          this.minder.execCommand('HyperLink')
          break
        case 'matrix':
          break
        default:
          break
      }
    },
    // 关闭的操作
    handleVisibleChange(visible) {
      if (!visible) {
        clearTimeout(this.timer)
        this.timer = null
        this.timer = setTimeout(() => {
          this.isShowNote = false
        }, 300)
      }
    },
    // 处理note blur事件
    handleTextAreaBlur() {
      const status = this.handleCheckDisabled('note') === 'disabled'
      if (status) return
      const note = this.note.trim() === '' ? null : this.note
      this.minder.execCommand('note', note)
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    this.timer = null
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
    user-select: none;
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

.note-textarea {
  min-height: 150px;
  width: 150px;
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
