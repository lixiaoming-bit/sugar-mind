import Quill from 'quill'
import { clickOutside, removeClickOutside } from './click-outside'

export default function generateEditor(event) {
  const selectedNode = event.minder.getSelectedNode()
  const isReadonly = event.minder.getStatus() === 'readonly'
  // 选中 且 非制度
  if (selectedNode && !isReadonly) {
    event.minder.setStatus('textedit')

    const nodeText = selectedNode.getText()
    const textGroup = selectedNode.getTextGroup()
    // 切换模式
    textGroup.foreign.setVisible(false)

    // 初始化 修改tab 与 enter的逻辑
    const quill = new Quill(textGroup.foreign.editElement, {
      modules: {
        keyboard: {
          bindings: {
            tab: {
              key: 9,
              handler: () => {
                close()
                event.minder.execCommand('AppendChildNode')
                return false
              }
            },
            enter: {
              key: 13,
              handler: () => {
                close()
                event.minder.execCommand('AppendSiblingNode')
                return false
              }
            },
            custom: {
              key: 13,
              shiftKey: true,
              handler: range => {
                const content = quill.getText()
                let target = content.split('')
                target.splice(range.index, 0, '\n')
                target = target.join('')
                quill.setContents([{ insert: target }])
                quill.setSelection(range.index + 1)
              }
            }
          }
        }
      }
    })

    // 监听文本变化
    quill.on('text-change', function () {
      const text = quill.getText()
      selectedNode.setText(text)
      selectedNode.render()
      event.minder.layout(600)
    })

    // 设置文本 并将光标设置在末尾
    quill.setContents([{ insert: nodeText }])

    quill.focus()
    quill.setSelection(0, quill.getLength())

    const close = () => {
      quill.blur()
      event.minder.setStatus('normal')
      removeClickOutside(textGroup.foreign.editElement)
      textGroup.foreign.setVisible(true)
    }

    clickOutside({
      el: textGroup.foreign.editElement,
      handler: () => {
        close()
      }
    })
  }
}
