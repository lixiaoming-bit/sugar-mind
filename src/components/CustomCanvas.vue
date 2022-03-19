<template>
  <div class="custom-canvas-container mousetrap" v-contextmenu:contextmenu>
    <!-- 全局备注预览器 -->
    <note-previewer v-if="isShowChildComponent"></note-previewer>
    <!-- 全局菜单 -->
    <v-contextmenu ref="contextmenu" :disabled="!contextmenuList.length">
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
      <V-contextmenu-submenu
        title="移除主题内容"
        max-height="100"
        v-if="selectedNode"
        :style="style"
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
      </V-contextmenu-submenu>
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
import {
  NODE_FONT_STYLE_SETTING,
  generateSelectedNodeContextmenu,
  generateSelectedPaperContextmenu,
  removeNodeContextmenu
} from '@/config'
import generateEditor from '@/utils/quill-editor'
export default {
  name: 'CustomCanvas',
  components: {
    NotePreviewer
  },
  data() {
    return {
      contextmenuList: [],
      removeMenuList: [],
      editor: null,
      selectedNode: null,
      style: {
        color: '#1a1a1a'
      }
    }
  },
  computed: {
    ...mapGetters(['displayMode', 'macosCommandText', 'macosOptionText']),
    isShowChildComponent() {
      return this.displayMode === 'normal'
    },
    isContextmenuDisabled() {
      return !this.contextmenuList.length || this.editor?.minder.getStatus() === 'readonly'
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
      const { minder } = this.editor

      this.SET_MINDER(minder)
      this.SET_DISPLAY_MODE('normal')

      // 初始化设置
      this.handleStoreNodeFontStyle(minder)

      // 监听缩放
      minder.on('zoom', event => {
        const { zoom } = event
        this.SET_MINDER_ZOOM(zoom)
      })
      // 监听左键菜单
      minder.on('contextmenu', event => {
        this.selectedNode = event.minder.getSelectedNode()
        this.contextmenuList = this.selectedNode
          ? generateSelectedNodeContextmenu(this.handleCheckDisabled, this.macosCommandText)
          : generateSelectedPaperContextmenu(
              this.handleCheckDisabled,
              this.macosCommandText,
              this.macosOptionText
            )
        this.removeMenuList = this.selectedNode
          ? removeNodeContextmenu(this.handleCheckDisabled)
          : ''
      })
      // 监听双击编辑节点
      minder.on('normal.dblclick', e => {
        generateEditor(e)
      })
      // 监听处理全局单击事件 需要添加防抖
      minder.on('normal.click', e => {
        this.handleStoreNodeFontStyle(e.minder)
      })
    },
    // 菜单点击事件
    handleContextmenuClick(item) {
      if (item.command) {
        console.log('item.command: ', item.command)
        this.editor.minder.execCommand(item.command)
      }
    },
    // 处理选中的节点 将节点的信息传入到store中
    handleStoreNodeFontStyle(minder) {
      const node = minder.getSelectedNode()
      if (node) {
        const style = {}
        const getDataOrStyle = name => node.getData(name) || node.getStyle(name)
        for (const key in NODE_FONT_STYLE_SETTING) {
          if (Object.hasOwnProperty.call(NODE_FONT_STYLE_SETTING, key)) {
            const head = key.replace(/([a-zA-Z])([A-Z])/g, '$1-$2').toLowerCase()
            const target = getDataOrStyle(head) * 1
            style[key] = target * 1 || target || NODE_FONT_STYLE_SETTING[key]
          }
        }
        this.SET_NODE_STYLE(style)
      } else {
        this.SET_VISIBLE_MODAL()
        this.SET_NODE_STYLE()
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
}
</style>
<style>
.ql-container {
  height: 100%;
  margin: 0;
  min-height: 100%;
  padding: 0;
  pointer-events: all;
  text-align: left;
  top: 0;
  width: 100%;
}
.ql-editor {
  margin: 0;
  outline: none;
  padding: 0;
}
.ql-container p,
.ql-container p span {
  word-wrap: normal;
  margin: 0;
  white-space: nowrap;
  word-break: normal;
}
.fo-text p,
.fo-text p span {
  word-wrap: normal;
  margin: 0;
  white-space: nowrap;
  word-break: normal;
}
</style>
