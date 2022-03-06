class Editor {
  constructor(selector) {
    this.selector = selector
    this.checkContainerIsValid()
  }
  // 校验传入的选择器或者DOM
  checkContainerIsValid() {
    const isString = typeof this.selector === 'string'
    this.container = isString ? document.querySelector(this.selector) : this.selector
    if (!this.container) {
      this.container = null
      throw new Error('Invalid selector: ' + this.selector)
    }
    // 这个类名用于给编辑器添加样式
    container.classList.add('km-editor')
  }
}
