/**
 * 脑图示例运行时
 */
const Minder = window.kityminder.Minder

export default function MinderRuntime() {
  const minder = new Minder({
    enableKeyReceiver: false,
    enableAnimation: true
  })

  // 渲染，初始化
  minder.renderTo(this.selector)
  minder.setTheme(null)
  minder.select(minder.getRoot(), true)
  minder.execCommand('text', '中心主题')

  // 导出给其它 Runtime 使用
  this.minder = minder
}
