/**
 * 编辑器状态机
 */
const Debug = require('../tool/debug')
const debug = new Debug('fsm')

function handlerConditionMatch(condition, when, exit, enter) {
  if (condition.when != when) return false
  if (condition.enter != '*' && condition.enter != enter) return false
  if (condition.exit != '*' && condition.exit != exit) return
  return true
}

function FSM(defaultState) {
  let currentState = defaultState
  const BEFORE_ARROW = ' - '
  const AFTER_ARROW = ' -> '
  const handlers = []

  /**
   * 状态跳转
   *
   * 会通知所有的状态跳转监视器
   *
   * @param  {string} newState  新状态名称
   * @param  {any} reason 跳转的原因，可以作为参数传递给跳转监视器
   */
  this.jump = function (newState, reason) {
    if (!reason) throw new Error('Please tell fsm the reason to jump')

    const oldState = currentState
    const notify = [oldState, newState].concat([].slice.call(arguments, 1))
    let handler

    // 跳转前
    for (let i = 0; i < handlers.length; i++) {
      handler = handlers[i]
      if (handlerConditionMatch(handler.condition, 'before', oldState, newState)) {
        if (handler.apply(null, notify)) return
      }
    }

    currentState = newState
    debug.log('[{0}] {1} -> {2}', reason, oldState, newState)

    // 跳转后
    for (let i = 0; i < handlers.length; i++) {
      handler = handlers[i]
      if (handlerConditionMatch(handler.condition, 'after', oldState, newState)) {
        handler.apply(null, notify)
      }
    }
    return currentState
  }

  /**
   * 返回当前状态
   * @return {string}
   */
  this.state = function () {
    return currentState
  }

  /**
   * 添加状态跳转监视器
   *
   * @param {string} condition
   * 监视的时机
   * "* => *" （默认）
   *
   * @param  {Function} handler
   * 监视函数，当状态跳转的时候，会接收三个参数
   * * from - 跳转前的状态
   * * to - 跳转后的状态
   * * reason - 跳转的原因
   */
  this.when = function (condition, handler) {
    if (arguments.length === 1) {
      handler = condition
      condition = '* -> *'
    }

    let when
    let resolved
    let exit
    let enter

    resolved = condition.split(BEFORE_ARROW)
    if (resolved.length == 2) {
      when = 'before'
    } else {
      resolved = condition.split(AFTER_ARROW)
      if (resolved.length == 2) {
        when = 'after'
      }
    }
    if (!when) throw new Error('Illegal fsm condition: ' + condition)

    exit = resolved[0]
    enter = resolved[1]

    handler.condition = {
      when: when,
      exit: exit,
      enter: enter
    }

    handlers.push(handler)
  }
}

export default function FSMRuntime() {
  this.fsm = new FSM('normal')
}
