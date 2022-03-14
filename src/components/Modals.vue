<template>
  <component :is="visibleModal"></component>
</template>

<script>
// 插入图标
import InsertIconModal from '@/base/InsertIconModal'
// 插入图片
import InsertImagesModal from '@/base/InsertImagesModal'
// 插入URL
import InsertUrlModal from '@/base/InsertUrlModal'
// 风格
import ThemeStyleModal from '@/base/ThemeStyleModal'
// 字体
import NodeStyleModal from '@/base/NodeStyleModal'
// 画布
import CanvasStructModal from '@/base/CanvasStructModal'
// 大纲
import SynopsisModal from '@/base/SynopsisModal'
// 导出弹框
import ExportMinderModal from '@/base/ExportMinderModal'

import { mapGetters } from 'vuex'
export default {
  name: 'Modals',
  filters: {},
  components: {
    InsertIconModal,
    InsertImagesModal,
    InsertUrlModal,
    ThemeStyleModal,
    NodeStyleModal,
    CanvasStructModal,
    SynopsisModal,
    ExportMinderModal
  },
  computed: {
    ...mapGetters(['visibleModal'])
  }
}
</script>
