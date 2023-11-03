// Styles
import './VDatePicker.sass'

// Components
import { makeVDatePickerControlsProps, VDatePickerControls } from './VDatePickerControls'
import { VDatePickerHeader } from './VDatePickerHeader'
import { makeVDatePickerMonthProps, VDatePickerMonth } from './VDatePickerMonth'
import { makeVDatePickerMonthsProps, VDatePickerMonths } from './VDatePickerMonths'
import { makeVDatePickerYearsProps, VDatePickerYears } from './VDatePickerYears'
import { VFadeTransition } from '@/components/transitions'
import { VTextField } from '@/components/VTextField'
import { makeVPickerProps, VPicker } from '@/labs/VPicker/VPicker'

// Composables
import { useDate } from '@/composables/date'
import { useLocale } from '@/composables/locale'
import { useProxiedModel } from '@/composables/proxiedModel'

// Utilities
import { computed, ref, shallowRef, watch, watchEffect } from 'vue'
import { genericComponent, omit, propsFactory, useRender, wrapInArray } from '@/util'

// Types
import type { PropType } from 'vue'
import type { VPickerSlots } from '@/labs/VPicker/VPicker'
import type { GenericProps } from '@/util'

// Types
export type VDatePickerSlots = Omit<VPickerSlots, 'header'> & {
  header: {
    header: string
    appendIcon: string
    'onClick:append': () => void
  }
}

export const makeVDatePickerProps = propsFactory({
  calendarIcon: {
    type: String,
    default: '$calendar',
  },
  keyboardIcon: {
    type: String,
    default: '$edit',
  },
  inputMode: {
    type: String as PropType<'calendar' | 'keyboard'>,
    default: 'calendar',
  },
  inputText: {
    type: String,
    default: '$vuetify.datePicker.input.placeholder',
  },
  inputPlaceholder: {
    type: String,
    default: 'dd/mm/yyyy',
  },
  header: {
    type: String,
    default: '$vuetify.datePicker.header',
  },

  ...makeVDatePickerControlsProps(),
  ...makeVDatePickerMonthProps(),
  ...omit(makeVDatePickerMonthsProps(), ['modelValue']),
  ...omit(makeVDatePickerYearsProps(), ['modelValue']),
  ...makeVPickerProps({ title: '$vuetify.datePicker.title' }),

  modelValue: null,
}, 'VDatePicker')

