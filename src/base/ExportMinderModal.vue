<template>
  <a-modal :visible="visible" title="导出" @ok="handleExport" @cancel="handleCancel" centered>
    <a-radio-group v-model="selectedExportType">
      <a-radio
        :disabled="item.disabled"
        class="custom-radio"
        v-for="item in exportTypeList"
        :value="item.key"
        :key="item.key"
      >
        {{ item.title }}
      </a-radio>
    </a-radio-group>
  </a-modal>
</template>

<script>
import { downloadFile, downloadMarkdown, downloadPDF } from '@/utils'
import { EXPORT_TYPE_LIST } from '@/config'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ExportMinderModal',
  props: {},
  data() {
    return {
      selectedExportType: 'png'
    }
  },
  computed: {
    ...mapGetters(['visibleModal', 'minder']),
    visible() {
      return this.visibleModal === 'ExportMinderModal'
    },
    exportTypeList() {
      return EXPORT_TYPE_LIST.slice()
    }
  },
  methods: {
    ...mapMutations(['SET_VISIBLE_MODAL']),
    handleExport() {
      this.minder.removeAllSelectedNodes()
      const type = this.selectedExportType
      const exportType = type === 'pdf' ? 'png' : type
      if (exportType) {
        this.minder
          .exportData(exportType)
          .then(content => {
            switch (type) {
              case 'pdf':
                downloadPDF(content, new Date().toLocaleString())
                break
              case 'png':
                downloadFile(content, new Date().toLocaleString(), 'png')
                break
              case 'markdown':
                downloadMarkdown(content, new Date().toLocaleString(), 'markdown')
                break
              default:
                console.log('导出数据:', content)
                break
            }
          })
          .catch(err => {
            console.log('err: ', err)
            this.$message.warning(err)
          })
      }
      this.SET_VISIBLE_MODAL('')
    },
    handleCancel() {
      this.SET_VISIBLE_MODAL('')
    }
  }
}
</script>

<style scoped lang="less">
.custom-radio {
  width: 100%;
  padding: 10px 0;
}
</style>
