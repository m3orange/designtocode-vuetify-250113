// Composables
import type { FormProvide } from '@/composables/form'
import { useForm } from '@/composables/form'

// Utilities
import { computed, onBeforeMount, onBeforeUnmount, ref } from 'vue'
import { getUid, propsFactory, wrapInPromise } from '@/util'

// Types
import type { ComponentInternalInstance, PropType } from 'vue'

export type ValidationResult = string | true
export type ValidationRule = string | ((value: any) => ValidationResult) | Promise<ValidationResult>

export interface ValidationProps {
  disabled?: boolean
  error?: boolean
  errorMessages?: string | string[]
  maxErrors?: string | number
  name?: string
  readonly?: boolean
  rules: ValidationRule[]
  modelValue?: any
}

export const makeValidationProps = propsFactory({
  disabled: Boolean,
  error: Boolean,
  errorMessages: {
    type: [Array, String] as PropType<string | string[]>,
    default: () => ([]),
  },
  maxErrors: {
    type: [Number, String],
    default: 1,
  },
  name: String,
  readonly: Boolean,
  rules: {
    type: Array as PropType<ValidationRule[]>,
    default: () => ([]),
  },
  modelValue: {
    type: [Number, String, Array, Object],
    default: undefined as any,
  },
})

export function useValidation (
  props: ValidationProps,
  name: string,
  vm?: ComponentInternalInstance
) {
  const errorMessages = ref<string[]>([])
  const form = ref<FormProvide | null>()
  const isPristine = ref(true)
  const isDisabled = computed(() => !!(props.disabled || form.value?.isDisabled))
  const isReadonly = computed(() => !!(props.readonly || form.value?.isReadonly))
  const isValid = computed(() => {
    if (
      props.error ||
      props.errorMessages?.length ||
      errorMessages.value.length
    ) return false

    return isPristine.value ? null : true
  })
  const isValidating = ref(false)
  const validationClasses = computed(() => {
    return {
      [`${name}--error`]: isValid.value === false,
      [`${name}--disabled`]: isDisabled.value,
      [`${name}--readonly`]: isReadonly.value,
    }
  })

  if (vm) {
    form.value = useForm()

    const name = computed(() => props.name ?? getUid())

    onBeforeMount(() => {
      form.value?.register(name.value, validate, reset, resetValidation)
    })

    onBeforeUnmount(() => {
      form.value?.unregister(name.value)
    })
  }

  function reset () {
    resetValidation()

    vm?.emit('update:modelValue', null)
  }

  function resetValidation () {
    isPristine.value = true
    errorMessages.value = []
  }

  async function validate () {
    const results = []

    errorMessages.value = []
    isValidating.value = true

    for (const rule of props.rules) {
      if (results.length >= (props.maxErrors || 1)) {
        break
      }

      const handler = typeof rule === 'function' ? rule : () => rule
      const result = await wrapInPromise<ValidationResult>(handler(props?.modelValue?.value ?? props.modelValue))

      if (result === true) continue

      if (typeof result !== 'string') {
        // eslint-disable-next-line no-console
        console.warn(`${result} is not a valid value. Rule functions must return boolean true or a string.`)

        continue
      }

      results.push(result)
    }

    errorMessages.value = results
    isValidating.value = false
    isPristine.value = false

    return errorMessages.value
  }

  return {
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
  }
}
