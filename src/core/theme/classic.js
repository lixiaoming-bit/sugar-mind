import theme from '../core/theme'
const classicThemes = [
  {
    title: 'classic',
    compat: false
  },
  {
    title: 'classic-compact',
    compat: true
  }
]
classicThemes.forEach(item => {
  const { title, compat } = item
  theme.register(title, {
    background: '#f2f3f5',
    'root-color': '#50E3C2',
    'root-background': '#ffffff',
    'root-stroke': 'none',
    'root-font-size': 24,
    'root-padding': compat ? [6, 12] : [20, 30],
    'root-margin': compat ? 10 : [30, 100],
    'root-radius': 8,
    'root-space': 10,
    'root-shadow': 'none',

    'main-color': '#000000',
    'main-background': '#ffffff',
    'main-stroke': 'none',
    'main-font-size': 20,
    'main-padding': compat ? [6, 20] : [15, 20],
    'main-margin': compat ? 8 : 20,
    'main-radius': 8,
    'main-space': 8,
    'main-shadow': 'none',

    'sub-color': '#000000',
    'sub-background': 'transparent',
    'sub-stroke': 'none',
    'sub-font-size': 16,
    'sub-padding': compat ? [3, 5] : [5, 10],
    'sub-margin': compat ? [4, 8] : [15, 20],
    'sub-tree-margin': 30,
    'sub-radius': 8,
    'sub-space': 5,

    'connect-color': '#333333',
    'connect-width': 3,
    'main-connect-width': 3,
    // 'connect-radius': 10,

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

    'order-hint-area-color': 'rgba(0, 255, 0, .5)',
    'order-hint-path-color': '#0f0',
    'order-hint-path-width': 1,

    'text-selection-color': 'rgb(27,171,255)',
    'line-height': 1.5
  })
})
