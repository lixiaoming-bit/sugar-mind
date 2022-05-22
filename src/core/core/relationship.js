import utils from './utils'

import Command from './command'
import Module from './module'
import Minder from './minder'
import MinderNode from './node'
// import Renderer from './render'
const kity = window.kity

// 连线提供方
const _relationshipConnectProviders = {}

function register(name, provider) {
  _relationshipConnectProviders[name] = provider
}

register('default', function (node, parent, connection) {
  connection.setPathData(['M', parent.getLayoutVertexOut(), 'L', node.getLayoutVertexIn()])
})

export default { register }

Module.register('RelationshipModule', function () {
  const minder = this
  // 数据信息
  let _relationship = []
  let _tempRelationship = {}

  const marker = new kity.Marker().pipe(function () {
    const r = 8
    const triangle = new kity.Path('M 4 0 L 0 2 L 4 4 Z').fill('#999999')
    this.addShape(triangle)
    this.setRef(1, 2).setViewBox(0, 0, r, r).setWidth(r).setHeight(r)
  })
  const paper = minder.getPaper()
  paper.addResource(marker)

  kity.extendClass(Minder, {
    setRelationshipData(id, nodes) {
      const [start, end] = nodes
      const startId = start.getData('id')
      const endId = end.getData('id')
      _tempRelationship = {
        id,
        start: {
          id: startId
        },
        end: {
          id: endId
        }
      }
      console.log('_tempRelationship: ', _tempRelationship)
      _relationship.push(_tempRelationship)
    },
    getRelationship(nodes) {
      const ids = nodes.map(node => node.getData('id'))
      const relationship = _relationship.filter(
        item => ids.includes(item.start.id) || ids.includes(item.end.id)
      )
      return Array.from(relationship, item => {
        return {
          shape: document.getElementById(item.id).shape.getItem(1),
          start: this.getNodeById(item.start.id),
          end: this.getNodeById(item.end.id)
        }
      })
    },
    // 获取当前的关联线容器
    getRelationshipContainer() {
      return this._relationshipConnectContainer
    },
    // 获取当前的关联线编辑容器 全局共享一个
    getRelationshipEditContainer() {
      return this._relationshipConnectEditContainer
    },
    // 删除关联线
    removeRelationship(nodes) {
      const ids = nodes.map(node => node.getData('id'))
      const rest = []
      const remove = []
      _relationship.forEach(item => {
        if (ids.includes(item.start.id) || ids.includes(item.end.id)) {
          remove.push(item)
        } else {
          rest.push(item)
        }
      })
      _relationship = rest
      return remove.map(connect => document.getElementById(connect.id).shape)
    },

    // 创建关联线
    createRelationshipConnect(nodes) {
      if (!Array.isArray(nodes) || nodes.length !== 2) return

      const relationship = new Relationship()

      this.setRelationshipData(relationship.getId(), nodes)
      this._relationshipConnectContainer.addShape(relationship)
      this.updateRelationshipConnect(nodes)
    },

    // 更新所有的关联线
    updateAllRelationshipConnect() {
      if (this._relationshipConnectContainer) {
        this.getRenderContainer().arrangeShape(this._relationshipConnectContainer, -1)
        this.getRenderContainer().arrangeShape(this._relationshipConnectEditContainer, -1)
      }

      if (!this._relationshipConnectContainer || utils.isEmpty(_relationship)) return

      const nodes = this.getAllNode()
      const connection = this.getRelationship(this.getAllNode())

      if (!connection.length) return

      // TODO 现在默认使用第一个元素来获取连线的配置
      const [node] = nodes
      const provider = node.getRelationshipConnectProvider()
      const strokeColor = node.getStyle('relationship-stroke-color') || 'white'
      const strokeWidth = node.getStyle('relationship-stroke-width') || 1
      const strokeDasharray = node.getStyle('relationship-stroke-dasharray') || '6 4'

      connection.forEach(connect => {
        const { shape, start, end } = connect
        const visible =
          start.isCollapsed() || end.isCollapsed() || start._isDragging || end._isDragging
        shape.setVisible(!visible)
        shape.stroke(strokeColor, strokeWidth)
        shape.setAttr('stroke-dasharray', strokeDasharray)

        provider(end, start, shape, marker)

        if (strokeWidth % 2 === 0) {
          shape.setTranslate(0.5, 0.5)
        } else {
          shape.setTranslate(0, 0)
        }
      })
    },

    // 更新单个关联线
    updateRelationshipConnect(nodes) {
      if (this._relationshipConnectContainer) {
        this.getRenderContainer().arrangeShape(this._relationshipConnectContainer, -1)
      }
      if (utils.isEmpty(nodes) || nodes.length !== 2) return

      const [node] = nodes
      const provider = node.getRelationshipConnectProvider()

      const strokeColor = node.getStyle('relationship-stroke-color') || 'white'
      const strokeWidth = node.getStyle('relationship-stroke-width') || 1
      const strokeDasharray = node.getStyle('relationship-stroke-dasharray') || '6 4'

      const container = document.getElementById(_tempRelationship.id).shape
      const shape = container.getItem(1)
      const [start, end] = nodes

      shape.setVisible(true)

      shape.stroke(strokeColor, strokeWidth)
      shape.setAttr('stroke-dasharray', strokeDasharray)

      provider(end, start, shape, marker)

      // 更新当前关联线的shadow状态
      container.update(shape)

      if (strokeWidth % 2 === 0) {
        shape.setTranslate(0.5, 0.5)
      } else {
        shape.setTranslate(0, 0)
      }
    },

    // 删除关联线
    removeRelationshipConnect(node) {
      node.traverse(node => {
        const connection = this.removeRelationship([node])
        connection.forEach(connect => {
          this._relationshipConnectContainer.removeShape(connect)
        })
      })
      this.updateAllRelationshipConnect()
    }
  })

  kity.extendClass(MinderNode, {
    // 获取当前连接线的类型
    getRelationshipConnect() {
      return 'poly'
    },

    getRelationshipConnectProvider() {
      return (
        _relationshipConnectProviders[this.getRelationshipConnect()] ||
        _relationshipConnectProviders['poly']
      )
    },
    // 获取当前节点连接的关联线
    getRelationshipConnection() {
      return this._relationshipConnection || null
    },
    // 获取当前节点关联节点的数据
    getRelationshipNode() {
      return []
    }
  })

  // 创建一个foreignObject节点
  // const DEFAULT_EDITOR_STYLE = 'width: 100%; height: 100%; overflow: visible; cursor: text;'
  const DEFAULT_TEXT_STYLE =
    'outline: none;padding: 0;height: 100%;margin: 0;width: 100%;display: inline-block;border:none;max-width:300px;word-wrap: break-word;word-break: break-all;overflow:hidden;resize:none;'

  class CreateForeignObject {
    constructor() {
      this.createMainContainer()
      this.createTextContainer()
      this.bindEvents()
    }
    // 创建主容器
    createMainContainer() {
      const element = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
      element.setAttribute('id', utils.uuid('foreignObject'))
      element.setAttribute('class', 'km-relationship-foreign-object')
      this.foreignElement = element
    }
    // 创建
    createTextContainer() {
      const element = document.createElement('input')
      element.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
      element.setAttribute('class', 'fo-text')
      element.setAttribute('style', DEFAULT_TEXT_STYLE)
      this.textElement = element
      this.foreignElement.appendChild(this.textElement)
    }

    // 切换编辑器编辑状态
    setEditStatus(status) {
      if (status) {
        this.textElement.setAttribute('contenteditable', 'true')
        this.textElement.focus()
      } else {
        this.textElement.setAttribute('contenteditable', 'false')
      }
    }

    // 设置文本内容
    setContent(text) {
      const style = {
        color: '#999999',
        fontSize: '14px',
        fontFamily: "微软雅黑, 'Microsoft YaHei'",
        lineHeight: '1.5'
      }

      const { width, height } = utils.getTextBoundary(text, style)
      this.width = width
      this.height = height

      this.foreignElement.style.color = style.color
      this.foreignElement.style.fontSize = style.fontSize
      this.foreignElement.style.fontFamily = style.fontFamily
      this.foreignElement.style.lineHeight = style.lineHeight
      this.foreignElement.style.height = height + 'px'
      this.foreignElement.style.width = width + 'px'

      this.textElement.value = text || ''

      if (this.x && this.y) {
        this.setTranslate(this.x, this.y)
      }
    }
    setTranslate(x, y) {
      this.x = x
      this.y = y
      const deltaX = x - this.width / 2
      const deltaY = y - this.height / 2
      this.foreignElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`
    }
    setVisible(visible) {
      const display = visible ? 'block' : 'none'
      this.textElement.style.display = display
    }
    bindEvents() {
      this.textElement.addEventListener('input', e => {
        this.setContent(e.target.value)
      })
    }
  }

  // 连线编辑状态
  class RelationshipEdit extends kity.Group {
    constructor() {
      super()
      this.setId(utils.uuid('minder_relationship_edit_group'))
      this.setConnection()
      this.setControl()
      this.setTextContainer()
      this.setVisible(false)
      this.bindEvents()
    }
    setVisible(visible) {
      this.connection.setVisible(visible)
      this.control.setVisible(visible)
      this.foreign.setVisible(visible)
    }
    setTextContainer() {
      const fo = new CreateForeignObject()
      this.node.appendChild(fo.foreignElement)
      this.foreign = fo
    }
    setConnection(connection = new kity.Path()) {
      const strokeWidth = 8
      const strokeColor = '#2ebdff'
      const strokeOpacity = '0.75'
      const strokeLinecap = 'round'

      const pathData = connection.getPathData()
      this.connection = new kity.Path(pathData)
      this.connection.stroke(strokeColor, strokeWidth)
      this.connection.setAttr('stroke-opacity', strokeOpacity)
      this.connection.setAttr('stroke-linecap', strokeLinecap)

      this.addShape(this.connection)
    }
    setControl() {
      this.control = new kity.Path()
      this.addShape(this.control)
    }
    active(connection, points) {
      minder.getRelationshipEditContainer().clear()
      this.setConnection(connection)
      this.setControl(points)
      this.setVisible(true)
    }
    deActive() {
      this.setVisible(false)
      minder.getRelationshipEditContainer().clear()
    }
    editText() {
      const point = kity.g.pointAtPath(this.connection.getPathData(), 0.5)
      this.foreign.setContent('关联线')
      this.foreign.setEditStatus(true)
      this.foreign.setTranslate(point.x, point.y)
    }
    bindEvents() {
      this.on('dblclick', e => {
        e.stopPropagation()
        this.editText()
      })
    }
  }

  // 创建连线
  class Relationship extends kity.Group {
    constructor() {
      super()
      this.connectionShadow = new kity.Path().stroke('#333', 8).setAttr('stroke-opacity', 0)
      this.connection = new kity.Path()
      this.text = new kity.Text()
      // const point = kity.g.pointAtPath(this.connection.getPathData(), 0.5)
      // this.text.setPosition(point.x, point.y)
      this.text.setVisible(false)
      // this.forward = new kity.Point()
      // this.backward = new kity.Point()
      // this.endPoint = new kity.Point()
      this.addShapes([this.connectionShadow, this.connection, this.text])
      this.bindEvents()
    }
    bindEvents() {
      const container = minder.getRelationshipEditContainer()
      // this.on('mouseover', e => {
      //   e.stopPropagation()
      //   container.active(this.connection)
      // })
      // this.on('mouseleave', e => {
      //   e.stopPropagation()
      //   container.deActive()
      // })
      this.on('click', e => {
        e.stopPropagation()
        container.active(this.connection)
      })
      // 双击编辑文本
      this.on('dblclick', e => {
        e.stopPropagation()
        container.editText(this.text)
      })
    }
    update(shape, text) {
      const pathData = shape.getPathData()
      this.connectionShadow.setPathData(pathData)
      if (text) {
        this.text.setContent(text)
      }
      this.text.setVisible(!!text)
    }
  }

  /**
   * @description: normal状态下支持直接选择设置连线
   */
  const RelationshipCommand = kity.createClass('RelationshipCommand', {
    base: Command,
    execute(minder) {
      // _isConnecting = true
      const selected = minder.getSelectedNodes() || []

      // 没有选中节点，则选中节点再连线

      // 从当前节点的中心点触发
      // if (selected.length === 1) {
      // }

      if (selected.length === 2) {
        minder.createRelationshipConnect(selected)
      }
    },

    queryState(minder) {
      const node = minder.getSelectedNodes() || []
      return minder.getStatus() === 'normal' && node.length <= 2 ? 0 : -1
    }
  })

  return {
    // 初始化创建关联线容器
    init() {
      this._relationshipConnectContainer = new kity.Group().setId(
        utils.uuid('minder_relationship_group')
      )
      this._relationshipConnectEditContainer = new RelationshipEdit()
      this.getRenderContainer().addShapes([
        this._relationshipConnectContainer,
        this._relationshipConnectEditContainer
      ])
    },
    events: {
      nodedetach(e) {
        this.removeRelationshipConnect(e.node)
      },
      click: function (e) {
        if (!(e.kityEvent.targetShape.container instanceof RelationshipEdit)) {
          e.minder.getRelationshipEditContainer().clear()
        }
      },
      'layoutapply layoutfinish noderender': function () {
        this.updateAllRelationshipConnect()
      }
    },
    commands: {
      relationship: RelationshipCommand
    }
  }
})
