<template>
  <transition name="slide-fade-left">
    <div class="select-icon-modal-container">
      <basic-modal title="图标">
        <template slot="content">
          <div class="icon-wrapper">
            <div class="one-icon" v-for="item in icons" :key="item.title">
              <div class="title">{{ item.title }}</div>
              <div class="img-wrapper">
                <img
                  :src="icon"
                  :key="index"
                  class="img-icon"
                  v-for="(icon, index) in item.urls"
                  @click="handleInsetIcon(item.type, index)"
                />
              </div>
            </div>
          </div>
        </template>
      </basic-modal>
    </div>
  </transition>
</template>

<script>
import { ICONS } from '@/config'
import BasicModal from './BasicModal'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'InsertIconModal',
  components: {
    BasicModal
  },
  data() {
    return {
      icons: []
    }
  },
  computed: {
    ...mapGetters(['minder'])
  },
  created() {
    this.initConfig()
  },
  methods: {
    ...mapMutations(['SET_VISIBLE_MODAL']),
    // 初始化配置
    initConfig() {
      this.icons = ICONS.slice()
    },
    // 插入图标
    handleInsetIcon(type, index) {
      if (this.minder.queryCommandState(type) !== -1) {
        this.minder.execCommand(type, index)
      } else {
        this.$message.warning('请选择节点')
      }
    },
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
