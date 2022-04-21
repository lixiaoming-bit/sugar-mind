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
  _initPaper() {
    this._paper = new kity.Paper()
    this._paper._minder = this
    this._paper.getNode().ondragstart = function (e) {
      e.preventDefault()
    }
    this._paper.shapeNode.setAttribute('transform', 'translate(0.5, 0.5)')

    this._addRenderContainer()

    this.setRoot(this.createNode())

    if (this._options.renderTo) {
      this.renderTo(this._options.renderTo)
    }
  },

  _addRenderContainer() {
    this._rc = new kity.Group().setId(utils.uuid('minder'))
    this._paper.addShape(this._rc)
  },

  renderTo(target) {
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

  getRenderContainer() {
    return this._rc
  },

  getPaper() {
    return this._paper
  },

  getRenderTarget() {
    return this._renderTarget
  }
})
