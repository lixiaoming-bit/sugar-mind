<template>
  <div class="node-border-style-container">
    <a-row type="flex" align="middle" :gutter="[16, 16]">
      <a-col :span="12">
        <a-row type="flex" align="middle" :gutter="[16, 16]">
          <a-col :span="7">粗细</a-col>
          <a-col :span="17">
            <a-dropdown-button>
              <div class="shape-list" slot="overlay">
                <svg
                  width="120"
                  height="32"
                  v-for="number in 6"
                  :key="number"
                  class="shape-one"
                  @click="handleSelectWidth(number)"
                >
                  <line
                    x1="10"
                    y1="13"
                    x2="110"
                    y2="13"
                    :stroke-width="number"
                    stroke="black"
                    v-if="number"
                  ></line>
                </svg>
              </div>
              <svg width="60" height="32" class="shape-one">
                <line
                  x1="5"
                  y1="16"
                  x2="53"
                  y2="16"
                  :stroke-width="selectedStrokeWidth"
                  stroke="black"
                ></line>
              </svg>
              <a-icon slot="icon" type="caret-down" />
            </a-dropdown-button>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-row type="flex" align="middle" :gutter="[16, 16]">
          <a-col :span="7">颜色</a-col>
          <a-col :span="17">
            <color-picker @change="handleColorChange"></color-picker>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-row type="flex" align="middle" :gutter="[16, 16]">
          <a-col :span="7">类型</a-col>
          <a-col :span="17">
            <a-dropdown-button>
              <div class="shape-list" slot="overlay">
                <svg
                  width="120"
                  height="32"
                  v-for="das in dashed"
                  :key="das"
                  class="shape-one"
                  @click="handleSelectDashed(das)"
                >
                  <line
                    x1="10"
                    y1="13"
                    x2="110"
                    y2="13"
                    stroke-width="2"
                    stroke="black"
                    :stroke-dasharray="das"
                  ></line>
                </svg>
              </div>
              <svg width="60" height="32" class="shape-one">
                <line
                  x1="5"
                  y1="16"
                  x2="53"
                  y2="16"
                  stroke-width="2"
                  :stroke-dasharray="selectedStrokeDashed"
                  stroke="black"
                ></line>
              </svg>
              <a-icon slot="icon" type="caret-down" />
            </a-dropdown-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import ColorPicker from './ColorPicker'
export default {
  name: 'NodeBorderStyle',
  filters: {},
  components: {
    ColorPicker
  },
  props: {},
  data() {
    return {
      selectedStrokeWidth: 1,
      selectedStrokeDashed: 'none'
    }
  },
  computed: {
    dashed() {
      return ['none', '1, 1', '5 10', '6 4', '10, 5', '5, 5, 1, 5', '15, 10, 5, 10']
    }
  },
  watch: {},
  mounted() {},
  created() {},
  methods: {
    // 设置边框线条宽度
    handleSelectWidth(number) {
      this.selectedStrokeWidth = number
    },
    // 设置边框线条的类型
    handleSelectDashed(dashed) {
      console.log('dashed: ', dashed)
      this.selectedStrokeDashed = dashed
    },
    // 设置颜色
    handleColorChange() {}
  }
}
</script>

<style scoped lang="less">
.node-border-style-container {
  margin-top: 16px;
}
.shape-list {
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  .shape-one {
    display: block;
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
