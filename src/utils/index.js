import { jsPDF } from 'jspdf'

/**
 * @description 获取用户浏览器版本及系统信息
 * @param {string='zh-cn' | 'en'} lang 返回中文的信息还是英文的
 * @constructor
 */
export const getBrowserType = (lang = 'en') => {
  // 权重：系统 + 系统版本 > 平台 > 内核 + 载体 + 内核版本 + 载体版本 > 外壳 + 外壳版本
  const ua = navigator.userAgent.toLowerCase()
  const testUa = regexp => regexp.test(ua)
  const testVs = regexp =>
    ua
      .match(regexp)
      ?.toString()
      .replace(/[^0-9|_.]/g, '')
      .replace(/_/g, '.')
  // 系统
  const system =
    new Map([
      [testUa(/windows|win32|win64|wow32|wow64/g), 'windows'], // windows系统
      [testUa(/macintosh|macintel/g), 'macos'], // macos系统
      [testUa(/x11/g), 'linux'], // linux系统
      [testUa(/android|adr/g), 'android'], // android系统
      [testUa(/ios|iphone|ipad|ipod|iwatch/g), 'ios'] // ios系统
    ]).get(true) || 'unknow'

  // 系统版本
  const systemVs =
    new Map([
      [
        'windows',
        new Map([
          [testUa(/windows nt 5.0|windows 2000/g), '2000'],
          [testUa(/windows nt 5.1|windows xp/g), 'xp'],
          [testUa(/windows nt 5.2|windows 2003/g), '2003'],
          [testUa(/windows nt 6.0|windows vista/g), 'vista'],
          [testUa(/windows nt 6.1|windows 7/g), '7'],
          [testUa(/windows nt 6.2|windows 8/g), '8'],
          [testUa(/windows nt 6.3|windows 8.1/g), '8.1'],
          [testUa(/windows nt 10.0|windows 10/g), '10']
        ]).get(true)
      ],
      ['macos', testVs(/os x [\d._]+/g)],
      ['android', testVs(/android [\d._]+/g)],
      ['ios', testVs(/os [\d._]+/g)]
    ]).get(system) || 'unknow'

  // 平台
  let platform = 'unknow'
  if (system === 'windows' || system === 'macos' || system === 'linux') {
    platform = 'desktop' // 桌面端
  } else if (system === 'android' || system === 'ios' || testUa(/mobile/g)) {
    platform = 'mobile' // 移动端
  }
  // 内核和载体
  const [engine = 'unknow', supporter = 'unknow'] = new Map([
    [
      testUa(/applewebkit/g),
      [
        'webkit',
        new Map([
          // webkit内核
          [testUa(/safari/g), 'safari'], // safari浏览器
          [testUa(/chrome/g), 'chrome'], // chrome浏览器
          [testUa(/opr/g), 'opera'], // opera浏览器
          [testUa(/edge/g), 'edge'] // edge浏览器
        ]).get(true)
      ] || 'unknow'
    ], // [webkit内核, xxx浏览器]
    [testUa(/gecko/g) && testUa(/firefox/g), ['gecko', 'firefox']], // [gecko内核,firefox浏览器]
    [testUa(/presto/g), ['presto', 'opera']], // [presto内核,opera浏览器]
    [testUa(/trident|compatible|msie/g), ['trident', 'iexplore']] // [trident内核,iexplore浏览器]
  ]).get(true) || ['unknow', 'unknow']

  // 内核版本
  const engineVs =
    new Map([
      ['webkit', testVs(/applewebkit\/[\d._]+/g)],
      ['gecko', testVs(/gecko\/[\d._]+/g)],
      ['presto', testVs(/presto\/[\d._]+/g)],
      ['trident', testVs(/trident\/[\d._]+/g)]
    ]).get(engine) || 'unknow'

  // 载体版本
  const supporterVs =
    new Map([
      ['firefox', testVs(/firefox\/[\d._]+/g)],
      ['opera', testVs(/opr\/[\d._]+/g)],
      ['iexplore', testVs(/(msie [\d._]+)|(rv:[\d._]+)/g)],
      ['edge', testVs(/edge\/[\d._]+/g)],
      ['safari', testVs(/version\/[\d._]+/g)],
      ['chrome', testVs(/chrome\/[\d._]+/g)]
    ]).get(supporter) || 'unknow'

  // 外壳和外壳版本
  const [shell = 'none', shellVs = 'unknow'] = new Map([
    [testUa(/micromessenger/g), ['wechat', testVs(/micromessenger\/[\d._]+/g)]], // [微信浏览器,]
    [testUa(/qqbrowser/g), ['qq', testVs(/qqbrowser\/[\d._]+/g)]], // [QQ浏览器,]
    [testUa(/ucbrowser/g), ['uc', testVs(/ucbrowser\/[\d._]+/g)]], // [UC浏览器,]
    [testUa(/qihu 360se/g), ['360', 'unknow']], // [360浏览器(无版本),]
    [testUa(/2345explorer/g), ['2345', testVs(/2345explorer\/[\d._]+/g)]], // [2345浏览器,]
    [testUa(/metasr/g), ['sougou', 'unknow']], // [搜狗浏览器(无版本),]
    [testUa(/lbbrowser/g), ['liebao', 'unknow']], // [猎豹浏览器(无版本),]
    [testUa(/maxthon/g), ['maxthon', testVs(/maxthon\/[\d._]+/g)]] // [遨游浏览器,]
  ]).get(true) || ['none', 'unknow']

  return {
    'zh-cn': Object.assign(
      {
        内核: engine, // 内核: webkit gecko presto trident
        内核版本: engineVs, // 内核版本
        平台: platform, // 平台: desktop mobile
        载体: supporter, // 载体: chrome safari firefox opera iexplore edge
        载体版本: supporterVs, // 载体版本
        系统: system, // 系统: windows macos linux android ios
        系统版本: systemVs // 系统版本
      },
      shell === 'none'
        ? {}
        : {
            外壳: shell, // 外壳: wechat qq uc 360 2345 sougou liebao maxthon
            外壳版本: shellVs // 外壳版本
          }
    ),
    en: Object.assign(
      {
        engine, // 内核: webkit gecko presto trident
        engineVs, // 内核版本
        platform, // 平台: desktop mobile
        supporter, // 载体: chrome safari firefox opera iexplore edge
        supporterVs, // 载体版本
        system, // 系统: windows macos linux android ios
        systemVs // 系统版本
      },
      shell === 'none'
        ? {}
        : {
            shell, // 外壳: wechat qq uc 360 2345 sougou liebao maxthon
            shellVs // 外壳版本
          }
    )
  }[lang]
}

