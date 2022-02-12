/**
 * 动画控制
 */
import Minder from './minder'

const animateDefaultOptions = {
  enableAnimation: true,
  layoutAnimationDuration: 300,
  viewAnimationDuration: 100,
  zoomAnimationDuration: 300
}
const resortedAnimationOptions = {}

Minder.registerInitHook(function () {
  this.setDefaultOptions(animateDefaultOptions)
  if (!this.getOption('enableAnimation')) {
    this.disableAnimation()
  }
})

Minder.prototype.enableAnimation = function () {
  for (const name in animateDefaultOptions) {
    if (Object.hasOwnProperty.call(animateDefaultOptions, name)) {
      this.setOption(resortedAnimationOptions[name])
    }
  }
}

Minder.prototype.disableAnimation = function () {
  for (const name in animateDefaultOptions) {
    if (Object.hasOwnProperty.call(animateDefaultOptions, name)) {
      resortedAnimationOptions[name] = this.getOption(name)
      this.setOption(name, 0)
    }
  }
}
