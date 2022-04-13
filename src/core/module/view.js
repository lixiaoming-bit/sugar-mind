import Command from '../core/command'
import Module from '../core/module'
const kity = window.kity

const ViewDragger = kity.createClass('ViewDragger', {
  constructor: function (minder) {
    this._minder = minder
    this._enabled = false
    this._bind()
    const self = this
    this._minder.getViewDragger = function () {
      return self
    }
    this.setEnabled(false)
  },

  isEnabled: function () {
    return this._enabled
  },

  setEnabled: function (value) {
    const paper = this._minder.getPaper()
    paper.setStyle('cursor', value ? 'pointer' : 'default')
    paper.setStyle('cursor', value ? '-webkit-grab' : 'default')
    this._enabled = value
  },
  timeline: function () {
    return this._moveTimeline
  },

  move: function (offset, duration) {
    const targetPosition = this.getMovement().offset(offset)
    this.moveTo(targetPosition, duration)
  },

  moveTo: function (position, duration) {
    if (duration) {
      const dragger = this
      if (this._moveTimeline) this._moveTimeline.stop()
      this._moveTimeline = this._minder
        .getRenderContainer()
        .animate(
          new kity.Animator(this.getMovement(), position, function (target, value) {
            dragger.moveTo(value)
          }),
          duration,
          'easeOutCubic'
        )
        .timeline()

      this._moveTimeline.on('finish', function () {
        dragger._moveTimeline = null
      })

      return this
    }

    this._minder.getRenderContainer().setTranslate(position.round())
    this._minder.fire('viewchange')
  },

  getMovement: function () {
    const translate = this._minder.getRenderContainer().transform.translate
    return translate ? translate[0] : new kity.Point()
  },

  getView: function () {
    const minder = this._minder
    const c = minder._lastClientSize || {
      width: minder.getRenderTarget().clientWidth,
      height: minder.getRenderTarget().clientHeight
    }
    const m = this.getMovement()
    const box = new kity.Box(0, 0, c.width, c.height)
    const viewMatrix = minder.getPaper().getViewPortMatrix()
    return viewMatrix.inverse().translate(-m.x, -m.y).transformBox(box)
  },

  _bind: function () {
    const dragger = this
    let isTempDrag = false
    let lastPosition = null
    let currentPosition = null

    function dragEnd(e) {
      if (!lastPosition) return

      lastPosition = null

      e.stopPropagation()

      // 临时拖动需要还原状态
      if (isTempDrag) {
        dragger.setEnabled(false)
        isTempDrag = false
        if (dragger._minder.getStatus() === 'hand') dragger._minder.rollbackStatus()
      }
      const paper = dragger._minder.getPaper()
      paper.setStyle('cursor', dragger._minder.getStatus() === 'hand' ? '-webkit-grab' : 'default')
      dragger._minder.fire('viewchanged')
    }

    this._minder
      .on(
        'normal.mousedown normal.touchstart ' +
          'inputready.mousedown inputready.touchstart ' +
          'readonly.mousedown readonly.touchstart',
        function (e) {
          if (e.originEvent.button === 2) {
            e.originEvent.preventDefault() // 阻止中键拉动
          }
          // 点击未选中的根节点临时开启
          if (
            e.getTargetNode() === this.getRoot() ||
            e.originEvent.button === 2 ||
            e.originEvent.altKey
          ) {
            lastPosition = e.getPosition('view')
            isTempDrag = true
          }
        }
      )

      .on(
        'normal.mousemove normal.touchmove ' +
          'readonly.mousemove readonly.touchmove ' +
          'inputready.mousemove inputready.touchmove',
        function (e) {
          if (e.type === 'touchmove') {
            e.preventDefault() // 阻止浏览器的后退事件
          }
          if (!isTempDrag) return
          const offset = kity.Vector.fromPoints(lastPosition, e.getPosition('view'))
          if (offset.length() > 10) {
            this.setStatus('hand', true)
            const paper = dragger._minder.getPaper()
            paper.setStyle('cursor', '-webkit-grabbing')
          }
        }
      )

      .on('hand.beforemousedown hand.beforetouchstart', function (e) {
        // 已经被用户打开拖放模式
        if (dragger.isEnabled()) {
          lastPosition = e.getPosition('view')
          e.stopPropagation()
          const paper = dragger._minder.getPaper()
          paper.setStyle('cursor', '-webkit-grabbing')
        }
      })

      .on('hand.beforemousemove hand.beforetouchmove', function (e) {
        if (lastPosition) {
          currentPosition = e.getPosition('view')

          // 当前偏移加上历史偏移
          const offset = kity.Vector.fromPoints(lastPosition, currentPosition)
          dragger.move(offset)
          e.stopPropagation()
          e.preventDefault()
          e.originEvent.preventDefault()
          lastPosition = currentPosition
        }
      })

      .on('mouseup touchend', dragEnd)

      .on('contextmenu', function (e) {
        e.preventDefault()
      })

    window.addEventListener('mouseup', dragEnd)
  }
})

