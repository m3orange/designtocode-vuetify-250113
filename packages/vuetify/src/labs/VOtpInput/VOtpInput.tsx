// Styles
import './VOtpInput.sass'

// Components
import { makeVFieldProps, VField } from '@/components/VField/VField'
import { VOverlay } from '@/components/VOverlay/VOverlay'
import { VProgressCircular } from '@/components/VProgressCircular/VProgressCircular'

// Composables
import { provideDefaults } from '@/composables/defaults'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeFocusProps, useFocus } from '@/composables/focus'
import { useProxiedModel } from '@/composables/proxiedModel'

// Utilities
import { computed, ref, watch } from 'vue'
import { genericComponent, only, propsFactory, useRender } from '@/util'

// Types
import type { PropType } from 'vue'

// Types

export type VOtpInputSlots = {
  default: never
  loader: never
}

export const makeVOtpInputProps = propsFactory({
  autofocus: Boolean,
  divider: String,
  focusAll: Boolean,
  length: {
    type: [Number, String],
    default: 6,
  },
  modelValue: {
    type: [Number, String],
    default: undefined,
  },
  placeholder: String,
  type: {
    type: String as PropType<'text' | 'password' | 'number'>,
    default: 'text',
  },

  ...makeDimensionProps(),
  ...makeFocusProps(),
  ...only(makeVFieldProps({
    variant: 'outlined' as const,
  }), [
    'baseColor',
    'bgColor',
    'class',
    'color',
    'disabled',
    'error',
    'loading',
    'rounded',
    'style',
    'theme',
    'variant',
  ]),
}, 'VOtpInput')

export const VOtpInput = genericComponent<VOtpInputSlots>()({
  name: 'VOtpInput',

  props: makeVOtpInputProps(),

  emits: {
    finish: (val: string) => true,
    'update:focused': (val: boolean) => true,
    'update:modelValue': (val: string) => true,
  },

  setup (props, { emit, slots }) {
    const { dimensionStyles } = useDimension(props)
    const { isFocused, focus, blur } = useFocus(props)
    const model = useProxiedModel(
      props,
      'modelValue',
      '',
      val => String(val).split(''),
      val => val.join('')
    )
    const fields = computed(() => Array(Number(props.length)).fill(0))

    const focusIndex = ref(-1)
    const inputRef = ref<HTMLInputElement[]>([])

    function onInput () {
      const cur = inputRef.value[focusIndex.value]
      const next = inputRef.value[focusIndex.value + 1]

      const array = model.value.slice()

      array[focusIndex.value] = cur.value

      model.value = array

      if (next) next.focus()
      else cur.blur()
    }

    function onKeydown (e: KeyboardEvent) {
      const isFirst = focusIndex.value === 0
      const isLast = focusIndex.value + 1 === props.length

      let index: number

      if (e.key === 'ArrowLeft') {
        index = isFirst ? (parseInt(props.length) - 1) : (focusIndex.value - 1)

        inputRef.value?.[index].focus()
      } else if (e.key === 'ArrowRight') {
        index = isLast ? 0 : (focusIndex.value + 1)

        inputRef.value?.[index].focus()
      }
    }

    function onPaste (index: number, e: ClipboardEvent) {
      e.preventDefault()
      e.stopPropagation()

      model.value = (e?.clipboardData?.getData('Text') ?? '').split('')

      inputRef.value?.[index].blur()
    }

    function reset () {
      model.value = []
    }

    function onFocus (e: FocusEvent, index: number) {
      focus()

      focusIndex.value = index
    }

    function onBlur () {
      blur()

      focusIndex.value = -1
    }

    provideDefaults({
      VField: {
        disabled: computed(() => props.disabled),
        error: computed(() => props.error),
        variant: computed(() => props.variant),
      },
    }, { scoped: true })

    watch(model, val => {
      if (val.length === props.length) emit('finish', val.join(''))
    }, { deep: true })

    watch(focusIndex, val => {
      if (val < 0) return

      window.requestAnimationFrame(() => {
        inputRef.value[focusIndex.value].select()
      })
    })

    useRender(() => {
      return (
        <div
          class={[
            'v-otp-input',
            {
              'v-otp-input--divided': !!props.divider,
            },
            props.class,
          ]}
          style={[
            props.style,
            dimensionStyles.value,
          ]}
        >
          <div class="v-otp-input__content">
            { fields.value.map((_, i) => (
              <>
                { props.divider && i !== 0 && (
                  <span class="v-otp-input__divider">{ props.divider }</span>
                )}

                <VField
                  focused={ (isFocused.value && props.focusAll) || focusIndex.value === i }
                  key={ i }
                >
                  {{
                    ...slots,
                    default: () => {
                      return (
                        <input
                          ref={ val => inputRef.value[i] = val as HTMLInputElement }
                          aria-label={ `Please enter OTP character ${i + 1}` }
                          autofocus={ i === 0 && props.autofocus }
                          autocomplete="off"
                          class={[
                            'v-otp-input__field',
                          ]}
                          inputmode="text"
                          min={ props.type === 'number' ? 0 : undefined }
                          maxlength="1"
                          placeholder={ props.placeholder }
                          type={ props.type }
                          value={ model.value[i] }
                          onInput={ onInput }
                          onFocus={ e => onFocus(e, i) }
                          onBlur={ onBlur }
                          onKeydown={ onKeydown }
                          onPaste={ event => onPaste(i, event) }
                        />
                      )
                    },
                  }}
                </VField>
              </>
            ))}
          </div>

          <VOverlay
            contained
            content-class="v-otp-input__loader"
            model-value={ !!props.loading }
            persistent
          >
            { slots.loader?.() ?? (
              <VProgressCircular
                color={ typeof props.loading === 'boolean' ? undefined : props.loading }
                indeterminate
                size="24"
                width="2"
              />
            )}
          </VOverlay>

          { slots.default?.() }
        </div>
      )
    })

    return {
      blur: () => {
        inputRef.value?.some(input => input.blur())
      },
      focus: () => {
        inputRef.value?.[0].focus()
      },
      reset,
      isFocused,
    }
  },
})

export type VOtpInput = InstanceType<typeof VOtpInput>
