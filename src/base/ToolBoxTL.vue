<template>
  <transition name="slide-fade-top">
    <div class="tool-box-top-left-container" v-if="isShowComponent" :style="isCompact">
      <icon-font type="iconback" class="icon-font" />
      <a-popover placement="bottom">
        <template slot="content">自定义标题</template>
        <input type="text" class="custom-input" value="自定义标题" />
      </a-popover>
      <div class="vertical-line"></div>
      <icon-font type="iconwancheng" class="icon-font" />
      <div class="action-tips">自动保存成功</div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ToolBoxTL',
  computed: {
    ...mapGetters(['displayMode']),
    isShowComponent() {
      return this.displayMode !== 'pure'
    },
    isCompact() {
      return {
        '--layout-height': this.displayMode === 'compact' ? '40px' : '60px'
      }
    }
  }
}
</script>

<style scoped lang="less">
.tool-box-top-left-container {
  position: fixed;
  top: 16px;
  left: 16px;
  background: #fff;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  height: var(--layout-height);
  display: flex;
  flex-direction: row;
  width: 280px;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  .custom-input {
    text-decoration: underline;
    width: 116px;
    font-size: 16px;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
    outline: none;
    border: none;
    color: rgba(26, 26, 26, 0.8);
  }
  .vertical-line {
    height: 18px;
    width: 1px;
    background-color: #666666;
    margin: 0 5px;
  }
  .action-tips {
    margin-left: 5px;
    font-size: 13px;
    display: inline-block;
    vertical-align: top;
    line-height: 26px;
    color: #333;
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
  transform: translateY(-100%);
  opacity: 0;
}
</style>
