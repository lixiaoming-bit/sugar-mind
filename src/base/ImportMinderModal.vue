<template>
  <a-modal title="插入图片" centered :visible="visible" @cancel="handleCancel" @ok="handleCancel">
    <div class="method-wrapper">
      <input
        type="file"
        accept="application/vnd.xmind.workbook"
        class="file"
        @change="handleChange1"
      />
    </div>
  </a-modal>
</template>

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
      return this.visibleModal === 'ImportMinderModal'
    }
  },
  methods: {
    ...mapMutations(['SET_VISIBLE_MODAL']),
    handleChange1() {
      // 导入文件
      const files = document.querySelector('input[type=file]').files
      console.log('files: ', files)
      if (files.length <= 0) {
        console.log('无长度')
      } else {
        this.minder.importData('xmind', files[0])
        this.SET_VISIBLE_MODAL()
      }
    },
    handleChange(info) {
      if (info.file.status === 'done') {
        this.minder.importData('xmind', info.file.originFileObj)
        this.SET_VISIBLE_MODAL()
      }
    },
    handleCancel() {
      this.SET_VISIBLE_MODAL()
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
