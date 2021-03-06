import Minder from '../core/minder'
import Command from '../core/command'
import Module from '../core/module'
import Renderer from '../core/render'
const kity = window.kity
Module.register('Resource', function () {
  // String Hash
  // https://github.com/drostie/sha3-js/edit/master/blake32.min.js
  const blake32 = (function () {
    var k, g, r, l, m, o, p, q, t, w, x
    x = 4 * (1 << 30)
    k = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ]
    m = [
      0x243f6a88, 0x85a308d3, 0x13198a2e, 0x03707344, 0xa4093822, 0x299f31d0, 0x082efa98,
      0xec4e6c89, 0x452821e6, 0x38d01377, 0xbe5466cf, 0x34e90c6c, 0xc0ac29b7, 0xc97c50dd,
      0x3f84d5b5, 0xb5470917
    ]
    w = function (i) {
      if (i < 0) {
        i += x
      }
      return ('00000000' + i.toString(16)).slice(-8)
    }
    o = [
      [16, 50, 84, 118, 152, 186, 220, 254],
      [174, 132, 249, 109, 193, 32, 123, 53],
      [139, 12, 37, 223, 234, 99, 23, 73],
      [151, 19, 205, 235, 98, 165, 4, 143],
      [9, 117, 66, 250, 30, 203, 134, 211],
      [194, 166, 176, 56, 212, 87, 239, 145],
      [92, 241, 222, 164, 112, 54, 41, 184],
      [189, 231, 28, 147, 5, 79, 104, 162],
      [246, 158, 59, 128, 44, 125, 65, 90],
      [42, 72, 103, 81, 191, 233, 195, 13]
    ]
    p = function (a, b, n) {
      var s = q[a] ^ q[b]
      q[a] = (s >>> n) | (s << (32 - n))
    }
    g = function (i, a, b, c, d) {
      var u = l + (o[r][i] % 16),
        v = l + (o[r][i] >> 4)
      a %= 4
      b = 4 + (b % 4)
      c = 8 + (c % 4)
      d = 12 + (d % 4)
      q[a] += q[b] + (t[u] ^ m[v % 16])
      p(d, a, 16)
      q[c] += q[d]
      p(b, c, 12)
      q[a] += q[b] + (t[v] ^ m[u % 16])
      p(d, a, 8)
      q[c] += q[d]
      p(b, c, 7)
    }
    return function (a, b) {
      if (!(b instanceof Array && b.length === 4)) {
        b = [0, 0, 0, 0]
      }
      var c, d, e, L, f, h, j, i
      d = k.slice(0)
      c = m.slice(0, 8)
      for (r = 0; r < 4; r += 1) {
        c[r] ^= b[r]
      }
      e = a.length * 16
      f = e % 512 > 446 || e % 512 === 0 ? 0 : e
      if (e % 512 === 432) {
        a += '\u8001'
      } else {
        a += '\u8000'
        while (a.length % 32 !== 27) {
          a += '\u0000'
        }
        a += '\u0001'
      }
      t = []
      for (i = 0; i < a.length; i += 2) {
        t.push(a.charCodeAt(i) * 65536 + a.charCodeAt(i + 1))
      }
      t.push(0)
      t.push(e)
      h = t.length - 16
      j = 0
      for (l = 0; l < t.length; l += 16) {
        j += 512
        L = l === h ? f : Math.min(e, j)
        q = d.concat(c)
        q[12] ^= L
        q[13] ^= L
        for (r = 0; r < 10; r += 1) {
          for (i = 0; i < 8; i += 1) {
            if (i < 4) {
              g(i, i, i, i, i)
            } else {
              g(i, i, i + 1, i + 2, i + 3)
            }
          }
        }
        for (i = 0; i < 8; i += 1) {
          d[i] ^= b[i % 4] ^ q[i] ^ q[i + 8]
        }
      }
      return d.map(w).join('')
    }
  })()

  /**
   * ???????????????????????????
   */
  const RESOURCE_COLOR_SERIES = [51, 303, 75, 200, 157, 0, 26, 254].map(function (h) {
    return kity.Color.createHSL(h, 100, 85)
  })

  /**
   * ??? Minder ??????????????????????????????????????????
   */
  kity.extendClass(Minder, {
    /**
     * ???????????????????????????
     *
     * @param {String} str
     * @return {Number} hashCode
     */
    getHashCode(str) {
      str = blake32(str)
      let hash = 1315423911
      for (let i = str.length - 1; i >= 0; i--) {
        const ch = str.charCodeAt(i)
        hash ^= (hash << 5) + ch + (hash >> 2)
      }
      return hash & 0x7fffffff
    },

    /**
     * ??????????????????????????????????????????
     *
     * ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
     *
     * ????????????????????????????????????????????????????????????
     *
     * @param {String} resource ????????????
     * @return {Color}
     */
    getResourceColor(resource) {
      const colorMapping = this._getResourceColorIndexMapping()
      let nextIndex

      if (!Object.prototype.hasOwnProperty.call(colorMapping, resource)) {
        // ??????????????????????????????
        nextIndex = this._getNextResourceColorIndex()
        colorMapping[resource] = nextIndex
      }

      // ????????????????????????????????????????????????????????????????????????????????????
      return (
        RESOURCE_COLOR_SERIES[colorMapping[resource]] ||
        kity.Color.createHSL(Math.floor((this.getHashCode(resource) / 0x7fffffff) * 359), 100, 85)
      )
    },

    /**
     * ?????????????????????????????????
     *
     * @return {Array}
     */
    getUsedResource() {
      const mapping = this._getResourceColorIndexMapping()
      const used = []
      for (const resource in mapping) {
        if (Object.hasOwnProperty.call(mapping, resource)) {
          used.push(resource)
        }
      }
      return used
    },

    /**
     * ????????????????????????????????????????????????
     * @return {int}
     */
    _getNextResourceColorIndex() {
      // ????????????????????????
      //     resource => color_index
      const colorMapping = this._getResourceColorIndexMapping()
      const used = []
      // ??????????????????????????? used ??????
      for (const resource in colorMapping) {
        if (Object.hasOwnProperty.call(colorMapping, resource)) {
          used.push(colorMapping[resource])
        }
      }

      // ?????????????????????????????????????????????????????????
      for (let i = 0; i < RESOURCE_COLOR_SERIES.length; i++) {
        if (!~used.indexOf(i)) return i
      }

      // ????????????????????????
      return -1
    },

    // ????????????????????????
    //     resource => color_index
    _getResourceColorIndexMapping() {
      return this._resourceColorMapping || (this._resourceColorMapping = {})
    }
  })

  /**
   * @class ?????????????????????
   *
   * @example
   *
   * // ??????????????????????????? "??????"
   * minder.execCommand('resource', ['??????']);
   *
   * // ???????????? "??????" ???????????????
   * var resource = minder.queryCommandValue();
   * resource.push('??????');
   * minder.execCommand('resource', resource);
   *
   * // ???????????????????????????
   * minder.execCommand('resource', null);
   */
  const ResourceCommand = kity.createClass('ResourceCommand', {
    base: Command,

    execute(minder, resource) {
      const nodes = minder.getSelectedNodes()

      if (typeof resource === 'string') {
        resource = [resource]
      }

      nodes.forEach(function (node) {
        node.setData('resource', resource).render()
      })

      minder.layout(200)
    },

    queryValue(minder) {
      const nodes = minder.getSelectedNodes()
      const resource = []

      nodes.forEach(function (node) {
        const nodeResource = node.getData('resource')

        if (!nodeResource) return

        nodeResource.forEach(function (name) {
          if (!~resource.indexOf(name)) {
            resource.push(name)
          }
        })
      })

      return resource
    },

    queryState(km) {
      return km.getSelectedNode() ? 0 : -1
    }
  })

  /**
   * @class ?????????????????????
   *
   * ????????????????????????????????????????????????????????????????????????
   */

  class ResourceOverlay extends kity.Group {
    constructor() {
      super()
      this.rect = new kity.Rect().setRadius(4)
      const rect = this.rect
      this.text = new kity.Text().setFontSize(12).setVerticalAlign('middle')
      const text = this.text

      this.addShapes([rect, text])
    }
    setValue(resourceName, color) {
      const paddingX = 8
      const paddingY = 4
      //   const borderRadius = 4

      const text = this.text
      let box
      let rect
      if (resourceName === this.lastResourceName) {
        box = this.lastBox
      } else {
        text.setContent(resourceName)

        box = text.getBoundaryBox()
        this.lastResourceName = resourceName
        this.lastBox = box
      }

      text.setX(paddingX).fill(color.dec('l', 70))

      rect = this.rect
      rect.setPosition(0, box.y - paddingY)
      this.width = Math.round(box.width + paddingX * 2)
      this.height = Math.round(box.height + paddingY * 2)
      rect.setSize(this.width, this.height)
      rect.fill(color)
    }
  }
  /**
   * @class ???????????????
   */
  const ResourceRenderer = kity.createClass('ResourceRenderer', {
    base: Renderer,

    create() {
      this.overlays = []
      return new kity.Group()
    },

    shouldRender(node) {
      return node.getData('resource') && node.getData('resource').length
    },

    update(container, node, box) {
      const spaceRight = node.getStyle('space-right')

      const overlays = this.overlays

      /*  ?????? resource ??????????????? null ??? bug
       */
      const resource = node.getData('resource').filter(function (ele) {
        return ele !== null
      })
      if (!resource.length) {
        return
      }
      const minder = node.getMinder()

      let overlay
      let x = 0
      let i
      for (i = 0; i < resource.length; i++) {
        x += spaceRight

        overlay = overlays[i]
        if (!overlay) {
          overlay = new ResourceOverlay()
          overlays.push(overlay)
          container.addShape(overlay)
        }
        overlay.setVisible(true)
        overlay.setValue(resource[i], minder.getResourceColor(resource[i]))
        overlay.setTranslate(x, -1)

        x += overlay.width
      }

      while ((overlay = overlays[i++])) overlay.setVisible(false)

      container.setTranslate(box.left, box.bottom + 20)

      return new kity.Box({
        x: box.right,
        y: Math.round(-overlays[0].height / 2),
        width: x,
        height: overlays[0].height
      })
    }
  })

  return {
    commands: {
      resource: ResourceCommand
    },

    renderers: {
      outside: ResourceRenderer
    }
  }
})
