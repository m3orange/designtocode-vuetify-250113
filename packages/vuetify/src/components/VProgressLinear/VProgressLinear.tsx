// Styles
import './VProgressLinear.sass'

// Composables
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, useTheme } from '@/composables/theme'
import { useBackgroundColor, useTextColor } from '@/composables/color'
import { useIntersectionObserver } from '@/composables/intersectionObserver'
import { useProxiedModel } from '@/composables/proxiedModel'
import { useRtl } from '@/composables/rtl'

// Utilities
import { clamp, convertToUnit, defineComponent } from '@/util'
import { computed, Transition } from 'vue'

export default defineComponent({
  name: 'VProgressLinear',

  props: {
    active: {
      type: Boolean,
      default: true,
    },
    bgColor: {
      type: String,
      default: null,
    },
    bgOpacity: [Number, String],
    bufferValue: {
      type: [Number, String],
      default: 0,
    },
    clickable: Boolean,
    color: String,
    height: {
      type: [Number, String],
      default: 4,
    },
    indeterminate: Boolean,
    modelValue: {
      type: [Number, String],
      default: 0,
    },
    reverse: Boolean,
    stream: Boolean,
    striped: Boolean,
    roundedBar: Boolean,

    ...makeRoundedProps(),
    ...makeTagProps(),
    ...makeThemeProps(),
  },

  emits: {
    'update:modelValue': (value: number) => true,
  },

  setup (props, { slots }) {
    const progress = useProxiedModel(props, 'modelValue')
    const { isRtl } = useRtl()
    const { themeClasses } = useTheme(props)
    const { textColorClasses, textColorStyles } = useTextColor(props, 'color')
    const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(computed(() => props.bgColor || props.color))
    const { backgroundColorClasses: barColorClasses, backgroundColorStyles: barColorStyles } = useBackgroundColor(props, 'color')
    const { roundedClasses } = useRounded(props, 'v-progress-linear')
    const { intersectionRef, isIntersecting } = useIntersectionObserver()

    const height = computed(() => parseInt(props.height, 10))
    const normalizedBuffer = computed(() => clamp(parseFloat(props.bufferValue), 0, 100))
    const normalizedValue = computed(() => clamp(parseFloat(progress.value), 0, 100))
    const isReversed = computed(() => isRtl.value !== props.reverse)
    const transition = computed(() => props.indeterminate ? 'fade-transition' : 'slide-x-transition')
    const opacity = computed(() => {
      return props.bgOpacity == null
        ? props.bgOpacity
        : parseFloat(props.bgOpacity)
    })

    function handleClick (e: MouseEvent) {
      if (!intersectionRef.value) return

      const { left, right, width } = intersectionRef.value.getBoundingClientRect()
      const value = isReversed.value ? (width - e.clientX) + (right - width) : e.clientX - left

      progress.value = value / width * 100
    }

    return () => (
      <props.tag
        ref={ intersectionRef }
        class={[
          'v-progress-linear',
          {
            'v-progress-linear--active': props.active && isIntersecting.value,
            'v-progress-linear--reverse': isReversed.value,
            'v-progress-linear--rounded-bar': props.roundedBar,
            'v-progress-linear--striped': props.striped,
          },
          roundedClasses.value,
          themeClasses.value,
        ]}
        style={{
          height: props.active ? convertToUnit(height.value) : 0,
        }}
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={ props.indeterminate ? undefined : normalizedValue.value }
        onClick={ props.clickable && handleClick }
      >
        { props.stream && (
          <div
            class={[
              'v-progress-linear__stream',
              textColorClasses.value,
            ]}
            style={{
              ...textColorStyles.value,
              [isReversed.value ? 'left' : 'right']: convertToUnit(-height.value * 2),
              borderTop: `${convertToUnit(height.value)} dotted`,
              opacity: opacity.value,
              top: `calc(50% - ${convertToUnit(height.value / 2)}px)`,
              width: convertToUnit(100 - normalizedBuffer.value, '%'),
              // TODO: Fix typing
              // @ts-expect-error
              '--v-progress-linear-stream-to': convertToUnit(height.value * 2 * (isReversed.value ? 1 : -1)),
            }}
          />
        ) }

        <div
          class={[
            'v-progress-linear__background',
            backgroundColorClasses.value,
          ]}
          style={[
            backgroundColorStyles.value,
            {
              opacity: opacity.value,
              width: convertToUnit(props.stream ? normalizedBuffer.value : 100, '%'),
            },
          ]}
        />

        <Transition name={ transition.value }>
          { !props.indeterminate ? (
            <div
              class={[
                'v-progress-linear__determinate',
                barColorClasses.value,
              ]}
              style={[
                barColorStyles.value,
                { width: convertToUnit(normalizedValue.value, '%') },
              ]}
            />
          ) : (
            <div class="v-progress-linear__indeterminate">
              { ['long', 'short'].map(bar => (
                <div
                  key={ bar }
                  class={[
                    'v-progress-linear__indeterminate',
                    bar,
                    barColorClasses.value,
                  ]}
                  style={ barColorStyles.value }
                />
              )) }
            </div>
          ) }
        </Transition>

        { slots.default && (
          <div class="v-progress-linear__content">
            { slots.default({ value: normalizedValue.value, buffer: normalizedBuffer.value }) }
          </div>
        ) }
      </props.tag>
    )
  },
})
