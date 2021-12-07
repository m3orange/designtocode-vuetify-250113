import { useVelocity } from '@/composables/touch'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { Ref } from 'vue'

export function useTouch ({ isActive, isTemporary, width }: {
  isActive: Ref<boolean>
  isTemporary: Ref<boolean>
  width: Ref<number>
}) {
  onMounted(() => {
    window.addEventListener('touchstart', onTouchstart, { passive: true })
    window.addEventListener('touchmove', onTouchmove, { passive: false })
    window.addEventListener('touchend', onTouchend, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('touchstart', onTouchstart)
    window.removeEventListener('touchmove', onTouchmove)
    window.removeEventListener('touchend', onTouchend)
  })

  const { addMovement, endTouch, getVelocity } = useVelocity()
  const dragging = ref(false)
  const dragProgress = ref(0)
  const offset = ref(0)
  function onTouchstart (e: TouchEvent) {
    if (
      e.changedTouches[0].clientX < 100 ||
      (isActive.value && e.changedTouches[0].clientX < width.value) ||
      (isActive.value && isTemporary.value)
    ) {
      dragging.value = true
      offset.value = isActive.value ? e.changedTouches[0].clientX - width.value : e.changedTouches[0].clientX
      dragProgress.value = Math.min(1, (e.changedTouches[0].clientX - offset.value) / width.value)
      endTouch(e)
      addMovement(e)
    }
  }

  function onTouchmove (e: TouchEvent) {
    if (!dragging.value) return

    e.preventDefault()
    addMovement(e)

    const progress = (e.changedTouches[0].clientX - offset.value) / width.value
    dragProgress.value = Math.max(0, Math.min(1, progress))

    if (progress > 1) {
      offset.value = e.changedTouches[0].clientX - width.value
    }
  }

  function onTouchend (e: TouchEvent) {
    if (!dragging.value) return

    addMovement(e)

    dragging.value = false

    const velocity = getVelocity(e.changedTouches[0].identifier)
    if (velocity.polar.radius > 300 && ['left', 'right'].includes(velocity.direction)) {
      isActive.value = velocity.direction === 'right'
    } else {
      isActive.value = dragProgress.value > 0.5
    }
  }

  const dragStyles = computed(() => {
    return dragging.value ? {
      transform: `translateX(calc(-100% + ${dragProgress.value * width.value}px))`,
      // transition: 'none',
    } : undefined
  })

  return {
    dragging,
    dragProgress,
    dragStyles,
  }
}
