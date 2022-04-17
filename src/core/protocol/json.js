import data from '../core/data'
data.registerProtocol('json', {
  fileDescription: 'KityMinder 格式',
  fileExtension: '.km',
  dataType: 'text',
  mineType: 'application/json',

  encode(json) {
    return JSON.stringify(json)
  },

  decode(local) {
    return JSON.parse(local)
  }
})
