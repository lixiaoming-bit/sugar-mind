import data from '../core/data'
const kity = window.kity
const DomURL = window.URL || window.webkitURL || window

function loadImage(info) {
  return new Promise(function (resolve, reject) {
    const image = document.createElement('img')
    image.onload = function () {
      resolve({
        element: this,
        x: info.x,
        y: info.y,
        width: info.width,
        height: info.height
      })
    }
    image.onerror = function (err) {
      reject(err)
    }

    image.crossOrigin = 'anonymous'
    image.src = info.url
  })
}

/**
 * xhrLoadImage: 通过 xhr 加载保存在 BOS 上的图片
 * @note: BOS 上的 CORS 策略是取 headers 里面的 Origin 字段进行判断
 *        而通过 image 的 src 的方式是无法传递 origin 的，因此需要通过 xhr 进行
 */
function xhrLoadImage(info) {
  return Promise(function (resolve) {
    const xmlHttp = new XMLHttpRequest()

    xmlHttp.open('GET', info.url + '?_=' + Date.now(), true)
    xmlHttp.responseType = 'blob'
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        const blob = xmlHttp.response

        const image = document.createElement('img')

        image.src = DomURL.createObjectURL(blob)
        image.onload = function () {
          DomURL.revokeObjectURL(image.src)
          resolve({
            element: image,
            x: info.x,
            y: info.y,
            width: info.width,
            height: info.height
          })
        }
      }
    }

    xmlHttp.send()
  })
}

