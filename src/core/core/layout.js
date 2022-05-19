import utils from './utils'
import Minder from './minder'
import MinderNode from './node'
const kity = window.kity

const _layouts = {}
let _defaultLayout

function register(name, layout) {
  _layouts[name] = layout
  _defaultLayout = _defaultLayout || name
}

/**
 * @class Layout 布局基类，具体布局需要从该类派生
 */
const Layout = kity.createClass('Layout', {
  /**
   * @abstract
   *
   * 子类需要实现的布局算法，该算法输入一个节点，排布该节点的子节点（相对父节点的变换）
   *
   * @param  {MinderNode} node 需要布局的节点
   *
   * @example
   *
   * doLayout: function(node) {
   *     var children = node.getChildren();
   *     // layout calculation
   *     children[i].setLayoutTransform(new kity.Matrix().translate(x, y));
   * }
   */
  doLayout() {
    throw new Error('Not Implement: Layout.doLayout()')
  },
  doSummaryLayout() {
    throw new Error('Not Implement: Layout.doSummaryLayout()')
  },

  /**
   * 对齐指定的节点
   *
   * @param {Array<MinderNode>} nodes 要对齐的节点
   * @param {string} border 对齐边界，允许取值 left, right, top, bottom
   *
   */
  align(nodes, border, offset) {
    const self = this
    offset = offset || 0
    nodes.forEach(function (node) {
      const { left, right, top, bottom } = self.getTreeBox([node])
      const matrix = node.getLayoutTransform()
      switch (border) {
        case 'left':
          return matrix.translate(offset - left, 0)
        case 'right':
          return matrix.translate(offset - right, 0)
        case 'top':
          return matrix.translate(0, offset - top)
        case 'bottom':
          return matrix.translate(0, offset - bottom)
      }
    })
  },

  stack(nodes, axis, distance) {
    const self = this

    let position = 0

    distance =
      distance ||
      function (node, next, axis) {
        return (
          node.getStyle(
            {
              x: 'margin-right',
              y: 'margin-bottom'
            }[axis]
          ) +
          next.getStyle(
            {
              x: 'margin-left',
              y: 'margin-top'
            }[axis]
          )
        )
      }

    nodes.forEach(function (node, index, nodes) {
      const { width, height, left, top } = self.getTreeBox([node])

      const size = {
        x: width,
        y: height
      }[axis]

      const offset = {
        x: left,
        y: top
      }[axis]

      const matrix = node.getLayoutTransform()

      if (axis === 'x') {
        matrix.translate(position - offset, 0)
      } else {
        matrix.translate(0, position - offset)
      }
      position += size
      if (nodes[index + 1]) position += distance(node, nodes[index + 1], axis)
    })
    return position
  },

  move(nodes, dx, dy) {
    nodes.forEach(function (node) {
      node.getLayoutTransform().translate(dx, dy)
    })
  },

  /**
   * 工具方法：获取给点的节点所占的布局区域
   *
   * @param  {MinderNode[]} nodes 需要计算的节点
   *
   * @return {Box} 计算结果
   */
  getBranchBox(nodes) {
    let box = new kity.Box()
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const matrix = node.getLayoutTransform()
      const contentBox = node.getContentBox()
      box = box.merge(matrix.transformBox(contentBox))
    }

    return box
  },

  /**
   * 工具方法：计算给定的节点的子树所占的布局区域
   *
   * @param  {MinderNode} nodes 需要计算的节点
   *
   * @return {Box} 计算的结果
   */
  getTreeBox(nodes) {
    let box = new kity.Box()

    if (!(nodes instanceof Array)) nodes = [nodes]

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const matrix = node.getLayoutTransform()

      let treeBox = node.getContentBox()

      const children = [...node.getChildren(), ...node.getSummary()]

      if (node.isExpanded() && children.length) {
        treeBox = treeBox.merge(this.getTreeBox(children))
      }
      box = box.merge(matrix.transformBox(treeBox))
    }

    return box
  },
  getSummaryBox(node) {
    const nodes = node.parent.getChildren().slice(node.data.startIndex, node.data.endIndex + 1)
    return this.getTreeBox(nodes)
  },

  getOrderHint() {
    return []
  }
})

Layout.register = register

Minder.registerInitHook(function () {
  this.refresh()
})

/**
 * 布局池子管理
 */
utils.extend(Minder, {
  getLayoutList() {
    return _layouts
  },

  getLayoutInstance(name) {
    const LayoutClass = _layouts[name]
    if (!LayoutClass) throw new Error('Missing Layout: ' + name)
    const layout = new LayoutClass()
    return layout
  }
})

/**
 * MinderNode 上的布局支持
 */
