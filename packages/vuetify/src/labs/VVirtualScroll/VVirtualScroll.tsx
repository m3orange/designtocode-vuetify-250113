// Styles
import './VVirtualScroll.sass'

// Components
import { VVirtualScrollItem } from './VVirtualScrollItem'

// Composables
import { makeDimensionProps, useDimension } from '@/composables/dimensions'

// Utilities
import { computed, onMounted, ref } from 'vue'
import {
  convertToUnit,
  createRange,
  genericComponent,
  useRender,
} from '@/util'

// Types
import type { MakeSlots, SlotsToProps } from '@/util'

const UP = -1
const DOWN = 1

export interface VVirtualScrollSlot<T> {
  item: T
  index: number
}

export const VVirtualScroll = genericComponent<new <T>() => {
  $props: {
    items: readonly T[]
  } & SlotsToProps<
    MakeSlots<{
      default: [VVirtualScrollSlot<T>]
    }>
  >
}>()({
  name: 'VVirtualScroll',

  props: {
    items: {
      type: Array,
      default: () => ([]),
    },
    itemHeight: [Number, String],
    visibleItems: {
      type: [Number, String],
      default: 30,
    },

    ...makeDimensionProps(),
  },

  setup (props, { slots }) {
    const first = ref(0)
    const baseItemHeight = ref(props.itemHeight)
    const itemHeight = computed({
      get: () => parseInt(baseItemHeight.value ?? 0, 10),
      set (val) {
        baseItemHeight.value = val
      },
    })
    const visibleItems = computed(() => parseInt(props.visibleItems, 10))
    const rootEl = ref<HTMLDivElement>()

    const sizes = createRange(props.items.length).map(() => itemHeight.value)

    function handleItemResize (index: number, height: number) {
      sizes[index] = height
    }

    function calculateOffset (index: number) {
      return sizes.slice(0, index).reduce((curr, value) => curr + (value || itemHeight.value), 0)
    }

    function calculateMidPointIndex (scrollTop: number) {
      let start = 0
      let end = props.items.length

      while (start <= end) {
        const middle = start + Math.floor((end - start) / 2)
        const middleOffset = calculateOffset(middle)

        if (middleOffset === scrollTop) {
          return middle
        } else if (middleOffset < scrollTop) {
          start = middle + 1
        } else if (middleOffset > scrollTop) {
          end = middle - 1
        }
      }

      return start
    }

    let lastScrollTop = 0
    function handleScroll () {
      if (!rootEl.value) return

      const scrollTop = rootEl.value.scrollTop
      const direction = scrollTop < lastScrollTop ? UP : DOWN

      const midPointIndex = calculateMidPointIndex(scrollTop)
      const buffer = Math.round(visibleItems.value / 3)
      if (direction === UP && midPointIndex <= first.value) {
        first.value = Math.max(midPointIndex - buffer, 0)
      } else if (direction === DOWN && midPointIndex >= first.value + (buffer * 2) - 1) {
        first.value = Math.min(Math.max(0, midPointIndex - buffer), props.items.length - visibleItems.value)
      }

      lastScrollTop = rootEl.value.scrollTop
    }

    function scrollToIndex (index: number) {
      if (!rootEl.value) return

      const offset = calculateOffset(index)
      rootEl.value.scrollTop = offset
    }

    const last = computed(() => Math.min(props.items.length, first.value + visibleItems.value))
    const computedItems = computed(() => props.items.slice(first.value, last.value))
    const paddingTop = computed(() => calculateOffset(first.value))
    const paddingBottom = computed(() => calculateOffset(props.items.length) - calculateOffset(last.value))

    const { dimensionStyles } = useDimension(props)

    onMounted(() => {
      if (!itemHeight.value) {
        // If itemHeight prop is not set, then calculate an estimated height from the average of inital items
        itemHeight.value = sizes.slice(first.value, last.value).reduce((curr, height) => curr + height, 0) / (visibleItems.value)
      }
    })

    useRender(() => (
      <div
        ref={ rootEl }
        class="v-virtual-scroll"
        onScroll={ handleScroll }
        style={ dimensionStyles.value }
      >
        <div
          class="v-virtual-scroll__container"
          style={{
            paddingTop: convertToUnit(paddingTop.value),
            paddingBottom: convertToUnit(paddingBottom.value),
          }}
        >
          { computedItems.value.map((item, index) => (
            <VVirtualScrollItem
              key={ index }
              dynamicHeight={ !props.itemHeight }
              onUpdate:height={ height => handleItemResize(index + first.value, height) }
            >
              { slots.default?.({ item, index: index + first.value }) }
            </VVirtualScrollItem>
          )) }
        </div>
      </div>
    ))

    return {
      scrollToIndex,
    }
  },
})

export type VVirtualScroll = InstanceType<typeof VVirtualScroll>
