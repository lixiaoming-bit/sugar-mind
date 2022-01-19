<template>
  <div class="select-icon-modal-container">
    <basic-modal title="图标" :visible.sync="visible">
      <template slot="content">
        <div class="icon-wrapper">
          <div class="one-icon" v-for="item in icons" :key="item.title">
            <div class="title">{{ item.title }}</div>
            <div class="img-wrapper">
              <img class="img-icon" :src="icon" v-for="(icon, index) in item.urls" :key="index" />
            </div>
          </div>
        </div>
      </template>
    </basic-modal>
  </div>
</template>

<script>
import BasicModal from './BasicModal'

import { levelIcons, emojiIcons, processIcons, markIcons } from '@/icon'

export default {
  name: 'SelectIconModal',
  components: {
    BasicModal
  },
  data() {
    return {
      icons: [],
      visible: true
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {
    this.initConfig()
  },
  methods: {
    // 打开
    open() {
      this.visible = true
      this.initConfig()
    },
    // 初始化配置
    initConfig() {
      this.icons = [
        {
          title: '优先级图标',
          urls: levelIcons
        },
        {
          title: '进度条图标',
          urls: processIcons
        },
        {
          title: '表情图标',
          urls: emojiIcons
        },
        {
          title: '标记图标',
          urls: markIcons
        }
      ]
    }
  }
}
</script>

<style scoped lang="less">
.select-icon-modal-container {
  right: 10px;
  width: 340px;
  bottom: 10px;
  position: fixed;
  .icon-wrapper {
    padding: 0 20px;
    max-height: 520px;
    overflow: auto;
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
        &:hover {
          background: #f0f0f0;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
