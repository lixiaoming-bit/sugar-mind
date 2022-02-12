import Minder from './minder'
const kity = window.kity

Minder.registerInitHook(function () {
  this.on('beforemousedown', function (e) {
    this.focus()
    e.preventDefault()
  })
  this.on('paperrender', function () {
    this.focus()
  })
})

kity.extendClass(Minder, {
  focus: function () {
    if (!this.isFocused()) {
      const renderTarget = this._renderTarget
      renderTarget.classList.add('focus')
      this.renderNodeBatch(this.getSelectedNodes())
    }
    this.fire('focus')
    return this
  },

  blur: function () {
    if (this.isFocused()) {
      const renderTarget = this._renderTarget
      renderTarget.classList.remove('focus')
      this.renderNodeBatch(this.getSelectedNodes())
    }
    this.fire('blur')
    return this
  },

  isFocused: function () {
    const renderTarget = this._renderTarget
    return renderTarget && renderTarget.classList.contains('focus')
  }
})
