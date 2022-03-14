<template>
  <transition name="slide-fade-right">
    <div class="tool-box-top-right-container" v-if="isShowComponent" :style="layout">
      <div class="one-option" v-for="(item, index) in options" :key="index">
        <a-popover placement="bottom">
          <template slot="content">
            {{ item.tips }}
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
        <a-popover placement="bottomLeft" overlay-class-name="more-popover">
          <template slot="content">
            <div class="more-one-option" v-for="item in moreOptions" :key="item.title">
              <icon-font :type="item.icon" />
              <span class="more-one-option-title">{{ item.title }}</span>
            </div>
          </template>
          <div class="center">
            <icon-font type="iconicon_draw_share" class="one-option-icon" />
            <transition name="scale-in">
              <div class="one-option-title" v-if="!isCompact">分享协作</div>
            </transition>
          </div>
        </a-popover>
      </div>
    </div>
  </transition>
</template>

<script>
import { generateToolBoxTopRightOptions, TOOL_BOX_TR } from '@/config'
import { mapGetters } from 'vuex'
export default {
  name: 'ToolBoxTR',
  filters: {},
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['isShowComponent', 'isCompact', 'macosCommandText']),
    layout() {
      const value = this.isCompact ? '40px' : '60px'
      return {
        '--layout-height': value,
        '--layout-width': value
      }
    },
    options() {
      return generateToolBoxTopRightOptions(this.macosCommandText).slice()
    },
    moreOptions() {
      return TOOL_BOX_TR.slice()
    }
  },
  watch: {},
  mounted() {},
  created() {},
  methods: {}
}
</script>

<style scoped lang="less">
.tool-box-top-right-container {
  position: fixed;
  top: 16px;
  right: 16px;
  background: #fff;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  height: var(--layout-height);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  // padding: 0 8px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  transition: height 0.5s ease;
}
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
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
  }

  .disabled {
    color: #bcbcbc !important;
    .one-option-title {
      color: inherit;
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
  transform: translateY(-100%);
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
      color: #bcbcbc !important;
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
