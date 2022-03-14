<template>
  <transition name="slide-fade-left">
    <div class="shortcut-modal-container">
      <basic-modal title="快捷键">
        <template slot="content"></template>
      </basic-modal>
    </div>
  </transition>
</template>

<script>
import BasicModal from './BasicModal'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ShortcutModal',
  components: {
    BasicModal
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['minder'])
  },
  created() {},
  methods: {
    ...mapMutations(['SET_VISIBLE_MODAL']),
    // 取消插入图标
    handleCancel() {
      this.SET_VISIBLE_MODAL('')
    }
  }
}
</script>

<style scoped lang="less">
.select-icon-modal-container {
  position: fixed;
  right: 10px;
  bottom: 80px;
  width: 340px;
  top: 100px;
  z-index: 2;
  box-shadow: 0 2px 16px 0 #0000000f;
  .icon-wrapper {
    padding: 0 20px;
  }
  .one-icon {
    .title {
      font-family: PingFangSC-Regular, PingFang SC;
      font-size: 16px;
      font-weight: 500;
      color: rgba(26, 26, 26, 0.9);
      padding: 12px 0;
    }
    .img-wrapper {
      display: grid;
      justify-content: space-between;
      grid-template-columns: repeat(auto-fill, 36px);
      grid-gap: 10px;
      margin-bottom: 20px;
      .img-icon {
        width: 28px;
        height: 28px;
        font-size: 0;
        cursor: pointer;
        &:hover {
          background: #f0f0f0;
          border-radius: 4px;
        }
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
