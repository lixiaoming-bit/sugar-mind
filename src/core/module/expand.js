import utils from '../core/utils'
import MinderNode from '../core/node'
import Command from '../core/command'
import Module from '../core/module'
import Renderer from '../core/render'
const kity = window.kity
Module.register('Expand', function () {
  const minder = this
  const EXPAND_STATE_DATA = 'expandState'
  const STATE_EXPAND = 'expand'
  const STATE_COLLAPSE = 'collapse'
  let IS_COLLAPSE_ALL = true

  // 将展开的操作和状态读取接口拓展到 MinderNode 上
  kity.extendClass(MinderNode, {
    /**
     * 展开节点
     * @param  {Policy} policy 展开的策略，默认为 KEEP_STATE
     */
    expand() {
      this.setData(EXPAND_STATE_DATA, STATE_EXPAND)
      return this
    },

    /**
     * 收起节点
     */
    collapse() {
      this.setData(EXPAND_STATE_DATA, STATE_COLLAPSE)
      return this
    },

    /**
     * 判断节点当前的状态是否为展开
     */
    isExpanded() {
      const expanded = this.getData(EXPAND_STATE_DATA) !== STATE_COLLAPSE
      return expanded && (this.isRoot() || this.parent.isExpanded())
    },

    /**
     * 判断节点当前的状态是否为收起
     */
    isCollapsed() {
      return !this.isExpanded()
    }
  })

  /**
   * @command Expand
   * @description 展开当前选中的节点，保证其可见
   * @param {bool} justParents 是否只展开到父亲
   *     * `false` - （默认）保证选中的节点以及其子树可见
   *     * `true` - 只保证选中的节点可见，不展开其子树
   * @state
   *   0: 当前有选中的节点
   *  -1: 当前没有选中的节点
   */
  const ExpandCommand = kity.createClass('ExpandCommand', {
    base: Command,

    execute(km, justParents) {
      let node = km.getSelectedNode()
      if (!node) return
      if (justParents) {
        node = node.parent
      }
      while (node.parent) {
        node.expand()
        node = node.parent
      }
      node.renderTree()
      km.layout(100)
    },

    queryState(km) {
      const node = km.getSelectedNode()
      return node && !node.isRoot() && !node.isExpanded() ? 0 : -1
    }
  })

  /**
   * @command Collapse
   * @description 收起当前节点的子树
   * @state
   *   0: 当前有选中的节点
   *  -1: 当前没有选中的节点
   */
  const CollapseCommand = kity.createClass('CollapseCommand', {
    base: Command,

    execute(km) {
      const node = km.getSelectedNode()
      if (!node) return

      node.collapse()
      node.renderTree()
      km.layout()
    },

    queryState(km) {
      const node = km.getSelectedNode()
      return node && !node.isRoot() && node.isExpanded() ? 0 : -1
    }
  })

  /**
   * @command Toggle
   * @description 切换当前关闭折叠的节点
   * @state
   *   0: 当前有选中的节点
   *  -1: 当前没有选中的节点
   */

  const ToggleExpandCommand = kity.createClass('ToggleExpandCommand', {
    base: Command,

    execute(km) {
      const node = km.getSelectedNode()
      if (!node) return
      const expanded = node.isExpanded()
      km.getSelectedNodes().forEach(node => {
        expanded ? node.collapse() : node.expand()
      })
      node.renderTree()
      km.layout(100)
    },

    queryState(km) {
      const node = km.getSelectedNode()
      return node && !node.isRoot() ? 0 : -1
    }
  })

  /**
   * @command ExpandToLevel
   * @description 展开脑图到指定的层级
   * @param {number} level 指定展开到的层级，最少值为 1。
   * @state
   *   0: 一直可用
   */
  const ExpandToLevelCommand = kity.createClass('ExpandToLevelCommand', {
    base: Command,
    execute(km, level) {
      if (level) {
        level -= 48
        IS_COLLAPSE_ALL = true
      } else {
        level = IS_COLLAPSE_ALL ? 1 : 9999
        IS_COLLAPSE_ALL = !IS_COLLAPSE_ALL
      }
      km.getRoot().traverse(function (node) {
        if (node.getLevel() < level) node.expand()
        if (node.getLevel() === level && !node.isLeaf()) node.collapse()
      })
      km.refresh(100)
    },
    enableReadOnly: true
  })

  class Expander extends kity.Group {
    constructor(node) {
      super()
      this.radius = 7
      const PATH = ['M', 1.5 - this.radius, 0, 'L', this.radius - 1.5, 0]
      this.outline = new kity.Circle(this.radius).stroke('black').fill('white')
      this.textOutLint = new kity.Circle(10).stroke('black').fill('white')
      this.sign = new kity.Path(PATH).stroke('gray')
      this.number = new kity.Text()
        .setTextAnchor('middle')
        .setVerticalAlign('middle')
        .setFontSize(12)
        .setFontBold(true)
      this.toggleSymbolState(false, false)
      this.addShapes([this.outline, this.textOutLint, this.sign, this.number])
      this.initEvent(node)
      this.setId(utils.uuid('node_expander'))
      this.addClass('node-expander')
      this.setStyle('cursor', 'pointer')
    }
    initEvent(node) {
      this.on('mousedown', function (e) {
        minder.select([node], true)
        if (node.isExpanded()) {
          node.collapse()
        } else {
          node.expand()
        }
        node.renderTree().getMinder().layout(100)
        node.getMinder().fire('contentchange')
        e.stopPropagation()
        e.preventDefault()
      })
      this.on('dblclick click mouseup', function (e) {
        e.stopPropagation()
        e.preventDefault()
      })
    }

    setState(node) {
      const visible = node.parent.isExpanded()
      const state = visible && node.getChildren().length ? node.getData(EXPAND_STATE_DATA) : 'hide'
      if (state === 'hide') {
        this.setVisible(false)
        return
      }
      this.setVisible(true)

      if (node.isExpanded()) {
        const flag = node._isHover || node.isSelected()
        this.toggleSymbolState(flag, false)
      } else {
        this.toggleSymbolState(false, true)
      }
    }

    setContent(node) {
      let number = node.getComplex() - 1
      if (number > 99) {
        number = '...'
        this.number.setContent(number).setY(0).setAttr('dy', 0)
      } else {
        this.number.setContent(number).setY(4).setAttr('dy', 0)
      }
    }

    toggleSymbolState(sign, count) {
      this.sign.setVisible(sign)
      this.outline.setVisible(sign)
      this.number.setVisible(count)
      this.textOutLint.setVisible(count)
    }
  }

  const ExpanderRenderer = kity.createClass('ExpanderRenderer', {
    base: Renderer,

    create(node) {
      if (node.isRoot()) return
      this.expander = new Expander(node)
      node.getRenderContainer().prependShape(this.expander)
      node.expanderRenderer = this
      return this.expander
    },

    shouldRender(node) {
      return !node.isRoot() && (node._isHover || node.isSelected() || node.isCollapsed())
    },

    update(expander, node) {
      // 拖动状态不显示 不放在shouldRender 此种效率最高
      if (node._isDragging) {
        expander.toggleSymbolState(false, false)
        return
      }
      if (!node.parent) return

      expander.setState(node)
      expander.setContent(node)

      const vector = node
        .getLayoutVectorIn()
        .normalize(expander.radius + node.getStyle('stroke-width') + 5)

      const position = node.getVertexOut().offset(vector)
      this.expander.setTranslate(position)
    }
  })

  return {
    commands: {
      expand: ExpandCommand,
      expandtolevel: ExpandToLevelCommand,
      collapse: CollapseCommand,
      toggleexpand: ToggleExpandCommand
    },
    commandShortcutKeys: {
      expandtolevel: 'command+alt+/|ctrl+alt+/|alt+1|alt+2|alt+3|alt+4|alt+5|alt+6',
      toggleexpand: 'alt+/'
    },
    events: {
      layoutapply(e) {
        const r = e.node.getRenderer('ExpanderRenderer')
        if (r && r.getRenderShape()) {
          r.update(r.getRenderShape(), e.node)
        }
      },
      beforerender(e) {
        const node = e.node
        const visible = !node.parent || node.parent.isExpanded()

        node.getRenderContainer().setVisible(visible)
        if (!visible) e.stopPropagation()
      }
    },
    renderers: {
      outside: ExpanderRenderer
    }
  }
})
