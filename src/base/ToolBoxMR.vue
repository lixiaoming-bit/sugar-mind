<template>
  <transition name="slide-fade-left">
    <div
      class="tool-box-middle-right-container"
      v-if="isShowComponent"
      :style="layout"
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
            :class="{ 'is-active': visibleModal === item.component }"
          >
            <icon-font :type="item.icon" class="one-option-icon" />
            <transition name="scale-in">
              <div class="one-option-title" v-if="!isCompact">{{ item.title }}</div>
            </transition>
          </div>
        </a-popover>
      </div>
    </div>
  </transition>
</template>

<script>
import { TOOL_BOX_MR } from '@/config'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ToolBoxMR',
  computed: {
    ...mapGetters(['isShowComponent', 'isCompact', 'visibleModal']),
    layout() {
      return {
        '--layout-width': this.isCompact ? '40px' : '60px',
        '--layout-height': this.isCompact ? '40px' : '60px'
      }
    },
    options() {
      return TOOL_BOX_MR.slice()
    }
  },
  watch: {
    visibleModal(newVal) {
      let offset = 5
      let opacity = 0.2
      const flag = this.options.findIndex(item => item.component === newVal) !== -1
      if (flag) {
        offset = 360
        opacity = 1
      }
      this.$el.style.right = `${offset}px`
      this.$el.style.opacity = opacity
    }
  },
  methods: {
    ...mapMutations(['SET_VISIBLE_MODAL']),
    // 选择
    handleSelected(item) {
      if (this.visibleModal === item.component) {
        this.SET_VISIBLE_MODAL()
        return
      }
      this.SET_VISIBLE_MODAL(item.component)
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
  transition: right 0.25s linear, opacity 0.25s linear;
  opacity: 0.2;
  &:hover {
    opacity: 1 !important;
    transition: right 0.25s linear, opacity 0.25s linear;
  }
  overflow: hidden;
  .one-option {
    padding: 8px 0;
    height: var(--layout-height);
    width: var(--layout-width);
    text-align: center;
    font-size: 13px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #464646;
    cursor: pointer;
    transition: width 0.5s ease, height 0.5s ease;
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

.slide-fade-left-enter-active {
  transition: all 0.25s linear;
}
.slide-fade-left-leave-active {
  transition: all 0.25s linear;
}
.slide-fade-left-enter,
.slide-fade-left-leave-to {
  transform: translate(100%, -50%);
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
