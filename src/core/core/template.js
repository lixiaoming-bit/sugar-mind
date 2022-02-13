import utils from './utils'
import Minder from './minder'
import Command from './command'
import MinderNode from './node'
import Module from './module'
const kity = window.kity

const _templates = {}

utils.extend(Minder, {
  getTemplateList: function () {
    return _templates
  }
})

kity.extendClass(
  Minder,
  (function () {
    const originGetTheme = Minder.prototype.getTheme
    return {
      useTemplate: function (name, duration) {
        this.setTemplate(name)
        this.refresh(duration || 800)
      },

      getTemplate: function () {
        return this._template || 'default'
      },

      setTemplate: function (name) {
        this._template = name || null
      },

      getTemplateSupport: function (method) {
        const supports = _templates[this.getTemplate()]
        return supports && supports[method]
      },

      getTheme: function (node) {
        const support = this.getTemplateSupport('getTheme') || originGetTheme
        return support.call(this, node)
      }
    }
  })()
)

kity.extendClass(
  MinderNode,
  (function () {
    const originGetLayout = MinderNode.prototype.getLayout
    const originGetConnect = MinderNode.prototype.getConnect
    return {
      getLayout: function () {
        const support = this.getMinder().getTemplateSupport('getLayout') || originGetLayout
        return support.call(this, this)
      },

      getConnect: function () {
        const support = this.getMinder().getTemplateSupport('getConnect') || originGetConnect
        return support.call(this, this)
      }
    }
  })()
)

Module.register('TemplateModule', {
  /**
   * @command Template
   * @description 设置当前脑图的模板
   * @param {string} name 模板名称
   *    允许使用的模板可以使用 `kityminder.Minder.getTemplateList()` 查询
   * @state
   *   0: 始终可用
   * @return 返回当前的模板名称
   */
  commands: {
    template: kity.createClass('TemplateCommand', {
      base: Command,

      execute: function (minder, name) {
        minder.useTemplate(name)
        minder.execCommand('camera')
      },

      queryValue: function (minder) {
        return minder.getTemplate() || 'default'
      }
    })
  }
})

function register(name, supports) {
  _templates[name] = supports
}
export default { register }
