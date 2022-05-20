<template>
  <transition name="slide-fade-top">
    <div class="tool-box-top-center-container" v-if="isShowComponent" :style="layout">
      <div
        class="one-option"
        v-for="item in options"
        :key="item.key"
        :class="item.class"
        @click="handleUserAction(item)"
      >
        <a-popover placement="bottom">
          <template slot="content">
            <span>{{ item.tips }}</span>
          </template>
          <div class="center">
            <icon-font :type="item.icon" class="one-option-icon" />
            <transition name="scale-in">
              <div class="one-option-title" v-if="!isCompact">{{ item.title }}</div>
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
              <div class="one-option-title" v-if="!isCompact">更多</div>
            </transition>
          </div>
        </a-popover>
      </div>
    </div>
  </transition>
</template>

<script>
import { generateToolBoxTopCenterOptions, generateToolBoxTopCenterMoreOptions } from '@/config'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ToolBoxTC',
  filters: {},
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['isShowComponent', 'isCompact', 'minder', 'macosCommandText']),
    layout() {
      return {
        '--layout-height': this.isCompact ? '40px' : '60px',
        '--layout-width': this.isCompact ? '40px' : '60px'
      }
    },
    options() {
      return generateToolBoxTopCenterOptions(
        this.handleCheckDisabled,
        this.macosCommandText
      ).slice()
    },
    moreOptions() {
      return generateToolBoxTopCenterMoreOptions(this.handleCheckDisabled).slice()
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
          this.minder.execCommand('historyundo')
          break
        case 'redo':
          this.minder.execCommand('historyredo')
          break
        case 'copy-style':
          this.minder.execCommand('copystyle')
          this.SET_VISIBLE_MODAL('CopyStyleModal')
          break
        case 'append-sibling':
          this.minder.execCommand('AppendSiblingNode', '分支主题')
          break
        case 'append-child':
          this.minder.execCommand('AppendChildNode', '分支主题')
          break
        case 'connect':
          console.log('Relationship: ')
          this.minder.execCommand('Relationship')
          break
        case 'summary':
          this.minder.execCommand('AddNodeSummary')
          break
        case 'note':
          // this.SET_VISIBLE_MODAL('InsertNotesModal')
          this.minder.execCommand('OpenPopover', 'label')
          break
        case 'image':
          this.SET_VISIBLE_MODAL('InsertImagesModal')
          break
        case 'priority':
          this.SET_VISIBLE_MODAL('InsertIconsModal')
          break
        case 'hyperlink':
          this.SET_VISIBLE_MODAL('InsertUrlModal')
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
    border-radius: 6px;
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
