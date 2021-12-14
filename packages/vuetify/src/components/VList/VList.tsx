// Styles
import './VList.sass'

// Components
import { VListChildren } from './VListChildren'

// Composables
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { useBackgroundColor } from '@/composables/color'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { makeNestedProps, useNested } from '@/composables/nested/nested'
import { createList } from './list'

// Utilities
import { computed, toRef } from 'vue'
import { genericComponent, useRender } from '@/util'

// Types
import type { Prop } from 'vue'
import type { MakeSlots } from '@/util'
import type { ListGroupHeaderSlot } from './VListGroup'

export type ListItem = {
  [key: string]: any
  $type?: 'item' | 'subheader' | 'divider'
  $children?: ListItem[]
}

export type InternalListItem = {
  type?: 'item' | 'subheader' | 'divider'
  props?: Record<string, any>
  children?: InternalListItem[]
}

const parseItems = (items?: ListItem[]): InternalListItem[] | undefined => {
  if (!items) return undefined

  return items.map(({ $type, $children, ...props }) => {
    if ($type === 'subheader') return { type: 'subheader', props }
    if ($type === 'divider') return { type: 'divider', props }

    return { type: 'item', props, children: parseItems($children) }
  })
}

export const VList = genericComponent<new <T>() => {
  $props: {
    items?: T[]
  }
  $slots: MakeSlots<{
    subheader: []
    header: [ListGroupHeaderSlot]
    item: [T]
  }>
}>()({
  name: 'VList',

  props: {
    color: String,
    disabled: Boolean,
    lines: {
      type: String,
      default: 'one',
    },
    nav: Boolean,
    items: Array as Prop<ListItem[]>,

    ...makeNestedProps({
      selectStrategy: 'leaf' as const,
      openStrategy: 'multiple' as const,
      activeStrategy: 'single' as const,
    }),
    ...makeBorderProps(),
    ...makeDensityProps(),
    ...makeDimensionProps(),
    ...makeElevationProps(),
    ...makeRoundedProps(),
    ...makeTagProps(),
    ...makeThemeProps(),
  },

  emits: {
    'update:selected': (val: string[]) => true,
    'update:opened': (val: string[]) => true,
    'update:active': (val: string[]) => true,
  },

  setup (props, { slots }) {
    const items = computed(() => parseItems(props.items))
    const { themeClasses } = provideTheme(props)
    const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'color'))
    const { borderClasses } = useBorder(props)
    const { densityClasses } = useDensity(props)
    const { dimensionStyles } = useDimension(props)
    const { elevationClasses } = useElevation(props)
    const { roundedClasses } = useRounded(props)
    const { open, select, activate } = useNested(props)

    createList()

    useRender(() => {
      return (
        <props.tag
          class={[
            'v-list',
            {
              'v-list--disabled': props.disabled,
              'v-list--nav': props.nav,
              [`v-list--${props.lines}-line`]: true,
            },
            themeClasses.value,
            backgroundColorClasses.value,
            borderClasses.value,
            densityClasses.value,
            elevationClasses.value,
            roundedClasses.value,
          ]}
          style={[
            backgroundColorStyles.value,
            dimensionStyles.value,
          ]}
        >
          <VListChildren
            items={ items.value }
            v-slots={{
              default: slots.default,
              item: slots.item,
              externalHeader: slots.header,
            }}
          />
        </props.tag>
      )
    })

    return {
      open,
      select,
      activate,
    }
  },
})

export type VList = InstanceType<typeof VList>
