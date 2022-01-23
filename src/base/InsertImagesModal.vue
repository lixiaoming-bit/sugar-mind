<template>
  <a-modal v-model="visible" title="插入图片" @cancel="handleCancel" centered>
    <div class="method-wrapper">
      <div class="title">方法一</div>
      <a-upload-dragger name="file" :multiple="true">
        <p class="ant-upload-drag-icon">
          <a-icon type="upload" />
        </p>
        <p class="ant-upload-text">点击或者拖拽文件到此处上传</p>
      </a-upload-dragger>
      <div class="title">方法二</div>
      <a-input v-model="imgUrl" placeholder="输入图片地址"></a-input>
      <div class="title">方法三</div>
      <span>1.截图 > 2.选择主题 > 3.粘贴（Command + V)</span>
    </div>
  </a-modal>
</template>
公式
<script>
export default {
  name: 'InsertImagesModal',
  filters: {},
  components: {},
  props: {},
  data() {
    return {
      visible: false,
      imgUrl: ''
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {},
  methods: {
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less">
.method-wrapper {
  .title {
    font-size: 14px;
    margin-bottom: 12px;
    &:not(:first-of-type) {
      margin-top: 20px;
    }
  }
}
</style>
