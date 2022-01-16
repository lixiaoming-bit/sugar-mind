<template>
  <div class="tool-box-middle-right-container">
    <div class="one-option" v-for="(item, index) in options" :key="index">
      <a-popover placement="left">
        <template slot="content">
          {{ item.tips }}
        </template>
        <div class="center">
          <icon-font :type="item.icon" class="one-option-icon" />
          <div class="one-option-title">{{ item.title }}</div>
        </div>
      </a-popover>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToolBoxMR',
  filters: {},
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    options() {
      return [
        {
          icon: 'iconicon_draw_style',
          title: '风格',
          tips: '一键切换好看的风格'
        },
        {
          icon: 'iconicon_draw_format_new',
          title: '样式',
          tips: '选中主题-个性化每一个元素'
        },
        {
          icon: 'iconicon_draw_canvas',
          title: '画布',
          tips: '切换结构、背景'
        },
        {
          icon: 'iconicon_draw_outline',
          title: '大纲',
          tips: '大纲编辑文本'
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
.tool-box-middle-right-container {
  position: fixed;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  background: #fff;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .one-option {
    padding: 8px 0;
    width: 60px;
    text-align: center;
    font-size: 13px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #464646;
    cursor: pointer;
    &:hover {
      background-color: #f5f5f5;
    }
    .one-option-icon {
      display: block;
      font-size: 26px;
    }
    .one-option-title {
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #464646;
      cursor: pointer;
    }
  }
}
</style>
