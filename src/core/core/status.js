/**
 *
 * 状态切换控制
 */
import Minder from './minder'
const kity = window.kity

const sf = ~window.location.href.indexOf('status')
const tf = ~window.location.href.indexOf('trace')

Minder.registerInitHook(function () {
  this._initStatus()
})

kity.extendClass(Minder, {
  _initStatus() {
    this._status = 'normal'
    this._rollbackStatus = 'normal'
  },

  setStatus(status, force) {
    // 在 readonly 模式下，只有 force 为 true 才能切换回来
    if (this._status === 'readonly' && !force) return this
    if (status !== this._status) {
      this._rollbackStatus = this._status
      this._status = status
      this.fire('statuschange', {
        lastStatus: this._rollbackStatus,
        currentStatus: this._status
      })
      if (sf) {
        console.log(window.event.type, this._rollbackStatus, '->', this._status)
        if (tf) {
          console.trace()
        }
      }
    }
    return this
  },

  rollbackStatus() {
    this.setStatus(this._rollbackStatus)
  },
  getRollbackStatus() {
    return this._rollbackStatus
  },
  getStatus() {
    return this._status
  }
})
