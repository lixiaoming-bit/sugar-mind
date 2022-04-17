import utils from '../core/utils'
import MinderNode from '../core/node'
import Command from '../core/command'
import Module from '../core/module'
import Renderer from '../core/render'
const kity = window.kity

// 创建一个foreignObject节点
const DEFAULT_EDITOR_STYLE = 'width: 100%; height: 100%; overflow: visible; cursor: text;'
const DEFAULT_TEXT_STYLE =
  'pointer-events: none;overflow: hidden;display:inline-block;height: 100%;'

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
    element.addEventListener('mousedown', e => e.stopPropagation())
    this.editElement = element
    this.foreignElement.appendChild(this.editElement)
  }
  // 创建
  createTextContainer() {
    const element = document.createElement('div')
    element.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
    element.setAttribute('class', 'fo-text')
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

  create() {
    // 创建dom节点
    const fo = new CreateForeignObject()
    const group = new kity.Group().setId(utils.uuid('node_text'))
    group.node.appendChild(fo.foreignElement)
    group.foreign = fo

    return group
  },

  update(textGroup, node) {
    const element = textGroup.node.lastChild
    const getDataOrStyle = name => node.getData(name) || node.getStyle(name)

    const nodeText = node.getText()

    // const textArr = nodeText ? nodeText.split('\n') : [' ']
    // const lineHeight = node.getStyle('line-height')
    // const height = lineHeight * fontSize * textArr.length - (lineHeight - 1) * fontSize
    const color = getDataOrStyle('color')
    const fontSize = getDataOrStyle('font-size') + 'px'
    const fontFamily = getDataOrStyle('font-family') || "微软雅黑, 'Microsoft YaHei'"
    const lineHeight = getDataOrStyle('line-height')
    const fontStyle = getDataOrStyle('font-style')
    const fontWeight = getDataOrStyle('font-weight')
    const textDecoration = getDataOrStyle('text-decoration')

    textGroup.foreign.setStyle({
      color,
      fontSize,
      fontFamily,
      lineHeight,
      fontStyle,
      fontWeight,
      textDecoration
    })

    // 获取当前文本宽高
    const { width, height } = utils.getTextBoundary(nodeText, {
      color,
      fontSize,
      fontFamily,
      lineHeight,
      fontStyle,
      fontWeight,
      textDecoration
    })

    const yStart = -height / 2

    textGroup.foreign.setContent(nodeText)

    element.setAttribute('width', width + 2)
    element.setAttribute('height', height)
    element.setAttribute('y', yStart)
    element.setAttribute('x', 0)

    this.setTextStyle(node, textGroup)

    const textHash =
      node.getText() +
      ['font-size', 'font-name', 'font-weight', 'font-style'].map(getDataOrStyle).join('/')

    if (node._currentTextHash === textHash && node._currentTextGroupBox) {
      return node._currentTextGroupBox
    }

    node._currentTextHash = textHash

    return function () {
      const r = Math.round

      const nBox = new kity.Box(0, r(yStart), width, height)

      node._currentTextGroupBox = nBox
      return nBox
    }
  },

  setTextStyle(node, text) {
    const hooks = TextRenderer._styleHooks
    hooks.forEach(function (hook) {
      hook(node, text)
    })
  }
})

const TextCommand = kity.createClass({
  base: Command,
  execute(minder, text) {
    const node = minder.getSelectedNode()
    if (node) {
      node.setText(text)
      node.render()
      minder.layout()
    }
  },
  queryState(minder) {
    return minder.getSelectedNode() ? 0 : -1
  },
  queryValue(minder) {
    const node = minder.getSelectedNode()
    return node.getText()
  }
})

utils.extend(TextRenderer, {
  _styleHooks: [],

  registerStyleHook(fn) {
    TextRenderer._styleHooks.push(fn)
  }
})

kity.extendClass(MinderNode, {
  getTextGroup() {
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
