import keymap from '../core/keymap'
import Module from '../core/module'
const kity = window.kity
Module.register('ImageViewer', function () {
  function createEl(name, classNames, children) {
    const el = document.createElement(name)
    addClass(el, classNames)
    children &&
      children.length &&
      children.forEach(function (child) {
        el.appendChild(child)
      })
    return el
  }

  function on(el, event, handler) {
    el.addEventListener(event, handler)
  }

  function addClass(el, classNames) {
    classNames &&
      classNames.split(' ').forEach(function (className) {
        el.classList.add(className)
      })
  }

  //   function removeClass(el, classNames) {
  //     classNames &&
  //       classNames.split(' ').forEach(function (className) {
  //         el.classList.remove(className)
  //       })
  //   }

  const ImageViewer = kity.createClass('ImageViewer', {
    constructor() {
      const btnClose = createEl('button', 'km-image-viewer-btn km-image-viewer-close')
      const btnSource = createEl('button', 'km-image-viewer-btn km-image-viewer-source')
      const image = (this.image = createEl('img'))
      const toolbar = (this.toolbar = createEl('div', 'km-image-viewer-toolbar', [
        btnSource,
        btnClose
      ]))
      const container = createEl('div', 'km-image-viewer-container', [image])
      const viewer = (this.viewer = createEl('div', 'km-image-viewer', [toolbar, container]))
      this.hotkeyHandler = this.hotkeyHandler.bind(this)
      on(btnClose, 'click', this.close.bind(this))
      on(btnSource, 'click', this.viewSource.bind(this))
      on(image, 'click', this.zoomImage.bind(this))
      on(viewer, 'contextmenu', this.toggleToolbar.bind(this))
      on(document, 'keydown', this.hotkeyHandler)
    },
    dispose() {
      this.close()
      document.removeEventListener('remove', this.hotkeyHandler)
    },
    hotkeyHandler(e) {
      if (!this.activated) {
        return
      }
      if (e.keyCode === keymap['esc']) {
        this.close()
      }
    },
    toggleToolbar(e) {
      e && e.preventDefault()
      this.toolbar.classList.toggle('hidden')
    },
    zoomImage(restore) {
      const image = this.image
      if (typeof restore === 'boolean') {
        restore && addClass(image, 'limited')
      } else {
        image.classList.toggle('limited')
      }
    },
    viewSource() {
      window.open(this.image.src)
    },
    open(src) {
      this.image.src = src
      this.zoomImage(true)
      document.body.appendChild(this.viewer)
      this.activated = true
    },
    close() {
      this.image.src = ''
      document.body.removeChild(this.viewer)
      this.activated = false
    }
  })

  return {
    init() {
      this.viewer = new ImageViewer()
    },
    events: {
      'normal.dblclick'(e) {
        const shape = e.kityEvent.targetShape
        const isAllowed = shape.node.className.animVal === 'upload-image'
        if (shape.__KityClassName === 'Image' && isAllowed && shape.url) {
          this.viewer.open(shape.url)
        }
        e.stopPropagation()
      },
      'normal.click'(e) {
        e.stopPropagation()
        const shape = e.kityEvent.targetShape
        const isAllowedDeleteImage = shape.node.className.animVal === 'delete-image'
        const isAllowedOpenImage = shape.node.className.animVal === 'open-image'
        // 删除
        if (isAllowedDeleteImage) {
          this.execCommand('Image', '')
          // shape.container.remove()
        }
        // 缩放
        if (isAllowedOpenImage) {
          console.log(' this.viewer', this.viewer)
        }
      }
    }
  }
})
