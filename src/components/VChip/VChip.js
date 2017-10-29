require('../../stylus/components/_chips.styl')

import VIcon from '../VIcon'
import Colorable from '../../mixins/colorable'
import Themeable from '../../mixins/themeable'
import Toggleable from '../../mixins/toggleable'

export default {
  name: 'v-chip',

  components: {
    VIcon
  },

  mixins: [Colorable, Themeable, Toggleable],

  props: {
    close: Boolean,
    disabled: Boolean,
    label: Boolean,
    outline: Boolean,
    // Used for selects/tagging
    selected: Boolean,
    selectedClass: {
      type: String,
      default: 'accent'
    },
    small: Boolean,
    value: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    classes () {
      return {
        'chip': true,
        'chip--disabled': this.disabled,
        [`chip--selected ${this.selectedClass}`]: this.selected,
        'chip--label': this.label,
        'chip--outline': this.outline,
        'chip--small': this.small,
        'chip--removable': this.close
      }
    }
  },

  render (h) {
    const children = [this.$slots.default]
    const data = {
      'class': this._computedClasses,
      attrs: { tabindex: this.disabled ? -1 : 0 },
      directives: [{
        name: 'show',
        value: this.isActive
      }],
      on: this.$listeners
    }

    if (this.close) {
      const data = {
        staticClass: 'chip__close',
        on: {
          click: e => {
            e.stopPropagation()

            this.$emit('input', false)
          }
        }
      }

      children.push(h('div', data, [
        h(VIcon, { props: { right: true } }, 'cancel')
      ]))
    }

    return h('span', data, children)
  }
}
