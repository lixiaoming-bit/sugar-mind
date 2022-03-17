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
      <V-contextmenu-submenu title="移除图标" max-height="100" v-if="selectedNode">
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
      selectedNode: null
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
    ...mapMutations(['SET_MINDER_ZOOM', 'SET_MINDER', 'SET_DISPLAY_MODE']),
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
      minder.on('zoom', event => {
        const { zoom } = event
        this.SET_MINDER_ZOOM(zoom)
      })
      minder.on('contextmenu', event => {
        this.selectedNode = event.minder.getSelectedNode()
        console.log('selectedNode: ', this.selectedNode)
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
      // 双击编辑节点
      minder.on('normal.dblclick', e => {
        generateEditor(e)
      })
    },
    // 菜单点击事件
    handleContextmenuClick(item) {
      if (item.command) {
        this.editor.minder.execCommand(item.command)
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
</style>
