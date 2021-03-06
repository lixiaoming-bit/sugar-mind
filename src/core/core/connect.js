import utils from './utils'
import Module from './module'
import Minder from './minder'
import MinderNode from './node'
const kity = window.kity

// 连线提供方
const _connectProviders = {}

function register(name, provider) {
  _connectProviders[name] = provider
}

register('default', function (node, parent, connection) {
  connection.setPathData(['M', parent.getLayoutVertexOut(), 'L', node.getLayoutVertexIn()])
})

kity.extendClass(MinderNode, {
  /**
   * @private
   * @method getConnect()
   * @for MinderNode
   * @description 获取当前节点的连线类型
   *
   * @grammar getConnect() => {string}
   */
  getConnect() {
    return this.data.connect || 'default'
  },

  getConnectProvider() {
    return _connectProviders[this.getConnect()] || _connectProviders['default']
  },

  /**
   * @private
   * @method getConnection()
   * @for MinderNode
   * @description 获取当前节点的连线对象
   *
   * @grammar getConnection() => {kity.Path}
   */
  getConnection() {
    return this._connection || null
  }
})

kity.extendClass(Minder, {
  getConnectContainer() {
    return this._connectContainer
  },

  createConnect(node) {
    if (node.isRoot()) return

    const connection = new kity.Path()

    node._connection = connection

    this._connectContainer.addShape(connection)
    this.updateConnect(node)
  },

  removeConnect(node) {
    const self = this
    node.traverse(function (node) {
      self._connectContainer.removeShape(node._connection)
      node._connection = null
    })
  },

  updateConnect(node) {
    const connection = node._connection
    const parent = node.parent

    if (!parent || !connection) return

    if (parent.isCollapsed() || node._isDragging) {
      connection.setVisible(false)
      return
    }
    connection.setVisible(true)

    const provider = node.getConnectProvider()

    let strokeColor = node.getStyle('connect-color') || 'white'
    const strokeWidth = node.getStyle('connect-width') || 2

    // if (this._rainbowConnect && this._rainbowConnect.length) {
    //   const _connection = parent._connection || node._connection
    //   console.log('_connection: ', _connection)
    //   strokeColor =
    //     node.getType() === 'main'
    //       ? this._rainbowConnect[node.getIndex() % 7]
    //       : _connection.getAttr('stroke')
    // }

    connection.stroke(strokeColor, strokeWidth)

    provider(node, parent, connection, strokeWidth, strokeColor)

    if (strokeWidth % 2 === 0) {
      connection.setTranslate(0.5, 0.5)
    } else {
      connection.setTranslate(0, 0)
    }
  }

  // setRainbowConnect(colors) {
  //   if (!colors) return
  //   const flag = colors.every(color => /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(color))
  //   this._rainbowConnect = flag ? colors : null
  // },

  // getRainbowConnect() {
  //   return this._rainbowConnect || undefined
  // }
})

Module.register('Connect', {
  init() {
    this._connectContainer = new kity.Group().setId(utils.uuid('minder_connect_group'))
    this.getRenderContainer().prependShape(this._connectContainer)
  },
  events: {
    nodeattach(e) {
      this.createConnect(e.node)
    },
    nodedetach(e) {
      this.removeConnect(e.node)
    },
    'layoutapply layoutfinish noderender'(e) {
      this.updateConnect(e.node)
    }
  }
})

export default { register }
