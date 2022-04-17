// import utils from './utils'
import Minder from './minder'
import Command from './command'
import MinderNode from './node'
import Module from './module'
const kity = window.kity

const _templates = {}

kity.extendClass(Minder, {
  getTemplateList() {
    return _templates
  }
})

kity.extendClass(
  Minder,
  (function () {
    const originGetTheme = Minder.prototype.getTheme
    return {
      useTemplate(name, duration) {
        this.setTemplate(name)
        this.refresh(duration || 800)
      },

      getTemplate() {
        return this._template || 'default'
      },

      setTemplate(name) {
        this._template = name || null
      },

      getTemplateSupport(method) {
        const supports = _templates[this.getTemplate()]
        return supports && supports[method]
      },

      getTheme(node) {
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
      getLayout() {
        const support = this.getMinder().getTemplateSupport('getLayout') || originGetLayout
        return support.call(this, this)
      },

      getConnect() {
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

      execute(minder, name) {
        minder.useTemplate(name)
        minder.execCommand('camera')
      },

      queryValue(minder) {
        return minder.getTemplate() || 'default'
      }
    })
  }
})

function register(name, supports) {
  _templates[name] = supports
}
export default { register }
