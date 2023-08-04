// Utilities
import { computed } from 'vue'
import { getCurrentInstanceName, convertToUnit, propsFactory } from '@/util'

import type { PropType } from 'vue'

const pointerSideValues = ['bottom', 'left', 'right', 'top'] as const

export type pointerSide = typeof pointerSideValues[number]

// Types
export interface SpeechBubbleProps {
  speechBubble?: Boolean
  pointerHeight?: number | string
  pointerWidth?: number | string
  pointerPosition?: number | string
  pointerSide?: pointerSide
}

// Composables
export const makeSpeechBubbleProps = propsFactory({
  speechBubble: Boolean,
  pointerHeight: [Number, String],
  pointerWidth: [Number, String],
  pointerPosition: [Number, String],
  pointerSide: {
    type: String as PropType<pointerSide>,
    default: 'bottom',
    validator: (v: any) => pointerSideValues.includes(v),
  }
}, 'speechBubble')

export function useSpeechBubble (
  props: SpeechBubbleProps,
  name = getCurrentInstanceName(),
) {
  const speechBubbleClasses = computed(() => {
    return props.speechBubble ? `${name}--speech-bubble-${props.pointerSide}` : null
  })

  const speechBubbleStyles = computed(() => ({
    '--speech-bubble-pointer-height': convertToUnit(props.pointerHeight, 'px'),
    '--speech-bubble-pointer-width': convertToUnit(props.pointerWidth, 'px'),
    '--speech-bubble-pointer-position': convertToUnit(props.pointerPosition, '%'),
  }))

  return { speechBubbleClasses, speechBubbleStyles }
}
