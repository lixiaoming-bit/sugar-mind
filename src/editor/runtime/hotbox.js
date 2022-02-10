/**
 * 热盒 Runtime
 *
 */
const Hotbox = require('../hotbox').default

export default function HotboxRuntime() {
  const fsm = this.fsm
  const minder = this.minder
  const receiver = this.receiver
  const container = this.container

  const hotbox = new Hotbox(container)

  hotbox.setParentFSM(fsm)

  fsm.when('normal -> hotbox', function () {
    let position
    const node = minder.getSelectedNode()
    if (node) {
      const box = node.getRenderBox()
      position = {
        x: box.cx,
        y: box.cy
      }
    }
    hotbox.active('main', position)
  })

  fsm.when('normal -> normal', function (_, __, reason, e) {
    if (reason == 'shortcut-handle') {
      const handleResult = hotbox.dispatch(e)
      if (handleResult) {
        e.preventDefault()
      } else {
        minder.dispatchKeyEvent(e)
      }
    }
  })

  fsm.when('modal -> normal', function (_, __, reason) {
    if (reason == 'import-text-finish') {
      receiver.element.focus()
    }
  })

  this.hotbox = hotbox
}
