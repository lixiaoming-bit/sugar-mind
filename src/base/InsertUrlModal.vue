<template>
  <a-modal
    :visible="visible"
    title="插入链接"
    @ok="handleInsertUrl"
    @cancel="handleCancel"
    centered
  >
    <a-input v-model="hyperLink" placeholder="请输入您需要插入的链接"></a-input>
  </a-modal>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'InsertUrlModal',
  props: {},
  data() {
    return {
      hyperLink: ''
    }
  },
  computed: {
    ...mapGetters(['visibleModal']),
    visible() {
      return this.visibleModal === 'InsertImagesModal'
    }
  },
  methods: {
    ...mapMutations(['SET_VISIBLE_MODAL']),
    handleInsertUrl() {
      const reg =
        /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/
      if (this.hyperLink && reg.test(this.hyperLink)) {
        this.minder.execCommand('HyperLink', this.hyperLink)
      }
      this.SET_VISIBLE_MODAL('')
    },
    handleCancel() {
      this.SET_VISIBLE_MODAL('')
    }
  }
}
</script>

<style scoped lang="less"></style>
