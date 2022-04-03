<template>
  <keep-alive>
    <component :is="visibleModal" v-if="visibleModal !== 'navigator'"></component>
  </keep-alive>
</template>

<script>
// 插入备注
import InsertNotesModal from '@/base/InsertNotesModal'
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
// 快捷键弹窗
import ShortcutModal from '@/base/ShortcutModal'
// 复制样式弹窗
import CopyStyleModal from '@/base/CopyStyleModal'

import { mapGetters } from 'vuex'
export default {
  name: 'Modals',
  filters: {},
  components: {
    InsertNotesModal,
    InsertIconModal,
    InsertImagesModal,
    InsertUrlModal,
    ThemeStyleModal,
    NodeStyleModal,
    CanvasStructModal,
    SynopsisModal,
    ExportMinderModal,
    ShortcutModal,
    CopyStyleModal
  },
  computed: {
    ...mapGetters(['visibleModal'])
  }
}
</script>