kity.extendClass(MinderNode, {
  /**
   * 获得当前节点的布局名称
   *
   * @return {String}
   */
  getLayout() {
    return this.getData('layout') || (this.isRoot() ? _defaultLayout : this.parent.getLayout())
  },

  setLayout(name) {
    if (name) {
      if (name === 'inherit') {
        this.setData('layout')
      } else {
        this.setData('layout', name)
      }
    }
    return this
  },

  layout(name) {
    this.setLayout(name).getMinder().layout()
    return this
  },

  getLayoutInstance() {
    return Minder.getLayoutInstance(this.getLayout())
  },

  getOrderHint() {
    return this.parent.getLayoutInstance().getOrderHint(this)
  },

  /**
   * 获取当前节点相对于父节点的布局变换
   */
  getLayoutTransform() {
    return this._layoutTransform || new kity.Matrix()
  },

  /**
   * 第一轮布局计算后，获得的全局布局位置
   *
   * @return {[type]} [description]
   */
  getGlobalLayoutTransformPreview() {
    const pMatrix = this.parent ? this.parent.getLayoutTransform() : new kity.Matrix()
    let matrix = this.getLayoutTransform()
    const offset = this.getLayoutOffset()
    if (offset) {
      matrix = matrix.clone().translate(offset.x, offset.y)
    }
    return pMatrix.merge(matrix)
  },

  getLayoutPointPreview() {
    return this.getGlobalLayoutTransformPreview().transformPoint(new kity.Point())
  },

  /**
   * 获取节点相对于全局的布局变换
   */
  getGlobalLayoutTransform() {
    if (this._globalLayoutTransform) {
      return this._globalLayoutTransform
    } else if (this.parent) {
      return this.parent.getGlobalLayoutTransform()
    } else {
      return new kity.Matrix()
    }
  },

  /**
   * 设置当前节点相对于父节点的布局变换
   */
  setLayoutTransform(matrix) {
    this._layoutTransform = matrix
    return this
  },

  /**
   * 设置当前节点相对于全局的布局变换（冗余优化）
   */
  setGlobalLayoutTransform(matrix) {
    this.getRenderContainer().setMatrix((this._globalLayoutTransform = matrix))
    return this
  },

  setVertexIn(p) {
    this._vertexIn = p
  },

  setVertexOut(p) {
    this._vertexOut = p
  },

  getVertexIn() {
    return this._vertexIn || new kity.Point()
  },

  getVertexOut() {
    return this._vertexOut || new kity.Point()
  },

  getLayoutVertexIn() {
    return this.getGlobalLayoutTransform().transformPoint(this.getVertexIn())
  },

  getLayoutVertexOut() {
    return this.getGlobalLayoutTransform().transformPoint(this.getVertexOut())
  },

  setLayoutVectorIn(v) {
    this._layoutVectorIn = v
    return this
  },

  setLayoutVectorOut(v) {
    this._layoutVectorOut = v
    return this
  },

  getLayoutVectorIn() {
    return this._layoutVectorIn || new kity.Vector()
  },

  getLayoutVectorOut() {
    return this._layoutVectorOut || new kity.Vector()
  },

  getLayoutBox() {
    const matrix = this.getGlobalLayoutTransform()
    return matrix.transformBox(this.getContentBox())
  },

  getLayoutPoint() {
    const matrix = this.getGlobalLayoutTransform()
    return matrix.transformPoint(new kity.Point())
  },

  getLayoutOffset() {
    if (!this.parent) return new kity.Point()
    // 影响当前节点位置的是父节点的布局
    const data = this.getData('layout_' + this.parent.getLayout() + '_offset')
    if (data) return new kity.Point(data.x, data.y)
    return new kity.Point()
  },

  setLayoutOffset(p) {
    if (!this.parent) return this

    this.setData(
      'layout_' + this.parent.getLayout() + '_offset',
      p
        ? {
            x: p.x,
            y: p.y
          }
        : undefined
    )

    return this
  },

  hasLayoutOffset() {
    return !!this.getData('layout_' + this.parent.getLayout() + '_offset')
  },

  resetLayoutOffset() {
    return this.setLayoutOffset(null)
  },

  getLayoutRoot() {
    if (this.isLayoutRoot()) {
      return this
    }
    return this.parent.getLayoutRoot()
  },

  isLayoutRoot() {
    return this.getData('layout') || this.isRoot()
  },
  /**
   * 为提供方法给节点连线使用，供getSummaryBox调用
   * @param {*} nodes
   * @returns
   */
  getTreeBoxForSum(nodes) {
    let box = new kity.Box()

    if (!(nodes instanceof Array)) nodes = [nodes]

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const matrix = node.getLayoutTransform()

      let treeBox = node.getContentBox()

      const children = [...node.getChildren(), ...node.getSummary()]

      if (node.isExpanded() && children.length) {
        treeBox = treeBox.merge(this.getTreeBoxForSum(children))
      }
      const nowbox = matrix.transformBox(treeBox)
      box = box.merge(nowbox)
    }

    return box
  },
  /**
   * 计算概要节点所概要的box，并挂载在node节点下
   * @param {概要节点} node
   * @returns
   */
  getSummaryBox(node) {
    const nodes = node.parent.getChildren().slice(node.data.startIndex, node.data.endIndex + 1)
    return this.getTreeBoxForSum(nodes)
  }
})

