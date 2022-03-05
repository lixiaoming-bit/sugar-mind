<template>
  <transition name="slide-fade-left">
    <div class="node-style-modal-container">
      <basic-modal title="节点样式设置">
        <template slot="content">
          <div class="node-style-wrapper">
            <div class="one-node-wrapper" v-for="item in nodeStyles" :key="item.title">
              <div class="node-title">{{ item.title }}</div>
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
import NodeFontStyle from './NodeFontStyle'
import NodeThemeStyle from './NodeThemeStyle'
import NodeBorderStyle from './NodeBorderStyle'
import NodeLineStyle from './NodeLineStyle'
export default {
  name: 'NodeStyleModal',
  components: { BasicModal, NodeFontStyle, NodeThemeStyle, NodeBorderStyle, NodeLineStyle },
  data() {
    return {}
  },
  computed: {
    nodeStyles() {
      return [
        {
          title: '字体',
          component: 'NodeFontStyle'
        },
        {
          title: '主题',
          component: 'NodeThemeStyle'
        },
        {
          title: '边框',
          component: 'NodeBorderStyle'
        },
        {
          title: '线条',
          component: 'NodeLineStyle'
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
.node-style-modal-container {
  position: fixed;
  right: 10px;
  bottom: 80px;
  width: 340px;
  top: 100px;
  z-index: 2;
  box-shadow: 0 2px 16px 0 #0000000f;
  .node-style-wrapper {
    padding: 0 16px;
    .one-node-wrapper {
      margin-top: 16px;
      .node-title {
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
