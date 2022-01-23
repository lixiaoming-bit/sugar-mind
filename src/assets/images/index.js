// 图标图片
const levelModule = require.context('./level', false, /\.png$/)
const processModule = require.context('./process', false, /\.png$/)
const emojiModule = require.context('./emoji', false, /\.png$/)
const markModule = require.context('./mark', false, /\.png$/)

// 主题样式
const themeClassicalModule = require.context('./theme-classical', false, /\.png$/)
const themeDarknessModule = require.context('./theme-darkness', false, /\.png$/)
const themeDrawPaintModule = require.context('./theme-draw-paint', false, /\.png$/)

const customSort = (a, b) => a.length - b.length

export const levelIcons = levelModule
  .keys()
  .sort(customSort)
  .reduce((prev, current) => {
    const path = current.substr(2, current.length)
    prev.push(require(`./level/${path}`))
    return prev
  }, [])
export const processIcons = processModule
  .keys()
  .sort(customSort)
  .reduce((prev, current) => {
    const path = current.substr(2, current.length)
    prev.push(require(`./process/${path}`))
    return prev
  }, [])
export const emojiIcons = emojiModule
  .keys()
  .sort(customSort)
  .reduce((prev, current) => {
    const path = current.substr(2, current.length)
    prev.push(require(`./emoji/${path}`))
    return prev
  }, [])
export const markIcons = markModule
  .keys()
  .sort(customSort)
  .reduce((prev, current) => {
    const path = current.substr(2, current.length)
    prev.push(require(`./mark/${path}`))
    return prev
  }, [])

export const themeClassical = themeClassicalModule
  .keys()
  .sort(customSort)
  .reduce((prev, current) => {
    const path = current.substr(2, current.length)
    prev.push(require(`./theme-classical/${path}`))
    return prev
  }, [])

export const themeDarkness = themeDarknessModule
  .keys()
  .sort(customSort)
  .reduce((prev, current) => {
    const path = current.substr(2, current.length)
    prev.push(require(`./theme-darkness/${path}`))
    return prev
  }, [])

export const themeDrawPaint = themeDrawPaintModule
  .keys()
  .sort(customSort)
  .reduce((prev, current) => {
    const path = current.substr(2, current.length)
    prev.push(require(`./theme-draw-paint/${path}`))
    return prev
  }, [])
