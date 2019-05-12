/**
 * Menu activator
 *
 * @mixin
 *
 * Handles the click and hover activation
 * Supports slotted and detached activators
 */
/* @vue/component */
export default {
  methods: {
    activatorClickHandler (e) {
      if (this.openOnClick && !this.isActive) {
        this.getActivator(e).focus()
        this.isActive = true
        this.absoluteX = e.clientX
        this.absoluteY = e.clientY
      } else if (this.closeOnClick && this.isActive) {
        this.getActivator(e).blur()
        this.isActive = false
      }
    },
    mouseEnterHandler () {
      if (this.openOnHover) {
        this.runDelay('open', () => {
          if (this.hasJustFocused) return

          this.hasJustFocused = true
          this.isActive = true
        })
      }
    },
    mouseLeaveHandler (e) {
      if (this.openOnHover) {
        // Prevent accidental re-activation
        this.runDelay('close', () => {
          if (this.$refs.content.contains(e.relatedTarget)) return

          requestAnimationFrame(() => {
            this.isActive = false
            this.callDeactivate()
          })
        })
      }
    },
    addActivatorEvents (activator = null) {
      if (!activator || this.disabled) return
      activator.addEventListener('click', this.activatorClickHandler)
      activator.addEventListener('mouseenter', this.mouseEnterHandler)
      activator.addEventListener('mouseleave', this.mouseLeaveHandler)
    },
    removeActivatorEvents (activator = null) {
      if (!activator) return
      activator.removeEventListener('click', this.activatorClickHandler)
      activator.removeEventListener('mouseenter', this.mouseEnterHandler)
      activator.removeEventListener('mouseleave', this.mouseLeaveHandler)
    }
  }
}