/**
 * desc: base64对象转blob文件对象
 * @param urlData：数据的base64对象
 * @param type：类型 png, pdf, doc, mp3等;
 * @returns {Blob}：Blob文件对象
 */
const base64ToBlob = (urlData, type) => {
  const arr = urlData.split(',')
  const array = arr[0].match(/:(.*?);/)
  const mime = (array && array.length > 1 ? array[1] : type) || type
  // 去掉url的头，并转化为byte
  const bytes = window.atob(arr[1])
  // 处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length)
  // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
  const ia = new Uint8Array(ab)
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }
  return new Blob([ab], {
    type: mime
  })
}

/**
 * desc: 下载导出文件
 * @param blob  ：返回数据的blob对象或链接
 * @param fileName  ：下载后文件名标记
 * @param fileType  ：文件类 word(docx) excel(xlsx) ppt等
 */
const downloadExportFile = (blob, fileName, fileType) => {
  let element = document.createElement('a')
  let href = blob
  if (typeof blob === 'string') {
    element.target = '_blank'
  } else {
    //创建下载的链接
    href = window.URL.createObjectURL(blob)
  }
  element.href = href
  element.download = fileName + '.' + fileType
  document.body.appendChild(element)
  element.click() //触发点击下载
  document.body.removeChild(element) //下载完成移除元素
  if (typeof blob !== 'string') {
    window.URL.revokeObjectURL(href) //释放掉blob对象
  }
}

/**
 * desc: base64转文件并下载
 * @param base64 {String} : base64数据
 * @param fileType {String} : 要导出的文件类型 PNG、PDF、DOC、MD等
 * @param fileName {String} : 文件名
 */
export const downloadFile = (base64, fileName, fileType) => {
  // 定义base64 头部文件类型
  let typeHeader = ''
  if (!/data:([\s\S]*?);base64/g.test(base64)) {
    typeHeader = 'data:application/' + fileType + ';base64,'
  }
  // const typeHeader = 'data:application/' + fileType + ';base64,'
  const convergedBase64 = typeHeader + base64 // 拼接最终的base64
  let blob = base64ToBlob(convergedBase64, fileType) // 转成blob对象
  downloadExportFile(blob, fileName, fileType) // 下载文件
}

/**
 * desc: 下载markdown
 * @param context {String} : 文本字符串
 * @param fileName {String} : 文件名
 */

export const downloadMarkdown = (content, fileName) => {
  const blob = new Blob([content], { type: 'text/markdown' })
  downloadExportFile(blob, fileName, 'md')
}

/**
 * desc: 下载pdf
 * @param base64 {String} : base64 png
 * @param fileName {String} : 文件名
 */

export const downloadPDF = (base64, fileName) => {
  const img = new Image()
  img.onload = () => {
    const { width, height } = img
    // 纵向 单位px FAST 压缩率高
    const doc = new jsPDF('l', 'px', [width, height])
    doc.addImage(base64, 'PNG', 0, 0, width, height, '', 'FAST')
    doc.save(`${fileName}.pdf`).then(() => {
      img.remove()
    })
  }
  img.src = base64
}

const DEFAULT_CANVAS_TO_WATERMARK_OPTIONS = {
  width: 150,
  height: 150,
  rotate: 45
}

/**
 * @description: 生成高分辨水印
 * @param {*} text 水印文字
 * @param {*} options 大小配置
 * @return {*} base64
 */
export const canvas2watermark = (text, options = DEFAULT_CANVAS_TO_WATERMARK_OPTIONS) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const dpr = window.devicePixelRatio || 1
  const bsr =
    ctx['webkitBackingStorePixelRatio'] ||
    ctx['mozBackingStorePixelRatio'] ||
    ctx['msBackingStorePixelRatio'] ||
    ctx['oBackingStorePixelRatio'] ||
    ctx['backingStorePixelRatio'] ||
    1
  const ratio = dpr / bsr
  canvas.height = options.height * ratio
  canvas.width = options.width * ratio
  // canvas.style.height = options.height + 'px'
  // canvas.style.width = options.width + 'px'

  ctx.save()
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.restore()

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

  ctx.rotate((options.rotate * Math.PI) / 180)
  ctx.fillStyle = '#efefef'
  ctx.font = '10px sans-serif'
  ctx.fillText(text, 75, 10)

  const base64 = canvas.toDataURL('image/png', 1)
  canvas.remove()
  return base64
}
