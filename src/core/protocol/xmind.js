import _ from 'lodash'
import data from '../core/data'
import { dataDealMap } from '../utils'

const fxparser = require('fast-xml-parser')
const zipAll = require('../../../public/zip')
const zip = zipAll.zip

data.registerProtocol('xmind', {
  fileDescription: 'XMind 格式',
  fileExtension: '.xmind',
  dataType: 'blob',
  mineType: 'application/octet-stream',

  decode: function (local) {
    let entriesFile
    function compatibilityLowData(topic, obj) {
      dataDealMap(obj, topic, 'lowV')
      if (topic['xhtml:img']) {
        const fileName = topic['xhtml:img']['xhtml:src'].split(':')[1]
        const file = _.find(entriesFile, o => o.filename === fileName)
        console.log('file: ', file)
        file.getData(new zip.BlobWriter(), function (blob) {
          const imgFile = new window.File([blob], file.filename.split('/')[1], {
            type: 'image/png'
          })
          console.log('imgFile: ', imgFile)
        })
      }
      // 处理概要
      const sum = topic.summaries && topic.summaries?.summary
      if (sum) {
        if (sum.length && sum.length > 0) {
          for (let i in sum) {
            obj.children.summary.push({})
            const sumData = _.find(topic.children.topics[1].topic, o => o.id === sum[i]['topic-id'])
            const sumTopic = {
              ...sum[i],
              ...sumData,
              startIndex: sum[i].range[1],
              endIndex: sum[i].range[3]
            }
            compatibilityLowData(sumTopic, obj.children.summary[i])
          }
        } else {
          obj.children.summary = [{}]
          const sumData = topic.children.topics[1].topic
          const sumTopic = {
            ...sum,
            ...sumData,
            startIndex: sum.range[1],
            endIndex: sum.range[3]
          }
          compatibilityLowData(sumTopic, obj.children.summary[0])
        }
      }
      //处理子节点
      const topics = topic.children && topic.children.topics
      const subTopics = topics && (topics.topic || (topics[0] && topics[0].topic))
      // 忽略自由节点
      if (subTopics && (topics?.type === 'attached' || topics[0]?.type === 'attached')) {
        const tmp = subTopics
        if (tmp.length && tmp.length > 0) {
          for (let i in tmp) {
            obj.children.common.push({})
            compatibilityLowData(tmp[i], obj.children.common[i])
          }
        } else {
          obj.children.common = [{}]
          compatibilityLowData(tmp, obj.children.common[0])
        }
      }
    }
    function compatibilityHeighData(topic, obj) {
      dataDealMap(obj, topic, 'highV')
      if (topic.image) {
        const fileName = topic.image.src.split(':')[1]
        const file = _.find(entriesFile, o => o.filename === fileName)
        file.getData(new zip.BlobWriter(), function (blob) {
          const imgFile = new window.File([blob], file.filename.split('/')[1], {
            type: 'image/png'
          })
          console.log('imgFile: ', imgFile)
        })
      }
      // 处理概要
      if (topic.summaries && topic.summaries.length) {
        const sum = topic.summaries
        for (let i in sum) {
          obj.children.summary.push({})
          const sumData = _.find(topic.children.summary, o => o.id === sum[i].topicId)
          const sumTopic = {
            ...sum[i],
            ...sumData,
            startIndex: sum[i].range[1],
            endIndex: sum[i].range[3]
          }
          compatibilityLowData(sumTopic, obj.children.summary[i])
        }
      }
      // 处理子节点
      if (topic.children?.attached) {
        const tmp = topic.children?.attached
        if (tmp.length && tmp.length > 0) {
          for (let i in tmp) {
            obj.children.common.push({})
            compatibilityHeighData(tmp[i], obj.children.common[i])
          }
        }
      }
    }
    function dealData(sheet, obj, version) {
      const isLowV = version === 'lowV'
      const relationship = isLowV ? sheet.relationships?.relationship : sheet.relationships
      obj = {
        template: 'right',
        version: '1.1.0',
        relationship: [],
        root: {}
      }
      relationship?.forEach(item => {
        obj.relationship.push({
          id: item.id,
          text: item?.title,
          type: 'sys',
          start: {
            id: isLowV ? item.end1 : item.end1Id
          },
          end: {
            id: isLowV ? item.end2 : item.end2Id
          }
        })
      })
      isLowV
        ? compatibilityLowData(sheet.topic, obj.root)
        : compatibilityHeighData(sheet.rootTopic, obj.root)
      console.log('sheet: ', sheet)
      return obj
    }

    function getEntries(file) {
      return new Promise(function (resolve, reject) {
        zip.createReader(
          new zip.BlobReader(file),
          function (zipReader) {
            zipReader.getEntries(resolve)
          },
          reject
        )
      })
    }

    async function readDocument(entries) {
      entriesFile = entries
      console.log('entries: ', entries)
      return new Promise(function (resolve, reject) {
        let entry,
          json = {}

        const highEntry = _.find(entries, o => o.filename.split('/').pop() === 'content.json')
        const lowEntry = _.find(entries, o => o.filename.split('/').pop() === 'content.xml')
        entry = highEntry || lowEntry || null

        // 找到了读取数据
        if (entry) {
          entry.getData(new zip.TextWriter(), function (text) {
            try {
              if (highEntry) {
                json = dealData(JSON.parse(text)[0], json, 'heighV')
              } else {
                const parser = new fxparser.XMLParser({
                  ignoreAttributes: false,
                  attributeNamePrefix: '',
                  attrNodeName: '@',
                  textNodeName: '#text',
                  cdataTagName: '__cdata',
                  cdataPositionChar: '\\c',
                  format: false,
                  indentBy: '  ',
                  supressEmptyNode: false
                })
                const formatData = parser.parse(text)
                const sheet = _.get(formatData, 'xmap-content.sheet')
                json = dealData(sheet, json, 'lowV')
              }
              resolve(json)
            } catch (e) {
              reject(e)
            }
          })
        }

        // 找不到返回失败
        else {
          reject(new Error('Content document missing'))
        }
      })
    }
    return getEntries(local).then(readDocument)
  },

  encode: function () {},

  recognizePriority: -1
})
