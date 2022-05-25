import { debounce } from 'lodash-es'
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
  minder._relationship = []

  const marker = new kity.Marker().pipe(function () {
    const r = 8
    const triangle = new kity.Path('M 4 0 L 0 2 L 4 4 Z').fill('#999999')
    this.addShape(triangle)
    this.setRef(1, 2).setViewBox(0, 0, r, r).setWidth(r).setHeight(r)
  })
  const paper = minder.getPaper()
  paper.addResource(marker)

  kity.extendClass(Minder, {
    // 设置关联线容器
    setRelationshipContainer() {
      const id = utils.uuid('minder_relationship_group')
      const shape = new kity.Group().setId(id)
      this._relationshipConnectContainer = shape
      this.getRenderContainer().addShape(shape)
      return shape
    },
    // 设置关联线编辑容器
    setRelationshipEditContainer(group) {
      const container = this.getRenderContainer()
      const editContainer = this._relationshipConnectEditContainer
      const shape = new RelationshipEdit(group)
      if (editContainer) {
        editContainer.node.remove()
      }
      container.addShape(shape)
      this._relationshipConnectEditContainer = shape
      return shape
    },
    // 根据id设置关联线点
    setRelationshipPoint(id, points, type) {
      this._relationship.forEach(item => {
        if (item.id === id) {
          item.start.sp = points[0]
          item.start.scp = points[1]
          item.end.ep = points[2]
          item.end.ecp = points[3]
          item.type = type || item.type || 'sys'
        }
      })
    },
    // 设置连线数据
    setRelationship(id, nodes) {
      const [start, end] = nodes
      const startId = start.getData('id')
      const endId = end.getData('id')
      minder._relationship.push({
        id,
        start: {
          id: startId
        },
        end: {
          id: endId
        }
      })
    },
    // 设置关联线的文本
    setRelationshipText(id, text) {
      for (let i = 0; i < minder._relationship.length; i++) {
        const item = minder._relationship[i]
        if (item.id === id) {
          item.text = text
          return
        }
      }
    },
    setRawRelationship(relationship = []) {
      this._relationship = relationship
    },
    // 获取原始数据
    getRawRelationship() {
      return this._relationship
    },
    // 获取指定节点的关联线
    getRelationship(nodes) {
      const ids = nodes.map(node => node.getData('id'))
      const relationship = minder._relationship.filter(
        item => ids.includes(item.start.id) || ids.includes(item.end.id)
      )
      return Array.from(relationship, item => {
        return {
          shape: document.getElementById(item.id).shape,
          start: this.getNodeById(item.start.id),
          end: this.getNodeById(item.end.id),
          text: item.text,
          sp: item.start.sp,
          scp: item.start.scp,
          ep: item.end.ep,
          ecp: item.end.ecp,
          type: item.type
        }
      })
    },
    // 根据id获取信息
    // TODO 此处代码需要优化
    getRelationshipById(id) {
      const relationship = minder._relationship.filter(item => item.id === id)
      const [target] = relationship
      if (!target) return {}
      const shape = document.getElementById(target.id).shape
      const start = this.getNodeById(target.start.id)
      const end = this.getNodeById(target.end.id)
      const text = target.text
      const sp = target.start.sp
      const scp = target.start.scp
      const ep = target.end.ep
      const ecp = target.end.ecp
      const startId = target.start.id
      const endId = target.end.id
      const type = target.type
      return { shape, start, end, text, sp, scp, ep, ecp, startId, endId, type }
    },
    // 根据id获取关联线的文本
    getRelationshipTextById(id) {
      return minder._relationship.find(item => item.id === id) || '关联线'
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
      minder._relationship.forEach(item => {
        if (ids.includes(item.start.id) || ids.includes(item.end.id)) {
          remove.push(item)
        } else {
          rest.push(item)
        }
      })
      minder._relationship = rest
      return remove.map(connect => document.getElementById(connect.id).shape)
    },
    // 删除关联线根据id
    removeRelationshipByIndex(index) {
      const [remove] = minder._relationship.splice(index, 1)
      if (!remove) return
      const { id } = remove
      const shape = document.getElementById(id).shape
      shape.remove()
    },
    // 设置关联线根据id
    addRelationshipByIndex(index, value) {
      // minder._relationship.splice(index, 0, value)
      const start = this.getNodeById(value.start.id)
      const end = this.getNodeById(value.end.id)
      if (start && end) {
        this.createRelationshipConnect([start, end])
      }
    },

    // 创建关联线
    createRelationshipConnect(nodes) {
      if (!Array.isArray(nodes) || nodes.length !== 2) return

      const relationship = new Relationship()

      this.setRelationship(relationship.getId(), nodes)
      this._relationshipConnectContainer.addShape(relationship)
      this.updateRelationshipConnect(nodes)
    },

    // 更新关联线
    updateRelationshipConnect: debounce(function (nodes) {
      // const selected = this.getSelectedNodes()
      // const defaultNodes = selected.length ? selected : this.getAllNode()
      const container = this.getRenderContainer()
      nodes = nodes || this.getAllNode()

      if (this._relationshipConnectContainer) {
        container.arrangeShape(this._relationshipConnectContainer, -1)
      }
      if (this._relationshipConnectEditContainer) {
        this._relationshipConnectEditContainer.node.remove()
        // console.log(
        //   'this._relationshipConnectEditContainer: ',
        //   this._relationshipConnectEditContainer
        // )
        // container.arrangeShape(this._relationshipConnectEditContainer, -1)
      }

      const provider = _relationshipConnectProviders['poly']

      const strokeColor = '#999999'
      const strokeWidth = 2
      const strokeDasharray = '6 4'

      const connection = this.getRelationship(nodes)

      if (!connection.length) return

      connection.forEach(connect => {
        const { shape, start, end, text, type, sp, scp, ep, ecp } = connect
        const points = [sp, scp, ep, ecp]
        const visible =
          start.isCollapsed() || end.isCollapsed() || start._isDragging || end._isDragging

        shape.setVisible(!visible)
        if (!visible) {
          shape.connection.stroke(strokeColor, strokeWidth)
          shape.connection.setAttr('stroke-dasharray', strokeDasharray)

          const newPoints = provider(end, start, shape.connection, marker, points, type)

          if (strokeWidth % 2 === 0) {
            shape.setTranslate(0.5, 0.5)
          } else {
            shape.setTranslate(0, 0)
          }

          // 更新当前关联线的shadow状态
          shape.update(shape.connection, text, newPoints)
        }
      })
    }, 0),

    // 删除关联线
    removeRelationshipConnect(node) {
      node.traverse(node => {
        const connection = this.removeRelationship([node])
        connection.forEach(connect => {
          // this._relationshipConnectContainer.removeShape(connect)
          connect.remove()
        })
      })
      this.updateRelationshipConnect()
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
    'outline: none;padding: 0;height: 100%;margin: 0;width: 100%;display: inline-block;border:none;max-width:300px;white-space:nowrap;overflow:hidden;resize:none;'

  class CreateForeignObject {
    constructor(relationship, type) {
      this.type = type
      this.relationship = relationship
      this.createMainContainer()
      this.createTextContainer()
      if (type === 'edit') {
        this.bindEvents()
      }
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
      const style =
        this.type === 'edit'
          ? DEFAULT_TEXT_STYLE
          : DEFAULT_TEXT_STYLE + 'background:transparent;text-align:center;'
      const element = document.createElement('textarea')
      element.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
      element.setAttribute('class', 'relationship-edit')
      element.setAttribute('style', style)
      this.textElement = element
      this.foreignElement.appendChild(this.textElement)
    }

    // 切换编辑器编辑状态
    setEditStatus(status) {
      if (status) {
        this.setContent(this.relationship.text)
        this.textElement.focus()
        //   this.textElement.setAttribute('contenteditable', 'true')
        // } else {
        //   this.textElement.setAttribute('contenteditable', 'false')
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

      let { width, height } = utils.getTextBoundary(text, style)

      if (/[\r?\n|(?<!\n)\r]$/.test(text)) {
        height += 20
      }

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
    // 获取文本内容
    getContent() {
      return this.textElement.value
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
        const text = e.target.value
        this.relationship.text = text
        this.setContent(text)
        this.relationship.setContent(text)
      })
      this.textElement.addEventListener('click', e => {
        e.stopPropagation()
        if (this.type !== 'edit') return
        console.log('this.relationship.text: ', this.relationship.text)
        this.setContent(this.relationship.text)
        this.relationship.setContent(this.relationship.text)
        this.textElement.focus()
      })
      // this.textElement.addEventListener('blur', e => {
      //   e.stopPropagation()
      //   if (this.type !== 'edit') return
      //   this.textElement.blur()
      // })
    }
  }

  // 手柄
  class ControlPoint extends kity.Group {
    constructor(editRelationshipContainer, node, from, to) {
      super()
      const box = node.getLayoutBox()
      this.box = box
      this.nodeId = node.getData('id')
      this.editRelationshipContainer = editRelationshipContainer
      this.from = new kity.Point(box.cx, box.cy).offset(from)
      this.to = new kity.Point(box.cx, box.cy).offset(to)
      this.initLine()
      this.initCircle()
      this.bindEvents()
    }
    initLine() {
      const strokeWidth = 2
      const strokeColor = '#2ebdff'
      const strokeOpacity = '0.75'
      const strokeLinecap = 'round'

      this.line = new kity.Line(this.from.x, this.from.y, this.to.x, this.to.y)
      this.line.stroke(strokeColor, strokeWidth)
      this.line.setAttr('stroke-opacity', strokeOpacity)
      this.line.setAttr('stroke-linecap', strokeLinecap)
      this.addShape(this.line)
    }
    initCircle() {
      const color = '#2ebdff'
      this.circle = new kity.Circle()
      this.circle.setCenter(this.to.x, this.to.y)
      this.circle.setRadius(8)
      this.circle.stroke(color, 1).fill('#ffffff')
      this.circle.addClass('control-point')
      this.addShape(this.circle)
    }
    updateFromPoint(toPoint) {
      // 四个顶点
      const topLeft = new kity.Point(this.box.left, this.box.top)
      const topRight = new kity.Point(this.box.right, this.box.top)
      const bottomRight = new kity.Point(this.box.right, this.box.bottom)
      const bottomLeft = new kity.Point(this.box.left, this.box.bottom)

      // 判断拖拽的点在矩形内部还是外部
      const tempPoint = toPoint

      // 其中一条线的两个点
      const a = new kity.Point(this.box.cx, this.box.cy).round()
      const b = tempPoint

      // 确定另外两个点
      // 计算拖拽的点在盒子的哪个象限
      let p, pos
      let position = ''

      if (tempPoint.x <= this.box.left) {
        position += 'left'
      }
      if (tempPoint.x >= this.box.right) {
        position += 'right'
      }
      if (tempPoint.y >= this.box.bottom) {
        position += 'bottom'
      }
      if (tempPoint.y <= this.box.top) {
        position += 'top'
      }
      if (!position) {
        return this.from
      }
      switch (position) {
        case 'left':
          p = utils.calculateCrossPoint(a, b, topLeft, bottomLeft)
          break
        case 'right':
          p = utils.calculateCrossPoint(a, b, topRight, bottomRight)
          break
        case 'top':
          p = utils.calculateCrossPoint(a, b, topLeft, topRight)
          break
        case 'bottom':
          p = utils.calculateCrossPoint(a, b, bottomLeft, bottomRight)
          break
        case 'lefttop':
          pos = utils.calculatePointPosition(topLeft, a, b)
          if (pos === 'left') {
            p = utils.calculateCrossPoint(a, b, topLeft, topRight)
          } else if (pos === 'right') {
            p = utils.calculateCrossPoint(a, b, topLeft, bottomLeft)
          } else {
            p = topLeft
          }
          break
        case 'righttop':
          pos = utils.calculatePointPosition(topRight, a, b)
          if (pos === 'left') {
            p = utils.calculateCrossPoint(a, b, topRight, bottomRight)
          } else if (pos === 'right') {
            p = utils.calculateCrossPoint(a, b, topLeft, topRight)
          } else {
            p = topRight
          }
          break
        case 'leftbottom':
          pos = utils.calculatePointPosition(bottomLeft, a, b)
          if (pos === 'left') {
            p = utils.calculateCrossPoint(a, b, bottomLeft, bottomRight)
          } else if (pos === 'right') {
            p = utils.calculateCrossPoint(a, b, topLeft, bottomLeft)
          } else {
            p = bottomLeft
          }
          break
        case 'rightbottom':
          pos = utils.calculatePointPosition(bottomRight, a, b)
          if (pos === 'left') {
            p = utils.calculateCrossPoint(a, b, topRight, bottomRight)
          } else if (pos === 'right') {
            p = utils.calculateCrossPoint(a, b, bottomLeft, bottomRight)
          } else {
            p = bottomRight
          }
          break
      }
      return new kity.Point(p.x, p.y).round()
    }
    setVisible(visible) {
      this.line.setVisible(visible)
      this.circle.setVisible(visible)
    }
    bindEvents() {
      let isKeyDown, fromPoint, toPoint
      const center = new kity.Point(this.box.cx, this.box.cy)
      this.circle.on('mousedown', e => {
        e.stopPropagation()
        isKeyDown = true
        document.onmousemove = evt => {
          evt.stopPropagation()
          if (isKeyDown) {
            const dx = evt.clientX - e.originEvent.clientX
            const dy = evt.clientY - e.originEvent.clientY

            toPoint = new kity.Point(this.to.x, this.to.y).offset(dx, dy)
            fromPoint = this.updateFromPoint(toPoint)

            this.circle.setCenter(toPoint.x, toPoint.y)
            this.line.setPoint1(fromPoint.x, fromPoint.y)
            this.line.setPoint2(toPoint.x, toPoint.y)

            this.editRelationshipContainer.updateView(
              this.nodeId,
              kity.Vector.fromPoints(center, fromPoint),
              kity.Vector.fromPoints(center, toPoint)
            )
          }
        }
        document.onmouseup = event => {
          event.stopPropagation()
          this.from = fromPoint
          this.to = toPoint

          toPoint = null
          fromPoint = null
          isKeyDown = null
          document.onmousemove = null

          // 设置坐标
        }
      })
    }
  }

  // 连线编辑状态
  class RelationshipEdit extends kity.Group {
    constructor(relationship) {
      super()
      this.relationship = relationship
      this.pathData = this.relationship.connection.getPathData()
      this.setId(utils.uuid('minder_relationship_edit_group'))
      this.initConnection()
      this.initTextContainer()
      this.initControlPoint()
      // this.bindEvents()
    }
    // 初始化连接线
    initConnection() {
      const strokeWidth = 8
      const strokeColor = '#2ebdff'
      const strokeOpacity = '0.75'
      const strokeLinecap = 'round'

      this.connection = new kity.Path()
      this.connection.stroke(strokeColor, strokeWidth)
      this.connection.setAttr('stroke-opacity', strokeOpacity)
      this.connection.setAttr('stroke-linecap', strokeLinecap)
      this.connection.setPathData(this.pathData)

      this.addShape(this.connection)
    }
    // 初始化控制点
    initControlPoint() {
      const { start, end, sp, scp, ep, ecp } = minder.getRelationshipById(this.relationship.getId())
      if (!start && !end) return

      const [startPoint, startControlPoint, endPoint, endControlPoint] = [sp, scp, ep, ecp]

      this.startControl = new ControlPoint(this, start, startPoint, startControlPoint)
      this.endControl = new ControlPoint(this, end, endPoint, endControlPoint)

      this.addShapes([this.startControl, this.endControl])
    }
    // 初始化文本容器
    initTextContainer() {
      this.foreign = new CreateForeignObject(this.relationship, 'edit')
      this.node.appendChild(this.foreign.foreignElement)
    }
    // 控制显示 连线、手柄、文本
    // setVisible(visible) {
    //   this.connection.setVisible(visible)
    //   this.startControl.setVisible(visible)
    //   this.endControl.setVisible(visible)
    //   this.foreign.setVisible(visible)
    // }
    // 激活
    // active() {
    //   // this.connection.setPathData(pathData)
    //   // this.setVisible(true)

    //   this.updateTextPosition()
    // }
    // 取消激活
    // deActive() {
    //   // this.relationship.setContent(this.text)
    //   minder.getRelationshipEditContainer().remove()
    //   // this.setVisible(false)
    // }
    // 编辑文本
    // editText() {
    //   // this.text = text
    //   // this.foreign.setContent(text)
    //   this.updateTextPosition()
    // }
    // 更新文本编辑位置
    updateTextPosition() {
      // const pathData = this.connection.getPathData()
      const point = kity.g.pointAtPath(this.pathData, 0.5)
      this.foreign.setContent(this.relationship.text)
      // this.foreign.setEditStatus(true)
      this.foreign.setTranslate(point.x, point.y)
    }
    // // 编辑状态绑定双击 编辑文本
    // bindEvents() {
    //   this.on('click', e => {
    //     e.stopPropagation()
    //     console.log('this.relationship.text: ', this.relationship.text)
    //     this.relationship.setContent(this.relationship.text)
    //   })
    // }
    // 拖拽更新 只更新连接线 和 关联数据
    updateView(nodeId, from, to) {
      const relationshipId = this.relationship.getId()
      const { start, end, startId, endId, sp, scp, ep, ecp } =
        minder.getRelationshipById(relationshipId)

      const startBox = start.getLayoutBox()
      const endBox = end.getLayoutBox()

      let points = [sp, scp, ep, ecp]
      if (startId === nodeId) {
        points = [from, to, ep, ecp]
      } else if (endId === nodeId) {
        points = [sp, scp, from, to]
      }
      minder.setRelationshipPoint(relationshipId, points, 'user')

      // 更新视图
      const target = new kity.Path()
      const drawer = target.getDrawer()
      const startPoint = new kity.Point(startBox.cx, startBox.cy).offset(points[0])
      const startControlPoint = new kity.Point(startBox.cx, startBox.cy).offset(points[1])
      const endPoint = new kity.Point(endBox.cx, endBox.cy).offset(points[2])
      const endControlPoint = new kity.Point(endBox.cx, endBox.cy).offset(points[3])
      drawer
        .moveTo(startPoint.x, startPoint.y)
        .bezierTo(
          startControlPoint.x,
          startControlPoint.y,
          endControlPoint.x,
          endControlPoint.y,
          endPoint.x,
          endPoint.y
        )
      const pathData = target.getPathData()
      this.pathData = pathData

      this.relationship.connection.setPathData(pathData)
      this.relationship.connectionShadow.setPathData(pathData)

      this.connection.setPathData(pathData)
      this.updateTextPosition()
    }
  }

  // 创建连线
  class Relationship extends kity.Group {
    constructor(id = utils.guid()) {
      super()
      this.initConnectionShadow()
      this.initConnection()
      this.initTextContainer()

      this.bindEvents()
      this.setId(id)
      const { text = '关联线' } = minder.getRelationshipTextById(id) || {}
      this.text = text
    }
    // 初始化背景连接线
    initConnectionShadow() {
      this.connectionShadow = new kity.Path().stroke('#333', 8).setAttr('stroke-opacity', 0)
      this.addShape(this.connectionShadow)
    }
    // 初始化连接线
    initConnection() {
      this.connection = new kity.Path()
      this.addShape(this.connection)
    }
    // 初始化文本容器
    initTextContainer() {
      this.foreign = new CreateForeignObject(this, 'normal')
      this.foreign.setVisible(false)
      // this.foreign.setEditStatus(false)
      this.node.appendChild(this.foreign.foreignElement)
    }
    // 绑定事件
    bindEvents() {
      // 单击连线激活编辑状态
      this.on('click', e => {
        e.stopPropagation()
        this.foreign.setVisible(false)

        const editContainer = minder.setRelationshipEditContainer(this)
        editContainer.updateTextPosition()
      })
      // 双击连线激活编辑状态并编辑文本
      // this.on('dblclick', e => {
      //   e.stopPropagation()
      // })
    }
    // 失去焦点 或者渲染完成时更新数据
    update(shape, text, points) {
      minder.setRelationshipPoint(this.getId(), points)

      const pathData = shape.getPathData()
      this.connectionShadow.setPathData(pathData)
      this.foreign.setVisible(!!text)

      text && this.setContent(text)
    }
    setContent(text) {
      const point = kity.g.pointAtPath(this.connection.getPathData(), 0.5)
      this.foreign.setContent(text)
      this.foreign.setVisible(true)
      // this.foreign.setEditStatus(false)
      this.foreign.setTranslate(point.x, point.y)
      minder.setRelationshipText(this.getId(), text)
    }
    setVisible(visible) {
      this.connection.setVisible(visible)
      this.connectionShadow.setVisible(visible)
      this.foreign.setVisible(visible)
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
      minder.fire('contentchange')
    },

    queryState(minder) {
      const selected = minder.getSelectedNodes() || []
      return selected.length === 2 ? 0 : -1
    }
  })

  const RemoveRelationshipCommand = kity.createClass('RemoveRelationshipCommand', {
    base: Command,
    execute(minder, id) {
      minder._relationship = minder._relationship.filter(item => item.id !== id)
      minder.updateRelationshipConnect()
    }
  })

  return {
    // 初始化创建关联线容器
    init() {
      this.setRelationshipContainer()
    },
    events: {
      noderemove(e) {
        this.removeRelationshipConnect(e.node)
      },
      // nodeattach() {
      //   this.updateRelationshipConnect()
      // },
      click: function (e) {
        const isEdit = e.kityEvent.targetShape.container instanceof RelationshipEdit
        const isCircle = e.kityEvent.targetShape.container instanceof ControlPoint
        const editContainer = this.getRelationshipEditContainer()
        if (!isEdit && !isCircle && editContainer) {
          editContainer.node.remove()
          this.updateRelationshipConnect()
        }
      },
      'layoutapply layoutfinish noderender': function () {
        this.updateRelationshipConnect()
      }
    },
    commands: {
      relationship: RelationshipCommand,
      removeRelationship: RemoveRelationshipCommand
    }
  }
})
