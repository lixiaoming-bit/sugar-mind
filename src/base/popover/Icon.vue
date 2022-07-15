<template>
  <div class="icon-container">
    <div class="img-wrapper">
      <img
        :src="icon"
        :key="index"
        class="img-icon"
        v-for="(icon, index) in icons.urls"
        @click="handleInsetIcon(icons.type, index)"
      />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { ICONS } from '@/config'

export default {
  name: 'Icon',
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      icons: []
    }
  },
  computed: {
    ...mapGetters(['minder'])
  },
  mounted() {},
  beforeDestroy() {},
  created() {
    this.initConfig()
  },
  methods: {
    initConfig() {
      this.icons = _.find(ICONS.slice(), item => item.type === this.type)
    },
    // 插入图标
    handleInsetIcon(type, index) {
      if (this.minder.queryCommandState(type) !== -1) {
        this.minder.execCommand(type, index)
      } else {
        this.$message.warning('请选择节点')
      }
    }
  }
}
</script>

<style scoped lang="less">
.icon-container {
  // min-width: 300px;
  padding: 10px;
}
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
</style>
