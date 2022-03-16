// 判断是否有windows对象（浏览器环境）
const HAS_WINDOWS = typeof window !== 'undefined'
// 判断是否有navigator
const HAS_NAVIGATOR = typeof navigator !== 'undefined'
// 是否支持touch
const IS_TOUCH =
  HAS_WINDOWS && ('ontouchstart' in window || (HAS_NAVIGATOR && navigator.msMaxTouchPoints > 0))
// 默认的触发事件
const EVENTS = IS_TOUCH ? ['touchstart', 'click'] : ['click']
// 默认的拦截器
const MIDDLEWARE = e => e

// 缓存事件
const cacheListener = []

// 对外暴露函数
function clickOutside({ el, events, handler, middleware }) {
  const params = processParams({ el, events, handler, middleware })

  params.events.forEach(event => {
    const instance = {
      event,
      el,
      handler: e => clickOutsideHandle(params.el, e, params.handler, params.middleware)
    }
    cacheListener.push(instance)
    onEvent(instance)
  })
}

// 处理参数
function processParams({ el, events, handler, middleware }) {
  return {
    el,
    handler,
    events: events ? events : EVENTS,
    middleware: middleware ? middleware : MIDDLEWARE
  }
}

// 注册事件
function onEvent({ event, handler }) {
  return setTimeout(() => document.addEventListener(event, handler), 0)
}

// 注销事件
function offEvent(event, handler) {
  return document.removeEventListener(event, handler)
}

// 核心处理函数
function clickOutsideHandle(el, e, handler, middleware) {
  // contains 传入的节点是否有调用节点的子节点
  // 是否是当前节点的外部节点
  const isClickOutside = e.target !== el && !el.contains(e.target)
  // 内部节点就不做处理
  if (!isClickOutside) return
  // 中间拦截器，同时会执行
  if (middleware(e, el)) {
    handler(e, el)
  }
}

// 对外注销函数
function removeClickOutside(targetElement) {
  // 遍历已绑定的
  cacheListener.forEach(({ event, el, handler }) => {
    // 如果没有指定元素，则全部事件注销
    if (!targetElement) {
      return offEvent(event, handler)
    }
    // 指定元素，则针对指定去注销
    if (targetElement === el) {
      return offEvent(event, handler)
    }
  })
}
export { clickOutside, removeClickOutside }
