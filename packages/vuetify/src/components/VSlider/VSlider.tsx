// Styles
import './VSlider.sass'

// Components
import { VInput } from '../VInput'
import { VSliderThumb } from './VSliderThumb'
import { VSliderTrack } from './VSliderTrack'

// Composables
import { useProxiedModel } from '@/composables/proxiedModel'
import { useFocus } from '@/composables/focus'
import { makeSliderProps, useSlider } from './slider'

// Helpers
import { defineComponent, getUid } from '@/util'

// Types
import { computed, ref } from 'vue'
import { filterInputProps, makeVInputProps } from '../VInput/VInput'

export const VSlider = defineComponent({
  name: 'VSlider',

  props: {
    ...makeSliderProps(),
    ...makeVInputProps(),

    modelValue: {
      type: [Number, String],
      default: 0,
    },
  },

  emits: {
    'update:modelValue': (v: number) => true,
  },

  setup (props, { attrs, slots }) {
    const thumbContainerRef = ref()

    const {
      min,
      max,
      mousePressed,
      roundValue,
      onSliderMousedown,
      onSliderTouchstart,
      trackContainerRef,
      position,
      hasLabels,
    } = useSlider({
      props,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handleSliderMouseUp: newValue => model.value = roundValue(newValue),
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handleMouseMove: newValue => model.value = roundValue(newValue),
      getActiveThumb: () => thumbContainerRef.value?.$el,
    })

    const model = useProxiedModel(
      props,
      'modelValue',
      undefined,
      v => {
        const value = typeof v === 'string' ? parseFloat(v) : v == null ? min.value : v

        return roundValue(value)
      },
    )

    const { isFocused, focus, blur } = useFocus()
    const trackStop = computed(() => position(model.value))

    return () => {
      const [inputProps, _] = filterInputProps(props)
      const id = attrs.id as string ?? `input-${getUid()}`
      const name = attrs.name as string ?? id

      return (
        <VInput
          class={[
            'v-slider',
            {
              'v-slider--has-labels': !!slots['tick-label'] || hasLabels.value,
              'v-slider--focused': isFocused.value,
              'v-slider--pressed': mousePressed.value,
              'v-slider--disabled': props.disabled,
            },
          ]}
          { ...inputProps }
          focused={ isFocused.value }
          v-slots={{
            ...slots,
            default: () => (
              <div
                class="v-slider__container"
                onMousedown={ onSliderMousedown }
                onTouchstartPassive={ onSliderTouchstart }
              >
                <input
                  id={ id }
                  name={ name }
                  disabled={ props.disabled }
                  readonly={ props.readonly }
                  tabindex="-1"
                  value={ model.value }
                />

                <VSliderTrack
                  ref={ trackContainerRef }
                  start={ 0 }
                  stop={ trackStop.value }
                  v-slots={{
                    'tick-label': slots['tick-label'],
                  }}
                />

                <VSliderThumb
                  ref={ thumbContainerRef }
                  focused={ isFocused.value }
                  min={ min.value }
                  max={ max.value }
                  modelValue={ model.value }
                  onUpdate:modelValue={ v => (model.value = v) }
                  position={ trackStop.value }
                  elevation={ props.elevation }
                  onFocus={ focus }
                  onBlur={ blur }
                  v-slots={{
                    'thumb-label': slots['thumb-label'],
                  }}
                />
              </div>
            ),
          }}
        />
      )
    }
  },
})
