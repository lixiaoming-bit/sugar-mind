import utils from '../core/utils'
import Module from '../core/module'
import Renderer from '../core/render'
// import Command from '../core/command'
const kity = window.kity
const EntityRenderer = kity.createClass('EntityRenderer', {
  base: Renderer,

  create(node) {
    const entity = new kity.Rect().setId(utils.uuid('node_entity'))
    this.bringToBack = true
    entity.on('mouseover', () => {
      if (node.isSelected()) return
      if (!node._isHover) {
        node._isHover = true
        node.render()
      }
    })
    entity.on('mouseleave', () => {
      if (node.isSelected()) {
        delete node._isHover
        return
      }
      if (node._isHover) {
        node._isHover = false
        node.render()
      }
    })
    return entity
  },

  update(entity, node, box) {
    const shape = node.getStyle('shape')
    const paddingLeft = node.getStyle('padding-left')
    const paddingRight = node.getStyle('padding-right')
    const paddingTop = node.getStyle('padding-top')
    const paddingBottom = node.getStyle('padding-bottom')

    const outlineBox = {
      x: box.x - paddingLeft,
      y: box.y - paddingTop,
      width: box.width + paddingLeft + paddingRight,
      height: box.height + paddingTop + paddingBottom
    }

    let radius = node.getStyle('radius')
    // 天盘图圆形的情况
    if (shape && shape === 'circle') {
      const p = Math.pow
      const r = Math.round

      radius = r(Math.sqrt(p(outlineBox.width, 2) + p(outlineBox.height, 2)) / 2)

      outlineBox.x = box.cx - radius
      outlineBox.y = box.cy - radius
      outlineBox.width = 2 * radius
      outlineBox.height = 2 * radius
    }

    entity
      .setPosition(outlineBox.x, outlineBox.y)
      .setSize(outlineBox.width, outlineBox.height)
      .setRadius(radius)
      .fill(node.getData('background') || node.getStyle('background'))
      .stroke(node.getStyle('stroke'), node.getStyle('stroke-width'))
    return new kity.Box(outlineBox)
  }
})

const OutlineRenderer = kity.createClass('OutlineRenderer', {
  base: Renderer,

  create() {
    this.bringToBack = true
    const outline = new kity.Rect().setId(utils.uuid('node_outline'))
    return outline
  },

  shouldRender(node) {
    return node.isSelected() || node._isHover
  },

  update(outline, node, box) {
    const shape = node.getStyle('shape')

    const background = 'none'
    const radius = node.getStyle('radius')
    const prefix = node.isSelected() || node._isHover ? 'selected-' : ''
    const stroke = node.getStyle(prefix + 'stroke')
    const strokeWidth = node.getStyle(prefix + 'stroke-width')
    const paddingLeft = node.getStyle('selected-padding-left') || 4
    const paddingTop = node.getStyle('selected-padding-top') || 4

    outline
      .setPosition(box.x - paddingLeft, box.y - paddingTop)
      .fill(background)
      .stroke(stroke, strokeWidth)

    if (!shape) {
      outline.setSize(box.width + paddingLeft * 2, box.height + paddingTop * 2).setRadius(radius)
    } else if (shape === 'circle') {
      const width = Math.max(box.width + paddingLeft * 2, box.height + paddingTop * 2)
      outline.setSize(width, width)
      outline.setRadius(width / 2)
    }
  }
})

// 调试模式
const marker = new kity.Marker()

marker.setWidth(10)
marker.setHeight(12)
marker.setRef(0, 0)
marker.setViewBox(-6, -4, 8, 10)

marker.addShape(new kity.Path().setPathData('M-5-3l5,3,-5,3').stroke('#33ffff'))

const wireframeOption = /wire/.test(window.location.href)
const WireframeRenderer = kity.createClass('WireframeRenderer', {
  base: Renderer,

  create() {
    const wireframe = new kity.Group()
    const oxy = (this.oxy = new kity.Path().stroke('#f6f').setPathData('M0,-50L0,50M-50,0L50,0'))

    const box = (this.wireframe = new kity.Rect().stroke('lightgreen'))

    const vectorIn = (this.vectorIn = new kity.Path().stroke('#66ffff'))
    const vectorOut = (this.vectorOut = new kity.Path().stroke('#66ffff'))

    vectorIn.setMarker(marker, 'end')
    vectorOut.setMarker(marker, 'end')

    return wireframe.addShapes([oxy, box, vectorIn, vectorOut])
  },

  shouldRender() {
    return wireframeOption
  },

  update(created, node, box) {
    this.wireframe.setPosition(box.x, box.y).setSize(box.width, box.height)
    const pin = node.getVertexIn()
    const pout = node.getVertexOut()
    const vin = node.getLayoutVectorIn().normalize(30)
    const vout = node.getLayoutVectorOut().normalize(30)
    this.vectorIn.setPathData(['M', pin.offset(vin.reverse()), 'L', pin])
    this.vectorOut.setPathData(['M', pout, 'l', vout])
  }
})

const wireEvents = !wireframeOption
  ? null
  : {
      ready() {
        this.getPaper().addResource(marker)
      },
      layoutallfinish() {
        this.getRoot().traverse(function (node) {
          node.getRenderer('WireframeRenderer').update(null, node, node.getContentBox())
        })
      }
    }

Module.register('OutlineModule', function () {
  return {
    events: {
      ...wireEvents
    },
    renderers: {
      outline: EntityRenderer,
      outside: [OutlineRenderer, WireframeRenderer]
    },
    commands: {
      // 'set-outline-shape': kity.createClass('SetOutlineCommand', {
      //   base: Command,
      //   execute(minder, shape) {
      //     const nodes = minder.getSelectedNodes()
      //     nodes.forEach(node => {
      //       node.setData('outline', shape)
      //       node.render()
      //     })
      //     // minder.layout(300)
      //   },
      //   queryState(minder) {
      //     return minder.getSelectedNode() ? 0 : -1
      //   },
      //   queryValue(minder) {
      //     const node = minder.getSelectedNode()
      //     return node && node.getData('outline')
      //   }
      // })
    }
  }
})
