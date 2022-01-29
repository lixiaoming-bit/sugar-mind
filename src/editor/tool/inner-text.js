/**
 * innerText polyfill
 */
export default function () {
  if (!('innerText' in document.createElement('a')) && 'getSelection' in window) {
    HTMLElement.prototype.__defineGetter__('innerText', function () {
      const selection = window.getSelection()
      const ranges = []
      let str = null

      // Save existing selections.
      for (let i = 0; i < selection.length; i++) {
        ranges[i] = selection.getRangeAt(i)
      }

      // Deselect everything.
      selection.removeAllRanges()

      // Select `el` and all child nodes.
      // 'this' is the element .innerText got called on
      selection.selectAllChildren(this)

      // Get the string representation of the selected nodes.
      str = selection.toString()

      // Deselect everything. Again.
      selection.removeAllRanges()

      // Restore all formerly existing selections.
      for (let i = 0; i < ranges.length; i++) {
        ranges[i] = selection.getRangeAt(i)
      }

      // Oh look, this is what we wanted.
      // String representation of the element, close to as rendered.
      return str
    })
    HTMLElement.prototype.__defineSetter__('innerText', function (text) {
      /**
       * @Desc: 解决FireFox节点内容删除后text为null，出现报错的问题
       * @Editor: Naixor
       * @Date: 2015.9.16
       */
      this.innerHTML = (text || '')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>')
    })
  }
}
