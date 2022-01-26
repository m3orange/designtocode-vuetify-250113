// Composables
import { makeVariantProps } from '@/composables/variant'
import { provideDefaults } from '@/composables/defaults'

// Utilities
import { defineComponent } from '@/util'
import { toRef } from 'vue'

export const VToolbarItems = defineComponent({
  name: 'VToolbarItems',

  inheritAttrs: false,

  props: {
    ...makeVariantProps({ variant: 'contained-text' }),
  },

  setup (props, { slots }) {
    provideDefaults({
      VBtn: {
        color: toRef(props, 'color'),
        textColor: toRef(props, 'textColor'),
        variant: toRef(props, 'variant'),
      },
    })

    return () => slots.default?.()
  },
})
