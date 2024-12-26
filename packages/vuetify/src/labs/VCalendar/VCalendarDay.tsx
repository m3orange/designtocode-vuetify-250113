// Styles
import './VCalendarDay.sass'

// Components
import { makeVCalendarIntervalProps, VCalendarInterval } from './VCalendarInterval'
import { VBtn } from '@/components/VBtn'

// Composables
import { useDate } from '@/composables/date'

// Utilities
import { computed } from 'vue'
import { genericComponent, getPrefixedEventHandlers, pick, propsFactory, useRender } from '@/util'

// Types
import type { VCalendarIntervalSlots } from './VCalendarInterval'

export type VCalendarDaySlots = VCalendarIntervalSlots & {
  interval: Record<string, unknown>
}

export const makeVCalendarDayProps = propsFactory({
  hideDayHeader: Boolean,
  intervals: {
    type: Number,
    default: 24,
  },

  ...makeVCalendarIntervalProps(),
}, 'VCalendarDay')

export const VCalendarDay = genericComponent<VCalendarDaySlots>()({
  name: 'VCalendarDay',

  props: makeVCalendarDayProps(),

  emits: {
    'click:event': null,
    'contextmenu:date': null,
    'contextmenu:event': null,
  },

  setup (props, { attrs, emit, slots }) {
    const adapter = useDate()
    const intervals = computed(() => [
      ...Array.from({ length: props.intervals }, (v, i) => i)
        .filter((_, index) => (props.intervalDuration * (index + props.intervalStart)) < 1440),
    ])
    const clickEvent = (mouseEvent: any, event: any) => {
      emit('click:event', mouseEvent, event)
    }

    const contextmenuDate = (mouseEvent: any, date: any) => {
      // Pass the date up the chain
      emit('contextmenu:date', mouseEvent, date)
    }

    const contextmenuEvent = (mouseEvent: any, date: any, event: null) => {
      emit('contextmenu:event', mouseEvent, date, event)
    }

    useRender(() => {
      const calendarIntervalProps = VCalendarInterval.filterProps(props)

      return (
        <div class="v-calendar-day__container">
          { !props.hideDayHeader && (
            <div
              key="calender-week-name"
              class="v-calendar-weekly__head-weekday"
            >
              { adapter.format(props.day.date, 'weekdayShort') }

              <div>
                <VBtn
                  { ...getPrefixedEventHandlers(attrs, ':intervalDate', () => props.day) }
                  class={ props.day?.isToday ? 'v-calendar-day-label__today' : undefined }
                  icon
                  text={ adapter.format(props.day.date, 'dayOfMonth') }
                  variant={ props.day?.isToday ? undefined : 'text' }
                />
              </div>
            </div>
          )}
          { intervals.value.map((_, index) =>
            slots.interval?.(calendarIntervalProps) ?? (
              <VCalendarInterval
                index={ index }
                onClick:event={ clickEvent }
                onContextmenu:date={ contextmenuDate }
                onContextmenu:event={ contextmenuEvent }

                { ...calendarIntervalProps }
                { ...getPrefixedEventHandlers(attrs, ':interval', () => calendarIntervalProps) }
              >
                {{
                  ...pick(slots, ['intervalBody', 'intervalEvent', 'intervalTitle']),
                }}
              </VCalendarInterval>
            )
          )}
        </div>
      )
    })

    return { intervals }
  },
})

export type VCalendarDay = InstanceType<typeof VCalendarDay>
