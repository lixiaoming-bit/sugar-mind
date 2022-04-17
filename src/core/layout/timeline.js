// 时间轴布局
import Layout from '../core/layout'
const kity = window.kity

Layout.register(
  'timeline',
  kity.createClass({
    base: Layout,
    doLayout() {}
  })
)
