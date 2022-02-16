import utils from '../core/utils'
import Command from '../core/command'
import Module from '../core/module'
import Renderer from '../core/render'
const kity = window.kity

Module.register('ProgressModule', function () {
  const minder = this

  const PROGRESS_DATA = 'progress'

  // Designed by Akikonata
  const BG_COLOR = '#FFED83'
  const PIE_COLOR = '#43BC00'
  const SHADOW_PATH =
    'M10,3c4.418,0,8,3.582,8,8h1c0-5.523-3.477-10-9-10S1,5.477,1,11h1C2,6.582,5.582,3,10,3z'
  const SHADOW_COLOR = '#8E8E8E'

  const FRAME_PATH =
    'M10,0C4.477,0,0,4.477,0,10c0,5.523,4.477,10,10,10s10-4.477,10-10C20,4.477,15.523,0,10,0zM10,18c-4.418,0-8-3.582-8-8s3.582-8,8-8s8,3.582,8,8S14.418,18,10,18z'

  const FRAME_GRAD = new kity.LinearGradient().pipe(function (g) {
    g.setStartPosition(0, 0)
    g.setEndPosition(0, 1)
    g.addStop(0, '#fff')
    g.addStop(1, '#ccc')
  })
  const CHECK_PATH =
    'M15.812,7.896l-6.75,6.75l-4.5-4.5L6.25,8.459l2.812,2.803l5.062-5.053L15.812,7.896z'
  const CHECK_COLOR = '#EEE'

  minder.getPaper().addResource(FRAME_GRAD)

  // 进度图标的图形

  class ProgressIcon extends kity.Group {
    constructor(value) {
      super()
      this.setSize(20)
      this.create()
      this.setValue(value)
      this.setId(utils.uuid('node_progress'))
      this.translate(0.5, 0.5)
    }
    setSize(size) {
      this.width = this.height = size
    }

    create() {
      const bg = new kity.Circle(9).fill(BG_COLOR)
      const pie = new kity.Pie(9, 0).fill(PIE_COLOR)
      const shadow = new kity.Path()
        .setPathData(SHADOW_PATH)
        .setTranslate(-10, -10)
        .fill(SHADOW_COLOR)
      const frame = new kity.Path().setTranslate(-10, -10).setPathData(FRAME_PATH).fill(FRAME_GRAD)
      const check = new kity.Path().setTranslate(-10, -10).setPathData(CHECK_PATH).fill(CHECK_COLOR)

      this.addShapes([bg, pie, shadow, check, frame])
      this.pie = pie
      this.check = check
    }

    setValue(value) {
      this.pie.setAngle((-360 * (value - 1)) / 8)
      this.check.setVisible(value === 9)
    }
  }

  // const ProgressIcon = kity.createClass('ProgressIcon', {
  //   base: kity.Group,

  //   constructor: function (value) {
  //     kity.Group.call(this)
  //     try {
  //       this.callBase()
  //     } catch (error) {
  //       console.log('error: ')
  //     }
  //     this.setSize(20)
  //     this.create()
  //     this.setValue(value)
  //     this.setId(utils.uuid('node_progress'))
  //     this.translate(0.5, 0.5)
  //   },

  //   setSize: function (size) {
  //     this.width = this.height = size
  //   },

  //   create: function () {
  //     const bg = new kity.Circle(9).fill(BG_COLOR)
  //     const pie = new kity.Pie(9, 0).fill(PIE_COLOR)
  //     const shadow = new kity.Path()
  //       .setPathData(SHADOW_PATH)
  //       .setTranslate(-10, -10)
  //       .fill(SHADOW_COLOR)
  //     const frame = new kity.Path().setTranslate(-10, -10).setPathData(FRAME_PATH).fill(FRAME_GRAD)
  //     const check = new kity.Path().setTranslate(-10, -10).setPathData(CHECK_PATH).fill(CHECK_COLOR)

  //     this.addShapes([bg, pie, shadow, check, frame])
  //     this.pie = pie
  //     this.check = check
  //   },

  //   setValue: function (value) {
  //     this.pie.setAngle((-360 * (value - 1)) / 8)
  //     this.check.setVisible(value === 9)
  //   }
  // })

  /**
   * @command Progress
   * @description 设置节点的进度信息（添加一个进度小图标）
   * @param {number} value 要设置的进度
   *     取值为 0 移除进度信息；
   *     取值为 1 表示未开始；
   *     取值为 2 表示完成 1/8；
   *     取值为 3 表示完成 2/8；
   *     取值为 4 表示完成 3/8；
   *     其余类推，取值为 9 表示全部完成
   * @state
   *    0: 当前有选中的节点
   *   -1: 当前没有选中的节点
   */
  const ProgressCommand = kity.createClass('ProgressCommand', {
    base: Command,
    execute: function (km, value) {
      const nodes = km.getSelectedNodes()
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].setData(PROGRESS_DATA, value || null).render()
      }
      km.layout()
    },
    queryValue: function (km) {
      const nodes = km.getSelectedNodes()
      let val
      for (let i = 0; i < nodes.length; i++) {
        val = nodes[i].getData(PROGRESS_DATA)
        if (val) break
      }
      return val || null
    },

    queryState: function (km) {
      return km.getSelectedNodes().length ? 0 : -1
    }
  })

  return {
    commands: {
      progress: ProgressCommand
    },
    renderers: {
      left: kity.createClass('ProgressRenderer', {
        base: Renderer,

        create: function () {
          return new ProgressIcon()
        },

        shouldRender: function (node) {
          return node.getData(PROGRESS_DATA)
        },

        update: function (icon, node, box) {
          const data = node.getData(PROGRESS_DATA)
          const spaceLeft = node.getStyle('space-left')

          icon.setValue(data)

          const x = box.left - icon.width - spaceLeft
          const y = -icon.height / 2
          icon.setTranslate(x + icon.width / 2, y + icon.height / 2)

          return new kity.Box(x, y, icon.width, icon.height)
        }
      })
    }
  }
})
