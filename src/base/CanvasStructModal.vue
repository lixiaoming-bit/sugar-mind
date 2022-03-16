<template>
  <transition name="slide-fade-left">
    <div class="canvas-modal-container">
      <basic-modal title="画布">
        <template slot="content">
          <div class="canvas-wrapper">
            <div class="one-wrapper">
              <div class="title">水印背景</div>
              <a-input></a-input>
            </div>
            <div class="tow-wrapper">
              <div class="title">自定义背景</div>
              <div>
                <a-button>上传</a-button>
                <a-button style="margin: 0 4px">设置</a-button>
                <a-button>重置</a-button>
              </div>
            </div>
          </div>
        </template>
      </basic-modal>
    </div>
  </transition>
</template>

<script>
import BasicModal from './BasicModal'

export default {
  name: 'InsertIconModal',
  components: {
    BasicModal
  },
  data() {
    return {}
  },
  computed: {},
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
    padding: 0 20px;
    .one-wrapper {
      display: grid;
      grid-template-columns: 50% 50%;
      padding: 30px 0;
    }
    .tow-wrapper {
      display: grid;
      grid-template-columns: 33% auto;
      align-items: center;
    }
  }
}
</style>
