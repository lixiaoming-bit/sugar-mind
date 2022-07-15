import _ from 'lodash'

// 标签 map
const markerMap = {
  'priority-1': ['priority', 0],
  'priority-2': ['priority', 1],
  'priority-3': ['priority', 2],
  'priority-4': ['priority', 3],
  'priority-5': ['priority', 4],
  'priority-6': ['priority', 5],
  'priority-7': ['priority', 6],
  'priority-8': ['priority', 7],

  'task-start': ['progress', 0],
  'task-oct': ['progress', 1],
  'task-quarter': ['progress', 2],
  'task-3oct': ['progress', 3],
  'task-half': ['progress', 4],
  'task-5oct': ['progress', 5],
  'task-3quar': ['progress', 6],
  'task-7oct': ['progress', 7],
  'task-done': ['progress', 8]
}
// 高版本xmind数据
// 处理概要下标、图标、超链接、备注、笔记
const highDataMap = new Map([
  ['startIndex', (obj, topic) => (obj.data.startIndex = Number(topic.startIndex))],
  ['endIndex', (obj, topic) => (obj.data.endIndex = Number(topic.endIndex))],
  [
    'markers',
    (obj, topic) => {
      const markers = topic.markers
      let type
      for (let i in markers) {
        type = markerMap[markers[i].markerId]
        if (type) obj.data[type[0]] = type[1]
      }
    }
  ],
  ['href', (obj, topic) => (obj.data.hyperlink = topic.href)],
  ['labels', (obj, topic) => (obj.data.label = obj.data.label + topic.labels.join(''))],
  ['notes', (obj, topic) => (obj.data.label = obj.data.label + topic.notes.plain?.content)]
])

// 低版本xmind数据
// 处理概要下标、图标、超链接、备注、笔记
const lowDataMap = new Map([
  ['startIndex', (obj, topic) => (obj.data.startIndex = Number(topic.startIndex))],
  ['endIndex', (obj, topic) => (obj.data.endIndex = Number(topic.endIndex))],
  [
    'marker-refs',
    (obj, topic) => {
      const markers = topic['marker-refs']['marker-ref']
      let type
      if (markers.length && markers.length > 0) {
        for (let i in markers) {
          type = markerMap[markers[i]['marker-id']]
          if (type) obj.data[type[0]] = type[1]
        }
      } else {
        type = markerMap[markers['marker-id']]
        if (type) obj.data[type[0]] = type[1]
      }
    }
  ],
  ['xlink:href', (obj, topic) => (obj.data.endIndex = Number(topic.endIndex))],
  ['labels', (obj, topic) => (obj.data.label = obj.data.label + topic.labels.label?.join(''))],
  [
    'notes',
    (obj, topic) => {
      const note = topic.notes.html?.['xhtml:p']
      let spanArray
      note.forEach(e => {
        const span = e['xhtml:span']
        spanArray = spanArray ? _.concat(spanArray, span) : _.concat(span)
      })
      let result = new String()
      spanArray.forEach(e => {
        result += e['#text'] ? e['#text'] : ' '
      })
      obj.data.label = obj.data.label + result
    }
  ]
])
export const action = (val, obj, topic, version) => {
  if (topic[val]) {
    let handleType = version === 'lowV' ? lowDataMap.get(val) : highDataMap.get(val)
    handleType(obj, topic)
  }
}
export const dataDealMap = (obj, topic, version) => {
  //处理文本和整体结构
  obj.data = {
    text: topic.title,
    id: topic.id,
    side: 'right',
    created: topic.timestamp || +new Date(),
    label: ''
  }
  obj.children = {
    common: [],
    summary: []
  }
  const data =
    version === 'lowV'
      ? ['startIndex', 'endIndex', 'marker-refs', 'xlink:href', 'labels', 'notes']
      : ['startIndex', 'endIndex', 'markers', 'href', 'labels', 'notes']
  data.forEach(item => action(item, obj, topic, version))
}
