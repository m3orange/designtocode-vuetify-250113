// Styles
import './VNumberInput.sass'

// Components
import { VBtn } from '../../components/VBtn'
import { VDefaultsProvider } from '../../components/VDefaultsProvider'
import { VDivider } from '../../components/VDivider'
import { makeVTextFieldProps, VTextField } from '@/components/VTextField/VTextField'

// Composables
import { useProxiedModel } from '@/composables/proxiedModel'

// Utilities
import { computed, watchEffect } from 'vue'
import { clamp, genericComponent, getDecimals, omit, propsFactory, useRender } from '@/util'

// Types
import type { PropType } from 'vue'
import type { VTextFieldSlots } from '@/components/VTextField/VTextField'

const CALCULATION_DECIMAL_PRECISION = 10

type ControlSlot = {
  click: (e: MouseEvent) => void
}

type VNumberInputSlots = Omit<VTextFieldSlots, 'default'> & {
  increment: ControlSlot
  decrement: ControlSlot
}

type ControlVariant = 'default' | 'stacked' | 'split'

const makeVNumberInputProps = propsFactory({
  controlVariant: {
    type: String as PropType<ControlVariant>,
    default: 'default',
  },
  inset: Boolean,
  hideInput: Boolean,
  min: {
    type: Number,
    default: -Infinity,
  },
  max: {
    type: Number,
    default: Infinity,
  },
  step: {
    type: Number,
    default: 1,
  },

  ...omit(makeVTextFieldProps(), ['appendInnerIcon', 'prependInnerIcon']),
}, 'VNumberInput')

