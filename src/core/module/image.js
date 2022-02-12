import Command from '../core/command'
import Module from '../core/module'
import Renderer from '../core/render'
const kity = window.kity
Module.register('image', function () {
  function loadImageSize(url, callback) {
    const img = document.createElement('img')
    img.onload = function () {
      callback(img.width, img.height)
    }
    img.onerror = function () {
      callback(null)
    }
    img.src = url
  }

  function fitImageSize(width, height, maxWidth, maxHeight) {
    const ratio = width / height
    const fitRatio = maxWidth / maxHeight

    // 宽高比大于最大尺寸的宽高比，以宽度为标准适应
    if (width > maxWidth && ratio > fitRatio) {
      width = maxWidth
      height = width / ratio
    } else if (height > maxHeight) {
      height = maxHeight
      width = height * ratio
    }

    return {
      width: width | 0,
      height: height | 0
    }
  }

  /**
   * @command Image
   * @description 为选中的节点添加图片
   * @param {string} url 图片的 URL，设置为 null 移除
   * @param {string} title 图片的说明
   * @state
   *   0: 当前有选中的节点
   *  -1: 当前没有选中的节点
   * @return 返回首个选中节点的图片信息，JSON 对象： `{url: url, title: title}`
   */
  const ImageCommand = kity.createClass('ImageCommand', {
    base: Command,

    execute: function (km, url, title) {
      const nodes = km.getSelectedNodes()

      loadImageSize(url, function (width, height) {
        nodes.forEach(function (n) {
          const size = fitImageSize(
            width,
            height,
            km.getOption('maxImageWidth'),
            km.getOption('maxImageHeight')
          )
          n.setData('image', url)
          n.setData('imageTitle', url && title)
          n.setData('imageSize', url && size)
          n.render()
        })
        km.fire('saveScene')
        km.layout(300)
      })
    },
    queryState: function (km) {
      const nodes = km.getSelectedNodes()
      let result = 0
      if (nodes.length === 0) {
        return -1
      }
      nodes.forEach(function (n) {
        if (n && n.getData('image')) {
          result = 0
          return false
        }
      })
      return result
    },
    queryValue: function (km) {
      const node = km.getSelectedNode()
      return {
        url: node.getData('image'),
        title: node.getData('imageTitle')
      }
    }
  })

  const ImageRenderer = kity.createClass('ImageRenderer', {
    base: Renderer,

    create: function (node) {
      return new kity.Image(node.getData('image'))
    },

    shouldRender: function (node) {
      return node.getData('image')
    },

    update: function (image, node, box) {
      const url = node.getData('image')
      const title = node.getData('imageTitle')
      const size = node.getData('imageSize')
      const spaceTop = node.getStyle('space-top')

      if (!size) return

      if (title) {
        image.node.setAttributeNS('http://www.w3.org/1999/xlink', 'title', title)
      }

      const x = box.cx - size.width / 2
      const y = box.y - size.height - spaceTop

      image
        .setUrl(url)
        .setX(x | 0)
        .setY(y | 0)
        .setWidth(size.width | 0)
        .setHeight(size.height | 0)

      return new kity.Box(x | 0, y | 0, size.width | 0, size.height | 0)
    }
  })

  return {
    defaultOptions: {
      maxImageWidth: 200,
      maxImageHeight: 200
    },
    commands: {
      image: ImageCommand
    },
    renderers: {
      top: ImageRenderer
    }
  }
})
