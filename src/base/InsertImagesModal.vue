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
      <a-popover :trigger="['focus']" placement="topLeft">
        <template slot="content">
          <img :src="imgUrl" v-if="imgUrl" style="max-width: 150px; max-height: 150px" />
          <span v-else>输入图片地址, 预览图片</span>
        </template>
        <a-input
          v-model.trim.lazy="imgUrl"
          placeholder="输入图片地址"
          class="upload-image-url"
        ></a-input>
      </a-popover>
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
      const reg =
        /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/
      if (this.imgUrl && reg.test(this.imgUrl)) {
        this.minder.execCommand('Image', this.imgUrl)
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
