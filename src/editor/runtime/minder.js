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
    enableAnimation: false,
    priorityImages: levelIcons,
    progressImages: processIcons,
    emojiImages: emojiIcons,
    markImages: markIcons
  })

  // 渲染，初始化
  minder.renderTo(this.selector)
  // console.log('minder.getTheme(): ', minder.getTheme())
  // console.log('minder.getThemeList(): ', minder.getThemeList())
  minder.useTemplate('right')
  // console.log('minder.getTemplate(): ', minder.getTemplateList())
  minder.select(minder.getRoot(), true)
  // minder.execCommand('text', '中心主题')
  const json = {
    root: {
      data: {
        text: '2022个推技术嘉年华'
        // label: ['121231231231231231231231231']
      }
    }
  }
  minder.importJson(json)

  // 导出给其它 Runtime 使用
  this.minder = minder
}
