// Composables
import { makeFilterProps, useFilter } from '@/composables/filter'
import { makeTagProps } from '@/composables/tag'
import { createPagination, makeDataTablePaginateProps, providePagination, usePaginatedItems } from '../VDataTable/composables/paginate'
import { makeDataTableSelectProps, provideSelection } from '../VDataTable/composables/select'
import { createSort, makeDataTableSortProps, provideSort, useSortedItems } from '../VDataTable/composables/sort'
import { makeDataTableExpandProps, provideExpanded } from '../VDataTable/composables/expand'
import { makeDataTableGroupProps, provideGroupBy, useGroupedItems } from '../VDataTable/composables/group'
import { makeDataIteratorItemProps, useDataIteratorItems } from './composables/items'
import { useOptions } from '../VDataTable/composables/options'
import { useProxiedModel } from '@/composables/proxiedModel'

// Utilities
import { computed, toRef } from 'vue'
import { genericComponent, useRender } from '@/util'

// Types
import type { SortItem } from '../VDataTable/composables/sort'
import type { DataIteratorItem } from './composables/items'
import type { Group } from '../VDataTable/composables/group'

type VDataIteratorSlotProps = {
  page: number
  itemsPerPage: number
  sortBy: readonly SortItem[]
  pageCount: number
  toggleSort: ReturnType<typeof provideSort>['toggleSort']
  prevPage: ReturnType<typeof providePagination>['prevPage']
  nextPage: ReturnType<typeof providePagination>['nextPage']
  setPage: ReturnType<typeof providePagination>['setPage']
  setItemsPerPage: ReturnType<typeof providePagination>['setItemsPerPage']
  isSelected: ReturnType<typeof provideSelection>['isSelected']
  select: ReturnType<typeof provideSelection>['select']
  selectAll: ReturnType<typeof provideSelection>['selectAll']
  toggleSelect: ReturnType<typeof provideSelection>['toggleSelect']
  isExpanded: ReturnType<typeof provideExpanded>['isExpanded']
  toggleExpand: ReturnType<typeof provideExpanded>['toggleExpand']
  isGroupOpen: ReturnType<typeof provideGroupBy>['isGroupOpen']
  toggleGroup: ReturnType<typeof provideGroupBy>['toggleGroup']
  items: DataIteratorItem[]
  groupedItems: (DataIteratorItem | Group<DataIteratorItem>)[]
}

export type VDataIteratorSlots = {
  default: [VDataIteratorSlotProps]
  header: [VDataIteratorSlotProps]
  footer: [VDataIteratorSlotProps]
  'no-data': []
}

export const VDataIterator = genericComponent<VDataIteratorSlots>()({
  name: 'VDataIterator',

  props: {
    ...makeTagProps(),
    ...makeDataIteratorItemProps(),
    ...makeDataTableSelectProps(),
    ...makeDataTableSortProps(),
    ...makeDataTablePaginateProps(),
    ...makeDataTableExpandProps(),
    ...makeDataTableGroupProps(),
    ...makeFilterProps(),
    search: String,
    loading: Boolean,
  },

  emits: {
    'update:modelValue': (value: any[]) => true,
    'update:groupBy': (value: any) => true,
    'update:page': (value: number) => true,
    'update:itemsPerPage': (value: number) => true,
    'update:sortBy': (value: any) => true,
    'update:options': (value: any) => true,
    'update:expanded': (value: any) => true,
  },

  setup (props, { slots }) {
    const groupBy = useProxiedModel(props, 'groupBy')
    const search = toRef(props, 'search')

    const { items } = useDataIteratorItems(props)
    const { filteredItems } = useFilter(props, items, search, { transform: item => item.raw })

    const { sortBy, multiSort, mustSort } = createSort(props)
    const { page, itemsPerPage } = createPagination(props)

    const { toggleSort } = provideSort({ sortBy, multiSort, mustSort, page })
    const { sortByWithGroups, opened, extractRows, isGroupOpen, toggleGroup } = provideGroupBy({ groupBy, sortBy })

    const { sortedItems } = useSortedItems(props, filteredItems, sortByWithGroups)
    const { flatItems } = useGroupedItems(sortedItems, groupBy, opened)

    const itemsLength = computed(() => flatItems.value.length)

    const {
      startIndex,
      stopIndex,
      pageCount,
      prevPage,
      nextPage,
      setItemsPerPage,
      setPage,
    } = providePagination({ page, itemsPerPage, itemsLength })
    const { paginatedItems } = usePaginatedItems({ items: flatItems, startIndex, stopIndex, itemsPerPage })

    const paginatedItemsWithoutGroups = computed(() => extractRows(paginatedItems.value))

    const { isSelected, select, selectAll, toggleSelect } = provideSelection(props, paginatedItemsWithoutGroups)
    const { isExpanded, toggleExpand } = provideExpanded(props)

    useOptions({
      page,
      itemsPerPage,
      sortBy,
      groupBy,
      search,
    })

    const slotProps = computed(() => ({
      page: page.value,
      itemsPerPage: itemsPerPage.value,
      sortBy: sortBy.value,
      pageCount: pageCount.value,
      toggleSort,
      prevPage,
      nextPage,
      setPage,
      setItemsPerPage,
      isSelected,
      select,
      selectAll,
      toggleSelect,
      isExpanded,
      toggleExpand,
      isGroupOpen,
      toggleGroup,
      items: paginatedItems.value,
      groupedItems: flatItems.value,
    }))

    useRender(() => (
      <props.tag class="v-data-iterator">
        { slots.header?.(slotProps.value) }
        { !paginatedItems.value.length
          ? slots['no-data']?.()
          : slots.default
            ? slots.default(slotProps.value)
            : undefined
        }
        { slots.footer?.(slotProps.value) }
      </props.tag>
    ))

    return {}
  },
})

export type VDataIterator = InstanceType<typeof VDataIterator>
