// Styles
import './VApp.sass'

// Mixins
import Bidirectional from '../../mixins/bidirectional'
import Themeable from '../../mixins/themeable'

// Utilities
import mixins from '../../util/mixins'

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
      return this.$vuetify.theme.dark
    },
    isRtl (): boolean {
      return this.$vuetify.rtl
    },
  },

  beforeCreate () {
    if (!this.$vuetify || (this.$vuetify === this.$root as any)) {
      throw new Error('Vuetify is not properly initialized, see https://vuetifyjs.com/getting-started/quick-start#bootstrapping-the-vuetify-object')
    }
  },

  render (h) {
    const wrapper = h('div', { staticClass: 'v-application--wrap' }, this.$slots.default)

    return h('div', {
      staticClass: 'v-application',
      class: {
        ...this.rtlClasses,
        ...this.themeClasses,
      },
      attrs: { 'data-app': true },
      domProps: { id: this.id },
    }, [wrapper])
  },
})
