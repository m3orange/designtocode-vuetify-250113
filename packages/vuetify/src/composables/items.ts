// Utilities
import { computed } from 'vue'
import { getObjectValueByPath, getPropertyFromItem, propsFactory } from '@/util'

// Types
import type { PropType } from 'vue'
import type { SelectItemKey } from '@/util'

export interface InternalItem {
  title: string
  value: any
  props: {
    [key: string]: any
    title: string
    value: any
  }
  children?: InternalItem[]
  originalItem: any
}

export interface ItemProps {
  items: any[]
  itemTitle: SelectItemKey
  itemValue: SelectItemKey
  itemChildren: string
  itemProps: ((item: any) => object) | undefined
  returnObject: boolean | undefined
}

// Composables
export const makeItemsProps = propsFactory({
  items: {
    type: Array as PropType<ItemProps['items']>,
    default: () => ([]),
  },
  itemTitle: {
    type: [String, Array, Function] as PropType<SelectItemKey>,
    default: 'title',
  },
  itemValue: {
    type: [String, Array, Function] as PropType<SelectItemKey>,
    default: 'value',
  },
  itemChildren: {
    type: String,
    default: 'children',
  },
  itemProps: {
    type: Function as PropType<ItemProps['itemProps']>,
    default: (item: any) => ({}),
  },
  returnObject: Boolean,
}, 'item')

export function transformItem (props: Omit<ItemProps, 'items'>, item: any) {
  const title = getPropertyFromItem(item, props.itemTitle, item)
  const value = getPropertyFromItem(item, props.itemValue, title)
  const children = getObjectValueByPath(item, props.itemChildren)

  const _props = {
    title,
    value,
    ...props.itemProps?.(item),
  }

  return {
    title: _props.title,
    value: _props.value,
    props: _props,
    children: Array.isArray(children) ? transformItems(props, children) : undefined,
    originalItem: item,
  }
}

export function transformItems (props: Omit<ItemProps, 'items'>, items: ItemProps['items']) {
  const array: InternalItem[] = []

  for (const item of items) {
    array.push(transformItem(props, item))
  }

  return array
}

export function useItems (props: ItemProps) {
  const items = computed(() => transformItems(props, props.items))

  function transformIn (value: any[]): InternalItem[] {
    return value.map(item => transformItem(props, item))
  }

  function transformOut (value: InternalItem[]) {
    if (props.returnObject) return value.map(({ originalItem: item }) => item)
    return value.map(({ props }) => props.value)
  }

  return { items, transformIn, transformOut }
}
