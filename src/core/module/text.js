import utils from '../core/utils'
import MinderNode from '../core/node'
import Command from '../core/command'
import Module from '../core/module'
import Renderer from '../core/render'
const kity = window.kity

// 创建一个foreignObject节点
const DEFAULT_EDITOR_STYLE = 'width: 100%; height: 100%; overflow: visible; cursor: text;'
const DEFAULT_TEXT_STYLE = 'pointer-events: none; overflow: hidden;'

class CreateForeignObject {
  constructor() {
    this.createMainContainer()
    this.createEditorContainer()
    this.createTextContainer()
  }
  // 创建主容器
  createMainContainer() {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
    // element.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    element.setAttribute('id', utils.uuid('foreignObject'))
    element.setAttribute('class', 'km-foreign-object')

    this.foreignElement = element
  }
  // 创建编辑器容器
  createEditorContainer() {
    const element = document.createElement('div')
    // element.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
    element.setAttribute('style', DEFAULT_EDITOR_STYLE)
    element.setAttribute('class', 'km-text-editor')
    this.editElement = element
    this.foreignElement.appendChild(this.editElement)
    this.editElement.setVisible = flag => {
      this.editElement.style.display = flag ? 'block' : 'none'
    }
    this.editElement.setVisible(false)
  }
  // 创建
  createTextContainer() {
    const element = document.createElement('div')
    element.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
    element.setAttribute('style', DEFAULT_TEXT_STYLE)
    this.textElement = element
    this.foreignElement.appendChild(this.textElement)
    this.textElement.setVisible = flag => {
      this.textElement.style.display = flag ? 'flex' : 'none'
    }
  }
  // 唤醒编辑器
  wakeUpEditor() {
    this.textElement.remove()
  }
  // 设置文本内容
  setContent(text) {
    this.textElement.innerText = text || ''
  }
  // 设置样式
  setStyle(style) {
    style = utils.styleToString(style)
    this.foreignElement.setAttributeNS(null, 'style', style)
  }
}

const FONT_ADJUST = {
  safari: {
    '微软雅黑,Microsoft YaHei': -0.17,
    '楷体,楷体_GB2312,SimKai': -0.1,
    '隶书, SimLi': -0.1,
    'comic sans ms': -0.23,
    'impact,chicago': -0.15,
    'times new roman': -0.1,
    'arial black,avant garde': -0.17,
    default: 0
  },
  ie: {
    10: {
      '微软雅黑,Microsoft YaHei': -0.17,
      'comic sans ms': -0.17,
      'impact,chicago': -0.08,
      'times new roman': 0.04,
      'arial black,avant garde': -0.17,
      default: -0.15
    },
    11: {
      '微软雅黑,Microsoft YaHei': -0.17,
      'arial,helvetica,sans-serif': -0.17,
      'comic sans ms': -0.17,
      'impact,chicago': -0.08,
      'times new roman': 0.04,
      'sans-serif': -0.16,
      'arial black,avant garde': -0.17,
      default: -0.15
    }
  },
  edge: {
    '微软雅黑,Microsoft YaHei': -0.15,
    'arial,helvetica,sans-serif': -0.17,
    'comic sans ms': -0.17,
    'impact,chicago': -0.08,
    'sans-serif': -0.16,
    'arial black,avant garde': -0.17,
    default: -0.15
  },
  sg: {
    '微软雅黑,Microsoft YaHei': -0.15,
    'arial,helvetica,sans-serif': -0.05,
    'comic sans ms': -0.22,
    'impact,chicago': -0.16,
    'times new roman': -0.03,
    'arial black,avant garde': -0.22,
    default: -0.15
  },
  chrome: {
    Mac: {
      'andale mono': -0.05,
      'comic sans ms': -0.3,
      'impact,chicago': -0.13,
      'times new roman': -0.1,
      'arial black,avant garde': -0.17,
      default: 0
    },
    Win: {
      '微软雅黑,Microsoft YaHei': -0.15,
      'arial,helvetica,sans-serif': -0.02,
      'arial black,avant garde': -0.2,
      'comic sans ms': -0.2,
      'impact,chicago': -0.12,
      'times new roman': -0.02,
      default: -0.15
    },
    Lux: {
      'andale mono': -0.05,
      'comic sans ms': -0.3,
      'impact,chicago': -0.13,
      'times new roman': -0.1,
      'arial black,avant garde': -0.17,
      default: 0
    }
  },
  firefox: {
    Mac: {
      '微软雅黑,Microsoft YaHei': -0.2,
      '宋体,SimSun': 0.05,
      'comic sans ms': -0.2,
      'impact,chicago': -0.15,
      'arial black,avant garde': -0.17,
      'times new roman': -0.1,
      default: 0.05
    },
    Win: {
      '微软雅黑,Microsoft YaHei': -0.16,
      'andale mono': -0.17,
      'arial,helvetica,sans-serif': -0.17,
      'comic sans ms': -0.22,
      'impact,chicago': -0.23,
      'times new roman': -0.22,
      'sans-serif': -0.22,
      'arial black,avant garde': -0.17,
      default: -0.16
    },
    Lux: {
      '宋体,SimSun': -0.2,
      '微软雅黑,Microsoft YaHei': -0.2,
      '黑体, SimHei': -0.2,
      '隶书, SimLi': -0.2,
      '楷体,楷体_GB2312,SimKai': -0.2,
      'andale mono': -0.2,
      'arial,helvetica,sans-serif': -0.2,
      'comic sans ms': -0.2,
      'impact,chicago': -0.2,
      'times new roman': -0.2,
      'sans-serif': -0.2,
      'arial black,avant garde': -0.2,
      default: -0.16
    }
  }
}

