// Components
import { VImg } from '@/components/VImg'
import { VWindowItem } from '@/components/VWindow'

// Utilities
import { genericComponent, useRender } from '@/util'

// Types
import type { GenericSlot } from '@/util'

export const VCarouselItem = genericComponent<new () => {
  $props: GenericSlot
}>()({
  name: 'VCarouselItem',

  inheritAttrs: false,

  props: {
    value: null,
  },

  setup (props, { slots, attrs }) {
    useRender(() => (
      <VWindowItem class="v-carousel-item" value={ props.value }>
        <VImg { ...attrs } v-slots={ slots } />
      </VWindowItem>
    ))
  },
})

export type VCarouselItem = InstanceType<typeof VCarouselItem>
