import Minder from '../core/minder'
import Command from '../core/command'
import Module from '../core/module'
const kity = window.kity

Module.register('Zoom', function () {
  const self = this

  let timeline

  function setTextRendering() {
    const value = self._zoomValue >= 100 ? 'optimize-speed' : 'geometricPrecision'
    self.getRenderContainer().setAttr('text-rendering', value)
  }

  function fixPaperCTM(paper) {
    const node = paper.shapeNode
    const ctm = node.getCTM()
    const matrix = new kity.Matrix(ctm.a, ctm.b, ctm.c, ctm.d, (ctm.e | 0) + 0.5, (ctm.f | 0) + 0.5)
    node.setAttribute('transform', 'matrix(' + matrix.toString() + ')')
  }

  kity.extendClass(Minder, {
    zoom(value) {
      const paper = this.getPaper()
      const viewport = paper.getViewPort()
      viewport.zoom = value / 100
      viewport.center = {
        x: viewport.center.x,
        y: viewport.center.y
      }
      paper.setViewPort(viewport)
      if (value === 100) fixPaperCTM(paper)
    },
    getZoomValue() {
      return this._zoomValue
    }
  })

  function zoomMinder(minder, value) {
    // const paper = minder.getPaper()
    // const viewport = paper.getViewPort()
    if (!value) return

    setTextRendering()

    const duration = minder.getOption('zoomAnimationDuration')
    if (minder.getRoot().getComplex() > 200 || !duration) {
      minder._zoomValue = value
      minder.zoom(value)
      minder.fire('viewchange')
    } else {
      const animator = new kity.Animator({
        beginValue: minder._zoomValue,
        finishValue: value,
        setter(target, value) {
          target.zoom(value)
        }
      })
      minder._zoomValue = value
      if (timeline) {
        timeline.pause()
      }
      timeline = animator.start(minder, duration, 'easeInOutSine')
      timeline.on('finish', function () {
        minder.fire('viewchange')
      })
    }
    minder.fire('zoom', {
      zoom: value
    })
  }

  /**
   * @command Zoom
   * @description 缩放当前的视野到一定的比例（百分比）
   * @param {number} value 设置的比例，取值 100 则为原尺寸
   * @state
   *   0: 始终可用
   */
  const ZoomCommand = kity.createClass('Zoom', {
    base: Command,
    execute: zoomMinder,
    queryValue(minder) {
      return minder._zoomValue
    }
  })

  /**
   * @command ZoomIn
   * @description 放大当前的视野到下一个比例等级（百分比）
   * @shortcut =
   * @state
   *   0: 如果当前脑图的配置中还有下一个比例等级
   *  -1: 其它情况
   */
  const ZoomInCommand = kity.createClass('ZoomInCommand', {
    base: Command,
    execute(minder) {
      zoomMinder(minder, this.nextValue(minder))
      this.setContentChanged(false)
    },
    queryState(minder) {
      return +!this.nextValue(minder)
    },
    nextValue(minder) {
      const stack = minder.getOption('zoom')
      for (let i = 0; i < stack.length; i++) {
        if (stack[i] > minder._zoomValue) return stack[i]
      }
      return 0
    },
    enableReadOnly: true
  })

  /**
   * @command ZoomOut
   * @description 缩小当前的视野到上一个比例等级（百分比）
   * @shortcut -
   * @state
   *   0: 如果当前脑图的配置中还有上一个比例等级
   *  -1: 其它情况
   */
  const ZoomOutCommand = kity.createClass('ZoomOutCommand', {
    base: Command,
    execute(minder) {
      zoomMinder(minder, this.nextValue(minder))
      this.setContentChanged(false)
    },
    queryState(minder) {
      return +!this.nextValue(minder)
    },
    nextValue(minder) {
      const stack = minder.getOption('zoom')
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i] < minder._zoomValue) return stack[i]
      }
      return 0
    },
    enableReadOnly: true
  })

  return {
    init() {
      this._zoomValue = 100
      this.setDefaultOptions({
        zoom: [10, 20, 50, 100, 200]
      })
      setTextRendering()
    },
    events: {
      'normal.mousewheel readonly.mousewheel'(e) {
        if (!e.originEvent.ctrlKey && !e.originEvent.metaKey) return

        const delta = e.originEvent.wheelDelta
        // 稀释
        if (Math.abs(delta) > 100) {
          clearTimeout(this._wheelZoomTimeout)
        } else {
          return
        }
        let value = this.getZoomValue()
        const timer = value === 90 || value === 110 ? 100 : 15

        this._wheelZoomTimeout = setTimeout(() => {
          //   const lastValue = self.getPaper()._zoom || 1
          if (delta > 0) {
            value += 10
            value = value > 200 ? 200 : value
            zoomMinder(this, value)
          } else if (delta < 0) {
            value -= 10
            value = value < 50 ? 50 : value
            zoomMinder(this, value)
          }
        }, timer)

        e.originEvent.preventDefault()
      }
    },
    commands: {
      zoomin: ZoomInCommand,
      zoomout: ZoomOutCommand,
      zoom: ZoomCommand
    },
    commandShortcutKeys: {
      zoomin: 'ctrl+=|command+=',
      zoomout: 'ctrl+-|command+-'
    }
  }
})
