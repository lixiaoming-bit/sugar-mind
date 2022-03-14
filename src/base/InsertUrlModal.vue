<template>
  <a-modal
    :visible="visible"
    title="插入链接"
    @ok="handleInsertUrl"
    @cancel="handleCancel"
    centered
  >
    <a-input
      v-model="hyperLink"
      placeholder="支持http(s):// 或 ftp://的链接，回车保存"
      @keyup.enter="handleInsertUrl"
    ></a-input>
  </a-modal>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'InsertUrlModal',
  props: {},
  data() {
    return {
      hyperLinkText: '',
      hyperLink: ''
    }
  },
  computed: {
    ...mapGetters(['visibleModal', 'minder']),
    visible() {
      return this.visibleModal === 'InsertUrlModal'
    }
  },
  methods: {
    ...mapMutations(['SET_VISIBLE_MODAL']),
    handleInsertUrl() {
      const reg =
        /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/
      if (this.hyperLink && reg.test(this.hyperLink)) {
        this.minder.execCommand('HyperLink', this.hyperLink, '链接')
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
