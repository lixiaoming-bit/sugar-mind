// 时间轴布局
import Layout from '../core/layout'
import Minder from '../core/minder'
const kity = window.kity

Layout.register(
  'timeline',
  kity.createClass({
    base: Layout,
    doLayout: function (parent, node, children) {}
  })
)
