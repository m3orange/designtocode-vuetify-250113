// Styles
import './VBottomNav.sass'

// Mixins
import Applicationable from '../../mixins/applicationable'
import ButtonGroup from '../../mixins/button-group'
import Colorable from '../../mixins/colorable'
import Measurable from '../../mixins/measurable'
import Proxyable from '../../mixins/proxyable'
import Scrollable from '../../mixins/scrollable'
import Themeable from '../../mixins/themeable'
import { factory as ToggleableFactory } from '../../mixins/toggleable'

// Utilities
import mixins from '../../util/mixins'
import { deprecate } from '../../util/console'

// Types
import { VNode } from 'vue'

export default mixins(
  Applicationable('bottom', [
    'height',
    'inputValue'
  ]),
  Colorable,
  Measurable,
  ToggleableFactory('inputValue'),
  Proxyable,
  Scrollable,
  Themeable
  /* @vue/component */
).extend({
  name: 'v-bottom-nav',

  props: {
    active: [Number, String],
    activeClass: {
      type: String,
      default: 'v-btn--active'
    },
    grow: Boolean,
    hideOnScroll: Boolean,
    horizontal: Boolean,
    mandatory: Boolean,
    height: {
      type: [Number, String],
      default: 56
    },
    shift: Boolean,
    inputValue: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    canScroll (): boolean {
      return (
        Scrollable.options.computed.canScroll.call(this) &&
        (
          this.hideOnScroll ||
          this.inputValue !== false
        )
      )
    },
    classes (): object {
      return {
        'v-bottom-nav--absolute': this.absolute,
        'v-bottom-nav--grow': this.grow,
        'v-bottom-nav--fixed': !this.absolute && (this.app || this.fixed),
        'v-bottom-nav--horizontal': this.horizontal,
        'v-bottom-nav--shift': this.shift
      }
    },
    styles (): object {
      return {
        ...this.measurableStyles,
        transform: this.isActive ? 'none' : 'translateY(100%)'
      }
    }
  },

  created () {
    /* istanbul ignore next */
    if (this.active != null) {
      deprecate('active.sync', 'value or v-model')
    }
  },

  methods: {
    thresholdMet () {
      this.isActive = !this.isScrollingUp
    },
    updateApplication (): number {
      return this.$el
        ? this.$el.clientHeight
        : 0
    },
    updateValue (val: any) {
      this.internalValue = val
      this.$emit('update:active', val)
    }
  },

  render (h): VNode {
    const data = this.setBackgroundColor(this.color, {
      staticClass: 'v-bottom-nav',
      class: this.classes,
      style: this.styles,
      props: {
        activeClass: this.activeClass,
        mandatory: Boolean(
          this.mandatory ||
          this.value !== undefined ||
          this.active !== undefined
        ),
        value: this.internalValue || this.active
      },
      on: { change: this.updateValue }
    })

    if (this.canScroll) {
      data.directives = data.directives || []

      data.directives.push({
        arg: this.scrollTarget,
        name: 'scroll',
        value: this.onScroll
      })
    }

    return h(ButtonGroup, data, this.$slots.default)
  }
})
