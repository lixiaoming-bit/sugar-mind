<template>
  <transition name="slide-fade-right">
    <div class="tool-box-top-right-container" v-if="isShowComponent" :style="isCompact">
      <div class="one-option" v-for="(item, index) in options" :key="index">
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
              <div class="one-option-title" v-if="isShowTitle">分享协作</div>
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
  name: 'ToolBoxTR',
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
          icon: 'iconicon_draw_save',
          title: '保存',
          tips: '手动保存Cmd+S'
        },
        {
          icon: 'iconicon_draw_export',
          title: '导出',
          tips: '导出高清晰度文件'
        }
      ]
    },
    moreOptions() {
      return [
        {
          icon: 'iconicon_draw_tool_share_key',
          title: '链接分享'
        },
        {
          icon: 'iconicon_draw_tool_share_team',
          title: '多人协作'
        },
        {
          icon: 'iconicon_draw_tool_share_template',
          title: '发布模板'
        }
      ]
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
    border-radius: 2px;
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
