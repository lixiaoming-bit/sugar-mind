/**
 *
 * 只读模式支持
 *
 */

import Minder from './minder'
const kity = window.kity

Minder.registerInitHook(function (options) {
  if (options.readOnly) {
    this.setDisabled()
  }
})

kity.extendClass(Minder, {
  disable: function () {
    const self = this
    //禁用命令
    self.bkQueryCommandState = self.queryCommandState
    self.bkQueryCommandValue = self.queryCommandValue
    self.queryCommandState = function (type) {
      const cmd = this._getCommand(type)
      if (cmd && cmd.enableReadOnly) {
        return self.bkQueryCommandState.apply(self, arguments)
      }
      return -1
    }
    self.queryCommandValue = function (type) {
      const cmd = this._getCommand(type)
      if (cmd && cmd.enableReadOnly) {
        return self.bkQueryCommandValue.apply(self, arguments)
      }
      return null
    }
    this.setStatus('readonly')
    self._interactChange()
  },

  enable: function () {
    const self = this

    if (self.bkQueryCommandState) {
      self.queryCommandState = self.bkQueryCommandState
      delete self.bkQueryCommandState
    }
    if (self.bkQueryCommandValue) {
      self.queryCommandValue = self.bkQueryCommandValue
      delete self.bkQueryCommandValue
    }

    this.setStatus('normal')

    self._interactChange()
  }
})
