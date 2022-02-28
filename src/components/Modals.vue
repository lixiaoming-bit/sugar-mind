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
import FontStyleModal from '@/base/FontStyleModal'
// 画布
import CanvasStructModal from '@/base/CanvasStructModal'
// 大纲
import SynopsisModal from '@/base/SynopsisModal'
import { mapGetters } from 'vuex'
export default {
  name: 'Modals',
  filters: {},
  components: {
    InsertIconModal,
    InsertImagesModal,
    InsertUrlModal,
    ThemeStyleModal,
    FontStyleModal,
    CanvasStructModal,
    SynopsisModal
  },
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['visibleModal'])
  },
  watch: {},
  mounted() {},
  created() {},
  methods: {}
}
</script>

<style scoped lang="less"></style>
