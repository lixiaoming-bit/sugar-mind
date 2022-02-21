/**
 * 脑图示例运行时
 */
const { Minder } = window.kityminder
export default function MinderRuntime() {
  const zoom = new Array(20).fill().map((_, index) => (index + 1) * 10)
  const minder = new Minder({
    enableKeyReceiver: false,
    enableAnimation: true,
    zoom
  })

  // 渲染，初始化
  minder.renderTo(this.selector)
  minder.setTheme('classic')
  minder.select(minder.getRoot(), true)
  minder.execCommand('text', '中心主题')

  // 导出给其它 Runtime 使用
  this.minder = minder
}
