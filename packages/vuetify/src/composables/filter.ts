
// Utilities
import { getPropertyFromItem, propsFactory, wrapInArray } from '@/util'
import { computed } from 'vue'

// Types
import type { PropType, Ref } from 'vue'

export type FilterFunction = typeof defaultFilter
export type FilterMode = 'intersection' | 'union'

export interface FilterProps {
  filterFn?: FilterFunction
  filterMode?: FilterMode
}

// Composables
export function defaultFilter (text: string, query?: string, item?: any) {
  if (typeof query !== 'string') return true
  if (typeof text !== 'string') return false

  return text.toLocaleLowerCase().includes(query.toLocaleLowerCase())
}

export const makeFilterProps = propsFactory({
  filterFn: Function as PropType<FilterFunction>,
  filterMode: {
    type: String as PropType<FilterMode>,
    default: 'intersection',
  },
}, 'filter')

export function filterItems (
  items: Record<string, any>[],
  keys: string[],
  query?: string,
  filter?: {
    default?: FilterFunction
    mode?: FilterMode
    keyFilters?: Record<string, FilterFunction>
  }
) {
  if (!query || !keys.length) return items

  const array: (typeof items) = []
  const method = filter?.mode !== 'union' ? 'some' : 'every'

  for (const item of items) {
    const matched = keys[method](key => {
      const value = getPropertyFromItem(item, key, item)
      const handler = filter?.keyFilters?.[key] ?? filter?.default ?? defaultFilter

      return handler(value, query, item)
    })

    if (matched) array.push(item)
  }

  return array
}

export function useFilter (
  props: FilterProps,
  items: Ref<any[]>,
  keys: (string | string[]),
  query?: Ref<string>,
  keyFilters?: Record<string, FilterFunction>
) {
  const strQuery = computed(() => (
    typeof query?.value !== 'string' &&
    typeof query?.value !== 'number'
  ) ? '' : String(query.value))

  const filteredItems = computed(() => filterItems(
    items.value,
    wrapInArray(keys),
    strQuery.value,
    {
      default: props.filterFn,
      mode: props.filterMode,
      keyFilters,
    },
  ))

  return { filteredItems }
}
