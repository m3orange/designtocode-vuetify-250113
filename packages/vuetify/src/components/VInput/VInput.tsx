// Styles
import './VInput.sass'

// Components
import { VMessages } from '@/components/VMessages'

// Composables
import { IconValue } from '@/composables/icons'
import { makeComponentProps } from '@/composables/component'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeValidationProps, useValidation } from '@/composables/validation'

// Utilities
import { computed } from 'vue'
import { EventProp, genericComponent, getUid, propsFactory, useRender } from '@/util'

// Types
import type { ComputedRef, PropType, Ref } from 'vue'
import { useInputIcon } from '@/components/VInput/InputIcon'

export interface VInputSlot {
  id: ComputedRef<string>
  labelId: ComputedRef<string>
  messagesId: ComputedRef<string>
  isDirty: ComputedRef<boolean>
  isDisabled: ComputedRef<boolean>
  isReadonly: ComputedRef<boolean>
  isPristine: Ref<boolean>
  isValid: ComputedRef<boolean | null>
  isValidating: Ref<boolean>
  reset: () => void
  resetValidation: () => void
  validate: () => void
}

export const makeVInputProps = propsFactory({
  id: String,
  appendIcon: IconValue,
  prependIcon: IconValue,
  hideDetails: [Boolean, String] as PropType<boolean | 'auto'>,
  hint: String,
  persistentHint: Boolean,
  messages: {
    type: [Array, String] as PropType<string | string[]>,
    default: () => ([]),
  },
  direction: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal',
    validator: (v: any) => ['horizontal', 'vertical'].includes(v),
  },

  'onClick:prepend': EventProp<[MouseEvent]>(),
  'onClick:append': EventProp<[MouseEvent]>(),

  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeValidationProps(),
}, 'v-input')

export type VInputSlots = {
  default: [VInputSlot]
  prepend: [VInputSlot]
  append: [VInputSlot]
  details: [VInputSlot]
}

export const VInput = genericComponent<VInputSlots>()({
  name: 'VInput',

  props: {
    ...makeVInputProps(),
  },

  emits: {
    'update:modelValue': (val: any) => true,
  },

  setup (props, { attrs, slots, emit }) {
    const { densityClasses } = useDensity(props)
    const { InputIcon } = useInputIcon(props)

    const uid = getUid()
    const id = computed(() => props.id || `input-${uid}`)
    const labelId = computed(() => `${id.value}-label`)
    const messagesId = computed(() => `${id.value}-messages`)

    const {
      errorMessages,
      isDirty,
      isDisabled,
      isReadonly,
      isPristine,
      isValid,
      isValidating,
      reset,
      resetValidation,
      validate,
      validationClasses,
    } = useValidation(props, 'v-input', id)

    const slotProps = computed<VInputSlot>(() => ({
      id,
      labelId,
      messagesId,
      isDirty,
      isDisabled,
      isReadonly,
      isPristine,
      isValid,
      isValidating,
      reset,
      resetValidation,
      validate,
    }))

    const messages = computed(() => {
      if (errorMessages.value.length > 0) {
        return errorMessages.value
      } else if (props.hint && (props.persistentHint || props.focused)) {
        return props.hint
      } else {
        return props.messages
      }
    })

    useRender(() => {
      const hasPrepend = !!(slots.prepend || props.prependIcon)
      const hasAppend = !!(slots.append || props.appendIcon)
      const hasMessages = messages.value.length > 0
      const hasDetails = !props.hideDetails || (
        props.hideDetails === 'auto' &&
        (hasMessages || !!slots.details)
      )

      return (
        <div
          class={[
            'v-input',
            `v-input--${props.direction}`,
            densityClasses.value,
            validationClasses.value,
            props.class,
          ]}
          style={ props.style }
        >
          { hasPrepend && (
            <div key="prepend" class="v-input__prepend">
              { slots.prepend?.(slotProps.value) }

              { props.prependIcon && (
                <InputIcon
                  key="prepend-icon"
                  name="prepend"
                />
              )}
            </div>
          )}

          { slots.default && (
            <div class="v-input__control">
              { slots.default?.(slotProps.value) }
            </div>
          )}

          { hasAppend && (
            <div key="append" class="v-input__append">
              { props.appendIcon && (
                <InputIcon
                  key="append-icon"
                  name="append"
                />
              )}

              { slots.append?.(slotProps.value) }
            </div>
          )}

          { hasDetails && (
            <div class="v-input__details">
              <VMessages
                id={ messagesId.value }
                active={ hasMessages }
                messages={ messages.value }
                v-slots={{ message: slots.message }}
              />

              { slots.details?.(slotProps.value) }
            </div>
          )}
        </div>
      )
    })

    return {
      reset,
      resetValidation,
      validate,
    }
  },
})

export type VInput = InstanceType<typeof VInput>
