import utils from '../core/utils'
import MinderNode from '../core/node'
import Command from '../core/command'
import Module from '../core/module'
import Renderer from '../core/render'
const kity = window.kity

// 创建一个foreignObject节点
const DEFAULT_EDITOR_STYLE = 'width: 100%; height: 100%; overflow: visible; cursor: text;'
const DEFAULT_TEXT_STYLE =
  'overflow: hidden;display:flex;align-items: center;height:100%;width:100%'

class CreateForeignObject {
  constructor() {
    this.createMainContainer()
    this.createEditorContainer()
    this.createTextContainer()
  }
  // 创建主容器
  createMainContainer() {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
    // element.setAttributeNS(null, 'xmlns', 'http://www.w3.org/2000/svg')
    element.setAttributeNS(null, 'id', utils.uuid('foreignObject'))
    this.foreignElement = element
  }
  // 创建编辑器容器
  createEditorContainer() {
    const element = document.createElement('div')
    this.editElement = element
    this.editElement.setAttribute('style', DEFAULT_EDITOR_STYLE)
    this.editElement.setAttribute('class', 'km-text-editor')
    this.foreignElement.appendChild(this.editElement)
    this.editElement.setVisible = flag => {
      this.editElement.style.display = flag ? 'block' : 'none'
    }
    this.editElement.setVisible(false)
  }
  // 创建
  createTextContainer() {
    const element = document.createElementNS('http://www.w3.org/1999/xhtml', 'div')
    this.textElement = element
    this.textElement.setAttributeNS(null, 'style', DEFAULT_TEXT_STYLE)
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

    // const lineHeight = node.getStyle('line-height')
    const fontSize = getDataOrStyle('font-size')
    const fontFamily = getDataOrStyle('font-family') || 'default'

    // 获取当前文本宽高
    const { width, height } = utils.getTextBoundary(nodeText, {
      fontSize: fontSize + 'px',
      fontFamily
    })

    const yStart = -height / 2

    textGroup.foreign.setContent(nodeText)

    element.setAttributeNS(null, 'width', width)
    element.setAttributeNS(null, 'height', height)
    element.setAttributeNS(null, 'y', yStart)

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

      const nBox = new kity.Box(r(rBox.x), r(rBox.y), r(rBox.width), r(rBox.height + 2))

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
