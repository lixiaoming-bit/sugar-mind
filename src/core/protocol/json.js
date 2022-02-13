import data from '../core/data'
data.registerProtocol('json', {
  fileDescription: 'KityMinder 格式',
  fileExtension: '.km',
  dataType: 'text',
  mineType: 'application/json',

  encode: function (json) {
    return JSON.stringify(json)
  },

  decode: function (local) {
    return JSON.parse(local)
  }
})
