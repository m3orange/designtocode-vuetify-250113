// Styles
import './VCalendarCategory.sass'

// Types
import { VNode } from 'vue'

// Mixins
import VCalendarDaily from './VCalendarDaily'

// Util
import { convertToUnit, getSlot } from '../../util/helpers'
import { CalendarTimestamp } from 'types'
import props from './util/props'

/* @vue/component */
export default VCalendarDaily.extend({
  name: 'v-calendar-category',

  props: props.category,

  computed: {
    classes (): object {
      return {
        'v-calendar-daily': true,
        'v-calendar-category': true,
        ...this.themeClasses,
      }
    },
    parsedCategories (): any[] {
      return typeof this.categories === 'string' && this.categories
        ? this.categories.split(/\s*,\s*/)
        : Array.isArray(this.categories)
          ? this.categories as any[]
          : []
    },
  },

  methods: {
    genDayHeader (day: CalendarTimestamp, index: number): VNode[] {
      const data = {
        staticClass: 'v-calendar-category__columns',
      }
      const scope = {
        week: this.days, ...day, index,
      }

      const children = this.parsedCategories.map(category => this.genDayHeaderCategory(day, this.getCategoryScope(scope, category)))

      return [this.$createElement('div', data, children)]
    },
    getCategoryScope (scope: any, category: any) {
      return {
        ...scope,
        category: category === this.categoryForInvalid ? null : category,
      }
    },
    genDayHeaderCategory (day: CalendarTimestamp, scope: any): VNode {
      const category = typeof scope.category === 'string' ? scope.category : scope.category[this.categoryText]
      return this.$createElement('div', {
        staticClass: 'v-calendar-category__column-header',
        on: this.getDefaultMouseEventHandlers(':day-category', e => {
          return this.getCategoryScope(this.getSlotScope(day), scope.category)
        }),
      }, [
        getSlot(this, 'category', scope) || this.genDayHeaderCategoryTitle(category),
        getSlot(this, 'day-header', scope),
      ])
    },
    genDayHeaderCategoryTitle (category: any) {
      return this.$createElement('div', {
        staticClass: 'v-calendar-category__category',
      }, category === null ? this.categoryForInvalid : category)
    },
    genDays (): VNode[] {
      const d = this.days[0]
      let days = this.days.slice()
      days = new Array(this.parsedCategories.length)
      days.fill(d)
      return days.map((v, i) => this.genDay(v, 0, i))
    },
    genDay (day: CalendarTimestamp, index: number, categoryIndex: number): VNode {
      const category = this.parsedCategories[categoryIndex]
      return this.$createElement('div', {
        key: day.date + '-' + categoryIndex,
        staticClass: 'v-calendar-daily__day',
        class: this.getRelativeClasses(day),
        on: this.getDefaultMouseEventHandlers(':time', e => {
          return this.getSlotScope(this.getTimestampAtEvent(e, day))
        }),
      }, [
        ...this.genDayIntervals(index, category),
        ...this.genDayBody(day, category),
      ])
    },
    genDayIntervals (index: number, category: any): VNode[] {
      return this.intervals[index].map(v => this.genDayInterval(v, category))
    },
    genDayInterval (interval: CalendarTimestamp, category: any): VNode {
      const height: string | undefined = convertToUnit(this.intervalHeight)
      const styler = this.intervalStyle || this.intervalStyleDefault

      const data = {
        key: interval.time,
        staticClass: 'v-calendar-daily__day-interval',
        style: {
          height,
          ...styler({ ...interval, category }),
        },
      }

      const children = getSlot(this, 'interval', () => this.getSlotScope(interval))

      return this.$createElement('div', data, children)
    },
    genDayBody (day: CalendarTimestamp, category: any): VNode[] {
      const data = {
        staticClass: 'v-calendar-category__columns',
      }

      // const children = this.parsedCategories.map(category => this.genDayBodyCategory(day, category))
      const children = [this.genDayBodyCategory(day, category)]

      return [this.$createElement('div', data, children)]
    },
    genDayBodyCategory (day: CalendarTimestamp, category: any): VNode {
      const data = {
        staticClass: 'v-calendar-category__column',
        on: this.getDefaultMouseEventHandlers(':time-category', e => {
          return this.getCategoryScope(this.getSlotScope(this.getTimestampAtEvent(e, day)), category)
        }),
      }

      const children = getSlot(this, 'day-body', () => this.getCategoryScope(this.getSlotScope(day), category))

      return this.$createElement('div', data, children)
    },
  },
})
