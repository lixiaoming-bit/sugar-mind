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
          shape: document.getElementById(item.id).shape.getItem(0),
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
        // const visible =
        //   start.isCollapsed() || end.isCollapsed() || start._isDragging || end._isDragging

        // shape.setVisible(!visible)
        shape.setVisible(true)
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
      const shape = container.getItem(0)
      const [start, end] = nodes

      shape.setVisible(true)

      shape.stroke(strokeColor, strokeWidth)
      shape.setAttr('stroke-dasharray', strokeDasharray)

      provider(end, start, shape, strokeWidth, strokeColor)

      // 更新当前关联线的shadow状态
      container.update()

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

  // 创建连线的操作副本
  class RelationshipEdit extends kity.Group {
    constructor() {
      super()
      this.setId(utils.uuid('minder_relationship_edit_group'))
      this.setConnection()
      this.setControl()
      this.setVisible(false)
      this.addClass('relationship-edit')
    }
    setVisible(visible) {
      this.connection.setVisible(visible)
      this.control.setVisible(visible)
    }
    setConnection(connection = new kity.Path()) {
      const strokeWidth = 8
      const strokeColor = '#2ebdff'
      const strokeOpacity = '0.75'
      const strokeLinecap = 'round'
      // this.text = new kity.Text(text || '关联线')
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
  }

  // 创建连线
  class Relationship extends kity.Group {
    constructor() {
      super()
      this.connectionShadow = new kity.Path()
      this.connection = new kity.Path()
      // this.text = new kity.Text('关联线')
      // this.forward = new kity.Point()
      // this.backward = new kity.Point()
      // this.endPoint = new kity.Point()
      this.addClass('relationship')
      this.addShapes([this.connectionShadow, this.connection])
      this.bindEvents()
    }
    bindEvents() {
      const container = minder.getRelationshipEditContainer()
      // this.on('mouseover', () => {
      //   container.active(this.connection)
      // })
      // this.on('mouseleave', () => {
      //   container.deActive()
      // })
      this.on('click', e => {
        console.groupEnd('dianji')
        e.stopPropagation()
        container.active(this.connection)
      })
    }
    update() {
      // this.removeShape(1)
      const pathData = this.connection.getPathData()
      console.log('this.connection: ', this.connection)
      this.connectionShadow = new kity.Path().setPathData(pathData)
      this.connectionShadow.stroke(8, '#2ebdff').setOpacity(0.75)
      this.addShape(this.connectionShadow)
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
