import { VNodeDirective } from 'vue/types/vnode'
import { DirectiveOptions } from 'vue'

interface ScrollVNodeDirective extends Omit<VNodeDirective, 'modifiers'> {
  arg: string
  value: EventListener | {
    handler: EventListener
    options?: boolean | AddEventListenerOptions
  }
  modifiers?: {
    self?: boolean
  }
}

function inserted (el: HTMLElement, binding: ScrollVNodeDirective) {
  const { self = false } = binding.modifiers || {}
  const value = binding.value
  // Add fallback to value
  const { handler, options = {} } = typeof value === 'object'
    ? value
    : { handler: value, options: { passive: true } }

  const target = self
    ? el
    : binding.arg
      ? document.querySelector(binding.arg)
      : window

  if (!target) return

  target.addEventListener('scroll', handler, options)

  el._onScroll = {
    handler,
    options,
    // Don't reference self
    target: self ? undefined : target,
  }
}

function unbind (el: HTMLElement) {
  if (!el._onScroll) return

  const { handler, options, target = el } = el._onScroll

  target.removeEventListener('scroll', handler, options)
  delete el._onScroll
}

export const Scroll = {
  inserted,
  unbind,
} as DirectiveOptions

export default Scroll
