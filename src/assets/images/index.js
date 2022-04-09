// 图标图片
const levelModule = require.context('./level', false, /\.png$/)
const processModule = require.context('./process', false, /\.png$/)
const emojiModule = require.context('./emoji', false, /\.png$/)
const markModule = require.context('./mark', false, /\.png$/)

// 结构图片
const canvasStructModule = require.context('./struct', false, /\.png$/)

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

export const canvasStruct = canvasStructModule
  .keys()
  .sort(customSort)
  .reduce((prev, current) => {
    const path = current.substr(2, current.length)
    prev.push(require(`./struct/${path}`))
    return prev
  }, [])
