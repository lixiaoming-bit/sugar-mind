import { CLASSIC, RAINBOWS, ZEN } from '../core/utils/colors'
// 连线路径
export const MINDER_CONNECT_PATH = [
  'M283.5,116.5A81,74,0,0,1,364.5,42.5',
  'M283.5,116.5A81,0,0,0,1,364.5,116.5',
  'M283.5,116.5A81,74,0,0,0,364.5,190.5',
  'M211.5,116.5A81,74,0,0,0,130.5,42.5',
  'M211.5,116.5A81,0,0,0,1,130.5,116.5',
  'M211.5,116.5A81,74,0,0,1,130.5,190.5'
]

// 节点路径
export const MINDER_NODE_PATH = [
  'M183.5,88.5h128a8,8,0,0,1,8,8v40a8,8,0,0,1,-8,8h-128a8,8,0,0,1,-8,-8v-40a8,8,0,0,1,8,-8z',
  'M372.5,20.5h94a8,8,0,0,1,8,8v28a8,8,0,0,1,-8,8h-94a8,8,0,0,1,-8,-8v-28a8,8,0,0,1,8,-8z',
  'M372.5,94.5h94a8,8,0,0,1,8,8v28a8,8,0,0,1,-8,8h-94a8,8,0,0,1,-8,-8v-28a8,8,0,0,1,8,-8z',
  'M372.5,168.5h94a8,8,0,0,1,8,8v28a8,8,0,0,1,-8,8h-94a8,8,0,0,1,-8,-8v-28a8,8,0,0,1,8,-8z',
  'M28.5,20.5h94a8,8,0,0,1,8,8v28a8,8,0,0,1,-8,8h-94a8,8,0,0,1,-8,-8v-28a8,8,0,0,1,8,-8z',
  'M28.5,94.5h94a8,8,0,0,1,8,8v28a8,8,0,0,1,-8,8h-94a8,8,0,0,1,-8,-8v-28a8,8,0,0,1,8,-8z',
  'M28.5,168.5h94a8,8,0,0,1,8,8v28a8,8,0,0,1,-8,8h-94a8,8,0,0,1,-8,-8v-28a8,8,0,0,1,8,-8z'
]

const generateColor = colors => {
  switch (colors.length) {
    case 1:
      return new Array(6).fill(colors[0])
    case 2:
      return [...colors, ...colors, ...colors]
    case 3:
      return [...colors, ...colors]
    case 4:
      return [...colors, ...colors.split(0, 2)]
    case 5:
      return [...colors, colors[0]]
    default:
      return colors
  }
}

// 彩虹配置
const rainbowSetting = Array.from(RAINBOWS, colors => {
  const cKey = 'connect-color'
  const bKey = 'background'
  const rBKey = 'root-background'
  const mBKey = 'main-background'

  const connectColor = Array.isArray(colors[cKey])
    ? generateColor(colors[cKey])
    : new Array(6).fill(colors[cKey])
  const mainColor = Array.isArray(colors[mBKey]) ? colors[mBKey] : new Array(6).fill(colors[mBKey])
  const nodeFillColor = [colors[rBKey], ...mainColor]
  return {
    name: colors.name,
    type: 'minder',
    connect: MINDER_CONNECT_PATH,
    node: MINDER_NODE_PATH,
    connectColor,
    nodeFillColor,
    backgroundColor: colors[bKey]
  }
})

// 经典配置

const classicSetting = Array.from(CLASSIC, colors => {
  const cKey = 'connect-color'
  const bKey = 'background'
  const rBKey = 'root-background'
  const mBKey = 'main-background'

  const connectColor = Array.isArray(colors[cKey])
    ? generateColor(colors[cKey])
    : new Array(6).fill(colors[cKey])
  const mainColor = Array.isArray(colors[mBKey]) ? colors[mBKey] : new Array(6).fill(colors[mBKey])
  const nodeFillColor = [colors[rBKey], ...mainColor]
  return {
    name: colors.name,
    type: 'minder',
    connect: MINDER_CONNECT_PATH,
    node: MINDER_NODE_PATH,
    connectColor,
    nodeFillColor,
    backgroundColor: colors[bKey]
  }
})

// 禅心配置
const zenSetting = Array.from(ZEN, colors => {
  const cKey = 'connect-color'
  const bKey = 'background'
  const rBKey = 'root-background'
  const mBKey = 'main-background'

  const connectColor = Array.isArray(colors[cKey])
    ? generateColor(colors[cKey])
    : new Array(6).fill(colors[cKey])
  const mainColor = Array.isArray(colors[mBKey]) ? colors[mBKey] : new Array(6).fill(colors[mBKey])
  const nodeFillColor = [colors[rBKey], ...mainColor]
  return {
    name: colors.name,
    type: 'minder',
    connect: MINDER_CONNECT_PATH,
    node: MINDER_NODE_PATH,
    connectColor,
    nodeFillColor,
    backgroundColor: colors[bKey]
  }
})

const SKELETON_TYPE_LIST = {
  minder: {
    rainbow: rainbowSetting,
    zen: zenSetting,
    classic: classicSetting
  }
}

// 全部配色方案
export const COLORS_PANEL = [
  {
    title: '彩虹',
    key: 'rainbow',
    skeleton: SKELETON_TYPE_LIST['minder']['rainbow'],
    thumbColors: Array.from(RAINBOWS, rainbow => ({
      name: rainbow.name,
      background: rainbow['root-background']
    }))
  },
  {
    title: '经典',
    key: 'classic',
    skeleton: SKELETON_TYPE_LIST['minder']['classic'],
    thumbColors: Array.from(CLASSIC, zen => ({
      name: zen.name,
      background: zen['root-background']
    }))
  },
  {
    title: '禅心',
    key: 'zen',
    skeleton: SKELETON_TYPE_LIST['minder']['zen'],
    thumbColors: Array.from(ZEN, zen => ({
      name: zen.name,
      background: zen['background']
    }))
  }
]