export const VDatePicker = genericComponent<new <T, Multiple extends boolean = false> (
  props: {
    modelValue?: Multiple extends true ? T[] : T
    'onUpdate:modelValue'?: (value: Multiple extends true ? T[] : T) => void
    multiple?: Multiple
  },
  slots: VDatePickerSlots
) => GenericProps<typeof props, typeof slots>>()({
  name: 'VDatePicker',

  props: makeVDatePickerProps(),

  emits: {
    'update:modelValue': (date: any) => true,
    'update:month': (date: any) => true,
    'update:year': (date: any) => true,
    'update:inputMode': (date: any) => true,
    'update:viewMode': (date: any) => true,
  },

  setup (props, { emit, slots }) {
    const adapter = useDate()
    const { t } = useLocale()

    const model = useProxiedModel(
      props,
      'modelValue',
      undefined,
      v => wrapInArray(v),
      v => props.multiple ? v : v[0],
    )
    const internal = ref(model.value)
    watchEffect(() => {
      internal.value = model.value
    })

    const viewMode = useProxiedModel(props, 'viewMode')
    const inputMode = useProxiedModel(props, 'inputMode')
    const _model = computed(() => {
      const value = adapter.date(internal.value?.[0])

      return value && adapter.isValid(value) ? value : adapter.date()
    })

    const month = ref(Number(props.month ?? adapter.getMonth(adapter.startOfMonth(_model.value))))
    const year = ref(Number(props.year ?? adapter.getYear(adapter.startOfYear(adapter.setMonth(_model.value, month.value)))))

    const isReversing = shallowRef(false)
    const header = computed(() => {
      return props.multiple && model.value.length > 1
        ? t('$vuetify.datePicker.itemsSelected', model.value.length)
        : model.value[0] && adapter.isValid(model.value[0])
          ? adapter.format(model.value[0], 'normalDateWithWeekday')
          : t(props.header)
    })
    const text = computed(() => {
      return adapter.format(
        adapter.setYear(adapter.setMonth(adapter.date(), month.value), year.value),
        'monthAndYear',
      )
    })
    // TODO: implement in v3.5
    // const headerIcon = computed(() => props.inputMode === 'calendar' ? props.keyboardIcon : props.calendarIcon)
    const headerTransition = computed(() => `date-picker-header${isReversing.value ? '-reverse' : ''}-transition`)
    const minDate = computed(() => {
      const date = adapter.date(props.min)

      return props.min && adapter.isValid(date) ? date : null
    })
    const maxDate = computed(() => {
      const date = adapter.date(props.max)

      return props.max && adapter.isValid(date) ? date : null
    })
    const disabled = computed(() => {
      const targets = []

      if (viewMode.value !== 'month') {
        targets.push(...['prev', 'next'])
      } else {
        let _date = adapter.date()

        _date = adapter.setYear(_date, year.value)
        _date = adapter.setMonth(_date, month.value)

        if (minDate.value) {
          const date = adapter.addDays(adapter.startOfMonth(_date), -1)

          adapter.isAfter(minDate.value, date) && targets.push('prev')
        }

        if (maxDate.value) {
          const date = adapter.addDays(adapter.endOfMonth(_date), 1)

          adapter.isAfter(date, maxDate.value) && targets.push('next')
        }
      }

      return targets
    })

    function onClickAppend () {
      inputMode.value = inputMode.value === 'calendar' ? 'keyboard' : 'calendar'
    }

    function onClickNext () {
      if (month.value < 11) {
        month.value++

        emit('update:month', month.value)
      } else {
        year.value++
        month.value = 0

        emit('update:year', year.value)
      }
    }

    function onClickPrev () {
      if (month.value > 0) {
        month.value--

        emit('update:month', month.value)
      } else {
        year.value--
        month.value = 11

        emit('update:year', month.value)
      }
    }

    function onClickMonth () {
      viewMode.value = viewMode.value === 'months' ? 'month' : 'months'
    }

    function onClickYear () {
      viewMode.value = viewMode.value === 'year' ? 'month' : 'year'
    }

    watch(month, () => {
      if (viewMode.value === 'months') onClickMonth()
    })

    watch(year, () => {
      if (viewMode.value === 'year') onClickYear()
    })

    watch(internal, (val, oldVal) => {
      const before = adapter.date(wrapInArray(val)[0])
      const after = adapter.date(wrapInArray(oldVal)[0])

      isReversing.value = adapter.isBefore(before, after)

      model.value = val
    })

    useRender(() => {
      const [pickerProps] = VPicker.filterProps(props)
      const [datePickerControlsProps] = VDatePickerControls.filterProps(props)
      const [datePickerHeaderProps] = VDatePickerHeader.filterProps(props)
      const [datePickerMonthProps] = VDatePickerMonth.filterProps(props)
      const [datePickerMonthsProps] = VDatePickerMonths.filterProps(omit(props, ['modelValue']))
      const [datePickerYearsProps] = VDatePickerYears.filterProps(omit(props, ['modelValue']))

      return (
        <VPicker
          { ...pickerProps }
          class={[
            'v-date-picker',
            `v-date-picker--${viewMode.value}`,
            props.class,
          ]}
          style={ props.style }
          width={ props.showWeek ? 408 : 360 }
          v-slots={{
            title: () => slots.title?.() ?? (
              <div class="v-date-picker__title">
                { t(props.title) }
              </div>
            ),
            header: () => (
              <VDatePickerHeader
                key="header"
                { ...datePickerHeaderProps }
                header={ header.value }
                transition={ headerTransition.value }
                onClick:append={ onClickAppend }
                v-slots={ slots }
              />
            ),
            default: () => props.inputMode === 'calendar' ? (
              <>
                <VDatePickerControls
                  { ...datePickerControlsProps }
                  disabled={ disabled.value }
                  text={ text.value }
                  onClick:next={ onClickNext }
                  onClick:prev={ onClickPrev }
                  onClick:month={ onClickMonth }
                  onClick:year={ onClickYear }
                />

                <VFadeTransition hideOnLeave>
                  { viewMode.value === 'months' ? (
                    <VDatePickerMonths
                      key="date-picker-months"
                      { ...datePickerMonthsProps }
                      v-model={ month.value }
                      min={ minDate.value }
                      max={ maxDate.value }
                    />
                  ) : viewMode.value === 'year' ? (
                    <VDatePickerYears
                      key="date-picker-years"
                      { ...datePickerYearsProps }
                      v-model={ year.value }
                      min={ minDate.value }
                      max={ maxDate.value }
                    />
                  ) : (
                    <VDatePickerMonth
                      key="date-picker-month"
                      { ...datePickerMonthProps }
                      v-model={ internal.value }
                      v-model:month={ month.value }
                      v-model:year={ year.value }
                      min={ minDate.value }
                      max={ maxDate.value }
                    />
                  )}
                </VFadeTransition>
              </>
            ) : (
              <div class="v-date-picker__input">
                <VTextField
                  label={ t(props.inputText) }
                  placeholder={ props.inputPlaceholder }
                />
              </div>
            ),
            actions: slots.actions,
          }}
        />
      )
    })

    return {}
  },
})

export type VDatePicker = InstanceType<typeof VDatePicker>
