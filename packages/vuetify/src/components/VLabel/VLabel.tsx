// Styles
import './VLabel.sass'

// Composables
import { makeComponentProps } from '@/composables/component'
import { makeThemeProps } from '@/composables/theme'

// Utilities
import { genericComponent, useRender } from '@/util'

export const VLabel = genericComponent()({
  name: 'VLabel',

  props: {
    text: String,
    clickable: Boolean,

    ...makeComponentProps(),
    ...makeThemeProps(),
  },

  setup (props, { slots }) {
    useRender(() => (
      <label
        class={[
          'v-label',
          props.class,
          {
            'v-label--clickable': props.clickable,
          },
        ]}
        style={ props.style }
      >
        { props.text }

        { slots.default?.() }
      </label>
    ))

    return {}
  },
})

export type VLabel = InstanceType<typeof VLabel>
