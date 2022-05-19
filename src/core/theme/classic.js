import { CLASSIC } from '../utils/colors'
import theme from '../core/theme'

// 提取公共项
const setTheme = compat => ({
  'root-stroke': 'none',
  'root-font-size': 24,
  'root-padding': compat ? [6, 12] : [15, 24],
  'root-margin': compat ? 10 : [30, 30],
  'root-radius': 8,
  'root-space': 10,
  'root-shadow': 'none',

  'main-stroke': 'none',
  'main-font-size': 16,
  'main-padding': compat ? [6, 20] : [10, 20],
  'main-margin': compat ? 8 : 15,
  'main-radius': 8,
  'main-space': 8,
  'main-shadow': 'none',

  'sub-stroke': 'none',
  'sub-font-size': 14,
  'sub-padding': compat ? [3, 5] : [5, 10],
  'sub-margin': compat ? [5, 5] : [5, 10],
  'sub-tree-margin': 30,
  'sub-radius': 8,
  'sub-space': 5,

  'label-color': '#333',
  'label-background': '#ffffff',
  'label-radius': 5,
  'label-stroke-width': 1,
  'label-stroke-color': '#333',
  'label-font-size': 12,
  'label-padding': [6, 8],
  'label-margin': [2],

  'summary-stroke': 'none',
  'summary-font-size': 16,
  'summary-padding': compat ? [6, 20] : [10, 16],
  'summary-margin': compat ? [5, 5] : [5, 10],
  'summary-radius': 8,
  'summary-space': 5,

  'connect-width': 3,
  'main-connect-width': 3,

  'selected-stroke': '#5EC7F8',
  'selected-stroke-width': 2,
  'selected-padding': [3, 3],
  'selected-radius': 8,

  'marquee-background': 'rgba(204,224,255, .5)',
  'marquee-stroke': '#5EC7F8',

  'drop-hint-color': 'yellow',
  'sub-drop-hint-width': 2,
  'main-drop-hint-width': 4,
  'root-drop-hint-width': 4,
  'summary-drop-hint-width': 4,

  'order-hint-area-color': 'rgba(0, 255, 0, .5)',
  'order-hint-path-color': '#0f0',
  'order-hint-path-width': 1,

  'text-selection-color': 'rgb(27,171,255)',
  'line-height': 1.5
})

CLASSIC.forEach(zen => {
  const { name, ...rest } = zen
  const normal = { ...setTheme(false), ...rest }
  const compat = { ...setTheme(true), ...rest }
  theme.register(name, normal)
  theme.register(name + '-compact', compat)
})
