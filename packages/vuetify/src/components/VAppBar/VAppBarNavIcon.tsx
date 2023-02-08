// Components
import { VBtn } from '@/components/VBtn'

// Composables
import { IconValue } from '@/composables/icons'

// Utilities
import { genericComponent, useRender } from '@/util'

// Types
import type { GenericSlot } from '@/util'

export const VAppBarNavIcon = genericComponent<new () => {
  $props: GenericSlot
}>()({
  name: 'VAppBarNavIcon',

  props: {
    icon: {
      type: IconValue,
      default: '$menu',
    },
  },

  setup (props, { slots }) {
    useRender(() => (
      <VBtn
        class="v-app-bar-nav-icon"
        icon={ props.icon }
        v-slots={ slots }
      />
    ))

    return {}
  },
})

export type VAppBarNavIcon = InstanceType<typeof VAppBarNavIcon>
