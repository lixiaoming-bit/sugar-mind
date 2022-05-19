<template>
  <div class="canvas-struct-container">
    <div class="struct-wrapper">
      <a-row type="flex" :gutter="[16, 16]">
        <a-col :span="8" v-for="item in structList" :key="item.id">
          <div class="struct-one" @click="handleSelectStruct(item)">
            <img
              :src="item.url"
              class="img-responsive struct-img"
              :class="{ 'struct-img-disabled': item.disabled }"
            />
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { canvasStruct } from '@/assets/images'
import { mapGetters } from 'vuex'
export default {
  name: 'CanvasStruct',
  filters: {},
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['minder']),
    structList() {
      const template = ['right', 'default']
      return Array.from(canvasStruct, (item, index) => {
        return {
          id: index,
          url: item,
          disabled: index > 1,
          template: template[index]
        }
      })
    }
  },
  methods: {
    // 点击切换主题
    handleSelectStruct(item) {
      if (item.disabled) return
      if (item.template === 'default' && this.minder.getRoot().getSummary().length) {
        this.$message.warning('二级主题存在概要，暂不支持切换到该结构')
        return
      }
      this.minder.useTemplate(item.template)
    }
  }
}
</script>

<style scoped lang="less">
.canvas-struct-container {
  margin-top: 16px;
  .struct-img {
    user-select: none;
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    &:hover {
      border-color: var(--theme-color);
    }
  }
  .struct-img-disabled {
    position: relative;
    z-index: 1;
    opacity: 0.35;
    cursor: not-allowed;
    &:hover {
      border-color: #e8e8e8;
    }
  }
}
</style>
