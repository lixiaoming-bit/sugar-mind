<template>
  <a-modal
    title="插入图片"
    centered
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleInsetImage"
  >
    <div class="method-wrapper">
      <div class="title">方法一</div>
      <a-upload-dragger name="file" :multiple="true" disabled>
        <p class="ant-upload-drag-icon">
          <a-icon type="upload" />
        </p>
        <p class="ant-upload-text">点击或者拖拽文件到此处上传</p>
      </a-upload-dragger>
      <div class="title">方法二</div>
      <a-input v-model.trim="imgUrl" placeholder="输入图片地址"></a-input>
      <div class="title">方法三</div>
      <span>1.截图 > 2.选择主题 > 3.粘贴（Command + V)</span>
    </div>
  </a-modal>
</template>
公式
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'InsertImagesModal',
  data() {
    return {
      imgUrl: ''
    }
  },
  computed: {
    ...mapGetters(['visibleModal', 'minder']),
    visible() {
      return this.visibleModal === 'InsertImagesModal'
    }
  },
  methods: {
    ...mapMutations(['SET_VISIBLE_MODAL']),
    // 插入图片
    handleInsetImage() {
      if (this.imgUrl) {
        this.minder.execCommand('image', this.imgUrl, '新建图片')
      }
      this.SET_VISIBLE_MODAL('')
    },
    // 取消插入图片
    handleCancel() {
      this.SET_VISIBLE_MODAL('')
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
