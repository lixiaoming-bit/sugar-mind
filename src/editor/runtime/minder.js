/**
 * 脑图示例运行时
 */
import { levelIcons, emojiIcons, processIcons, markIcons } from '@/assets/images'

const { Minder } = window.kityminder
export default function MinderRuntime() {
  // const zoom = new Array(20).fill().map((_, index) => (index + 1) * 10)
  const minder = new Minder({
    // zoom,
    enableKeyReceiver: true,
    enableAnimation: true,
    priorityImages: levelIcons,
    progressImages: processIcons,
    emojiImages: emojiIcons,
    markImages: markIcons
  })

  // 渲染，初始化
  minder.renderTo(this.selector)
  minder.setTheme('classic')
  // console.log('minder.getTemplate(): ', minder.getTemplateList())
  minder.select(minder.getRoot(), true)
  minder.execCommand('text', '中心主题')

  // 导出给其它 Runtime 使用
  this.minder = minder
}
