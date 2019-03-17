// Directives
import Scroll from '../../directives/scroll'

// Utilities
import { consoleWarn } from '../../util/console'

// Types
import Vue from 'vue'

export default Vue.extend({
  name: 'scrollable',

  directives: { Scroll },

  props: {
    scrollTarget: String,
    scrollThreshold: [String, Number]
  },

  data: () => ({
    isActive: false,
    currentScroll: 0,
    currentThreshold: 0,
    isScrollingUp: false,
    previousScroll: 0,
    savedScroll: 0,
    target: null as Element | null
  }),

  computed: {
    canScroll (): boolean {
      return typeof window !== 'undefined'
    },
    computedScrollThreshold (): number {
      return this.scrollThreshold
        ? Number(this.scrollThreshold)
        : 300
    }
  },

  watch: {
    isScrollingUp () {
      this.savedScroll = this.savedScroll || this.currentScroll
    },
    isActive () {
      this.savedScroll = 0
    }
  },

  mounted () {
    if (this.scrollTarget) {
      this.target = document.querySelector(this.scrollTarget)

      if (!this.target) {
        consoleWarn(`Unable to locate element with identifier ${this.scrollTarget}`, this)
      }
    }
  },

  methods: {
    onScroll () {
      if (!this.canScroll) return

      this.previousScroll = this.currentScroll
      this.currentScroll = this.target
        ? this.target.scrollTop
        : window.pageYOffset

      this.isScrollingUp = this.currentScroll < this.previousScroll
      this.currentThreshold = Math.abs(this.currentScroll - this.computedScrollThreshold)

      this.$nextTick(() => {
        if (
          Math.abs(this.currentScroll - this.savedScroll) >
          this.computedScrollThreshold
        ) this.thresholdMet()
      })
    },
    thresholdMet () { /* noop */ }
  }
})
