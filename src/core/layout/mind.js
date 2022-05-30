import Layout from '../core/layout'
import Minder from '../core/minder'
const kity = window.kity

Layout.register(
  'mind',
  kity.createClass({
    base: Layout,

    doLayout(node, children, round) {
      const half = Math.ceil(node.getChildren().length / 2)
      const right = []
      const left = []
      const leftList = children.filter(e => e.getData('side') === 'left')
      const rightList = children.filter(e => e.getData('side') === 'right')
      const rightReverse = rightList.reverse()
      let leftFirstBindNode = []
      let rightLastBindNode = []
      if (round === 2) {
        for (let i = 0; i < leftList.length; i++) {
          let findLeftFirstNode = false
          const e = leftList[i]
          if (e.isInSummary(e.parent).length) {
            leftFirstBindNode = children[0]?.getBindNode(e, leftList)
            findLeftFirstNode = true
          }
          if (findLeftFirstNode) break
        }
        for (let j = 0; j < rightReverse.length; j++) {
          let findRightFirstNode = false
          const item = rightReverse[j]
          if (item.isInSummary(item.parent).length) {
            rightLastBindNode = children[0]?.getBindNode(item, rightReverse)
            findRightFirstNode = true
          }
          if (findRightFirstNode) break
        }
      }
      children.forEach(e => {
        const leftIndex = leftFirstBindNode.indexOf(e)
        const rightIndex = rightLastBindNode.indexOf(e)
        // 在左边并且有绑定概要（将有重合概要的节点视为一个节点）
        if (leftIndex !== -1) {
          if (
            leftList.length - leftFirstBindNode.length + 1 > rightList.length - 1 &&
            leftFirstBindNode.indexOf(e) === leftFirstBindNode.length - 1
          ) {
            right.push(...leftFirstBindNode)
            leftFirstBindNode.forEach(a => {
              const lIndex = left.indexOf(a)
              lIndex !== -1 && left.splice(lIndex, 1)
            })
          } else left.push(e)
        }
        // 在右边，主要为了在删除节点的时候，节点回退到左边做绑定限制
        else if (rightIndex !== -1) {
          if (e.getIndex() > half && rightLastBindNode.indexOf(e) === 0) {
            left.unshift(...rightLastBindNode.reverse())
            rightLastBindNode.forEach(a => {
              const rIndex = right.indexOf(a)
              rIndex !== -1 && right.splice(rIndex, 1)
            })
          } else right.push(e)
        } else {
          if (e.getIndex() < half) right.push(e)
          else left.push(e)
        }
      })

      const leftLayout = Minder.getLayoutInstance('left')
      const rightLayout = Minder.getLayoutInstance('right')

      leftLayout.doLayout(node, left)
      rightLayout.doLayout(node, right)

      const box = node.getContentBox()
      node.setVertexOut(new kity.Point(box.cx, box.cy))
      node.setLayoutVectorOut(new kity.Vector(0, 0))
    },

    getOrderHint(node) {
      const hint = []
      const box = node.getLayoutBox()
      const offset = 5

      hint.push({
        type: 'up',
        node: node,
        area: new kity.Box({
          x: box.x,
          y: box.top - node.getStyle('margin-top') - offset,
          width: box.width,
          height: node.getStyle('margin-top')
        }),
        path: ['M', box.x, box.top - offset, 'L', box.right, box.top - offset]
      })

      hint.push({
        type: 'down',
        node: node,
        area: new kity.Box({
          x: box.x,
          y: box.bottom + offset,
          width: box.width,
          height: node.getStyle('margin-bottom')
        }),
        path: ['M', box.x, box.bottom + offset, 'L', box.right, box.bottom + offset]
      })
      return hint
    }
  })
)
