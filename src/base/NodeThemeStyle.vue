<template>
  <div class="node-theme-style-container">
    <a-row type="flex" align="middle" :gutter="[16, 16]">
      <a-col :span="12">
        <a-row type="flex" align="middle" :gutter="[16, 16]">
          <a-col :span="7">形状</a-col>
          <a-col :span="17">
            <a-dropdown-button :trigger="['hover']">
              <div class="shape-list" slot="overlay">
                <svg
                  width="60"
                  height="26"
                  class="shape-one"
                  v-for="item in shapePath"
                  :key="item.title"
                  @click="handleSelect(item)"
                >
                  <path :d="item.path" fill="none" stroke="black" stroke-width="2"></path>
                </svg>
              </div>
              <svg width="60" height="26" class="shape-one" style="margin-top: 2px">
                <path :d="selectedPath" fill="none" stroke="black" stroke-width="2"></path>
              </svg>
              <a-icon slot="icon" type="caret-down" />
            </a-dropdown-button>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-row type="flex" align="middle" :gutter="[16, 16]">
          <a-col :span="7">填充</a-col>
          <a-col :span="17">
            <color-picker :value="color" @change="handleColorChange"></color-picker>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { SHAPE_PATH } from '@/config'
import { mapGetters } from 'vuex'
import ColorPicker from './ColorPicker'
export default {
  name: 'NodeThemeStyle',
  data() {
    return {
      color: '',
      selectedPath: SHAPE_PATH[0]['path']
    }
  },
  components: {
    ColorPicker
  },
  computed: {
    ...mapGetters(['minder']),
    shapePath() {
      return SHAPE_PATH.slice()
    }
  },
  mounted() {
    this.color = this.minder.queryCommandValue('background') || 'ffffff'
  },
  methods: {
    // 选择
    handleSelect({ path }) {
      this.selectedPath = path
    },
    // 设置背景颜色
    handleColorChange({ hex8 }) {
      this.minder.execCommand('background', hex8)
    }
  }
}
</script>

<style scoped lang="less">
.node-theme-style-container {
  margin-top: 16px;
}
.shape-list {
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #e8e8e8;
  display: grid;
  grid-template-columns: repeat(3, 60px);
  grid-template-rows: repeat(3, 26px);
  gap: 10px;
  border-radius: 2px;
  .shape-one {
    cursor: pointer;
    &:hover {
      background: #f2f3f5;
    }
  }
}
</style>
<style lang="less">
.ant-btn-group.ant-dropdown-button > .ant-btn {
  padding: 0;
}
</style>
