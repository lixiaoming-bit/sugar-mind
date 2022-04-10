<template>
  <transition name="slide-fade-left">
    <div class="canvas-modal-container">
      <basic-modal title="画布">
        <template slot="content">
          <div class="canvas-wrapper">
            <div class="one-comp-wrapper" v-for="item in canvasComponents" :key="item.title">
              <div class="one-title">{{ item.title }}</div>
              <component :is="item.component"></component>
            </div>
          </div>
        </template>
      </basic-modal>
    </div>
  </transition>
</template>

<script>
import BasicModal from './BasicModal'
import CanvasStruct from './CanvasStruct'
import CanvasBackground from './CanvasBackground'
import RainbowLines from './RainbowLines'

export default {
  name: 'CanvasStructModal',
  components: {
    BasicModal,
    CanvasStruct,
    CanvasBackground,
    RainbowLines
  },
  computed: {
    canvasComponents() {
      return [
        {
          title: '布局结构',
          component: 'CanvasStruct'
        },
        {
          title: '背景设置',
          component: 'CanvasBackground'
        }
        // {
        //   title: '彩虹线条',
        //   component: 'RainbowLines'
        // }
      ]
    }
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang="less">
.canvas-modal-container {
  position: fixed;
  right: 10px;
  bottom: 80px;
  width: 340px;
  top: 100px;
  z-index: 2;
  box-shadow: 0 2px 16px 0 #0000000f;
  .canvas-wrapper {
    padding: 0 16px;
    padding-bottom: 16px;
    .one-comp-wrapper {
      margin-top: 16px;
      .one-title {
        user-select: none;
        user-select: none;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(26, 26, 26, 0.9);
        box-sizing: border-box;
        font-size: 16px;
      }
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
  transform: translateX(100%);
  opacity: 0;
}
</style>