export const VNumberInput = genericComponent<VNumberInputSlots>()({
  name: 'VNumberInput',

  inheritAttrs: false,

  props: {
    ...makeVNumberInputProps(),
  },

  emits: {
    'update:modelValue': (val: number) => true,
  },

  setup (props, { attrs, emit, slots }) {
    const model = useProxiedModel(props, 'modelValue')

    const stepDecimals = computed(() => getDecimals(props.step))

    const canIncrease = computed(() => {
      if (model.value == null) return true
      return model.value < props.max
    })
    const canDecrease = computed(() => {
      if (model.value == null) return true
      return model.value > props.min
    })

    watchEffect(() => {
      if (model.value != null && (model.value < props.min || model.value > props.max)) {
        model.value = clamp(model.value, props.min, props.max)
      }
    })

    const controlVariant = computed(() => {
      return props.hideInput ? 'stacked' : props.controlVariant
    })

    const incrementSlotProps = computed(() => ({ click: onClickUp }))

    const decrementSlotProps = computed(() => ({ click: onClickDown }))

    function roundToZero (v: number) {
      const actualValue = +v.toFixed(CALCULATION_DECIMAL_PRECISION)
      return v < 0 ? -Math.floor(-actualValue) : Math.floor(actualValue)
    }
    function roundToStep (v: number) {
      return +(v.toFixed(stepDecimals.value))
    }

    function toggleUpDown (increment = true) {
      if (model.value == null) {
        model.value = 0
        return
      }

      const truncated = roundToStep(roundToZero(model.value / props.step) * props.step)
      if (increment) {
        const newValue = truncated > model.value
          ? truncated
          : roundToStep(truncated + props.step)
        model.value = Math.min(newValue, props.max)
      } else {
        const newValue = truncated < model.value
          ? truncated
          : roundToStep(truncated - props.step)
        model.value = Math.max(newValue, props.min)
      }
    }

    function onClickUp (e: MouseEvent) {
      e.stopPropagation()
      toggleUpDown()
    }

    function onClickDown (e: MouseEvent) {
      e.stopPropagation()
      toggleUpDown(false)
    }

    function onKeydown (e: KeyboardEvent) {
      if (
        ['Enter', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Tab'].includes(e.key) ||
        e.ctrlKey
      ) return

      if (['ArrowDown'].includes(e.key)) {
        e.preventDefault()
        toggleUpDown(false)
        return
      }
      if (['ArrowUp'].includes(e.key)) {
        e.preventDefault()
        toggleUpDown()
        return
      }

      // Only numbers, +, - & . are allowed
      if (!/^[0-9\-+.]+$/.test(e.key)) {
        e.preventDefault()
      }
    }

    function onModelUpdate (v: string) {
      model.value = v ? +(v) : undefined
    }

    function onControlMousedown (e: MouseEvent) {
      e.stopPropagation()
    }

    useRender(() => {
      const { modelValue: _, ...textFieldProps } = VTextField.filterProps(props)

      function controlNode () {
        const defaultHeight = controlVariant.value === 'stacked' ? 'auto' : '100%'
        return (
          <div class="v-number-input__control">
            {
              !slots.decrement ? (
                <VBtn
                  disabled={ !canDecrease.value }
                  flat
                  key="decrement-btn"
                  height={ defaultHeight }
                  name="decrement-btn"
                  icon="$expand"
                  size="small"
                  tabindex="-1"
                  onClick={ onClickDown }
                  onMousedown={ onControlMousedown }
                />
              ) : (
                <VDefaultsProvider
                  key="decrement-defaults"
                  defaults={{
                    VBtn: {
                      disabled: !canDecrease.value,
                      flat: true,
                      height: defaultHeight,
                      size: 'small',
                      icon: '$expand',
                    },
                  }}
                >
                  { slots.decrement(decrementSlotProps.value) }
                </VDefaultsProvider>
              )
            }

            <VDivider
              vertical={ controlVariant.value !== 'stacked' }
            />

            {
              !slots.increment ? (
                <VBtn
                  disabled={ !canIncrease.value }
                  flat
                  key="increment-btn"
                  height={ defaultHeight }
                  name="increment-btn"
                  icon="$collapse"
                  onClick={ onClickUp }
                  onMousedown={ onControlMousedown }
                  size="small"
                  tabindex="-1"
                />
              ) : (
                <VDefaultsProvider
                  key="increment-defaults"
                  defaults={{
                    VBtn: {
                      disabled: !canIncrease.value,
                      flat: true,
                      height: defaultHeight,
                      size: 'small',
                      icon: '$collapse',
                    },
                  }}
                >
                  { slots.increment(incrementSlotProps.value) }
                </VDefaultsProvider>
              )
            }
          </div>
        )
      }

      function dividerNode () {
        return !props.hideInput && !props.inset ? <VDivider vertical /> : undefined
      }

      const appendInnerControl =
        controlVariant.value === 'split'
          ? (
            <div class="v-number-input__control">
              <VDivider vertical />

              <VBtn
                flat
                height="100%"
                icon="$plus"
                tile
                tabindex="-1"
                onClick={ onClickUp }
                onMousedown={ onControlMousedown }
              />
            </div>
          ) : (!props.reverse
            ? <>{ dividerNode() }{ controlNode() }</>
            : undefined)

      const hasAppendInner = slots['append-inner'] || appendInnerControl

      const prependInnerControl =
        controlVariant.value === 'split'
          ? (
            <div class="v-number-input__control">
              <VBtn
                flat
                height="100%"
                icon="$minus"
                tile
                tabindex="-1"
                onClick={ onClickDown }
                onMousedown={ onControlMousedown }
              />

              <VDivider vertical />
            </div>
          ) : (props.reverse
            ? <>{ controlNode() }{ dividerNode() }</>
            : undefined)

      const hasPrependInner = slots['prepend-inner'] || prependInnerControl

      return (
        <VTextField
          modelValue={ model.value }
          onUpdate:modelValue={ onModelUpdate }
          onKeydown={ onKeydown }
          class={[
            'v-number-input',
            {
              'v-number-input--default': controlVariant.value === 'default',
              'v-number-input--hide-input': props.hideInput,
              'v-number-input--inset': props.inset,
              'v-number-input--reverse': props.reverse,
              'v-number-input--split': controlVariant.value === 'split',
              'v-number-input--stacked': controlVariant.value === 'stacked',
            },
            props.class,
          ]}
          { ...textFieldProps }
          style={ props.style }
          inputmode="decimal"
        >
          {{
            ...slots,
            'append-inner': hasAppendInner ? (...args) => (
              <>
                { slots['append-inner']?.(...args) }
                { appendInnerControl }
              </>
            ) : undefined,
            'prepend-inner': hasPrependInner ? (...args) => (
              <>
                { prependInnerControl }
                { slots['prepend-inner']?.(...args) }
              </>
            ) : undefined,
          }}
        </VTextField>
      )
    })
  },
})

export type VNumberInput = InstanceType<typeof VNumberInput>
