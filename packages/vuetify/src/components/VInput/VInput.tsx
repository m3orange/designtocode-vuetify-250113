// Styles
import './VInput.sass'

// Components
import { VIcon } from '@/components/VIcon'
import VInputLabel from './VInputLabel'

// Composables
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeThemeProps, useTheme } from '@/composables/theme'
import { useProxiedModel } from '@/composables/proxiedModel'

// Utilities
import { computed, ref, toRef, watch, watchEffect } from 'vue'
import { convertToUnit, defineComponent, getUid, nullifyTransforms, standardEasing, useRender } from '@/util'

// Types
import type { PropType } from 'vue'
import { useBackgroundColor, useTextColor } from '@/composables/color'

export default defineComponent({
  name: 'VInput',

  inheritAttrs: false,

  props: {
    active: Boolean,
    appendIcon: String,
    appendOuterIcon: String,
    bgColor: String,
    color: {
      type: String,
      default: 'primary',
    },
    hideDetails: [Boolean, String] as PropType<boolean | 'auto'>,
    hideSpinButtons: Boolean,
    hint: String,
    id: String,
    label: String,
    loading: Boolean,
    modelValue: null as any as PropType<any>,
    persistentHint: Boolean,
    prependIcon: String,
    prependOuterIcon: String,
    reverse: Boolean,
    variant: {
      type: String,
      default: 'filled',
      // required: true,
    },

    ...makeThemeProps(),
    ...makeDensityProps(),
  },

  emits: {
    'update:modelValue': (value: boolean) => true,
    'update:active': (value: boolean) => true,
    'click:prepend-outer': (e: Event) => e,
    'click:prepend': (e: Event) => e,
    'click:append': (e: Event) => e,
    'click:append-outer': (e: Event) => e,
  },

  setup (props, { attrs, emit, slots }) {
    const { themeClasses } = useTheme(props)
    const { densityClasses } = useDensity(props, 'v-input')
    const value = useProxiedModel(props, 'modelValue')
    const isActive = useProxiedModel(props, 'active')
    const uid = getUid()

    const labelRef = ref<InstanceType<typeof VInputLabel>>()
    const labelSizerRef = ref<InstanceType<typeof VInputLabel>>()
    const controlRef = ref<HTMLElement>()
    const fieldRef = ref<HTMLElement>()
    const isDirty = computed(() => (value.value != null && value.value !== ''))
    const isFocused = ref(false)
    const id = computed(() => props.id || `input-${uid}`)

    watchEffect(() => isActive.value = isFocused.value || isDirty.value)

    const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'bgColor'))
    const { textColorClasses, textColorStyles } = useTextColor(computed(() => {
      return isFocused.value ? props.color : undefined
    }))

    watch(isActive, val => {
      if (props.variant !== 'contained') {
        const el: HTMLElement = labelRef.value!.$el
        const targetEl: HTMLElement = labelSizerRef.value!.$el
        const rect = nullifyTransforms(el)
        const targetRect = targetEl.getBoundingClientRect()

        const x = targetRect.x - rect.x
        const y = targetRect.y - rect.y - (rect.height / 2 - targetRect.height / 2)

        const targetWidth = targetRect.width / 0.75
        const width = Math.abs(targetWidth - rect.width) > 1
          ? { maxWidth: convertToUnit(targetWidth) }
          : undefined

        el.style.visibility = 'visible'
        targetEl.style.visibility = 'hidden'

        el.animate([
          { transform: 'translate(0)' },
          { transform: `translate(${x}px, ${y}px) scale(.75)`, ...width },
        ], {
          duration: 150,
          easing: standardEasing,
          direction: val ? 'normal' : 'reverse',
        }).finished.then(() => {
          el.style.removeProperty('visibility')
          targetEl.style.removeProperty('visibility')
        })
      }
    }, { flush: 'post' })

    useRender(() => {
      const isOutlined = props.variant === 'outlined'
      const hasPrepend = (slots.prepend || props.prependIcon)
      const hasPrependOuter = (slots.prependOuter || props.prependOuterIcon)
      const hasAppend = (slots.append || props.appendIcon)
      const hasAppendOuter = (slots.appendOuter || props.appendOuterIcon)

      const label = slots.label
        ? slots.label({
          label: props.label,
          props: { for: id.value },
        })
        : props.label

      return (
        <div
          class={[
            'v-input',
            {
              'v-input--prepended': hasPrepend,
              'v-input--appended': hasAppend,
              'v-input--dirty': isActive.value,
              'v-input--focused': isFocused.value,
              'v-input--reverse': props.reverse,
              [`v-input--variant-${props.variant}`]: true,
            },
            themeClasses.value,
            densityClasses.value,
            textColorClasses.value,
          ]}
          style={[
            textColorStyles.value,
          ]}
          { ...attrs }
        >
          { hasPrependOuter && (
            <div
              class="v-input__prepend-outer"
              onClick={ (e: Event) => emit('click:prepend-outer', e) }
            >
              { slots.prependOuter
                ? slots.prependOuter()
                : (<VIcon icon={ props.prependOuterIcon } />)
              }
            </div>
          ) }

          <div
            ref={ controlRef }
            class={[
              'v-input__control',
              backgroundColorClasses.value,
            ]}
            style={ backgroundColorStyles.value }
          >
            { hasPrepend && (
              <div
                class="v-input__prepend"
                onClick={ (e: Event) => emit('click:prepend', e) }
              >
                { slots.prepend
                  ? slots.prepend()
                  : (<VIcon icon={ props.prependIcon } />)
                }
              </div>
            ) }

            <div class="v-input__field" ref={ fieldRef }>
              { props.variant === 'filled' && (
                <VInputLabel ref={ labelSizerRef } sizer>
                  { label }
                </VInputLabel>
              )}

              <VInputLabel ref={ labelRef } for={ id.value }>
                { label }
              </VInputLabel>

              { slots.default?.({
                uid,
                isActive: isActive.value,
                props: {
                  id: id.value,
                  value: value.value,
                  onFocus: () => (isFocused.value = true),
                  onBlur: () => (isFocused.value = false),
                  onInput: (e: Event) => {
                    const el = e.target as HTMLInputElement

                    value.value = el.value
                  },
                  onChange: (e: Event) => {
                    const el = e.target as HTMLInputElement

                    if (value.value === el.value) return

                    value.value = el.value
                  },
                },
              }) }
            </div>

            { hasAppend && (
              <div
                class="v-input__append"
                onClick={ (e: Event) => emit('click:append', e) }
              >
                { slots.append
                  ? slots.append()
                  : (<VIcon icon={ props.appendIcon } />)
                }
              </div>
            ) }

            <div class="v-input__outline">
              { isOutlined && (
                <>
                  <div class="v-input__outline__start" />

                  <div class="v-input__outline__notch">
                    <VInputLabel ref={ labelSizerRef } sizer>
                      { label }
                    </VInputLabel>
                  </div>

                  <div class="v-input__outline__end" />
                </>
              )}
              { props.variant === 'single-line' && (
                <VInputLabel ref={ labelSizerRef } sizer>
                  { label }
                </VInputLabel>
              )}
            </div>
          </div>

          { hasAppendOuter && (
            <div
              class="v-input__append-outer"
              onClick={ (e: Event) => emit('click:append-outer', e) }
            >
              { slots.appendOuter
                ? slots.appendOuter()
                : (<VIcon icon={ props.appendOuterIcon } />)
              }
            </div>
          ) }

          { slots.details && (
            <div class="v-input__details">
              { slots.details() }
            </div>
          ) }
        </div>
      )
    })

    return {
      value,
      isActive,
      isDirty,
      isFocused,
    }
  },
})
