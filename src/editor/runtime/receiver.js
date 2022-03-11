/**
 *
 * 键盘事件接收/分发器
 *
 */

const key = require('../tool/key')

export default function ReceiverRuntime() {
  const fsm = this.fsm
  const minder = this.minder

  // 接收事件的 div
  const element = document.createElement('div')
  element.contentEditable = true
  // 增加tabIndex属性使得element的contentEditable不管是true 还是false都能有focus和blur事件
  element.setAttribute('tabindex', -1)
  element.classList.add('receiver')
  element.onkeydown = element.onkeyup = dispatchKeyEvent
  element.addEventListener('compositionstart', dispatchKeyEvent)
  // element.addEventListener('compositionend', dispatchKeyEvent);
  this.container.appendChild(element)

  // receiver 对象
  const receiver = {
    element: element,
    selectAll: function () {
      // 保证有被选中的
      if (!element.innerHTML) element.innerHTML = '&nbsp;'
      const range = document.createRange()
      const selection = window.getSelection()
      range.selectNodeContents(element)
      selection.removeAllRanges()
      selection.addRange(range)
      element.focus()
    },
    // 增加enable和disable方法用于解决热盒的输入法屏蔽问题
    enable: function () {
      element.setAttribute('contenteditable', true)
    },
    disable: function () {
      element.setAttribute('contenteditable', false)
    },
    // hack FF下div contenteditable的光标丢失BUG
    fixFFCaretDisappeared: function () {
      element.removeAttribute('contenteditable')
      element.setAttribute('contenteditable', 'true')
      element.blur()
      element.focus()
    },
    // 以此事件代替通过mouse事件来判断receiver丢失焦点的事件
    onblur: function (handler) {
      element.onblur = handler
    }
  }
  receiver.selectAll()

  minder.on('beforemousedown', receiver.selectAll)
  minder.on('receiverfocus', receiver.selectAll)
  minder.on('readonly', function () {
    // 屏蔽minder的事件接受，删除receiver和hotbox
    minder.disable()
    window.editor.receiver.element.parentElement.removeChild(window.editor.receiver.element)
  })

  // 侦听器，接收到的事件会派发给所有侦听器
  const listeners = []

  // 侦听指定状态下的事件，如果不传 state，侦听所有状态
  receiver.listen = function (state, listener) {
    if (arguments.length === 1) {
      listener = state
      state = '*'
    }
    listener.notifyState = state
    listeners.push(listener)
  }

  function dispatchKeyEvent(e) {
    e.is = function (keyExpression) {
      const subs = keyExpression.split('|')
      for (let i = 0; i < subs.length; i++) {
        if (key.is(this, subs[i])) return true
      }
      return false
    }
    let listener
    for (let i = 0; i < listeners.length; i++) {
      listener = listeners[i]
      // 忽略不在侦听状态的侦听器
      if (listener.notifyState != '*' && listener.notifyState != fsm.state()) {
        continue
      }

      /**
       *
       * 对于所有的侦听器，只允许一种处理方式：跳转状态。
       * 如果侦听器确定要跳转，则返回要跳转的状态。
       * 每个事件只允许一个侦听器进行状态跳转
       * 跳转动作由侦听器自行完成（因为可能需要在跳转时传递 reason），返回跳转结果即可。
       * 比如：
       *
       * ```js
       *  receiver.listen('normal', function(e) {
       *      if (isSomeReasonForJumpState(e)) {
       *          return fsm.jump('newstate', e);
       *      }
       *  });
       * ```
       */
      if (listener.call(null, e)) {
        return
      }
    }
  }

  this.receiver = receiver
}
