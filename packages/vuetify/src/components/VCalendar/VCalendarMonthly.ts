// Styles
import './VCalendarWeekly.sass'

// Mixins
import VCalendarWeekly from './VCalendarWeekly'

// Util
import { parseTimestamp, getStartOfMonth, getEndOfMonth } from './util/timestamp'
import { CalendarTimestamp } from 'types'

/* @vue/component */
export default VCalendarWeekly.extend({
  name: 'v-calendar-monthly',

  computed: {
    staticClass (): string {
      return 'v-calendar-monthly v-calendar-weekly'
    },
    parsedStart (): CalendarTimestamp {
      return getStartOfMonth(parseTimestamp(this.start) as CalendarTimestamp)
    },
    parsedEnd (): CalendarTimestamp {
      return getEndOfMonth(parseTimestamp(this.end) as CalendarTimestamp)
    },
  },

})
