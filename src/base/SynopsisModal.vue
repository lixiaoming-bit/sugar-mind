<template>
  <transition name="slide-fade-left">
    <div class="synopsis-modal-container">
      <basic-modal title="大纲">
        <template slot="content">
          <div class="synopsis-wrapper">
            <a-tree
              tree-icon
              show-line
              v-if="showSynopsis"
              class="synopsis-tree"
              :tree-data="treeData"
              :replace-fields="replaceFields"
              :selected-keys.sync="selectedKeys"
              :default-expanded-keys="defaultExpandedKeys"
              @select="handleSelect"
            >
              <template v-slot:title="scope" class="title">
                {{ scope.text }}
              </template>
              <a-icon class="down" slot="switcherIcon" type="caret-down" />
              <icon-font class="child-icon" slot="child" type="iconicon_draw_outline_dots" />
            </a-tree>
          </div>
        </template>
      </basic-modal>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import BasicModal from './BasicModal'

export default {
  name: 'SynopsisModal',
  components: {
    BasicModal
  },
  data() {
    return {
      showSynopsis: false,
      selectedKeys: [],
      defaultExpandedKeys: [],
      treeData: [],
      replaceFields: {
        title: 'text',
        key: 'id'
      }
    }
  },
  computed: {
    ...mapGetters(['minder'])
  },
  activated() {
    this.getTreeData()
    this.minder.on('contentchange', () => this.getTreeData())
  },
  methods: {
    transformTreeData(data) {
      data.forEach(element => {
        element.data['scopedSlots'] = {
          title: 'title'
        }
        element.children = [...element.children.common, ...element.children.summary]
        if (element.children.length) {
          this.transformTreeData(element.children)
        } else {
          Object.assign(element.data['scopedSlots'], { switcherIcon: 'child' })
        }
        if (element.expandState !== 'collapse') {
          this.defaultExpandedKeys.push(element.data.id)
        }
        Object.assign(element, JSON.parse(JSON.stringify(element.data)))
        delete element.data
      })
    },
    // 获取树节点数据
    getTreeData() {
      this.showSynopsis = false
      this.minder.exportData('json').then(res => {
        const target = []
        const tree = JSON.parse(res)
        target.push(tree.root)
        this.transformTreeData(target)
        this.treeData = target.slice()
        // 设置初始值
        const selectedNode = this.minder.getSelectedNode()
        if (selectedNode) {
          this.selectedKeys = [selectedNode.data.id]
        }
        this.showSynopsis = true
      })
    },
    handleSelect(selectedKeys) {
      this.minder.selectById(selectedKeys, true)
      this.minder.execCommand('camera', this.minder.getSelectedNode(), 800)
    }
  }
}
</script>

<style scoped lang="less">
.synopsis-modal-container {
  position: fixed;
  right: 10px;
  bottom: 80px;
  width: 340px;
  top: 100px;
  z-index: 2;
  box-shadow: 0 2px 16px 0 #0000000f;
  .synopsis-wrapper {
    padding: 0 20px;
    .synopsis-tree {
      outline: none;
      .root {
        color: pink;
      }
      .child-icon {
        font-size: 25px;
      }
      .down {
        color: #000000d9;
      }
    }
  }
}
.slide-fade-left-enter-active {
  transition: all 0.25s linear;
}
.slide-fade-left-leave-active {
  transition: all 0.25s linear;
}
.slide-fade-left-enter,
.slide-fade-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
<style lang="less">
.synopsis-wrapper {
  .ant-tree.ant-tree-show-line li:not(:last-child):before {
    border-left: 1px dashed #d9d9d9;
  }
  .ant-tree li {
    margin-top: 8px;
  }
  .ant-tree > li > .ant-tree-node-content-wrapper {
    font-size: 20px;
    font-weight: 700;
    color: #000000d9;
  }
  .ant-tree > li > .ant-tree-child-tree > li > .ant-tree-node-content-wrapper {
    font-size: 16px;
    font-weight: 700;
    color: #000000d9;
  }
  .ant-tree .ant-tree-node-content-wrapper:hover {
    background-color: #f2f3f5;
  }
  .ant-tree .ant-tree-node-content-wrapper {
    overflow: hidden;
    text-overflow: ellipsis;
    width: calc(100% - 24px);
  }
  .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: #f2f3f5;
  }
}
</style>
