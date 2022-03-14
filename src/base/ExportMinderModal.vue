<template>
  <a-modal :visible="visible" title="导出" @ok="handleExport" @cancel="handleCancel" centered>
    <a-radio-group v-model="selectedExportType">
      <a-radio
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
      if (this.selectedExportType === 'png') {
        this.minder
          .exportData(this.selectedExportType)
          .then(res => {
            console.log('res: ', res)
          })
          .catch(err => {
            console.log('err: ', err)
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
