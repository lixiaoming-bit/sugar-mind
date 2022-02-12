import utils from './utils'
import Minder from './minder'
const kity = window.kity

/* 已注册的模块 */
const _modules = {}

export function register(name, module) {
  _modules[name] = module
}

/* 模块初始化 */
Minder.registerInitHook(function () {
  this._initModules()
})

// 模块声明周期维护
kity.extendClass(Minder, {
  _initModules: function () {
    const modulesPool = _modules
    const modulesToLoad = this._options.modules || utils.keys(modulesPool)

    this._commands = {}
    this._query = {}
    this._modules = {}
    this._rendererClasses = {}

    const self = this
    for (let i = 0; i < modulesToLoad.length; i++) {
      let moduleDeals
      const name = modulesToLoad[i]

      if (!modulesPool[name]) continue

      // 执行模块初始化，抛出后续处理对象

      if (typeof modulesPool[name] == 'function') {
        moduleDeals = modulesPool[name].call(self)
      } else {
        moduleDeals = modulesPool[name]
      }
      this._modules[name] = moduleDeals

      if (!moduleDeals) continue

      if (moduleDeals.defaultOptions) {
        self.setDefaultOptions(moduleDeals.defaultOptions)
      }

      if (moduleDeals.init) {
        moduleDeals.init.call(self, this._options)
      }

      // command加入命令池子
      const dealCommands = moduleDeals.commands
      for (const name in dealCommands) {
        this._commands[name.toLowerCase()] = new dealCommands[name]()
      }

      // 绑定事件
      const dealEvents = moduleDeals.events
      if (dealEvents) {
        for (const type in dealEvents) {
          self.on(type, dealEvents[type])
        }
      }

      // 渲染器
      const dealRenderers = moduleDeals.renderers

      if (dealRenderers) {
        for (const type in dealRenderers) {
          this._rendererClasses[type] = this._rendererClasses[type] || []

          if (utils.isArray(dealRenderers[type])) {
            this._rendererClasses[type] = this._rendererClasses[type].concat(dealRenderers[type])
          } else {
            this._rendererClasses[type].push(dealRenderers[type])
          }
        }
      }

      //添加模块的快捷键
      if (moduleDeals.commandShortcutKeys) {
        this.addCommandShortcutKeys(moduleDeals.commandShortcutKeys)
      }
    }
  },

  _garbage: function () {
    this.clearSelect()

    while (this._root.getChildren().length) {
      this._root.removeChild(0)
    }
  },

  destroy: function () {
    const modules = this._modules

    this._resetEvents()
    this._garbage()

    for (const key in modules) {
      if (!modules[key].destroy) continue
      modules[key].destroy.call(this)
    }
  },

  reset: function () {
    const modules = this._modules

    this._garbage()

    for (var key in modules) {
      if (!modules[key].reset) continue
      modules[key].reset.call(this)
    }
  }
})
