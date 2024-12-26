// Styles
import './VCalendarMonthDay.sass'

// Components
import { VCalendarEvent } from './VCalendarEvent'
import { VBtn } from '@/components/VBtn'

// Utilities
import { genericComponent, getPrefixedEventHandlers, propsFactory, useRender } from '@/util'

// Types
import type { PropType } from 'vue'
import type { CalendarDay } from '@/composables/calendar'

export type VCalendarMonthDaySlots = {
  dayBody: { day?: CalendarDay, events?: Array<any> }
  dayEvent: { day?: CalendarDay, allDay: boolean, event: Record<string, unknown> }
  dayTitle: { title?: number | string }
}

export const makeVCalendarMonthDayProps = propsFactory({
  active: Boolean,
  color: String,
  day: {
    type: Object as PropType<CalendarDay>,
  },
  disabled: Boolean,
  events: Array<any>,
  title: [Number, String],
}, 'VCalendarMonthDay')

export const VCalendarMonthDay = genericComponent<VCalendarMonthDaySlots>()({
  name: 'VCalendarMonthDay',

  props: makeVCalendarMonthDayProps(),

  emits: {
    'click:event': null,
    'contextmenu:date': null,
    'contextmenu:event': null,
  },

  setup (props, { emit, attrs, slots }) {
    const clickEvent = (mouseEvent: any, event: any) => {
      emit('click:event', mouseEvent, event)
    }
    const contextmenuDate = (mouseEvent: any, date: any) => {
      emit('contextmenu:date', mouseEvent, date)
    }

    const contextmenuEvent = (mouseEvent: any, date: any, event: any) => {
      emit('contextmenu:event', mouseEvent, date, event)
    }

    useRender(() => {
      return (
        <div
          class={[
            'v-calendar-month__day',
          ]}
          onContextmenu={ event => contextmenuDate(event, props.day?.date) }
        >
          { !props.day?.isHidden ? (
            <div key="title" class="v-calendar-weekly__day-label">
              { slots.dayTitle?.({ title: props.title }) ?? (
                <VBtn
                  { ...getPrefixedEventHandlers(attrs, ':date', () => props) }
                  class={ props.day?.isToday ? 'v-calendar-weekly__day-label__today' : undefined }
                  color={ props.color }
                  disabled={ props.disabled }
                  icon
                  size="x-small"
                  variant={ props.day?.isToday ? undefined : 'flat' }
                  text={ `${props.title}` }
                />
              )
            }
            </div>
          ) : undefined }

          { !props.day?.isHidden ? (
            <div key="content" class="v-calendar-weekly__day-content" >
              { slots.dayBody?.({ day: props.day, events: props.events }) ?? (
                <div
                  { ...getPrefixedEventHandlers(attrs, ':day', () => ({
                    day: props.day,
                    events: props.events,
                  }))}
                >
                  <div class="v-calendar-weekly__day-alldayevents-container">
                    { props.events?.filter(event => event.allDay).map(event => slots.dayEvent
                      ? slots.dayEvent({ day: props.day, allDay: true, event })
                      : (
                        <VCalendarEvent
                          day={ props.day }
                          event={ event }
                          onClick:event={ clickEvent }
                          onContextmenu:event={ contextmenuEvent }
                          allDay
                        />
                      ))}
                  </div>

                  <div class="v-calendar-weekly__day-events-container">
                    { props.events?.filter(event => !event.allDay).map(event => slots.dayEvent
                      ? slots.dayEvent({ day: props.day, event, allDay: false })
                      : (
                        <VCalendarEvent
                          day={ props.day }
                          event={ event }
                          onClick:event={ clickEvent }
                          onContextmenu:event={ contextmenuEvent }
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : undefined }
        </div>
      )
    })

    return {}
  },
})

export type VCalendarMonthDay = InstanceType<typeof VCalendarMonthDay>
