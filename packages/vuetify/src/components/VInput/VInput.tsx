// Styles
import './VInput.sass'

// Components
import { VIcon } from '@/components/VIcon'
import { VMessages } from '@/components/VMessages'

// Composables
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeValidationProps, useValidation } from '@/composables/validation'

// Utilities
import { computed } from 'vue'
import { genericComponent, pick, propsFactory } from '@/util'

// Types
import type { ComputedRef, PropType, Ref } from 'vue'
import type { MakeSlots } from '@/util'

export function filterInputAttrs (attrs: Record<string, unknown>) {
  return pick(attrs, ['class', 'style', 'id', /^data-/])
}

export type VInputSlot = {
  isDisabled: ComputedRef<boolean>
  isReadonly: ComputedRef<boolean>
  isPristine: Ref<boolean | null>
  isValid: ComputedRef<boolean | null>
  isValidating: Ref<boolean>
  reset: () => void
  resetValidation: () => void
  validate: () => void
}

export const makeVInputProps = propsFactory({
  appendIcon: String,
  prependIcon: String,
  focused: Boolean,
  hideDetails: [Boolean, String] as PropType<boolean | 'auto'>,
  hint: String,
  messages: {
    type: [Array, String],
    default: () => ([]),
  },
  persistentHint: Boolean,

  ...makeDensityProps(),
  ...makeValidationProps(),
})

export const VInput = genericComponent<new <T>() => {
  $slots: MakeSlots<{
    default: [VInputSlot]
    prepend: [VInputSlot]
    append: [VInputSlot]
    details: [VInputSlot]
  }>
}>()({
  name: 'VInput',

  props: makeVInputProps(),

  emits: {
    'click:prepend': (e: MouseEvent) => true,
    'click:append': (e: MouseEvent) => true,
  },

  setup (props, { slots, emit }) {
    const { densityClasses } = useDensity(props, 'v-input')
    const {
      errorMessages,
      isDisabled,
      isReadonly,
      isPristine,
      isValid,
      isValidating,
      reset,
      resetValidation,
      validate,
      validationClasses,
    } = useValidation(props, 'v-input')

    const slotProps = computed<VInputSlot>(() => ({
      isDisabled,
      isReadonly,
      isPristine,
      isValid,
      isValidating,
      reset,
      resetValidation,
      validate,
    }))

    return () => {
      const hasPrepend = (slots.prepend || props.prependIcon)
      const hasAppend = (slots.append || props.appendIcon)
      const hasHint = !!(slots.hint || props.hint)
      const hasMessages = !!(
        slots.messages ||
        props.messages?.length ||
        errorMessages.value.length
      )
      const hasDetails = !props.hideDetails || (
        props.hideDetails === 'auto' &&
        (hasMessages || hasHint)
      )
      const showMessages = hasMessages || (
        hasHint &&
        (props.persistentHint || props.focused)
      )

      return (
        <div class={[
          'v-input',
          densityClasses.value,
          validationClasses.value,
        ]}
        >
          { hasPrepend && (
            <div
              class="v-input__prepend"
              onClick={ e => emit('click:prepend', e) }
            >
              { slots?.prepend?.(slotProps.value) }

              { props.prependIcon && (
                <VIcon icon={ props.prependIcon } />
              ) }
            </div>
          ) }

          { slots.default?.(slotProps.value) }

          { hasAppend && (
            <div
              class="v-input__append"
              onClick={ e => emit('click:append', e) }
            >
              { slots?.append?.(slotProps.value) }

              { props.appendIcon && (
                <VIcon icon={ props.appendIcon } />
              ) }
            </div>
          ) }

          { hasDetails && (
            <div class="v-input__details">
              <VMessages
                active={ showMessages }
                value={ hasMessages ? props.messages : [props.hint] }
                v-slots={{ default: slots.messages }}
              />

              { slots.details?.(slotProps.value) }
            </div>
          ) }
        </div>
      )
    }
  },
})

export type VInput = InstanceType<typeof VInput>

export function filterInputProps (attrs: Record<string, unknown>) {
  return pick(attrs, Object.keys(VInput.props))
}
