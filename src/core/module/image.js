import utils from '../core/utils'
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

    execute(km, url, title) {
      const nodes = km.getSelectedNodes()

      loadImageSize(url, (width, height) => {
        nodes.forEach(node => {
          const size = fitImageSize(
            width,
            height,
            km.getOption('maxImageWidth'),
            km.getOption('maxImageHeight')
          )
          node
            .setData('image', url)
            .setData('imageTitle', url && title)
            .setData('imageSize', url && size)
            .render()
        })
        km.fire('contentchange')
        km.select(nodes[0], true)
        km.layout(300)
      })
    },
    queryState(km) {
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
    queryValue(km) {
      const node = km.getSelectedNode()
      const url = node.getData('image')
      return url
        ? {
            url,
            title: node.getData('imageTitle')
          }
        : null
    }
  })

  const ImageRenderer = kity.createClass('ImageRenderer', {
    base: Renderer,

    create(node) {
      const deleteImageUrl = require('@/assets/images/preview-group/delete.png')
      const openImageUrl = require('@/assets/images/preview-group/open.png')

      const group = new kity.Group()
        .setId(utils.uuid('minder_image_group'))
        .addClass('upload-image-group')

      const uploadImage = new kity.Image(node.getData('image')).addClass('upload-image')
      const deleteImage = new kity.Image(deleteImageUrl, 22, 22)
        .setVisible(false)
        .addClass('delete-image')
      const openImage = new kity.Image(openImageUrl, 22, 22)
        .setVisible(false)
        .addClass('open-image')

      // deleteImage.on('click', e => {
      //   node.setData('image', '').setData('imageTitle', '').setData('imageSize', '')
      //   e.fire('contentchange')
      //   this.getRenderShape().remove()
      //   node.render()
      // })
      group.on('mouseover', () => {
        deleteImage.setVisible(true)
        openImage.setVisible(true)
      })
      group.on('mouseleave', () => {
        deleteImage.setVisible(false)
        openImage.setVisible(false)
      })

      group.addShapes([uploadImage, deleteImage, openImage])
      return group
    },

    // 需要优化设置图片样式为空时 svg中的image节点并未清除
    shouldRender(node) {
      return node.getData('image')
    },

    update(group, node, box) {
      const [uploadImage, deleteImage, openImage] = group.getItems()
      const url = node.getData('image')
      const title = node.getData('imageTitle')
      const size = node.getData('imageSize')
      const spaceTop = node.getStyle('space-top')

      if (!size) return

      if (title) {
        uploadImage.node.setAttributeNS('http://www.w3.org/1999/xlink', 'title', title)
      }

      const x = box.cx - size.width / 2
      const y = box.y - size.height - spaceTop
      deleteImage.setX((box.cx + size.width / 2 - deleteImage.getWidth()) | 0).setY(y | 0)
      openImage
        .setX((box.cx + size.width / 2 - openImage.getWidth()) | 0)
        .setY((box.y - spaceTop - openImage.getHeight()) | 0)
      uploadImage
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
