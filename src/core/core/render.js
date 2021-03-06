import Minder from './minder'
import MinderNode from './node'
const kity = window.kity

const Renderer = kity.createClass('Renderer', {
  constructor(node) {
    this.node = node
  },

  create() {
    throw new Error('Not implement: Renderer.create()')
  },

  shouldRender() {
    return true
  },

  // watchChange(data) {
  //   // let changed
  //   // if (this.watchingData === undefined) {
  //   //   changed = true
  //   // } else if (this.watchingData !== data) {
  //   //   changed = true
  //   // } else {
  //   //   changed = false
  //   // }

  //   this.watchingData = data
  // },

  shouldDraw() {
    return true
  },

  update(shape, node, box) {
    if (this.shouldDraw()) this.draw(shape, node)
    return this.place(shape, node, box)
  },

  draw() {
    throw new Error('Not implement: Renderer.draw()')
  },

  place() {
    throw new Error('Not implement: Renderer.place()')
  },

  getRenderShape() {
    return this._renderShape || null
  },

  setRenderShape(shape) {
    this._renderShape = shape
  }
})

function createMinderExtension() {
  function createRendererForNode(node, registered) {
    let renderers = []

    ;['center', 'left', 'right', 'top', 'bottom', 'outline', 'outside'].forEach(function (section) {
      const before = 'before' + section
      const after = 'after' + section

      if (registered[before]) {
        renderers = renderers.concat(registered[before])
      }
      if (registered[section]) {
        renderers = renderers.concat(registered[section])
      }
      if (registered[after]) {
        renderers = renderers.concat(registered[after])
      }
    })

    node._renderers = renderers.map(function (Renderer) {
      return new Renderer(node)
    })
  }

  return {
    renderNodeBatch(nodes) {
      const rendererClasses = this._rendererClasses
      const lastBoxes = []
      let rendererCount = 0
      let renderer
      let node

      if (!nodes.length) return

      for (let j = 0; j < nodes.length; j++) {
        node = nodes[j]
        if (!node._renderers) {
          createRendererForNode(node, rendererClasses)
        }
        node._contentBox = new kity.Box()
        this.fire('beforerender', {
          node: node
        })
      }

      // ???????????????????????????????????????
      rendererCount = nodes[0]._renderers.length

      for (let i = 0; i < rendererCount; i++) {
        // ????????????????????????
        for (let j = 0; j < nodes.length; j++) {
          if (typeof lastBoxes[j] === 'function') {
            lastBoxes[j] = lastBoxes[j]()
          }
          if (!(lastBoxes[j] instanceof kity.Box)) {
            lastBoxes[j] = new kity.Box(lastBoxes[j])
          }
        }

        for (let j = 0; j < nodes.length; j++) {
          node = nodes[j]
          renderer = node._renderers[i]

          // ????????????
          if (lastBoxes[j]) {
            node._contentBox = node._contentBox.merge(lastBoxes[j])
            renderer.contentBox = lastBoxes[j]
          }

          // ???????????????????????????????????????
          if (renderer.shouldRender(node)) {
            // ????????????????????????????????????????????????????????????
            if (!renderer.getRenderShape()) {
              renderer.setRenderShape(renderer.create(node))
              if (renderer.bringToBack) {
                node.getRenderContainer().prependShape(renderer.getRenderShape())
              } else {
                node.getRenderContainer().appendShape(renderer.getRenderShape())
              }
            }

            // ???????????????????????????
            renderer.getRenderShape().setVisible(true)

            // ??????????????????
            lastBoxes[j] = renderer.update(renderer.getRenderShape(), node, node._contentBox)
          }

          // ???????????????????????????????????????????????????????????????????????????
          else if (renderer.getRenderShape()) {
            renderer.getRenderShape().setVisible(false)
            lastBoxes[j] = null
          }
        }
      }

      for (let j = 0; j < nodes.length; j++) {
        this.fire('noderender', {
          node: nodes[j]
        })
      }
    },

    renderNode(node) {
      const rendererClasses = this._rendererClasses
      let latestBox

      if (!node._renderers) {
        createRendererForNode(node, rendererClasses)
      }

      this.fire('beforerender', {
        node: node
      })

      node._contentBox = new kity.Box()

      node._renderers.forEach(function (renderer) {
        // ???????????????????????????????????????
        if (renderer.shouldRender(node)) {
          // ????????????????????????????????????????????????????????????
          if (!renderer.getRenderShape()) {
            renderer.setRenderShape(renderer.create(node))
            if (renderer.bringToBack) {
              node.getRenderContainer().prependShape(renderer.getRenderShape())
            } else {
              node.getRenderContainer().appendShape(renderer.getRenderShape())
            }
          }

          // ???????????????????????????
          renderer.getRenderShape().setVisible(true)

          // ??????????????????
          latestBox = renderer.update(renderer.getRenderShape(), node, node._contentBox)

          if (typeof latestBox === 'function') latestBox = latestBox()

          // ??????????????????
          if (latestBox) {
            node._contentBox = node._contentBox.merge(latestBox)
            renderer.contentBox = latestBox
          }
        }

        // ???????????????????????????????????????????????????????????????????????????
        else if (renderer.getRenderShape()) {
          renderer.getRenderShape().setVisible(false)
        }
      })

      this.fire('noderender', {
        node: node
      })
    }
  }
}

kity.extendClass(Minder, createMinderExtension())

kity.extendClass(MinderNode, {
  render() {
    if (!this.attached) return
    this.getMinder().renderNode(this)
    return this
  },
  renderTree() {
    if (!this.attached) return
    const list = []
    this.traverse(function (node) {
      list.push(node)
    })
    this.getMinder().renderNodeBatch(list)
    return this
  },
  getRenderer(type) {
    const rs = this._renderers
    if (!rs) return null
    for (let i = 0; i < rs.length; i++) {
      if (rs[i].getType() === type) return rs[i]
    }
    return null
  },
  getContentBox() {
    //if (!this._contentBox) this.render();
    return this.parent && this.parent.isCollapsed()
      ? new kity.Box()
      : this._contentBox || new kity.Box()
  },
  getRenderBox(rendererType, refer) {
    const renderer = rendererType && this.getRenderer(rendererType)
    const contentBox = renderer ? renderer.contentBox : this.getContentBox()
    const ctm = kity.Matrix.getCTM(this.getRenderContainer(), refer || 'paper')
    return ctm.transformBox(contentBox)
  }
})

export default Renderer
