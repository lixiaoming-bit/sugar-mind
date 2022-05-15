<template>
  <div class="custom-canvas-container mousetrap" v-contextmenu:contextmenu>
    <!-- 全局备注预览器 -->
    <note-previewer v-if="isShowChildComponent"></note-previewer>
    <!-- 全局搜索器 -->
    <search-node v-if="isShowChildComponent"></search-node>
    <!-- 全局popover提示器 -->
    <popover v-if="isShowChildComponent"></popover>
    <!-- 全局菜单 -->
    <v-contextmenu
      ref="contextmenu"
      :disabled="!contextmenuList.length"
      :event-type="null"
      :auto-placement="true"
    >
      <!-- 选中：移除主题内容 -->
      <v-contextmenu-submenu
        v-if="selectedNode && removeMenuList.length"
        title="移除主题内容"
        :style="{ color: '#1a1a1a' }"
      >
        <v-contextmenu-item
          v-for="item in removeMenuList"
          :key="item.key"
          :disabled="item.disable"
          @click="handleContextmenuClick(item)"
        >
          <div class="contextmenu-item">
            <div class="title">{{ item.title }}</div>
            <div class="description">{{ item.description }}</div>
          </div>
        </v-contextmenu-item>
      </v-contextmenu-submenu>

      <!-- 选中：快速插入主题 -->
      <v-contextmenu-submenu v-if="selectedNode" title="快速插入主题" :style="{ color: '#1a1a1a' }">
        <v-contextmenu-item
          v-for="item in quickInsertMenuList"
          :key="item.key"
          @click="handleQuickInsert(item)"
        >
          <div class="contextmenu-item">
            <div class="title">{{ item.title }}</div>
            <div class="description">{{ item.description }}</div>
          </div>
        </v-contextmenu-item>
      </v-contextmenu-submenu>

      <!-- 选中：快速选择主题 -->
      <v-contextmenu-submenu v-if="selectedNode" title="快速选择主题" :style="{ color: '#1a1a1a' }">
        <v-contextmenu-item
          v-for="item in quickSelectMenuList"
          :key="item.key"
          @click="handleQuickSelect(item)"
        >
          <div class="contextmenu-item">
            <div class="title">{{ item.title }}</div>
            <div class="description">{{ item.description }}</div>
          </div>
        </v-contextmenu-item>
      </v-contextmenu-submenu>

      <!-- 不选中：展开至指定主题 -->

      <v-contextmenu-submenu v-else title="展开至" :style="{ color: '#1a1a1a' }">
        <v-contextmenu-item
          v-for="item in expandToLevelMenuList"
          :key="item.key"
          @click="handleExpandToLevel(item)"
        >
          <div class="contextmenu-item">
            <div class="title">{{ item.title }}</div>
            <div class="description">{{ item.description }}</div>
          </div>
        </v-contextmenu-item>
      </v-contextmenu-submenu>

      <!-- 菜单列表 -->
      <v-contextmenu-item
        :key="item.key"
        :disabled="item.disabled"
        @click="handleContextmenuClick(item)"
        v-for="item in contextmenuList"
      >
        <div class="contextmenu-item">
          <div class="title">{{ item.title }}</div>
          <div class="description">{{ item.description }}</div>
        </div>
      </v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import kity from 'kity'

import '../core/kityminder'
import '../core/kityminder.css'
import KMEditor from '../editor/editor'

import { mapGetters, mapMutations } from 'vuex'

