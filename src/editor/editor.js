// 入口
const runtime = []

function assemble(mod) {
  runtime.push(mod)
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

assemble(require('./runtime/container').default)
// assemble(require('./runtime/fsm').default)
assemble(require('./runtime/minder').default)
// assemble(require('./runtime/receiver').default)
// assemble(require('./runtime/hotbox').default)
// assemble(require('./runtime/input').default)
assemble(require('./runtime/clipboard-mimetype').default)
assemble(require('./runtime/clipboard').default)
// assemble(require('./runtime/drag').default)
// assemble(require('./runtime/node').default)
// assemble(require('./runtime/history').default)
// assemble(require('./runtime/jumping').default)
// assemble(require('./runtime/priority').default)
// assemble(require('./runtime/progress').default)
export default KMEditor
