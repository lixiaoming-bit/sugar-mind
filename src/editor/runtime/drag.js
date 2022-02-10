/**
 * 用于拖拽节点时屏蔽键盘事件
 */
// import kity from 'kity'
const Hotbox = require('../hotbox').default
// const Debug = require('../tool/debug')
// const debug = new Debug('drag')

// listen the fsm changes, make action.
function setupFsm(fsm) {
  // when jumped to drag mode, enter
  fsm.when('* -> drag', function () {
    // now is drag mode
  })

  fsm.when('drag -> *', function (exit, enter, reason) {
    if (reason == 'drag-finish') {
      // now exit drag mode
    }
  })
}

export default function DragRuntime() {
  const fsm = this.fsm
  const minder = this.minder
  const hotbox = this.hotbox

  // setup everything to go
  setupFsm(fsm)

  let downX
  let downY
  let MOUSE_HAS_DOWN = 0
  let MOUSE_HAS_UP = 1
  let BOUND_CHECK = 20
  let flag = MOUSE_HAS_UP
  let maxX
  let maxY
  let osx
  let osy
  let containerY
  let freeHorizon = false
  let freeVertical = false
  let frame

  function move(direction, speed) {
    if (!direction) {
      freeHorizon = freeVertical = false
      frame && window.kity.releaseFrame(frame)
      frame = null
      return
    }
    if (!frame) {
      frame = window.kity.requestFrame(
        (function (direction, speed, minder) {
          return function (frame) {
            switch (direction) {
              case 'left':
                minder._viewDragger.move({ x: -speed, y: 0 }, 0)
                break
              case 'top':
                minder._viewDragger.move({ x: 0, y: -speed }, 0)
                break
              case 'right':
                minder._viewDragger.move({ x: speed, y: 0 }, 0)
                break
              case 'bottom':
                minder._viewDragger.move({ x: 0, y: speed }, 0)
                break
              default:
                return
            }
            frame.next()
          }
        })(direction, speed, minder)
      )
    }
  }

  minder.on('mousedown', function (e) {
    flag = MOUSE_HAS_DOWN
    var rect = minder.getPaper().container.getBoundingClientRect()
    downX = e.originEvent.clientX
    downY = e.originEvent.clientY
    containerY = rect.top
    maxX = rect.width
    maxY = rect.height
  })

  minder.on('mousemove', function (e) {
    if (
      fsm.state() === 'drag' &&
      flag == MOUSE_HAS_DOWN &&
      minder.getSelectedNode() &&
      (Math.abs(downX - e.originEvent.clientX) > BOUND_CHECK ||
        Math.abs(downY - e.originEvent.clientY) > BOUND_CHECK)
    ) {
      osx = e.originEvent.clientX
      osy = e.originEvent.clientY - containerY

      if (osx < BOUND_CHECK) {
        move('right', BOUND_CHECK - osx)
      } else if (osx > maxX - BOUND_CHECK) {
        move('left', BOUND_CHECK + osx - maxX)
      } else {
        freeHorizon = true
      }
      if (osy < BOUND_CHECK) {
        move('bottom', osy)
      } else if (osy > maxY - BOUND_CHECK) {
        move('top', BOUND_CHECK + osy - maxY)
      } else {
        freeVertical = true
      }
      if (freeHorizon && freeVertical) {
        move(false)
      }
    }
    if (
      fsm.state() !== 'drag' &&
      flag === MOUSE_HAS_DOWN &&
      minder.getSelectedNode() &&
      (Math.abs(downX - e.originEvent.clientX) > BOUND_CHECK ||
        Math.abs(downY - e.originEvent.clientY) > BOUND_CHECK)
    ) {
      if (fsm.state() === 'hotbox') {
        hotbox.active(Hotbox.STATE_IDLE)
      }

      return fsm.jump('drag', 'user-drag')
    }
  })

  window.addEventListener(
    'mouseup',
    function () {
      flag = MOUSE_HAS_UP
      if (fsm.state() === 'drag') {
        move(false)
        return fsm.jump('normal', 'drag-finish')
      }
    },
    false
  )
}
