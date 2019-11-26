// Styles
import './VApp.sass'

// Mixins
import Bidirectional from '../../mixins/bidirectional'
import Themeable from '../../mixins/themeable'

// Utilities
import mixins from '../../util/mixins'

// Types
import { VNode } from 'vue'

/* @vue/component */
export default mixins(
  Bidirectional,
  Themeable
).extend({
  name: 'v-app',

  props: {
    dark: {
      type: Boolean,
      default: undefined,
    },
    id: {
      type: String,
      default: 'app',
    },
    light: {
      type: Boolean,
      default: undefined,
    },
  },

  computed: {
    isDark (): boolean {
      return this.isAppDark
    },
  },

  beforeCreate () {
    if (!this.$vuetify || (this.$vuetify === this.$root as any)) {
      throw new Error('Vuetify is not properly initialized, see https://vuetifyjs.com/getting-started/quick-start#bootstrapping-the-vuetify-object')
    }
  },

  render (h): VNode {
    const wrapper = h('div', { staticClass: 'v-application--wrap' }, this.$slots.default)

    return h('div', {
      staticClass: 'v-application',
      class: {
        'v-application--is-rtl': this.hasRtl,
        'v-application--is-ltr': !this.hasRtl,
        ...this.themeClasses,
      },
      attrs: { 'data-app': true },
      domProps: { id: this.id },
    }, [wrapper])
  },
})
