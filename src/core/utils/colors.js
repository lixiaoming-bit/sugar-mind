// 彩虹
export const RAINBOWS = [
  {
    name: 'rainbow-1',
    background: '#ffffff',
    'root-color': '#ffffff',
    'root-background': '#000029',

    'main-color': '#fff',
    'main-background': ['#f9423a', '#f6a04d', '#f3d321', '#00bc7b', '#486aff', '#4d49be'],

    'sub-color': ['#630703', '#613204', '#605205', '#006642', '#001266', '#1c1a4b'],
    'sub-background': ['#fed9d8', '#fdecdb', '#fdf6d3', '#ccf2e5', '#dae1ff', '#dbdbf2'],

    'connect-color': ['#f9423a', '#f6a04d', '#f3d321', '#00bc7b', '#486aff', '#4d49be']
  },
  {
    name: 'rainbow-2',
    background: '#ffffff',
    'root-color': '#ffffff',
    'root-background': '#1F2766',

    'main-color': '#fff',
    'main-background': ['#FA8155', '#FFAD36', '#B7C82B', '#0098B9', '#7574BC', '#A165A8'],

    'sub-color': ['#631C02', '#663C00', '#4C5312', '#005366', '#212144', '#3E2441'],
    'sub-background': ['#FEE6DD', '#FFEFD7', '#F1F4D5', '#CCEAF1', '#E3E3F2', '#ECE0EE'],

    'connect-color': ['#FA8155', '#f6a04d', '#B7C82B', '#0098B9', '#7574BC', '#A165A8']
  },
  {
    name: 'rainbow-3',
    background: '#ffffff',
    'root-color': '#000229',
    'root-background': '#52CC83',

    'main-color': '#000000',
    'main-background': ['#E7C2C0', '#F3D4B2', '#D8DCAF', '#A8D4CC', '#B0C0D0', '#C8BAC9'],

    'sub-color': ['#491E1C', '#58340D', '#43461F', '#21443D', '#26323F', '#382C39'],
    'sub-background': ['#FAF3F2', '#FDF6F0', '#F7F8EF', '#EEF6F5', '#EFF2F6', '#F4F1F4'],

    'connect-color': ['#E7C2C0', '#F3D4B2', '#D8DCAF', '#A8D4CC', '#B0C0D0', '#C8BAC9']
  },
  {
    name: 'rainbow-4',
    background: '#ffffff',
    'root-color': '#ffffff',
    'root-background': '#4D86DB',

    'main-color': '#fff',
    'main-background': ['#D3BD6C', '#ADB66B', '#76B18A', '#54A39B', '#5192A4', '#7878A0'],

    'sub-color': ['#4E4217', '#404421', '#25402E', '#224340', '#213C44', '#2A2A3B'],
    'sub-background': ['#F6F2E2', '#EFF0E1', '#E4EFE8', '#DDEDEB', '#DCE9ED', '#E4E4EC'],

    'connect-color': ['#D3BD6C', '#ADB66B', '#76B18A', '#54A39B', '#5192A4', '#7878A0']
  },
  {
    name: 'rainbow-5',
    background: '#ffffff',
    'root-color': '#ffffff',
    'root-background': '#99142F',

    'main-color': ['#000029', '#000029', '#000029', '#000029', '#ffffff', '#ffffff'],
    'main-background': ['#F2D96E', '#FFBE71', '#FA8155', '#FFA787', '#C53F4D', '#A61D39'],

    'sub-color': ['#5D4D08', '#663700', '#631C02', '#560F1D', '#4E171D', '#661B00'],
    'sub-background': ['#FCF7E2', '#FFF2E3', '#FEE6DD', '#EDD2D7', '#F3D9DB', '#FFEDE7'],

    'connect-color': ['#F2D96E', '#FFBE71', '#FA8155', '#FFA787', '#C53F4D', '#A61D39']
  },
  {
    name: 'rainbow-6',
    background: '#ffffff',
    'root-color': '#ffffff',
    'root-background': '#245570',

    'main-color': '#fff',
    'main-background': ['#0B5D99', '#534E96', '#7B4083', '#A23E6A', '#C34150', '#CA5835'],

    'sub-color': ['#06395F', '#252243', '#402144', '#491C30', '#4D181E', '#502315'],
    'sub-background': ['#CEDFEB', '#DDDCEA', '#E5D9E6', '#ECD8E1', '#F3D9DC', '#F4DED7'],

    'connect-color': ['#0B5D99', '#534E96', '#7B4083', '#A23E6A', '#C34150', '#CA5835']
  }
]

