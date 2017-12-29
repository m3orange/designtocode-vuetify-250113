/**
 * Tabs touch
 *
 * @mixin
 */
export default {
  methods: {
    newOffset (direction) {
      const capitalize = `${direction.charAt(0).toUpperCase()}${direction.slice(1)}`
      const container = this.$refs.container
      const wrapper = this.$refs.wrapper
      const items = container.children

      return this[`newOffset${capitalize}`](wrapper, items)
    },
    newOffsetPrepend (wrapper, items, offset = 0) {
      for (let index = this.itemOffset - 1; index >= 0; index--) {
        const newOffset = offset + items[index].clientWidth
        if (newOffset >= wrapper.clientWidth) {
          return { offset: this.scrollOffset - offset, index: index + 1 }
        }
        offset = newOffset
      }

      return { offset: 0, index: 0 }
    },
    newOffsetAppend (wrapper, items, offset = this.scrollOffset) {
      for (let index = this.itemOffset; index < items.length; index++) {
        const newOffset = offset + items[index].clientWidth
        if (newOffset > this.scrollOffset + wrapper.clientWidth) {
          return { offset: Math.min(offset, wrapper.scrollWidth + this.scrollOffset - wrapper.clientWidth), index }
        }
        offset = newOffset
      }

      return null
    },
    onTouchStart (e) {
      this.startX = this.scrollOffset + e.touchstartX
      this.$refs.container.style.transition = 'none'
      this.$refs.container.style.willChange = 'transform'
    },
    onTouchMove (e) {
      this.scrollOffset = this.startX - e.touchmoveX
    },
    onTouchEnd () {
      const container = this.$refs.container
      const wrapper = this.$refs.wrapper
      const maxScrollOffset = container.clientWidth - wrapper.clientWidth
      container.style.transition = null
      container.style.willChange = null

      if (this.scrollOffset < 0 || !this.isOverflowing) {
        this.scrollOffset = 0
      } else if (this.scrollOffset >= maxScrollOffset) {
        this.scrollOffset = maxScrollOffset
      }
    }
  }
}
