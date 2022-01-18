const levelModule = require.context('./level-icon', false, /\.png$/)
const processModule = require.context('./process-icon', false, /\.png$/)
const emojiModule = require.context('./emoji-icon', false, /\.png$/)
const markModule = require.context('./mark-icon', false, /\.png$/)

export const levelIcons = levelModule.keys().reduce((prev, current) => {
  const path = current.substr(2, current.length)
  prev.push(require(`./level-icon/${path}`))
  return prev
}, [])
export const processIcons = processModule.keys().reduce((prev, current) => {
  const path = current.substr(2, current.length)
  prev.push(require(`./process-icon/${path}`))
  return prev
}, [])
export const emojiIcons = emojiModule.keys().reduce((prev, current) => {
  const path = current.substr(2, current.length)
  prev.push(require(`./emoji-icon/${path}`))
  return prev
}, [])
export const markIcons = markModule.keys().reduce((prev, current) => {
  const path = current.substr(2, current.length)
  prev.push(require(`./mark-icon/${path}`))
  return prev
}, [])
