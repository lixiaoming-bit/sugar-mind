import compare from '../utils/jsondiff'
import Command from '../core/command'
import Module from '../core/module'
const kity = window.kity

Module.register('LayoutModule', function () {
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
  const changed = () => {
    if (patchLock) return
    if (makeUndoDiff()) redoDiffs = []
  }

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

  // diff 向后
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

  // diff 向前
  const makeRedoDiff = () => {
    const revertSnap = minder.exportJson()
    redoDiffs.push(compare(revertSnap, lastSnap))
    lastSnap = revertSnap
  }

  // undo command
  const HistoryUndoCommand = kity.createClass('HistoryUndoCommand', {
    base: Command,

    execute: function (km) {
      patchLock = true
      const undoDiff = undoDiffs.pop()
      if (undoDiff) {
        km.applyPatches(undoDiff)
        makeRedoDiff()
      }
      patchLock = false
    },
    queryState: function () {
      return undoDiffs.length > 1 ? 0 : -1
    }
  })
  // undo command
  const HistoryRedoCommand = kity.createClass('HistoryRedoCommand', {
    base: Command,
    execute: function (km) {
      patchLock = true
      const redoDiff = redoDiffs.pop()
      if (redoDiff) {
        km.applyPatches(redoDiff)
        makeUndoDiff()
      }
      patchLock = false
    },
    queryState: function () {
      return redoDiffs.length ? 0 : -1
    }
  })

  return {
    init: function () {
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
