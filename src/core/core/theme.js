import utils from './utils'
import Minder from './minder'
import Command from './command'
import MinderNode from './node'
import Module from './module'
const kity = window.kity

const cssLikeValueMatcher = {
  left(value) {
    return (3 in value && value[3]) || (1 in value && value[1]) || value[0]
  },
  right(value) {
    return (1 in value && value[1]) || value[0]
  },
  top(value) {
    return value[0]
  },
  bottom(value) {
    return (2 in value && value[2]) || value[0]
  }
}

const _themes = {}

/**
 * 注册一个主题
 *
 * @param  {String} name  主题的名称
 * @param  {Plain} theme 主题的样式描述
 *
 * @example
 *     Minder.registerTheme('default', {
 *         'root-color': 'red',
 *         'root-stroke': 'none',
 *         'root-padding': [10, 20]
 *     });
 */

kity.extendClass(Minder, {
  getThemeList() {
    return _themes
  }
})

kity.extendClass(Minder, {
  /**
   * 切换脑图实例上的主题
   * @param  {String} name 要使用的主题的名称
   */
  useTheme(name) {
    this._background = null
    this.setTheme(name)
    this.refresh(800)

    return true
  },

  /**
   * @description: 设置脑图背景
   * @param {string} background base64
   */
  setBackground(background) {
    const container = this.getRenderTarget()
    if (background && container) {
      container.style.background = background
      this._background = background
    }
    if (!background) {
      this._background = null
    }
    return this
  },
  getBackground() {
    return this._background || ''
  },
  /**
   * @description: 设置当前脑图的主题
   * @param {*} name 主题名称
   * @return {*} Minder
   */
  setTheme(name) {
    if (name && !_themes[name]) throw new Error('Theme ' + name + ' not exists!')
    const lastTheme = this._theme
    this._theme = name || null
    const container = this.getRenderTarget()
    if (container) {
      container.classList.remove('km-theme-' + lastTheme)
      if (name) {
        container.classList.add('km-theme-' + name)
      }
      this._background = this._background || this.getStyle('background')
      container.style.background = this._background
    }
    if (name) {
      this.fire('themechange', {
        theme: name
      })
    }

    return this
  },

  /**
   * 获取脑图实例上的当前主题
   * @return {[type]} [description]
   */
  getTheme() {
    return this._theme || this.getOption('defaultTheme')
  },

  getThemeItems() {
    return _themes[this.getTheme()]
  },

  /**
   * 获得脑图实例上的样式
   * @param  {String} item 样式名称
   */
  getStyle(item, node) {
    const items = this.getThemeItems()
    let matcher

    // 这里特殊处理颜色部分
    if (item in items) {
      const value = items[item]

      const isColor = [
        'main-color',
        'main-background',
        'connect-color',
        'sub-color',
        'sub-background',
        'summary-color',
        'summary-background'
      ].includes(item)
      if (isColor) {
        const { length: len } = value
        if (Array.isArray(value) && node) {
          const index = node.getNodeByLevel(1).getIndex()
          return value[index % len]
        }
        return value
      }
      return value
    }

    // 尝试匹配 CSS 数组形式的值
    // 比如 item 为 'padding-left'
    // theme 里有 {'padding': [10, 20]} 的定义，则可以返回 20
    let segment = item.split('-')
    if (segment.length < 2) return null

    let dir = segment.pop()
    item = segment.join('-')

    if (item in items) {
      let value = items[item]
      if (utils.isArray(value) && (matcher = cssLikeValueMatcher[dir])) {
        return matcher(value)
      }
      if (!isNaN(value)) return value
    }

    return null
  },

  /**
   * 获取指定节点的样式
   * @param  {String} name 样式名称，可以不加节点类型的前缀
   */
  getNodeStyle(node, name) {
    const value = this.getStyle(node.getType() + '-' + name, node)
    return value !== null ? value : this.getStyle(name, node)
  }
})

kity.extendClass(MinderNode, {
  getStyle(name) {
    const minder = this.getMinder()
    return minder.getNodeStyle(this, name)
  }
})

Module.register('Theme', {
  defaultOptions: {
    defaultTheme: 'classic-1'
  },
  commands: {
    /**
     * @command Theme
     * @description 设置当前脑图的主题
     * @param {string} name 主题名称
     *    允许使用的主题可以使用 `kityminder.Minder.getThemeList()` 查询
     * @state
     *   0: 始终可用
     * @return 返回当前的主题名称
     */
    theme: kity.createClass('ThemeCommand', {
      base: Command,

      execute(km, name) {
        return km.useTheme(name)
      },

      queryValue(km) {
        return km.getTheme() || 'default'
      }
    })
  }
})

Minder.registerInitHook(function () {
  this.setTheme()
})

function register(name, theme) {
  _themes[name] = theme
}

export default { register }