// 经典
const CLASSIC_COLORS = ['#3949AB', '#E53935', '#C0CA33', '#00897B', '#1E88E5', '#8E24AA']
export const CLASSIC = Array.from(new Array(6), (_, index) => {
  const setting = {
    name: `classic-${index + 1}`,
    background: '#ffffff',
    'root-color': '#ffffff',
    'root-background': CLASSIC_COLORS[index],

    'main-color': '#141414',
    'main-background': '#EEEEEE',

    'sub-color': '#141414',
    'sub-background': '#EEEEEE',

    'summary-color': '#141414',
    'summary-background': '#EEEEEE',

    'connect-color': '#141414'
  }
  return setting
})

// 禅心
export const ZEN = [
  {
    name: 'zen-1',
    background: '#ffffff',
    'root-color': '#232323',
    'root-background': '#BCBCBC',

    'main-color': '#232323',
    'main-background': '#D6D6D6',

    'sub-color': '#232323',
    'sub-background': '#D6D6D6',

    'connect-color': '#D6D6D6'
  },
  {
    name: 'zen-2',
    background: '#EDEDED',
    'root-color': '#080808',
    'root-background': '#A1A1A1',

    'main-color': '#080808',
    'main-background': '#BBBBBB',

    'sub-color': '#080808',
    'sub-background': '#BBBBBB',

    'connect-color': '#080808'
  },
  {
    name: 'zen-3',
    background: '#D3D3D3',
    'root-color': '#ffffff',
    'root-background': '#878787',

    'main-color': '#232323',
    'main-background': '#A1A1A1',

    'sub-color': '#232323',
    'sub-background': '#A1A1A1',

    'connect-color': '#232323'
  },
  {
    name: 'zen-4',
    background: '#393939',
    'root-color': '#ffffff',
    'root-background': '#868686',

    'main-color': '#ffffff',
    'main-background': '#6D6D6D',

    'sub-color': '#ffffff',
    'sub-background': '#6D6D6D',

    'connect-color': '#FFFFFF'
  },
  {
    name: 'zen-5',
    background: '#202020',
    'root-color': '#ffffff',
    'root-background': '#6D6D6D',

    'main-color': '#ffffff',
    'main-background': '#545454',

    'sub-color': '#ffffff',
    'sub-background': '#545454',

    'connect-color': '#FFFFFF'
  },
  {
    name: 'zen-6',
    background: '#080808',
    'root-color': '#ffffff',
    'root-background': '#555555',

    'main-color': '#ffffff',
    'main-background': '#3C3C3C',

    'sub-color': '#ffffff',
    'sub-background': '#3C3C3C',

    'connect-color': '#FFFFFF'
  }
]

// 甜点
export const DESSERT = [
  {
    name: 'dessert-1',
    background: '#F9F8ED',
    'root-color': '#ffffff',
    'root-background': '#006D77',

    'main-color': '#000000',
    'main-background': ['#FFBC9F', '#D8AC8F', '#83C5BE'],

    'sub-color': ['#661E00', '#4B2D1A', '#204541'],
    'sub-background': ['#FAECDD', '#F2E9DA', '#E1EEE4'],

    'connect-color': ['#FFBC9F', '#D8AC8F', '#83C5BE']
  },
  {
    name: 'dessert-2',
    background: '#FFEDD2',
    'root-color': '#ffffff',
    'root-background': '#006D77',

    'main-color': '#000000',
    'main-background': '#D8AC8F',

    'sub-color': '#006D77',
    'sub-background': '#FFE3BB',

    'connect-color': '#006D77'
  },
  {
    name: 'dessert-3',
    background: '#FFBC9F',
    'root-color': '#ffffff',
    'root-background': '#006D77',

    'main-color': '#006D77',
    'main-background': '#F9F8ED',

    'sub-color': '#101010',
    'sub-background': '#FF9A6E',

    'connect-color': '#006D77'
  },
  {
    name: 'dessert-4',
    background: '#D8AC8F',
    'root-color': '#ffffff',
    'root-background': '#006D77',

    'main-color': '#006D77',
    'main-background': '#F9F8ED',

    'sub-color': '#006D77',
    'sub-background': '#ffffff',

    'connect-color': '#006D77'
  },
  {
    name: 'dessert-5',
    background: '#83C5BE',
    'root-color': '#ffffff',
    'root-background': '#006D77',

    'main-color': '#006D77',
    'main-background': '#F9F8ED',

    'sub-color': '#ffffff',
    'sub-background': '#198690',

    'connect-color': '#006D77'
  },
  {
    name: 'dessert-6',
    background: '#006D77',
    'root-color': '#006D77',
    'root-background': '#F9F8ED',

    'main-color': '#000000',
    'main-background': ['#FFEDD2', '#FFBC9F', '#D8AC8F', '#83C5BE'],

    'sub-color': '#ffffff',
    'sub-background': ['#338789', '#337D7F', '#2B7A7C', '#1A7F85'],

    'connect-color': ['#FFEDD2', '#FFBC9F', '#D8AC8F', '#83C5BE']
  }
]
