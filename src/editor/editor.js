/**
 * 运行时
 */
const runtime = []

function assemble(runtime) {
  runtime.push(runtime)
}

function KMEditor(selector) {
  this.selector = selector
  for (let i = 0; i < runtime.length; i++) {
    if (typeof runtime[i] === 'function') {
      runtime[i].call(this, this)
    }
  }
}

KMEditor.assemble = assemble

assemble(require('./runtime/container'))
assemble(require('./runtime/fsm'))
assemble(require('./runtime/minder'))
assemble(require('./runtime/receiver'))
assemble(require('./runtime/hotbox'))
assemble(require('./runtime/input'))
assemble(require('./runtime/clipboard-mimetype'))
assemble(require('./runtime/clipboard'))
assemble(require('./runtime/drag'))
assemble(require('./runtime/node'))
assemble(require('./runtime/history'))
assemble(require('./runtime/jumping'))
assemble(require('./runtime/priority'))
assemble(require('./runtime/progress'))

export default KMEditor
