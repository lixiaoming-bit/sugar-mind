<template>
  <transition name="slide-fade-left">
    <div class="synopsis-modal-container">
      <basic-modal title="大纲">
        <template slot="content">
          <div class="synopsis-wrapper">
            <a-tree
              class="tree"
              tree-icon
              show-line
              :tree-data="treeData"
              :replace-fields="replaceFields"
            >
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
  name: 'InsertIconModal',
  components: {
    BasicModal
  },
  data() {
    return {
      treeData: [],
      replaceFields: {
        title: 'data'
      }
    }
  },
  computed: {
    ...mapGetters(['minder'])
  },
  created() {
    this.getTreeData()
    this.transformTreeData(this.treeData)
  },
  methods: {
    transformTreeData(data) {
      data.forEach(element => {
        if (element.children) {
          this.transformTreeData(element.children)
        } else {
          element['scopedSlots'] = {
            switcherIcon: 'child'
          }
        }
      })
    },
    getTreeData() {
      this.minder.exportData('json').then(res => {
        const tree = JSON.parse(res)
        this.treeData.push(tree.root)
        console.log('this.treeData: ', this.treeData)
      })
      //
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
    .tree {
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
</style>
<style lang="less">
.synopsis-wrapper {
  .ant-tree.ant-tree-show-line li:not(:last-child):before {
    border-left: 1px dashed #d9d9d9;
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
}
</style>
