import compare from '../utils/jsondiff'
import Command from '../core/command'
import Module from '../core/module'
import { debounce } from 'lodash-es'
const kity = window.kity

Module.register('HistoryModule', function () {
  const minder = this
  const DEFAULT_MAX_HISTORY = 100

  let lastSnap
  let patchLock
  let undoDiffs
  let redoDiffs

  // 重置
  const reset = () => {
    undoDiffs = []
    redoDiffs = []
    lastSnap = minder.exportJson()
  }

  // 监听变化
  const changed = debounce(() => {
    if (patchLock) return
    if (makeUndoDiff()) redoDiffs = []
  }, 0)

  // 更新
  const updateSelection = e => {
    if (!patchLock) return
    const patch = e.patch
    switch (patch.express) {
      case 'node.add':
        minder.select(patch.node.getChild(patch.index), true)
        break
      case 'node.remove':
      case 'data.replace':
      case 'data.remove':
      case 'data.add':
        minder.select(patch.node, true)
        break
    }
  }

  const makeUndoDiff = () => {
    const headSnap = minder.exportJson()
    const diff = compare(headSnap, lastSnap)

    if (diff.length) {
      undoDiffs.push(diff)
      while (undoDiffs.length > DEFAULT_MAX_HISTORY) {
        undoDiffs.shift()
      }
      lastSnap = headSnap
      return true
    }
  }

  const makeRedoDiff = () => {
    const revertSnap = minder.exportJson()
    redoDiffs.push(compare(revertSnap, lastSnap))
    lastSnap = revertSnap
  }

  const HistoryUndoCommand = kity.createClass('HistoryUndoCommand', {
    base: Command,

    execute(km) {
      patchLock = true
      const undoDiff = undoDiffs.pop()
      if (undoDiff.length) {
        km.applyPatches(undoDiff)
        makeRedoDiff()
      }
      patchLock = false
    },
    queryState() {
      return undoDiffs.length ? 0 : -1
    }
  })
  const HistoryRedoCommand = kity.createClass('HistoryRedoCommand', {
    base: Command,
    execute(km) {
      patchLock = true
      const redoDiff = redoDiffs.pop()
      if (redoDiff.length) {
        km.applyPatches(redoDiff)
        makeUndoDiff()
      }
      patchLock = false
    },
    queryState() {
      return redoDiffs.length ? 0 : -1
    }
  })

  return {
    init() {
      reset()
      minder.on('contentchange', changed)
      minder.on('import', reset)
      minder.on('patch', updateSelection)
    },
    commands: {
      HistoryUndo: HistoryUndoCommand,
      HistoryRedo: HistoryRedoCommand
    },
    commandShortcutKeys: {
      historyundo: 'normal::ctrl+z|normal::command+z',
      historyredo: 'normal::ctrl+y|normal::command+y'
    }
  }
})
