import Minder from './minder'
import MinderEvent from './event'
import MinderNode from './node'
import compatibility from './compatibility'
const kity = window.kity

const protocols = {}

function registerProtocol(name, protocol) {
  protocols[name] = protocol
  for (const pname in protocols) {
    if (Object.hasOwnProperty.call(protocols, pname)) {
      protocols[pname].name = pname
    }
  }
}

function getRegisterProtocol(name) {
  return name === undefined ? protocols : protocols[name] || null
}

// 导入导出
kity.extendClass(Minder, {
  // 自动导入
  setup: function (target) {
    if (typeof target === 'string') {
      target = document.querySelector(target)
    }
    if (!target) return
    const protocol = target.getAttribute('minder-data-type')
    if (protocol in protocols) {
      const data = target.textContent
      target.textContent = null
      this.renderTo(target)
      this.importData(protocol, data)
    }
    return this
  },

  /**
   * @method exportJson()
   * @for Minder
   * @description
   *     导出当前脑图数据为 JSON 对象，导出的数据格式请参考 [Data](data) 章节。
   * @grammar exportJson() => {plain}
   */
  exportJson: function () {
    /* 导出 node 上整棵树的数据为 JSON */
    function exportNode(node) {
      const exported = {}
      exported['data'] = node.getData()
      const childNodes = node.getChildren()
      exported['children'] = []
      for (let i = 0; i < childNodes.length; i++) {
        exported.children.push(exportNode(childNodes[i]))
      }
      return exported
    }

    const json = {
      root: exportNode(this.getRoot())
    }

    json['template'] = this.getTemplate()
    json['theme'] = this.getTheme()
    json['version'] = Minder.version
    json['rainbowColors'] = this.getRainbowConnect()
    json['background'] = this.getBackground()

    return JSON.parse(JSON.stringify(json))
  },

  /**
   * function Text2Children(MinderNode, String)
   * @param {MinderNode} node 要导入数据的节点
   * @param {String} text 导入的text数据
   * @Desc: 用于批量插入子节点，并不会修改被插入的父节点
   * @example: 用于批量导入如下类型的节点
   *      234
   *      3456346 asadf
   *          12312414
   *              wereww
   *          12314
   *      1231412
   *      13123
   */
  Text2Children: function (node, text) {
    if (!(node instanceof MinderNode)) {
      return
    }
    let children = []
    let jsonMap = {}
    let level = 0

    const LINE_SPLITTER = /\r|\n|\r\n/
    const TAB_REGEXP = /^(\t|\x20{4})/

    const lines = text.split(LINE_SPLITTER)
    let line = ''
    let jsonNode
    let i = 0
    let minder = this

    function isEmpty(line) {
      return line === '' && !/\S/.test(line)
    }

    function getNode(line) {
      return {
        data: {
          text: line.replace(/^(\t|\x20{4})+/, '').replace(/(\t|\x20{4})+$/, '')
        },
        children: []
      }
    }

    function getLevel(text) {
      let level = 0
      while (TAB_REGEXP.test(text)) {
        text = text.replace(TAB_REGEXP, '')
        level++
      }
      return level
    }

    function addChild(parent, node) {
      parent.children.push(node)
    }

    function importChildren(node, children) {
      for (let i = 0, l = children.length; i < l; i++) {
        const childNode = minder.createNode(null, node)
        childNode.setData('text', children[i].data.text || '')
        importChildren(childNode, children[i].children)
      }
    }

    while ((line = lines[i++]) !== undefined) {
      line = line.replace(/&nbsp;/g, '')
      if (isEmpty(line)) continue

      level = getLevel(line)
      jsonNode = getNode(line)
      if (level === 0) {
        jsonMap = {}
        children.push(jsonNode)
        jsonMap[0] = children[children.length - 1]
      } else {
        if (!jsonMap[level - 1]) {
          throw new Error('Invalid local format')
        }
        addChild(jsonMap[level - 1], jsonNode)
        jsonMap[level] = jsonNode
      }
    }

    importChildren(node, children)
    minder.refresh()
  },

  /**
   * @method exportNode(MinderNode)
   * @param  {MinderNode} node 当前要被导出的节点
   * @return {Object}      返回只含有data和children的Object
   */
  exportNode: function (node) {
    const exported = {}
    exported.data = node.getData()
    const childNodes = node.getChildren()
    exported.children = []
    for (let i = 0; i < childNodes.length; i++) {
      exported.children.push(this.exportNode(childNodes[i]))
    }
    return exported
  },
  /**
   * @method importNode()
   * @description 根据纯json {data, children}数据转换成为脑图节点
   */
  importNode: function (node, json) {
    const { data } = json
    node.data = {}

    for (const field in data) {
      if (Object.hasOwnProperty.call(data, field)) {
        node.setData(field, data[field])
      }
    }

    const childrenTreeData = json.children || []
    for (let i = 0; i < childrenTreeData.length; i++) {
      const childNode = this.createNode(null, node)
      this.importNode(childNode, childrenTreeData[i])
    }
    return node
  },

  /**
   * @method importJson()
   * @for Minder
   * @description 导入脑图数据，数据为 JSON 对象，具体的数据字段形式请参考 [Data](data) 章节。
   *
   * @grammar importJson(json) => {this}
   *
   * @param {plain} json 要导入的数据
   */
  importJson: function (json) {
    if (!json) return

    /**
     * @event preimport
     * @for Minder
     * @when 导入数据之前
     */
    this._fire(new MinderEvent('preimport', null, false))

    // 删除当前所有节点
    while (this._root.getChildren().length) {
      this.removeNode(this._root.getChildren()[0])
    }

    json = compatibility(json)

    this.importNode(this._root, json.root)

    this.setTemplate(json.template || 'default')
    this.setTheme(json.theme || null)
    this.setRainbowConnect(json.rainbowColors || null)
    this.setBackground(json.background || null)
    this.refresh()

    /**
     * @event import,contentchange,interactchange
     * @for Minder
     * @when 导入数据之后
     */
    this.fire('import')

    this._firePhrase({
      type: 'contentchange'
    })

    this._interactChange()

    return this
  },

  /**
   * @method exportData()
   * @for Minder
   * @description 使用指定使用的数据协议，导入脑图数据
   *
   * @grammar exportData(protocol) => Promise<data>
   *
   * @param {string} protocol 指定的数据协议（默认内置五种数据协议 `json`、`text`、`markdown`、`svg` 和 `png`）
   */
  exportData: function (protocolName, option) {
    let json
    let protocol

    json = this.exportJson()

    // 指定了协议进行导出，需要检测协议是否支持
    if (protocolName) {
      protocol = protocols[protocolName]

      if (!protocol || !protocol.encode) {
        return Promise.reject(new Error('Not supported protocol:' + protocolName))
      }
    }

    // 导出前抛个事件
    this._fire(
      new MinderEvent('beforeexport', {
        json: json,
        protocolName: protocolName,
        protocol: protocol
      })
    )

    return Promise.resolve(protocol.encode(json, this, option))
  },

  /**
   * @method importData()
   * @for Minder
   * @description 使用指定的数据协议，导入脑图数据，覆盖当前实例的脑图
   *
   * @grammar importData(protocol, callback) => Promise<json>
   *
   * @param {string} protocol 指定的用于解析数据的数据协议（默认内置三种数据协议 `json`、`text` 和 `markdown` 的支持）
   * @param {any} data 要导入的数据
   */
  importData: function (protocolName, data, option) {
    let protocol
    const minder = this

    // 指定了协议进行导入，需要检测协议是否支持
    if (protocolName) {
      protocol = protocols[protocolName]

      if (!protocol || !protocol.decode) {
        return Promise.reject(new Error('Not supported protocol:' + protocolName))
      }
    }

    const params = {
      local: data,
      protocolName: protocolName,
      protocol: protocol
    }

    // 导入前抛事件
    this._fire(new MinderEvent('beforeimport', params))

    return Promise.resolve(protocol.decode(data, this, option)).then(function (json) {
      minder.importJson(json)
      return json
    })
  },

  /**
   * @method decodeData()
   * @for Minder
   * @description 使用指定的数据协议，解析为脑图数据，与 importData 的区别在于：不覆盖当前实例的脑图
   *
   * @grammar decodeData(protocol, callback) => Promise<json>
   *
   * @param {string} protocol 指定的用于解析数据的数据协议（默认内置三种数据协议 `json`、`text` 和 `markdown` 的支持）
   * @param {any} data 要导入的数据
   */
  decodeData: function (protocolName, data, option) {
    let protocol

    // 指定了协议进行导入，需要检测协议是否支持
    if (protocolName) {
      protocol = protocols[protocolName]

      if (!protocol || !protocol.decode) {
        return Promise.reject(new Error('Not supported protocol:' + protocolName))
      }
    }

    const params = {
      local: data,
      protocolName: protocolName,
      protocol: protocol
    }

    // 导入前抛事件
    this._fire(new MinderEvent('beforeimport', params))

    return Promise.resolve(protocol.decode(data, this, option))
  }
})

export default { registerProtocol, getRegisterProtocol }