const TextRenderer = kity.createClass('TextRenderer', {
  base: Renderer,

  create: function () {
    const fo = new CreateForeignObject()
    const group = new kity.Group().setId(utils.uuid('node_text'))
    group.node.appendChild(fo.foreignElement)
    group.foreign = fo
    return group
  },

  update: function (textGroup, node) {
    const element = textGroup.node.lastChild
    const getDataOrStyle = name => node.getData(name) || node.getStyle(name)

    const nodeText = node.getText()

    // const textArr = nodeText ? nodeText.split('\n') : [' ']

    const fontSize = getDataOrStyle('font-size')
    const fontFamily = getDataOrStyle('font-family') || 'default'

    const Browser = kity.Browser
    let adjust

    if (Browser.chrome || Browser.opera || Browser.bd || Browser.lb === 'chrome') {
      adjust = FONT_ADJUST['chrome'][Browser.platform][fontFamily]
    } else if (Browser.gecko) {
      adjust = FONT_ADJUST['firefox'][Browser.platform][fontFamily]
    } else if (Browser.sg) {
      adjust = FONT_ADJUST['sg'][fontFamily]
    } else if (Browser.safari) {
      adjust = FONT_ADJUST['safari'][fontFamily]
    } else if (Browser.ie) {
      adjust = FONT_ADJUST['ie'][Browser.version][fontFamily]
    } else if (Browser.edge) {
      adjust = FONT_ADJUST['edge'][fontFamily]
    } else if (Browser.lb) {
      // 猎豹浏览器的ie内核兼容性模式下
      adjust = 0.9
    }

    textGroup.setTranslate(0, (adjust || 0) * fontSize)

    // 获取当前文本宽高
    const { width, height } = utils.getTextBoundary(nodeText, {
      fontSize: fontSize + 'px',
      fontFamily
    })

    const yStart = -height / 2

    textGroup.foreign.setContent(nodeText)

    element.setAttributeNS(null, 'width', width + 2)
    element.setAttributeNS(null, 'height', height)
    element.setAttributeNS(null, 'y', yStart)
    element.lastChild.style.lineHeight = height + 'px'

    let rBox = new kity.Box()

    // const r = Math.round

    // this.setTextStyle(node, textGroup)

    // const textLength = textArr.length

    // const textGroupLength = textGroup.getItems().length

    // var i, ci, textShape, text

    // if (textLength < textGroupLength) {
    //   for (i = textLength, ci; (ci = textGroup.getItem(i)); ) {
    //     textGroup.removeItem(i)
    //   }
    // } else if (textLength > textGroupLength) {
    //   let growth = textLength - textGroupLength
    //   while (growth--) {
    //     textShape = new kity.Text().setAttr('text-rendering', 'inherit')
    //     console.log('textShape: ', textShape)
    //     if (kity.Browser.ie || kity.Browser.edge) {
    //       textShape.setVerticalAlign('top')
    //     } else {
    //       textShape.setAttr('dominant-baseline', 'text-before-edge')
    //     }
    //     textGroup.addItem(textShape)
    //   }
    // }

    // for (i = 0, text, textShape; (text = textArr[i]), (textShape = textGroup.getItem(i)); i++) {
    //   textShape.setContent(text)
    //   if (kity.Browser.ie || kity.Browser.edge) {
    //     textShape.fixPosition()
    //   }
    // }

    this.setTextStyle(node, textGroup)

    const textHash =
      node.getText() +
      ['font-size', 'font-name', 'font-weight', 'font-style'].map(getDataOrStyle).join('/')

    if (node._currentTextHash === textHash && node._currentTextGroupBox)
      return node._currentTextGroupBox

    node._currentTextHash = textHash

    return function () {
      const r = Math.round

      // textGroup.eachItem(function (i, textShape) {

      //   textShape.setY(y)
      //   const bBox = textShape.getBoundaryBox()
      // })
      rBox = rBox.merge(new kity.Box(0, yStart, (height && width) || 1, fontSize))

      const nBox = new kity.Box(r(rBox.x), r(rBox.y), r(rBox.width), r(rBox.height))

      node._currentTextGroupBox = nBox
      return nBox
    }
  },

  setTextStyle: function (node, text) {
    const hooks = TextRenderer._styleHooks
    hooks.forEach(function (hook) {
      hook(node, text)
    })
  }
})

const TextCommand = kity.createClass({
  base: Command,
  execute: function (minder, text) {
    const node = minder.getSelectedNode()
    if (node) {
      node.setText(text)
      node.render()
      minder.layout()
    }
  },
  queryState: function (minder) {
    return minder.getSelectedNode() ? 0 : -1
  },
  queryValue: function (minder) {
    const node = minder.getSelectedNode()
    return node.getText()
  }
})

utils.extend(TextRenderer, {
  _styleHooks: [],

  registerStyleHook: function (fn) {
    TextRenderer._styleHooks.push(fn)
  }
})

kity.extendClass(MinderNode, {
  getTextGroup: function () {
    return this.getRenderer('TextRenderer').getRenderShape()
  }
})

Module.register('text', {
  commands: {
    text: TextCommand
  },
  renderers: {
    center: TextRenderer
  }
})
export default TextRenderer
