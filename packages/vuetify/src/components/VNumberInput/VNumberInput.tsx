// Styles
import './VNumberInput.sass'

// Components
import { VBtn } from '../VBtn'
import { VDivider } from '../VDivider'
import { allowedVariants, filterFieldProps, makeVFieldProps, VField } from '@/components/VField/VField'
import { makeVInputProps, VInput } from '@/components/VInput/VInput'

// Composables
import { useProxiedModel } from '@/composables/proxiedModel'

// Utilities
import { computed, ref } from 'vue'
import { filterInputAttrs, genericComponent, propsFactory, useRender } from '@/util'

// Types
import type { PropType } from 'vue'
import type { Variant, VFieldSlots } from '@/components/VField/VField'
import type { VInputSlots } from '@/components/VInput/VInput'

type VNumberInputSlots = Omit<VInputSlots & VFieldSlots, 'default'>

type ControlVariant = 'default' | 'stacked' | 'split'

const makeVNumberInputProps = propsFactory({
  controlReverse: Boolean,
  controlVariant: {
    type: String as PropType<ControlVariant>,
    default: 'default',
  },
  inset: Boolean,
  hideInput: Boolean,
  min: Number,
  max: Number,
  step: Number,
  ...makeVInputProps(),
  ...makeVFieldProps(),
  variant: {
    type: String as PropType<Variant>,
    default: 'filled',
    validator: (v: any) => allowedVariants.includes(v),
  },
}, 'VNumberInput')

export const VNumberInput = genericComponent<VNumberInputSlots>()({
  name: 'VNumberInput',

  inheritAttrs: false,

  props: {
    ...makeVNumberInputProps(),
    modelValue: {
      type: Number,
      default: 0,
    },
  },

  emits: {
    'update:modelValue': (val: number) => true,
  },

  setup (props, { attrs, emit, slots }) {
    const model = useProxiedModel(props, 'modelValue')
    const inputRef = ref<HTMLInputElement>()

    const controlVariant = computed(() => {
      if (props.hideInput) return 'stacked'
      return props.controlVariant
    })

    const controlClasses = computed(() => {
      const classes: string[] = ['v-number-input__control']

      if (props.hideInput || props.inset) classes.push('v-number-input__control--borderless')

      return classes
    })

    function incrementalClick () {
      inputRef.value?.stepUp()
    }

    function decrementalClick () {
      inputRef.value?.stepDown()
    }

    useRender(() => {
      const [rootAttrs, inputAttrs] = filterInputAttrs(attrs)
      const controlNode = () => (
          <div
            class={ controlClasses.value }
          >
            <VBtn
              flat
              height={ controlVariant.value === 'stacked' ? 'auto' : '100%' }
              icon="mdi-chevron-down"
              rounded="0"
              size="small"
              onClick={ decrementalClick }
            />
            <VDivider
              vertical={ controlVariant.value !== 'stacked' }
            />
            <VBtn
              flat
              height={ controlVariant.value === 'stacked' ? 'auto' : '100%' }
              icon="mdi-chevron-up"
              onClick={ incrementalClick }
              rounded="0"
              size="small"
            />
          </div>
      )

      const fieldProps = filterFieldProps(props)

      return (
          <VInput
            class={[
              'v-number-input',
              {
                'v-number-input--control-reverse': props.controlReverse,
                'v-number-input--default': controlVariant.value === 'default',
                'v-number-input--hide-input': props.hideInput,
                'v-number-input--inset': props.inset,
                'v-number-input--split': controlVariant.value === 'split',
                'v-number-input--stacked': controlVariant.value === 'stacked',
              },
            ]}
            { ...rootAttrs }
          >
            {{
              default: () => (
                <VField
                  { ...fieldProps }
                >
                  {{
                    default: ({
                      props: { class: fieldClass, ...slotProps },
                    }) => (
                      <input
                        ref={ inputRef }
                        type="number"
                        value={ model.value }
                        class={ fieldClass }
                        max={ props.max }
                        min={ props.min }
                        step={ props.step }
                        { ...inputAttrs }
                      />
                    ),
                    'append-inner': controlVariant.value === 'split' ? () => (
                      <div
                        class={
                          [
                            'v-number-input__control--borderless',
                            ...controlClasses.value,
                          ]
                        }
                      >
                        <VDivider vertical />
                        <VBtn
                          flat
                          height="100%"
                          icon="mdi-plus"
                          rounded="0"
                          onClick={ incrementalClick }
                        />
                      </div>
                    ) : (!props.controlReverse ? controlNode : undefined),
                    'prepend-inner': controlVariant.value === 'split' ? () => (
                      <div
                        class={[
                          'v-number-input__control--borderless',
                          ...controlClasses.value,
                        ]}
                      >
                        <VBtn
                          flat
                          height="100%"
                          icon="mdi-minus"
                          rounded="0"
                          onClick={ decrementalClick }
                        />
                        <VDivider vertical />
                      </div>
                    ) : (props.controlReverse ? controlNode : undefined),
                  }}
                </VField>
              ),
            }}
          </VInput>
      )
    })
  },
})

export type VNumberInput = InstanceType<typeof VNumberInput>
