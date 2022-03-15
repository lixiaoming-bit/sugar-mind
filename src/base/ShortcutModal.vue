<template>
  <transition name="slide-fade-left">
    <div class="shortcut-modal-container">
      <basic-modal title="快捷键">
        <template slot="content">
          <div class="shortcut-wrapper">
            <div class="one-configure" v-for="item in shortcutContainer" :key="item.title">
              <div class="title">{{ item.title }}</div>
              <div
                class="configure-wrapper"
                v-for="(childItem, index) in item.contents"
                :key="index"
              >
                <div class="row-left">
                  <icon-font :type="childItem.icon" class="option-icon" />
                  <div>{{ childItem.title }}</div>
                </div>
                <div class="row-right">
                  <div>{{ childItem.description }}</div>
                </div>
                <div class="border"></div>
              </div>
            </div>
          </div>
        </template>
      </basic-modal>
    </div>
  </transition>
</template>

<script>
import { generateShortModalContext } from '@/config'
import BasicModal from './BasicModal'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'InsertIconModal',
  components: {
    BasicModal
  },
  data() {
    return {
      shortcutContainer: []
    }
  },
  computed: {
    ...mapGetters(['minder', 'macosCommandText', 'macosOptionText'])
  },
  created() {
    this.initConfig()
  },
  methods: {
    ...mapMutations(['SET_VISIBLE_MODAL']),
    // 初始化配置
    initConfig() {
      this.shortcutContainer = generateShortModalContext(
        this.macosCommandText,
        this.macosOptionText
      )
    }
  }
}
</script>

<style scoped lang="less">
.shortcut-modal-container {
  position: fixed;
  right: 10px;
  bottom: 80px;
  width: 340px;
  top: 100px;
  z-index: 2;
  box-shadow: 0 2px 16px 0 #0000000f;
  .shortcut-wrapper {
    padding: 0 20px;
  }
  .one-configure {
    border-bottom: 1px solid #e8e8e8;
    padding: 16px 0;
    .title {
      font-family: PingFangSC-Regular, PingFang SC;
      font-size: 16px;
      font-weight: 500;
      color: rgba(26, 26, 26, 0.9);
      padding: 12px 0;
    }
    .configure-wrapper {
      display: flex;
      padding: 7px 0;
      .row-left {
        display: flex;
        flex: 1;
        color: #333;
        align-items: center;
        font-size: 15px;
        .option-icon {
          padding-right: 20px;
        }
      }
      .row-right {
        color: #909090;
        font-size: 13px;
      }
    }
  }
  .one-configure:last-child {
    border: none;
  }
}
</style>
