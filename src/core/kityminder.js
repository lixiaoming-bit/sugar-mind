/**
 * 默认导出（全部模块）
 */
const kityminder = {
  version: require('./core/minder').default.version
}
// 核心导出，大写的部分导出类，小写的部分简单 require 一下
// 这里顺序是有讲究的，调整前先弄清楚依赖关系。
// require('./core/utils')
// console.log('require: ', require('./core/utils'))
kityminder.Minder = require('./core/minder').default
kityminder.Command = require('./core/command').default
kityminder.Node = require('./core/node').default
require('./core/option')
require('./core/animate')
kityminder.Event = require('./core/event').default
kityminder.data = require('./core/data').default
require('./core/compatibility')
kityminder.KeyMap = require('./core/keymap').default
require('./core/shortcut')
require('./core/status')
require('./core/paper')
require('./core/select')
// require('./core/focus')
require('./core/keyreceiver')
kityminder.Module = require('./core/module').default
require('./core/readonly')
kityminder.Render = require('./core/render').default
kityminder.Connect = require('./core/connect').default
kityminder.Layout = require('./core/layout').default
kityminder.Theme = require('./core/theme').default
kityminder.Template = require('./core/template').default
require('./core/_boxv')
require('./core/patch')

// 模块依赖
require('./module/arrange')
// require('./module/basestyle')
require('./module/clipboard')
require('./module/dragtree')
require('./module/expand')
require('./module/font')
require('./module/hyperlink')
require('./module/image')
require('./module/image-viewer')
require('./module/keynav')
require('./module/layout')
require('./module/node')
require('./module/note')
require('./module/outline')
require('./module/icon-priority')
require('./module/icon-progress')
require('./module/icon-emoji')
require('./module/icon-mark')
require('./module/resource')
require('./module/select')
require('./module/style')
require('./module/text')
require('./module/view')
require('./module/zoom')
require('./module/history')
require('./module/search')

require('./protocol/json')
require('./protocol/text')
require('./protocol/markdown')
require('./protocol/svg')
require('./protocol/png')

require('./layout/mind')
require('./layout/btree')
require('./layout/filetree')
require('./layout/fish-bone-master')
require('./layout/fish-bone-slave')
require('./layout/tianpan')

require('./theme/classic')
require('./theme/rainbow')
require('./theme/zen')
require('./theme/dessert')

require('./connect/arc')
require('./connect/arc_tp')
require('./connect/bezier')
require('./connect/fish-bone-master')
require('./connect/l')
require('./connect/poly')
require('./connect/under')

require('./template/default')
require('./template/structure')
require('./template/filetree')
require('./template/right')
require('./template/fish-bone')
require('./template/tianpan')

window.kityminder = kityminder

export default kityminder