function getSVGInfo(minder) {
  const paper = minder.getPaper()
  let paperTransform
  let svgXml
  let svgContainer
  let svgDom
  const renderContainer = minder.getRenderContainer()
  const renderBox = renderContainer.getRenderBox()
  const width = renderBox.width + 1
  const height = renderBox.height + 1

  // 保存原始变换，并且移动到合适的位置
  paperTransform = paper.shapeNode.getAttribute('transform')
  paper.shapeNode.setAttribute('transform', 'translate(0.5, 0.5)')
  renderContainer.translate(-renderBox.x, -renderBox.y)

  // 获取当前的 XML 代码
  svgXml = paper.container.innerHTML

  // 回复原始变换及位置
  renderContainer.translate(renderBox.x, renderBox.y)
  paper.shapeNode.setAttribute('transform', paperTransform)

  // 过滤内容
  svgContainer = document.createElement('div')
  svgContainer.innerHTML = svgXml
  svgDom = svgContainer.querySelector('svg')
  svgDom.setAttribute('width', renderBox.width + 1)
  svgDom.setAttribute('height', renderBox.height + 1)
  svgDom.setAttribute('style', 'font-family: Arial, "Microsoft Yahei","Heiti SC";')

  svgContainer = document.createElement('div')
  svgContainer.appendChild(svgDom)

  svgXml = svgContainer.innerHTML

  // Dummy IE
  svgXml = svgXml.replace(
    ' xmlns="http://www.w3.org/2000/svg" ' +
      'xmlns:NS1="" NS1:ns1:xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:NS2="" NS2:xmlns:ns1=""',
    ''
  )

  // svg 含有 &nbsp; 符号导出报错 Entity 'nbsp' not defined ,含有控制字符触发Load Image 会触发报错
  // eslint-disable-next-line no-control-regex
  svgXml = svgXml.replace(/&nbsp;|[\x00-\x1F\x7F-\x9F]/g, '')

  // fix title issue in safari
  // @ http://stackoverflow.com/questions/30273775/namespace-prefix-ns1-for-href-on-tagelement-is-not-defined-setattributens
  svgXml = svgXml.replace(/NS\d+:title/gi, 'xlink:title')
  svgXml = svgXml.replace(/\n/g, '').replace(/\t/g, '').replace(/#/g, '%23')
  console.log('svgXml: ', svgXml)

  const blob = new Blob([svgXml], {
    type: 'image/svg+xml'
  })

  const svgUrl = DomURL.createObjectURL(blob)

  //svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgXml);

  const imagesInfo = []

  // 遍历取出图片信息
  traverse(minder.getRoot())

  function traverse(node) {
    const nodeData = node.data

    if (nodeData.image) {
      minder.renderNode(node)
      const nodeData = node.data
      const imageUrl = nodeData.image
      const imageSize = nodeData.imageSize
      const imageRenderBox = node.getRenderBox('ImageRenderer', minder.getRenderContainer())
      const imageInfo = {
        url: imageUrl,
        width: imageSize.width,
        height: imageSize.height,
        x: -renderContainer.getBoundaryBox().x + imageRenderBox.x,
        y: -renderContainer.getBoundaryBox().y + imageRenderBox.y
      }

      imagesInfo.push(imageInfo)
    }

    // 若节点折叠，则直接返回
    if (nodeData.expandState === 'collapse') {
      return
    }

    const children = node.getChildren()
    for (let i = 0; i < children.length; i++) {
      traverse(children[i])
    }
  }

  return {
    width: width,
    height: height,
    dataUrl: svgUrl,
    xml: svgXml,
    imagesInfo: imagesInfo
  }
}

function encode(json, minder, option) {
  /* 绘制 PNG 的画布及上下文 */
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const backingStore =
    ctx.backingStorePixelRatio ||
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    1
  const ratio = (window.devicePixelRatio || 1) / backingStore

  /* 尝试获取背景图片 URL 或背景颜色 */
  const bgDeclare = minder.getStyle('background').toString()
  const bgUrl = /url\(\\"(.+)\\"\)/.exec(bgDeclare)
  const bgColor = kity.Color.parse(bgDeclare)

  /* 获取 SVG 文件内容 */
  const svgInfo = getSVGInfo(minder)
  console.log('svgInfo: ', svgInfo)
  const width =
    option && option.width && option.width > svgInfo.width ? option.width : svgInfo.width
  const height =
    option && option.height && option.height > svgInfo.height ? option.height : svgInfo.height
  const offsetX =
    option && option.width && option.width > svgInfo.width ? (option.width - svgInfo.width) / 2 : 0
  const offsetY =
    option && option.height && option.height > svgInfo.height
      ? (option.height - svgInfo.height) / 2
      : 0
  const svgDataUrl = svgInfo.dataUrl
  const imagesInfo = svgInfo.imagesInfo

  /* 画布的填充大小 */
  const padding = 20

  canvas.width = (width + padding * 2) * ratio
  canvas.height = (height + padding * 2) * ratio
  canvas.style.width = `${width + padding * 2}px`
  canvas.style.height = `${height + padding * 2}px`
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

  function fillBackground(ctx, style) {
    ctx.save()
    ctx.fillStyle = style
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
  }

  function drawImage(ctx, image, x, y, width, height) {
    if (width && height) {
      ctx.drawImage(image, x + padding, y + padding, width, height)
    } else {
      ctx.drawImage(image, x + padding, y + padding)
    }
  }

  function generateDataUrl(canvas) {
    return canvas.toDataURL('image/png', 1)
  }

  // 加载节点上的图片
  function loadImages(imagesInfo) {
    const imagePromises = imagesInfo.map(function (imageInfo) {
      return xhrLoadImage(imageInfo)
    })

    return Promise.all(imagePromises)
  }

  function drawSVG() {
    const svgData = { url: svgDataUrl }
    console.log('svgData: ', svgData)

    return loadImage(svgData)
      .then(function ($image) {
        drawImage(ctx, $image.element, offsetX, offsetY, $image.width, $image.height)
        return loadImages(imagesInfo)
      })
      .then(
        function ($images) {
          for (let i = 0; i < $images.length; i++) {
            drawImage(
              ctx,
              $images[i].element,
              $images[i].x + offsetX,
              $images[i].y + offsetY,
              $images[i].width,
              $images[i].height
            )
          }

          DomURL.revokeObjectURL(svgDataUrl)
          document.body.appendChild(canvas)
          const pngBase64 = generateDataUrl(canvas)

          document.body.removeChild(canvas)
          return pngBase64
        },
        function () {
          // 这里处理 reject，出错基本上是因为跨域，
          // 出错后依然导出，只不过没有图片。
          alert(
            '脑图的节点中包含跨域图片，导出的 png 中节点图片不显示，你可以替换掉这些跨域的图片并重试。'
          )
          DomURL.revokeObjectURL(svgDataUrl)
          document.body.appendChild(canvas)

          const pngBase64 = generateDataUrl(canvas)
          document.body.removeChild(canvas)
          return pngBase64
        }
      )
  }

  if (bgUrl) {
    const bgInfo = { url: bgUrl[1] }
    return loadImage(bgInfo).then(function ($image) {
      fillBackground(ctx, ctx.createPattern($image.element, 'repeat'))
      return drawSVG()
    })
  } else {
    fillBackground(ctx, bgColor.toString())
    return drawSVG()
  }
}
data.registerProtocol('png', {
  fileDescription: 'PNG 图片',
  fileExtension: '.png',
  mineType: 'image/png',
  dataType: 'base64',
  encode: encode
})
