<template>
  <transition name="slide-fade-left">
    <div class="synopsis-modal-container">
      <basic-modal title="画布">
        <template slot="content">
          <div class="synopsis-wrapper">
            <a-tree
              class="tree"
              tree-icon
              show-line
              :style="treeStyle"
              :tree-data="treeData"
              :contenteditable="true"
            >
              <a-icon slot="switcherIcon" type="caret-down" />
              <icon-font class="childIcon" slot="child" type="iconicon_draw_outline_dots" />
            </a-tree>
          </div>
        </template>
      </basic-modal>
    </div>
  </transition>
</template>

<script>
import BasicModal from './BasicModal'

export default {
  name: 'InsertIconModal',
  components: {
    BasicModal
  },
  data() {
    return {
      treeData: [
        {
          key: '000',
          title: '1111',
          type: 'root',
          children: [
            {
              key: '1-222',
              title: '1-222',
              type: 'main',
              children: [
                {
                  key: '2-111',
                  title: '2-111'
                  // scopedSlots: { switcherIcon: 'child' }
                }
              ]
            },
            {
              key: '1-333',
              title: '1-333'
            },
            {
              key: '1-444',
              title: '1-444'
            },
            {
              key: '1-555',
              title: '1-555'
            }
          ]
        }
      ],
      treeStyle: {}
    }
  },
  computed: {},
  created() {
    const target = this.transformTreeData(this.treeData)
    console.log('target: ', target)
  },
  methods: {
    transformTreeData(data) {
      // const scopedSlots = {
      //   switcherIcon: 'child'
      // }
      data.forEach(element => {
        if (element.children) {
          this.transformTreeData(element.children)
        } else {
          console.log(element)
          element['scopedSlots'] = {
            switcherIcon: 'child'
          }
        }
      })
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
      .childIcon {
        font-size: 25px;
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
  .ant-tree > li:nth-child(3) {
    color: pink;
    font-size: 18px;
  }
}
</style>
