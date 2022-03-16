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
                  title: '2-111',
                  children: [
                    {
                      key: '3-111',
                      title: '3-111'
                    },
                    {
                      key: '4-111',
                      title: '4-111'
                    }
                  ]
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
            },
            {
              key: '1-555',
              title: '1-555',
              children: [
                {
                  key: '3-111',
                  title: '3-111'
                },
                {
                  key: '4-111',
                  title: '4-111'
                }
              ]
            },
            {
              key: '1-555',
              title: '1-555'
            }
          ]
        }
      ],
      treeStyle: {
        // fontSize: '18px'
      }
    }
  },
  computed: {
    // treeStyle() {
    //   return {}
    // }
  },
  created() {
    const target = this.transformTreeData(this.treeData)
    console.log('target: ', target)
  },
  methods: {
    transformTreeData(data) {
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
