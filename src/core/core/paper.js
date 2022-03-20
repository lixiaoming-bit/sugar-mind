/**
 * 初始化渲染容器
 */
import utils from './utils'
import Minder from './minder'
const kity = window.kity

Minder.registerInitHook(function () {
  this._initPaper()
})

kity.extendClass(Minder, {
  _initPaper: function () {
    this._paper = new kity.Paper()
    this._paper._minder = this
    this._paper.getNode().ondragstart = function (e) {
      e.preventDefault()
    }
    this._paper.shapeNode.setAttribute('transform', 'translate(0.5, 0.5)')

    this._initBg()

    this._addRenderContainer()

    this.setRoot(this.createNode())

    if (this._options.renderTo) {
      this.renderTo(this._options.renderTo)
    }
  },

  _addRenderContainer: function () {
    this._rc = new kity.Group().setId(utils.uuid('minder'))
    this._paper.addShape(this._rc)
  },

  _initBg: function () {
    const { innerWidth, innerHeight } = window

    this._watermark = new kity.Text('')
      .fill('#e9e9e9')
      .setSize(16)
      .setVerticalAlign('middle')
      .setRotate(25)
      .setAttr('font-weight', 'lighter')
      .setPosition(innerWidth / 5 / 2, 16)

    const brush = new kity.Pattern().pipe(function () {
      this.setWidth(innerWidth / 5)
      this.setHeight(innerWidth / 8)
    })
    brush.addItem(this._watermark)
    brush.node.setAttribute('id', 'custom-pattern')

    this._paper.addResource(brush)

    const bg = new kity.Group().setId(utils.uuid('bg-group')).setAttr('pointer-events', 'none')
    let rect = new kity.Rect(innerWidth, innerHeight, 0, 0).fill('url(#custom-pattern)')

    bg.addShape(rect)

    this._paper.addShape(bg)

    window.addEventListener('resize', () => {
      bg.removeShape(0)
      rect = new kity.Rect(window.innerWidth, window.innerHeight, 0, 0).fill('url(#custom-pattern)')
      bg.addShape(rect)
      this._paper.addShape(bg)
    })
  },

  renderTo: function (target) {
    if (typeof target === 'string') {
      target = document.querySelector(target)
    }
    if (target) {
      if (target.tagName.toLowerCase() === 'script') {
        const newTarget = document.createElement('div')
        newTarget.id = target.id
        newTarget.class = target.class
        target.parentNode.insertBefore(newTarget, target)
        target.parentNode.removeChild(target)
        target = newTarget
      }
      target.classList.add('km-view')
      this._paper.renderTo((this._renderTarget = target))
      this._bindEvents()
      this.fire('paperrender')
    }
    return this
  },

  getWatermark() {
    return this._watermark
  },

  getRenderContainer: function () {
    return this._rc
  },

  getPaper: function () {
    return this._paper
  },

  getRenderTarget: function () {
    return this._renderTarget
  }
})
