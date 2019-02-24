// Styles
import '../../stylus/components/_carousel.styl'

// Extensions
import VWindow from '../VWindow/VWindow'

// Components
import VBtn from '../VBtn'
import VIcon from '../VIcon'

// Mixins
// TODO: Move this into core components v2.0
import ButtonGroup from '../../mixins/button-group'

// Utilities
import { convertToUnit } from '../../util/helpers'
import { deprecate } from '../../util/console'

// Types
import { VNode } from 'vue'
import { VNodeDirective } from 'vue/types/vnode'

export default VWindow.extend({
  name: 'v-carousel',

  props: {
    cycle: {
      type: Boolean,
      default: true
    },
    delimiterIcon: {
      type: String,
      default: '$vuetify.icons.delimiter'
    },
    height: {
      type: [Number, String],
      default: 500
    },
    hideControls: Boolean,
    hideDelimiters: Boolean,
    interval: {
      type: [Number, String],
      default: 6000,
      validator: (value: string | number) => value > 0
    },
    mandatory: {
      type: Boolean,
      default: true
    },
    nextIcon: {
      type: [Boolean, String],
      default: '$vuetify.icons.next'
    },
    prevIcon: {
      type: [Boolean, String],
      default: '$vuetify.icons.prev'
    }
  },

  data () {
    return {
      changedByDelimiters: false,
      internalHeight: this.height,
      slideTimeout: undefined as number | undefined
    }
  },

  computed: {
    isDark (): boolean {
      return this.dark || !this.light
    }
  },

  watch: {
    internalValue (val) {
      this.restartTimeout()
      /* @deprecate */
      /* istanbul ignore else */
      if (!this.$listeners['input']) return

      this.$emit('input', val)
    },
    interval: 'restartTimeout',
    height (val, oldVal) {
      if (val === oldVal || !val) return
      this.internalHeight = val
    },
    cycle (val) {
      if (val) {
        this.restartTimeout()
      } else {
        clearTimeout(this.slideTimeout)
        this.slideTimeout = undefined
      }
    }
  },

  mounted () {
    /* @deprecate */
    /* istanbul ignore next */
    if (this.$listeners['input']) {
      deprecate('@input', '@change', this)
    }
    this.startTimeout()
  },

  methods: {
    genDelimiters (): VNode {
      return this.$createElement('div', {
        staticClass: 'v-carousel__controls'
      }, [this.genItems()])
    },
    genIcon (
      direction: 'prev' | 'next',
      icon: string,
      fn: () => void
    ): VNode {
      return this.$createElement('div', {
        staticClass: `v-carousel__${direction}`
      }, [
        this.$createElement(VBtn, {
          props: {
            icon: true
          },
          attrs: {
            'aria-label': this.$vuetify.lang.t(`$vuetify.carousel.${direction}`)
          },
          on: {
            click: () => {
              this.changedByDelimiters = true
              fn()
            }
          }
        }, [
          this.$createElement(VIcon, {
            props: { 'size': '46px' }
          }, icon)
        ])
      ])
    },
    genIcons (): VNode[] {
      const icons = []

      const prevIcon = this.$vuetify.rtl
        ? this.nextIcon
        : this.prevIcon

      if (prevIcon && typeof prevIcon === 'string') {
        icons.push(this.genIcon('prev', prevIcon, this.prev))
      }

      const nextIcon = this.$vuetify.rtl
        ? this.prevIcon
        : this.nextIcon

      if (nextIcon && typeof nextIcon === 'string') {
        icons.push(this.genIcon('next', nextIcon, this.next))
      }

      return icons
    },
    genItems (): VNode {
      const length = this.items.length
      const children = []

      for (let i = 0; i < length; i++) {
        const child = this.$createElement(VBtn, {
          class: {
            'v-carousel__controls__item': true
          },
          props: {
            icon: true,
            small: true,
            value: this.getValue(this.items[i], i)
          }
        }, [
          this.$createElement(VIcon, {
            props: { size: 18 }
          }, this.delimiterIcon)
        ])

        children.push(child)
      }

      return this.$createElement(ButtonGroup, {
        props: {
          value: this.internalValue
        },
        on: {
          change: (val: any) => {
            this.internalValue = val
          }
        }
      }, children)
    },
    restartTimeout () {
      this.slideTimeout && clearTimeout(this.slideTimeout)
      this.slideTimeout = undefined

      const raf = requestAnimationFrame || setTimeout
      raf(this.startTimeout)
    },
    startTimeout () {
      if (!this.cycle) return

      this.slideTimeout = window.setTimeout(this.next, +this.interval > 0 ? +this.interval : 6000)
    },
    updateReverse (val: number, oldVal: number) {
      if (this.changedByDelimiters) {
        this.changedByDelimiters = false
        return
      }

      VWindow.options.methods.updateReverse.call(this, val, oldVal)
    }
  },

  render (h): VNode {
    const children = []
    const data = {
      staticClass: 'v-window v-carousel',
      style: {
        height: convertToUnit(this.height)
      },
      directives: [] as VNodeDirective[]
    }

    if (!this.touchless) {
      data.directives.push({
        name: 'touch',
        value: {
          left: this.next,
          right: this.prev
        }
      } as VNodeDirective)
    }

    if (!this.hideControls) {
      children.push(this.genIcons())
    }

    if (!this.hideDelimiters) {
      children.push(this.genDelimiters())
    }

    return h('div', data, [this.genContainer(), children])
  }
})
