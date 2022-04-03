<template>
  <a-modal
    title="插入备注"
    centered
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleInsertNotes"
  >
    <a-textarea placeholder="请输入自定义备注" v-model.trim="note" />
  </a-modal>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'InsertNotesModal',
  data() {
    return {
      note: ''
    }
  },
  computed: {
    ...mapGetters(['visibleModal', 'minder']),
    visible() {
      return this.visibleModal === 'InsertNotesModal'
    }
  },
  watch: {
    visible(value) {
      this.note = value ? this.minder.queryCommandValue('note') || '' : ''
    }
  },
  methods: {
    ...mapMutations(['SET_VISIBLE_MODAL']),
    // 插入备注
    handleInsertNotes() {
      const value = this.note
      if (value) {
        this.minder.execCommand('note', value)
      }
      this.handleCancel()
    },
    // 页面取消
    handleCancel() {
      this.note = ''
      this.SET_VISIBLE_MODAL()
    }
  }
}
</script>
<style lang=""></style>