Module.register('View', function () {
  /**
   * @command Hand
   * @description 切换抓手状态，抓手状态下，鼠标拖动将拖动视野，而不是创建选区
   * @state
   *   0: 当前不是抓手状态
   *   1: 当前是抓手状态
   */
  const ToggleHandCommand = kity.createClass('ToggleHandCommand', {
    base: Command,
    execute: function (minder) {
      if (minder.getStatus() !== 'hand') {
        minder.setStatus('hand', true)
      } else {
        minder.rollbackStatus()
      }
      this.setContentChanged(false)
    },
    queryState: function (minder) {
      return minder.getStatus() === 'hand' ? 1 : 0
    },
    enableReadOnly: true
  })

  /**
   * @command Camera
   * @description 设置当前视野的中心位置到某个节点上
   * @param {kityminder.MinderNode} focusNode 要定位的节点
   * @param {number} duration 设置视野移动的动画时长（单位 ms），设置为 0 不使用动画
   * @state
   *   0: 始终可用
   */
  const CameraCommand = kity.createClass('CameraCommand', {
    base: Command,
    execute: function (km, focusNode) {
      focusNode = focusNode || km.getRoot()
      const viewport = km.getPaper().getViewPort()
      const offset = focusNode.getRenderContainer().getRenderBox('view')
      const dx = viewport.center.x - offset.x - offset.width / 2
      const dy = viewport.center.y - offset.y
      const dragger = km._viewDragger

      const duration = km.getOption('viewAnimationDuration')
      dragger.move(new kity.Point(dx, dy), duration)
      this.setContentChanged(false)
    },
    enableReadOnly: true
  })

  /**
   * @command Move
   * @description 指定方向移动当前视野
   * @param {string} dir 移动方向
   *    取值为 'left'，视野向左移动一半
   *    取值为 'right'，视野向右移动一半
   *    取值为 'up'，视野向上移动一半
   *    取值为 'down'，视野向下移动一半
   * @param {number} duration 视野移动的动画时长（单位 ms），设置为 0 不使用动画
   * @state
   *   0: 始终可用
   */
  const MoveCommand = kity.createClass('MoveCommand', {
    base: Command,

    execute: function (km, dir) {
      const dragger = km._viewDragger
      const size = km._lastClientSize
      const duration = km.getOption('viewAnimationDuration')
      switch (dir) {
        case 'up':
          dragger.move(new kity.Point(0, size.height / 2), duration)
          break
        case 'down':
          dragger.move(new kity.Point(0, -size.height / 2), duration)
          break
        case 'left':
          dragger.move(new kity.Point(size.width / 2, 0), duration)
          break
        case 'right':
          dragger.move(new kity.Point(-size.width / 2, 0), duration)
          break
      }
      this.setContentChanged(false)
    },

    enableReadOnly: true
  })

  return {
    init: function () {
      this._viewDragger = new ViewDragger(this)
    },
    commands: {
      hand: ToggleHandCommand,
      camera: CameraCommand,
      move: MoveCommand
    },
    events: {
      statuschange: function (e) {
        this._viewDragger.setEnabled(e.currentStatus === 'hand')
      },
      mousewheel: function (e) {
        let dx
        let dy
        e = e.originEvent
        if (e.ctrlKey || e.shiftKey) return
        if ('wheelDeltaX' in e) {
          dx = e.wheelDeltaX || 0
          dy = e.wheelDeltaY || 0
        } else {
          dx = 0
          dy = e.wheelDelta
        }

        this._viewDragger.move({
          x: dx / 2.5,
          y: dy / 2.5
        })

        const self = this
        clearTimeout(this._mousewheeltimer)
        this._mousewheeltimer = setTimeout(function () {
          self.fire('viewchanged')
        }, 100)

        e.preventDefault()
      },
      'normal.dblclick readonly.dblclick': function (e) {
        if (e.kityEvent.targetShape instanceof kity.Paper) {
          if (e.minder.getSelectedNode()) return
          this.execCommand('camera', this.getRoot(), 800)
        }
      },
      'paperrender finishInitHook': function () {
        if (!this.getRenderTarget()) {
          return
        }
        this.execCommand('camera', null, 0)
        this._lastClientSize = {
          width: this.getRenderTarget().clientWidth,
          height: this.getRenderTarget().clientHeight
        }
      },
      resize: function () {
        const a = {
          width: this.getRenderTarget().clientWidth,
          height: this.getRenderTarget().clientHeight
        }
        const b = this._lastClientSize
        this._viewDragger.move(
          new kity.Point(((a.width - b.width) / 2) | 0, ((a.height - b.height) / 2) | 0)
        )
        this._lastClientSize = a
      },
      'selectionchange layoutallfinish': function () {
        const selected = this.getSelectedNode()
        const minder = this

        /*
         * windows 10 的 edge 浏览器在全部动画停止后，优先级图标不显示 text，
         * 因此再次触发一次 render 事件，让浏览器重绘
         * */
        if (kity.Browser.edge) {
          this.fire('paperrender')
        }
        if (!selected) return

        const dragger = this._viewDragger
        const timeline = dragger.timeline()

        /*
         * 如果之前有动画，那么就先暂时返回，等之前动画结束之后再次执行本函数
         * 以防止 view 动画变动了位置，导致本函数执行的时候位置计算不对
         *
         * fixed bug : 初始化的时候中心节点位置不固定（有的时候在左上角，有的时候在中心）
         * */
        if (timeline) {
          timeline.on('finish', function () {
            minder.fire('selectionchange')
          })

          return
        }

        const view = dragger.getView()
        const focus = selected.getLayoutBox()
        const space = 50
        let dx = 0
        let dy = 0

        if (focus.right > view.right) {
          dx += view.right - focus.right - space
        } else if (focus.left < view.left) {
          dx += view.left - focus.left + space
        }

        if (focus.bottom > view.bottom) {
          dy += view.bottom - focus.bottom - space
        }
        if (focus.top < view.top) {
          dy += view.top - focus.top + space
        }

        if (dx || dy) dragger.move(new kity.Point(dx, dy), 100)
      }
    }
  }
})
