import utils from '../core/utils'
import MinderNode from '../core/node'
import Command from '../core/command'
import Module from '../core/module'
import Renderer from '../core/render'
const kity = window.kity

// 创建一个foreignObject节点
const DEFAULT_EDITOR_STYLE = 'width: 100%; height: 100%; overflow: visible; cursor: text;'
const DEFAULT_TEXT_STYLE =
  // pointer-events: none;
  'overflow: hidden;display:inline-block;height: 100%;display:flex;align-items:center;'

class CreateForeignObject {
  constructor() {
    this.createMainContainer()
    this.createEditorContainer()
    this.createTextContainer()
    this.setVisible(true)
  }
  // 创建主容器
  createMainContainer() {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
    element.setAttribute('id', utils.uuid('foreignObject'))
    element.setAttribute('class', 'km-foreign-object')
    this.foreignElement = element
  }
  // 创建编辑器容器
  createEditorContainer() {
    const element = document.createElement('div')
    element.setAttribute('style', DEFAULT_EDITOR_STYLE)
    element.setAttribute('class', 'km-text-editor')
    this.editElement = element
    this.foreignElement.appendChild(this.editElement)
  }
  // 创建
  createTextContainer() {
    const element = document.createElement('div')
    element.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
    element.setAttribute('style', DEFAULT_TEXT_STYLE)
    this.textElement = element
    this.foreignElement.appendChild(this.textElement)
  }

  // 切换编辑器
  setVisible(flag) {
    if (flag) {
      this.editElement.innerHTML = null
      this.editElement.style.display = 'none'
      this.textElement.style.display = 'flex'
    } else {
      // this.textElement.innerHTML = null
      this.textElement.style.display = 'none'
      this.editElement.style.display = 'block'
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
    this.foreignElement.setAttribute('style', style)
  }
}

const TextRenderer = kity.createClass('TextRenderer', {
  base: Renderer,

  create: function (km) {
    const fo = new CreateForeignObject()
    const group = new kity.Group().setId(utils.uuid('node_text'))
    group.node.appendChild(fo.foreignElement)
    group.on('mousedown', e => {
      if (km.minder.getStatus() === 'textedit') e.stopPropagation()
    })
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

    // 获取当前文本宽高
    const { width, height } = utils.getTextBoundary(nodeText, {
      fontSize: fontSize + 'px',
      fontFamily
    })
    console.log('width, height: ', width, height)

    const yStart = -height / 2

    textGroup.foreign.setContent(nodeText)

    element.setAttribute('width', width + 2)
    element.setAttribute('height', height)
    element.setAttribute('y', yStart)

    // let rBox = new kity.Box()

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
      // rBox = rBox.merge(new kity.Box(0, yStart, (height && width) || 1, fontSize))

      const nBox = new kity.Box(0, r(yStart), width, height)

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