/**
 * Minder 上的布局支持
 */
kity.extendClass(Minder, {
  layout() {
    const duration = this.getOption('layoutAnimationDuration')

    this.getRoot().traverse(function (node) {
      // clear last results
      node.setLayoutTransform(null)
    })
    const minder = this
    function layoutNode(node, round) {
      // layout all children first
      // 剪枝：收起的节点无需计算
      ;[...node.getChildren(), ...node.getSummary()].forEach(function (child) {
        layoutNode(child, round)
      })

      const layout = node.getLayoutInstance()
      // var childrenInFlow = node.getChildren().filter(function(child) {
      //     return !child.hasLayoutOffset();
      // });
      layout.doLayout(node, node.getChildren(), round)
      // 概要节点布局
      if (node.getSummary().length) {
        let left = []
        let right = []
        node.getSummary().forEach(e => {
          const getFirstAttachNode = e.parent.getChildren()[e.data.startIndex]
          switch (minder.getTemplate()) {
            case 'default':
              getFirstAttachNode.position === 'right' ? right.push(e) : left.push(e)
              break
            case 'right':
              right.push(e)
              break
            default:
              break
          }
        })
        const leftSumLayout = Minder.getLayoutInstance('sumLeft')
        const rightSumLayout = Minder.getLayoutInstance('sumRight')
        leftSumLayout.doLayout(node, left)
        rightSumLayout.doLayout(node, right)
      }
    }

    // 第一轮布局
    layoutNode(this.getRoot(), 1)

    // 第二轮布局
    layoutNode(this.getRoot(), 2)

    this.applyLayoutResult(this.getRoot(), duration, function () {
      /**
       * 当节点>200, 不使用动画时, 此处逻辑变为同步逻辑, 外部minder.on事件无法
       * 被提前录入, 因此增加setTimeout
       */
      setTimeout(function () {
        minder.fire('layoutallfinish')
      }, 0)
    })

    return this.fire('layout')
  },

  refresh() {
    this.getRoot().renderTree()
    this.layout().fire('contentchange')._interactChange()
    return this
  },

  applyLayoutResult(root, duration, callback) {
    root = root || this.getRoot()
    const self = this

    let complex = root.getComplex()

    function consume() {
      if (!--complex) {
        if (callback) {
          callback()
        }
      }
    }

    // 节点复杂度大于 100，关闭动画
    if (complex > 200) duration = 0

    function applyMatrix(node, matrix) {
      node.setGlobalLayoutTransform(matrix)

      self.fire('layoutapply', {
        node: node,
        matrix: matrix
      })
    }

    function apply(node, pMatrix) {
      const matrix = node.getLayoutTransform().merge(pMatrix.clone())
      const lastMatrix = node.getGlobalLayoutTransform() || new kity.Matrix()

      const offset = node.getLayoutOffset()
      matrix.translate(offset.x, offset.y)

      matrix.m.e = Math.round(matrix.m.e)
      matrix.m.f = Math.round(matrix.m.f)

      // 如果当前有动画，停止动画
      if (node._layoutTimeline) {
        node._layoutTimeline.stop()
        node._layoutTimeline = null
      }

      // 如果要求以动画形式来更新，创建动画
      if (duration) {
        node._layoutTimeline = new kity.Animator(lastMatrix, matrix, applyMatrix)
          .start(node, duration, 'ease')
          .on('finish', function () {
            // 性能低的时候可能会丢帧，手动添加一帧
            setTimeout(function () {
              applyMatrix(node, matrix)
              self.fire('layoutfinish', {
                node: node,
                matrix: matrix
              })
              consume()
            }, 150)
          })
      }

      // 否则直接更新
      else {
        applyMatrix(node, matrix)
        self.fire('layoutfinish', {
          node: node,
          matrix: matrix
        })
        consume()
      }
      const allNode = [...node.getChildren(), ...node.getSummary()]
      for (let i = 0; i < allNode.length; i++) {
        apply(allNode[i], matrix)
      }
    }
    apply(root, root.parent ? root.parent.getGlobalLayoutTransform() : new kity.Matrix())
    return this
  }
})

export default Layout
