/**
 * 调试工具：为 kity.Box 提供一个可视化的渲染
 */
import Minder from './minder'
const kity = window.kity

if (location.href.indexOf('boxv') !== -1) {
  let vrect

  Object.defineProperty(kity.Box.prototype, 'visualization', {
    get: function () {
      if (!vrect) return null
      return vrect.setBox(this)
    }
  })

  Minder.registerInitHook(function () {
    this.on('paperrender', function () {
      vrect = new kity.Rect()
      vrect.fill('rgba(200, 200, 200, .5)')
      vrect.stroke('orange')
      this.getRenderContainer().addShape(vrect)
    })
  })
}
