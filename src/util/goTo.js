import { consoleError } from './console'

/**
 * Modified from https://github.com/alamcordeiro/vue-smooth-scroll
 */

function easeInOutCubic (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 }

export default function goTo (target, offset = 0, duration = 500) {
  if (typeof window === 'undefined') return

  if (offset && isNaN(offset)) {
    consoleError(`Offset must be a Number, received ${offset.constructor.name} instead.`)
    return
  }

  let end

  if (typeof target === 'string') {
    let anchor = target.charAt(0) === '#' ? target.substring(1) : target
    let scrollTo = document.getElementById(anchor)
    if (!scrollTo) return
    end = scrollTo.getBoundingClientRect().top + window.pageYOffset
  } else if (typeof target === 'number') {
    end = target
  } else {
    consoleError(`Target must be a String/Number, received ${target.constructor.name} instead.`)
    return
  }

  end += offset
  let start = performance.now()

  function step (now) {
    let elapsed = now - start
    let position = end
    if (elapsed < duration) {
      position = window.pageYOffset + (end - window.pageYOffset) * easeInOutCubic(elapsed / duration)
      window.requestAnimationFrame(step)
    }
    window.scroll(0, position)
  }

  window.requestAnimationFrame(step)
}