import NotePreviewer from '@/base/NotePreviewer'
import SearchNode from '@/base/SearchNode'
import Popover from '@/base/Popover'
import {
  QUICK_INSERT_CONTEXTMENU,
  QUICK_SELECT_CONTEXTMENU,
  NODE_FONT_STYLE_SETTING,
  generateExpandToLevelMenu,
  generateSelectedNodeContextmenu,
  generateSelectedPaperContextmenu,
  removeNodeContextmenu
} from '@/config'
import createEditor from '@/utils/quill-editor'
export default {
  name: 'CustomCanvas',
  components: {
    NotePreviewer,
    SearchNode,
    Popover
  },
  data() {
    return {
      contextmenuList: [],
      removeMenuList: [],
      quickInsertMenuList: QUICK_INSERT_CONTEXTMENU.slice(),
      quickSelectMenuList: QUICK_SELECT_CONTEXTMENU.slice(),
      editor: null,
      selectedNode: null
    }
  },
  computed: {
    ...mapGetters(['displayMode', 'macosCommandText', 'macosOptionText', 'visibleModal']),
    isShowChildComponent() {
      return this.displayMode === 'normal'
    },
    expandToLevelMenuList() {
      return generateExpandToLevelMenu(this.macosOptionText).slice()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapMutations([
      'SET_MINDER_ZOOM',
      'SET_MINDER',
      'SET_DISPLAY_MODE',
      'SET_VISIBLE_MODAL',
      'SET_NODE_STYLE'
    ]),
    // 检查当前的值
    handleCheckValue(command) {
      const value = this.editor.minder.queryCommandValue(command)
      return !value && value !== 0
    },
    // 检查当前的状态
    handleCheckDisabled(command) {
      return this.editor.minder.queryCommandState(command) === -1
    },
    // 检查当前是否未根节点
    handleCheckIsRoot() {
      return this.editor.minder.getSelectedNode().isRoot()
    },
    // 初始化
    init() {
      const el = document.querySelector('.custom-canvas-container')
      this.editor = new KMEditor(el)
      window.KMEditor = this.editor
      const { minder } = this.editor

      console.log('minder', minder.getRoot())
      this.SET_MINDER(minder)
      this.SET_DISPLAY_MODE('normal')

      // 初始化设置
      this.handleStoreNodeFontStyle(minder)

      // 监听缩放
      minder.on('zoom', event => {
        const { zoom } = event
        this.SET_MINDER_ZOOM(zoom)
      })
      // 监听视图拖拽change 事件
      minder.on('viewchanged hand.beforemousemove', () => {
        this.$refs.contextmenu.hideAll()
      })
      minder.on('normal.mouseup', event => {
        const { button, pageX, pageY } = event.originEvent
        if (button === 2) {
          this.selectedNode = event.minder.getSelectedNode()

          // 408、228、310是当前菜单的宽高，会随着设置的选项数量发生变化
          const height = this.$refs.contextmenu.$el.offsetHeight || (this.selectedNode ? 408 : 228)
          const width = this.$refs.contextmenu.$el.offsetWidth || 310

          const top = window.innerHeight - pageY < height ? pageY - height : pageY
          const left = window.innerWidth - pageX < width ? pageX - width : pageX
          this.$refs.contextmenu.show({ top, left })
          this.contextmenuList = this.selectedNode
            ? generateSelectedNodeContextmenu(this.handleCheckDisabled, this.macosCommandText)
            : generateSelectedPaperContextmenu(
                this.handleCheckDisabled,
                this.macosCommandText,
                this.macosOptionText
              )
          this.removeMenuList = this.selectedNode
            ? removeNodeContextmenu(this.handleCheckValue).filter(item => !item.disabled)
            : ''
        }
      })
      // 监听左键菜单
      // minder.on('contextmenu', event => {})
      // 监听双击编辑节点
      minder.on('normal.dblclick normal.textedit', e => {
        createEditor(e)
      })
      // 监听处理全局单击事件 需要添加防抖
      minder.on('normal.click', e => {
        const node = e.minder.getSelectedNode()
        if (!node) {
          this.SET_VISIBLE_MODAL()
          this.SET_NODE_STYLE()
        }
      })
      // 监听选中状态 设置当前的选中信息
      minder.on('selectionchange', e => {
        this.handleStoreNodeFontStyle(e.minder)
      })
    },
    // 菜单点击事件
    handleContextmenuClick(item) {
      const { command } = item

      const theme = this.editor.minder.getTheme('theme')
      const flag = theme.includes('compact')

      if (command === 'theme') {
        const value = flag ? theme.replace('-compact', '') : theme + '-compact'
        this.editor.minder.execCommand(command, value)
      } else {
        command && this.editor.minder.execCommand(command)
      }
    },
    // 快速插入点击事件
    handleQuickInsert(item) {
      this.SET_VISIBLE_MODAL(item.modal)
    },
    // 快速插入选择事件
    handleQuickSelect(item) {
      this.editor.minder.execCommand(item.command)
    },
    // 展开节点至
    handleExpandToLevel(item) {
      this.editor.minder.execCommand(item.command, item.args)
    },
    // 处理选中的节点 将节点的信息传入到store中
    handleStoreNodeFontStyle(minder) {
      const node = minder.getSelectedNode()
      if (node) {
        if (this.visibleModal === 'CopyStyleModal') {
          minder.execCommand('pastestyle')
        }
        const style = {}
        const getDataOrStyle = name => node.getData(name) || node.getStyle(name)
        for (const key in NODE_FONT_STYLE_SETTING) {
          if (Object.hasOwnProperty.call(NODE_FONT_STYLE_SETTING, key)) {
            const head = key.replace(/([a-zA-Z])([A-Z])/g, '$1-$2').toLowerCase()
            const target = getDataOrStyle(head)
            style[key] = target * 1 || target || NODE_FONT_STYLE_SETTING[key]
          }
        }
        this.SET_NODE_STYLE(style)
      }
    }
  }
}
</script>

<style scoped lang="less">
.custom-canvas-container {
  z-index: 1;
  // padding: 80px 80px 40px 16px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.contextmenu-item {
  width: 280px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 14px;
  line-height: 26px;
  .title {
    flex: 1;
    color: #1a1a1a;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    letter-spacing: 1px;
  }
  .description {
    text-align: right;
    color: #999999;
    font-size: 12px;
    flex: 1;
    letter-spacing: 1px;
    font-weight: 400;
  }
}

.v-contextmenu--default {
  box-shadow: 0 4px 12px 0 #b0b0b080 !important;
  border-radius: 4px;
}
.v-contextmenu-item--hover {
  background-color: #f3f4f5 !important;
}
.v-contextmenu-item--disabled {
  .title {
    color: #808080;
  }
}
.v-contextmenu-item.v-contextmenu-submenu {
  font-size: 14px;
  line-height: 26px;
  color: #1a1a1a;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  letter-spacing: 1px;
}
</style>
<style></style>
